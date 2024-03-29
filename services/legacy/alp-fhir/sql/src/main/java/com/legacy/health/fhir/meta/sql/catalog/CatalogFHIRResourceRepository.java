package com.legacy.health.fhir.meta.sql.catalog;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.content.ContentRepository;
import com.legacy.health.fhir.content.ContentRepositoryConsumer;
import com.legacy.health.fhir.content.TabledefinitionDeltaHandler;
import com.legacy.health.fhir.content.TabledefinitionDeltaHandler.AddColumnDelta;
import com.legacy.health.fhir.content.TabledefinitionDeltaHandler.Delta;
import com.legacy.health.fhir.content.model.Role;
import com.legacy.health.fhir.content.model.Scenario;
import com.legacy.health.fhir.content.model.ScenarioDefinition;
import com.legacy.health.fhir.content.model.TableContent;
import com.legacy.health.fhir.content.model.Tabledefinition;
import com.legacy.health.fhir.content.model.Scenario.Parameter;
import com.legacy.health.fhir.extension.ExtensionMetadata;
import com.legacy.health.fhir.extension.FHIRResourceRepository;
import com.legacy.health.fhir.extension.TransactionContext;
import com.legacy.health.fhir.extension.exceptions.FHIRResourceHandlingException;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.RequestContext;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.Element;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.json.JSONStructure;
import com.legacy.health.fhir.meta.json.JSONValueElement;
import com.legacy.health.fhir.meta.sql.Column;
import com.legacy.health.fhir.meta.sql.RelationSchemaController;
import com.legacy.health.fhir.meta.sql.RowBuffer;
import com.legacy.health.fhir.meta.sql.SQLExecutor;
import com.legacy.health.fhir.meta.sql.SQLProviderFactory;
import com.legacy.health.fhir.meta.sql.Table;
import com.legacy.health.fhir.meta.sql.TransactionContextImpl;
import com.legacy.health.fhir.meta.sql.queryengine.SQLUtils;
import com.legacy.health.fhir.meta.sql.util.CHPAccessHelper;
import com.legacy.health.fhir.meta.sql.util.FhirUtils;

public class CatalogFHIRResourceRepository implements FHIRResourceRepository, ContentRepositoryConsumer {

	private static final Logger log = LoggerFactory.getLogger(CatalogFHIRResourceRepository.class);
	private ContentRepository contentRepository;
	private SQLExecutor sqlExecutor = null;

	private RelationSchemaController controller = null;

	@Override
	public ExtensionMetadata getMetaData() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String getRepositoryType() {
		return "catalog";
	}

	@Override
	public Structure doInit(Structure resource, RequestContext reqCtx) throws FHIRResourceHandlingException {
		JsonNode node = ((JSONStructure) resource).getRoot();
		if ("Scenario".equals(node.path("resourceType").asText())) {
			boolean update = false;
			Scenario old = null;
			try {
				Structure chk = this.contentRepository.readContent(reqCtx.getEndPoint(),
						resource.getDefinition().getId());
				if (chk != null && chk.getRoot() != null && chk.getElements() != null && chk.getElements().size() > 0) {// &&
																														// chk.getDefinition()!=null){
					update = true;
					old = new Scenario();
					old.setContentRepository(this.contentRepository);
					old.fromStructure(chk);

					old.setResolved();
				}
			} catch (FhirException e1) {
				throw new FHIRResourceHandlingException(
						"Error when checking repository for Structure for Endpoint:" + reqCtx.getEndPoint(), e1);
			}

			Scenario scenario = new Scenario();
			scenario.setContentRepository(this.contentRepository);
			scenario.fromStructure(resource);
			scenario.setResolved();
			for (Scenario.Parameter parameter : scenario.getParameter()) {
				ensureEndpointAsId(resource, node, scenario, parameter);
			}
			ScenarioDefinition def = scenario.getDefinition();
			if (!update) {
				handleNewEndpoint(reqCtx, scenario, def, resource);
			} else {
				handleUpdateEndpoint(reqCtx, old, scenario, def, resource);
			}
		}
		return null;
	}

	@Override
	public String getTechnicalID(RequestContext reqCtx) {
		TransactionContext tctx = null;
		try {
			tctx = this.startTransaction(true, reqCtx);
			return sqlExecutor.getSchema();
		} catch (FHIRResourceHandlingException e) {
			if (tctx != null) {
				try {
					tctx.closeConnection();
				} catch (FHIRResourceHandlingException e2) {
					log.error("Error creating transaction", e2);
				}
			}
			log.error("Error creating transaction", e);
			return null;
		}
	}

	private void handleUpdateEndpoint(RequestContext reqCtx, Scenario old, Scenario scenario,
			ScenarioDefinition def, Structure resource) throws FHIRResourceHandlingException {

		updateScenarioWithSchemaInfo(scenario, null, resource, old);

		def.ensureResolved();
		ScenarioDefinition defOld = old.getDefinition();
		defOld.ensureResolved();
		if (!def.getUrl().equals(defOld.getUrl())) {// Update only with same canonical URL possible
			throw new FHIRResourceHandlingException(
					"Updating a scenario is only possible based on same canonical scenario definition!", null);
		}
		List<Tabledefinition> targetTables = this.getTableDefinitions(scenario);
		List<Tabledefinition> sourceTables = this.getTableDefinitions(old);
		List<Tabledefinition> additionalTables = new ArrayList<Tabledefinition>();
		List<Tabledefinition> newScenarioViews = targetTables.stream().filter(t -> t.isView())
				.collect(Collectors.toList());
		List<Tabledefinition> oldScenarioViews = sourceTables.stream().filter(t -> t.isView())
				.collect(Collectors.toList());
		List<Delta> deltas = new ArrayList<Delta>();
		TabledefinitionDeltaHandler deltaHandler = new TabledefinitionDeltaHandler();

		for (Tabledefinition target : targetTables) {
			boolean changed = false;
			boolean additional = true;
			for (Tabledefinition source : sourceTables) {
				if (target.getUrl().equals(source.getUrl())) {
					deltas.addAll(deltaHandler.getDeltas(target, source));
					additional = false;
				} else {
					if (target.getTable().equals(source.getTable())) {
						log.error("Update Error:" + target.getUrl() + "!=" + source.getUrl() + "but "
								+ target.getTable() + "=" + source.getTable());
						throw new FHIRResourceHandlingException(
								"Not supported to update resources with different canonical urls and same table name",
								null);
					}
				}
			}
			if (additional && !target.isView()) {
				additionalTables.add(target);
			}
		}
		List<Delta> incompatibleDeltas = incompatibleDeltas(deltas);
		if (incompatibleDeltas.size() > 0) {
			for (Delta delta : incompatibleDeltas) {
				log.error(delta.td.getId() + ":" + delta.message);
			}
			throw new FHIRResourceHandlingException("Update would require incompatible changes, please see log file",
					null);
		}
		TransactionContext tctx = this.startTransaction(true, reqCtx);
		try {
			String schema = this.getSchema(scenario);
			if (reqCtx.getActiveSpringProfileConfiguration() != null
					&& reqCtx.getActiveSpringProfileConfiguration().equals("xsa")) {
				// sqlExecutor.initializeInstancemanager(reqCtx.getEndPoint()); //-- this will
				// formt the tenant (used for do doInit)
				sqlExecutor.setSchema(this.getSchema(old));
				schema = sqlExecutor.getSchema();
				log.info("Schema during update of endpoint: " + schema);
				sqlExecutor.connect();
			}
			SQLProviderFactory factory = SQLProviderFactory.createInstance(getDriver(reqCtx));
			for (Tabledefinition addTable : additionalTables) {
				createTable(schema, factory, addTable);
			}
			for (Delta delta : deltas) {
				if (!delta.td.isView()) {
					if (delta instanceof AddColumnDelta) {
						delta.td.setSchema(schema);
						Column col = delta.modifiedColumn;
						Table table = delta.td.getTableModel();
						if (!factory.supportVersioning()) {
							String tableName = SQLUtils
									.ensureQuoting(SQLUtils.assertValidSQLIdentifier(delta.td.getFullTableName()), '"');
							String columnName = SQLUtils.ensureQuoting(SQLUtils.assertValidSQLIdentifier(col.getName()),
									'"');
							String ddl = "ALTER TABLE " + tableName + " ADD(";
							ddl += columnName + " " + col.getType() + " " + col.getPostfix();
							ddl += ")";
							sqlExecutor.executeDDL(ddl, false);
						} else {
							factory.addColumnVersioning(table, col, sqlExecutor);
						}

					}
				}
			}
			/*
			 * View Re-creation
			 */
			for (Tabledefinition removeView : oldScenarioViews) {
				dropView(schema, factory, removeView);
			}
			for (Tabledefinition addView : newScenarioViews) {
				createTable(schema, factory, addView);
			}
			List<String> ddls = new LinkedList<>();
			/*
			 * Data recreation
			 */
			for (String scope : old.getScope()) {
				List<ScenarioDefinition.Deployment> deployments = def.getDeployment();
				for (ScenarioDefinition.Deployment deployment : deployments) {
					if (scope.equals(deployment.getScope())) {
						removeTableContent(reqCtx, schema, factory, deployment.getData());
					}

				}
			}
			for (String scope : scenario.getScope()) {
				List<ScenarioDefinition.Deployment> deployments = def.getDeployment();
				for (ScenarioDefinition.Deployment deployment : deployments) {
					if (scope.equals(deployment.getScope())) {
						importTableContent(reqCtx, schema, factory, deployment.getData());
					}

				}
			}

			tctx.commit();
			scenario.setOld();
			scenario.save();
		} catch (SQLException | FhirException e) {
			throw new FHIRResourceHandlingException("Error when creating target schema." + e.getLocalizedMessage(), e);
		} finally {
			tctx.closeConnection();
		}
	}

	protected List<Delta> incompatibleDeltas(List<Delta> deltas) {
		List<Delta> incompatibleDeltas = new ArrayList<Delta>();
		for (Delta delta : deltas) {
			if (!delta.isCompatible) {
				incompatibleDeltas.add(delta);
			}
		}
		return incompatibleDeltas;
	}

	protected List<Tabledefinition> getTableDefinitions(Scenario scenario) {
		ScenarioDefinition def = scenario.getDefinition();
		List<Tabledefinition> ret = new ArrayList<Tabledefinition>();
		List<String> scopes = scenario.getScope();
		for (String scope : scopes) {
			List<ScenarioDefinition.Deployment> deployments = def.getDeployment();
			for (ScenarioDefinition.Deployment deployment : deployments) {
				if (scope.equals(deployment.getScope())) {
					List<ScenarioDefinition.Persistency> tables = deployment.getPersistency();
					for (ScenarioDefinition.Persistency persistency : tables) {
						Tabledefinition td = persistency.getDefinition();
						ret.add(td);
					}
				}
			}
		}
		return ret;
	}

	private void handleNewEndpoint(RequestContext reqCtx, Scenario scenario, ScenarioDefinition def,
			Structure resource)
			throws FHIRResourceHandlingException {
		String schema = this.getSchema(scenario);
		boolean defaultRolesCreated = true;
		TransactionContext tctx = this.startTransaction(true, reqCtx);
		try {
			if (reqCtx.getActiveSpringProfileConfiguration() == null
					|| !reqCtx.getActiveSpringProfileConfiguration().equals("xsa")) {
				sqlExecutor.executeDDL("DROP SCHEMA \"" + schema + "\" CASCADE", true);
				sqlExecutor.executeDDL("CREATE SCHEMA \"" + schema + "\"", false);
				sqlExecutor.connect().setSchema(schema);
			} else {
				// using instance manager
				sqlExecutor.initializeInstancemanager(reqCtx.getEndPoint());
				schema = sqlExecutor.getSchema();
				updateScenarioWithSchemaInfo(scenario, schema, resource, null);
				sqlExecutor.connect();
			}
			new CHPAccessHelper()
					.grantConsumptionToUser(sqlExecutor.connect().getMetaData().getUserName())
					.createSynonymForOtsViews(sqlExecutor);

			SQLProviderFactory factory = SQLProviderFactory.createInstance(getDriver(reqCtx));
			List<String> scopes = scenario.getScope();
			for (String scope : scopes) {
				List<ScenarioDefinition.Deployment> deployments = def.getDeployment();
				for (ScenarioDefinition.Deployment deployment : deployments) {
					if (scope.equals(deployment.getScope())) {
						List<ScenarioDefinition.Persistency> tables = deployment.getPersistency();
						for (ScenarioDefinition.Persistency persistency : tables) {
							Tabledefinition td = persistency.getDefinition();
							createTable(schema, factory, td);
						}

						importTableContent(reqCtx, schema, factory, deployment.getData());

						List<String> ddls = new LinkedList<>();
						if (!defaultRolesCreated) {
							ddls.addAll(RoleCreator.createDDLs(schema, scenario, RoleCreator.getSuperSupportRole()));
							ddls.addAll(RoleCreator.createDDLs(schema, scenario, RoleCreator.getDefaultSupportRole()));
							defaultRolesCreated = true;
						}
						// for (Role r : deployment.getRole()) {
						// ddls.addAll(RoleCreator.createDDLs(schema, scenario, r));
						// }
						for (String d : ddls) {
							sqlExecutor.executeDDL(d, false);
						}

					}
				}
			}
			tctx.commit();
			scenario.save();

			// org.hsqldb.util.DatabaseManagerSwing.main(new String[] {
			// "--url", "jdbc:hsqldb:test", "--noexit"
			// });
		} catch (SQLException | FhirException e) {
			throw new FHIRResourceHandlingException("Error when creating target schema." + e.getLocalizedMessage(), e);
		} finally {
			tctx.closeConnection();
		}
	}

	private void removeTableContent(RequestContext reqCtx, String schema, SQLProviderFactory factory,
			List<TableContent> datas) throws FhirException, SQLException {
		for (TableContent data : datas) {
			Tabledefinition td = data.getDefinition();
			td.setProviderFactory(factory);
			td.getFullTableName();
			td.setSchema(schema);
			String appliedName = td.getFullTableName();
			String ddl = "TRUNCATE TABLE " + appliedName;
			try {
				sqlExecutor.executeDDL(ddl, false);
			} catch (SQLException e) {
				log.error("Attempted DDL:" + ddl);
				throw new FHIRResourceHandlingException("Error during execution of DDL for data removal:" + td.getId(),
						e);
			}

		}
	}

	private void importTableContent(RequestContext reqCtx, String schema, SQLProviderFactory factory,
			List<TableContent> datas) throws FhirException, SQLException {
		for (TableContent data : datas) {
			Tabledefinition td = data.getDefinition();
			td.setProviderFactory(factory);
			td.getFullTableName();
			td.setSchema(schema);
			RowBuffer buffer = new RowBuffer(factory.createSQLTypeMapper());
			buffer.setActiveProfile(reqCtx.getActiveSpringProfileConfiguration()); // in case of XSA we use transMangr,
																					// no schema needed
			try {
				buffer.setConnection(sqlExecutor.connect());

				buffer.setTable(td.getTableModel());
				List<TableContent.Row> rows = data.getRow();
				for (TableContent.Row row : rows) {
					HashMap<String, Object> rowdata = new HashMap<String, Object>();
					List<TableContent.Column> columns = row.getColumn();
					for (TableContent.Column column : columns) {
						rowdata.put(SQLUtils.ensureQuoting(column.getName(), '"'), column.getValueString());
					}
					buffer.addRow(rowdata);
				}
				buffer.flushBuffer();
			} catch (RuntimeException e) {
				throw new FHIRResourceHandlingException("Error when inserting data into:" + td.getFullTableName(), e);
			}

		}
	}

	private void dropView(String schema, SQLProviderFactory factory, Tabledefinition td)
			throws FHIRResourceHandlingException {
		td.setProviderFactory(factory);
		td.getFullTableName();
		td.setSchema(schema);
		String appliedName = td.getFullTableName();
		String ddl = "DROP VIEW " + appliedName;
		try {
			sqlExecutor.executeDDL(ddl, false);
		} catch (SQLException e) {
			log.error("Attempted DDL:" + ddl);
			throw new FHIRResourceHandlingException("Error during execution of DDL for tabledefinition:" + td.getId(),
					e);
		}

	}

	private void createTable(String schema, SQLProviderFactory factory, Tabledefinition td)
			throws FHIRResourceHandlingException {
		td.setProviderFactory(factory);
		td.getFullTableName();
		td.setSchema(schema);
		String appliedName = td.getFullTableName();
		log.info("Deploy table:" + appliedName);
		if (!factory.supportVersioning()) {
			String ddl = td.getTableModel().getDDL();
			try {
				sqlExecutor.executeDDL(ddl, false);
			} catch (SQLException e) {
				log.error("Attempted DDL:" + ddl);
				throw new FHIRResourceHandlingException(
						"Error during execution of DDL for tabledefinition:" + td.getId(), e);
			}
		} else {
			try {
				factory.createVersioning(td.getTableModel(), sqlExecutor);
			} catch (SQLException e) {
				throw new FHIRResourceHandlingException(
						"Error during execution of DDL for tabledefinition:" + td.getId(), e);
			}
		}
	}

	public Structure revokeRole(Object scenario, Object roleDefinition, String user, RequestContext reqCtx,
			TransactionContext tctx) throws FHIRResourceHandlingException {
		if (roleDefinition instanceof Role) {
			List<String> ddls = new LinkedList<>();
			boolean ownTransaction = false;
			try {
				ddls.addAll(RoleCreator.createRevokeStatementsDDLs(user, this.getSchema((Scenario) scenario),
						((Role) roleDefinition)));

				if (tctx == null) {
					tctx = this.startTransaction(true, reqCtx);
					ownTransaction = true;
				}
				for (String d : ddls) {
					sqlExecutor.executeDDL(d, false);
				}

			} catch (SQLException e) {
				log.error("Error in granting role", e);
				throw new FHIRResourceHandlingException("Error in role grant", e);
			} catch (FhirException e) {
				log.error("Error in granting role", e);
				throw new FHIRResourceHandlingException("Error in role grant", e);
			} finally {

				if (ownTransaction) {
					if (tctx != null)
						tctx.closeConnection();
				}
			}
		} else {
			throw new FHIRResourceHandlingException("Invalid Roledefintion type", null);
		}
		return null;
	}

	public Structure grantRole(Object scenario, Object roleDefinition, String user, RequestContext reqCtx,
			TransactionContext tctx) throws FHIRResourceHandlingException {
		if (scenario instanceof Scenario) {

			if (roleDefinition instanceof Role) {
				List<String> ddls = new LinkedList<>();
				boolean ownTransaction = false;
				try {
					ddls.addAll(RoleCreator.createGrantStatementsDDLs(user, this.getSchema((Scenario) scenario),
							((Role) roleDefinition)));

					if (tctx == null) {
						tctx = this.startTransaction(true, reqCtx);
						ownTransaction = true;
					}

					for (String d : ddls) {
						sqlExecutor.executeDDL(d, false);
					}

				} catch (SQLException e) {
					log.error("Error in granting role", e);
					throw new FHIRResourceHandlingException("Error in role grant", e);
				} catch (FhirException e) {
					log.error("Error in granting role", e);
					throw new FHIRResourceHandlingException("Error in role grant", e);
				} finally {

					if (ownTransaction) {
						if (tctx != null)
							tctx.closeConnection();
					}
				}
			} else {
				throw new FHIRResourceHandlingException("Invalid Roledefintion type", null);
			}
		} else {
			throw new FHIRResourceHandlingException("Invalid scenario", null);
		}
		return null;

	}

	private void ensureEndpointAsId(Structure resource, JsonNode node, Scenario scenario,
			Scenario.Parameter parameter) {
		if ("endpoint".equals(parameter.getName())) {
			String endpoint = parameter.getValueString();
			scenario.setId(parameter.getValueString());
			if (resource instanceof JSONStructure) {
				Element id = resource.getOrCreateChildElement("id");
				if (id instanceof JSONValueElement) {
					if (node instanceof ObjectNode) {
						((ObjectNode) node).put("id", endpoint);
						((JSONValueElement) id).setValue(node.get("id"));
					}

				}
			}

		}
	}

	private String getDriver(RequestContext context) {
		return context.getConnectionDetails().getProperty("datasource.driver");
	}

	@Override
	public Structure createResource(Structure resource, RequestContext reqCtx, TransactionContext ctx)
			throws FHIRResourceHandlingException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Structure updateResource(Structure resource, StructureDefinition sd, RequestContext reqCtx,
			TransactionContext ctx) throws FHIRResourceHandlingException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void deleteResource(String resourceId, StructureDefinition sd, RequestContext reqCtx, TransactionContext ctx)
			throws FHIRResourceHandlingException {
		Scenario scenario = this.contentRepository.getScenarioForEndpoint(resourceId);

		if (scenario != null) {
			String schema = this.getSchema(scenario);
			if (ctx == null) {
				ctx = this.startTransaction(true, reqCtx);
			}
			try {
				// drop the schema ( removal of the endpoint )
				if (reqCtx.getActiveSpringProfileConfiguration() == null
						|| !reqCtx.getActiveSpringProfileConfiguration().equals("xsa")) {
					sqlExecutor.executeDDL("DROP SCHEMA \"" + schema + "\" CASCADE", true);
				} else {
					// using instance manager - delete the scenario endpoint
					sqlExecutor.deleteInstanceManager(resourceId);
				}

				// deleting the resource
				this.contentRepository.deleteContent(resourceId, sd.getId()); // by default this sets as markAsDeleted

				// access the content
				SQLExecutor sqlExecutorContent = new SQLExecutor();
				sqlExecutorContent.setSchema(reqCtx.getEndPoint());
				sqlExecutorContent.connect(reqCtx.getConnectionDetails(), true,
						reqCtx.getActiveSpringProfileConfiguration());
				try (Connection con = sqlExecutorContent.connect();) {
					// cleanup of the resource if markAsDeleted from the CONTENT
					deleteFromResourceTable(resourceId, sqlExecutorContent.getSchema(), con);
				} catch (SQLException e) {
					throw e;
				}

				ctx.commit();

			} catch (SQLException | FhirException e) {
				// TODO Auto-generated catch block
				throw (new FHIRResourceHandlingException("Unable to delete resource", e));
			} finally {
				ctx.closeConnection();
			}
		}

	}

	// TO-DO: Probably we have a better way to access the Resource Table?
	private void deleteFromResourceTable(String resourceId, String schema, Connection con)
			throws FhirException, SQLException {

		String sql = "DELETE FROM \"" + schema.toUpperCase()
				+ "\".\"FHIR_RESOURCE_TABLE\" WHERE \"IS_DELETED\"=true AND \"ID\"= ?";

		PreparedStatement stmt = con.prepareStatement(sql);
		stmt.setString(1, resourceId);
		stmt.execute();
		stmt.close();
	}

	private RelationSchemaController getSchemaController(String schema, RequestContext reqCtx, Connection connection)
			throws SQLException {
		if (controller == null) {
			controller = RelationSchemaController.createRelationSchemaController(sqlExecutor.getSchema(),
					reqCtx.getConnectionDetails().getProperty("datasource.driver"));

			controller.setMetaRepository(reqCtx.getMetaRepo());
			// controller.setSQLProviderFactory(sqlFactory);
		}
		controller.setSchema(sqlExecutor.getSchema());
		return controller;
	}

	@Override
	public Structure readResource(String resourceId, StructureDefinition sd, RequestContext reqCtx,
			TransactionContext ctx) throws FHIRResourceHandlingException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Structure readResourceByVersion(String resourceId, StructureDefinition sd, RequestContext reqCtx,
			TransactionContext ctx) throws FHIRResourceHandlingException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Structure> readResourceHistory(String resourceId, StructureDefinition sd, RequestContext reqCtx,
			TransactionContext ctx) throws FHIRResourceHandlingException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void setContentRepository(ContentRepository repo) {
		this.contentRepository = repo;

	}

	@Override
	public TransactionContext startTransaction(boolean autocommit, RequestContext reqCtx)
			throws FHIRResourceHandlingException {
		try {

			sqlExecutor = new SQLExecutor();
			sqlExecutor.setSchema(reqCtx.getEndPoint());
			sqlExecutor.connect(reqCtx.getConnectionDetails(), autocommit,
					reqCtx.getActiveSpringProfileConfiguration());
			TransactionContextImpl transContext = new TransactionContextImpl(sqlExecutor);
			transContext.setAutoCommit(autocommit); // TODO this is only a flag should be used to setup the query
													// excucitr;
			return transContext;

		} catch (FhirException e) {
			// TODO Auto-generated catch block
			throw new FHIRResourceHandlingException(e.getLocalizedMessage(), e);
		} catch (SQLException e) {
			throw new FHIRResourceHandlingException(e.getLocalizedMessage(), e);
		}
	}

	@Override
	public Structure fullDeletePatient(String id, RequestContext reqCtx, TransactionContext ctx)
			throws FHIRResourceHandlingException {
		Scenario scenario = this.contentRepository.getScenarioForEndpoint(reqCtx.getEndPoint());

		String schema = this.getSchema(scenario);
		boolean ownTransaction = false;
		if (ctx == null) {
			ctx = this.startTransaction(true, reqCtx);
			ownTransaction = true;
		}
		ScenarioDefinition def = scenario.getDefinition();
		try {
			if (reqCtx.getActiveSpringProfileConfiguration() != null
					&& reqCtx.getActiveSpringProfileConfiguration().equals("xsa")) {
				// sqlExecutor.initializeInstancemanager(reqCtx.getEndPoint()); - this will
				// format the tenant (used for doInit)
				schema = sqlExecutor.getSchema(); // retrieve the instancemanager created schema
			}
			SQLProviderFactory factory = SQLProviderFactory.createInstance(getDriver(reqCtx));
			List<String> scopes = scenario.getScope();
			for (String scope : scopes) {
				List<ScenarioDefinition.Deployment> deployments = def.getDeployment();
				for (ScenarioDefinition.Deployment deployment : deployments) {
					if (scope.equals(deployment.getScope())) {
						List<ScenarioDefinition.Persistency> tables = deployment.getPersistency();
						for (ScenarioDefinition.Persistency persistency : tables) {
							if (persistency.getPatientColumn() != null) {
								if (factory.supportVersioning()) {
									Tabledefinition td = persistency.getDefinition();
									td.setSchema(schema);
									Table table = td.getTableModel();
									table.setSchema(schema);
									Column column = table.getColumnByName(
											SQLUtils.ensureQuoting(persistency.getPatientColumn(), '"'));
									factory.deleteWithId(table, column, id, sqlExecutor);
								} else {
									Tabledefinition td = persistency.getDefinition();
									String tableName = SQLUtils.ensureQuoting(
											SQLUtils.assertValidSQLIdentifier(td.getFullTableName()), '"');
									String columnName = SQLUtils.ensureQuoting(
											SQLUtils.assertValidSQLIdentifier(persistency.getPatientColumn()), '"');
									String sql = "DELETE FROM " + tableName + " where " + columnName + "=?";
									PreparedStatement stmt = sqlExecutor.connect().prepareStatement(sql);
									try {
										stmt.setString(1, id);
										stmt.execute();
									} finally {
										stmt.close();
									}
								}
							}
						}
					}
				}
			}
			if (ownTransaction) {
				ctx.commit();
			}
		} catch (SQLException | FhirException e) {
			throw new FHIRResourceHandlingException("Error when deleting patient with ID:" + id, e);
		} finally {
			if (ownTransaction) {
				ctx.closeConnection();
			}
		}
		return null;
	}

	@Override
	public Structure fullGetPatient(String id, RequestContext reqCtx, TransactionContext ctx)
			throws FHIRResourceHandlingException {

		List<ObjectNode> resultContent = new ArrayList<ObjectNode>();

		Scenario scenario = this.contentRepository.getScenarioForEndpoint(reqCtx.getEndPoint());

		String schema = this.getSchema(scenario);
		boolean ownTransaction = false;
		if (ctx == null) {
			ctx = this.startTransaction(true, reqCtx);
			ownTransaction = true;
		}
		ScenarioDefinition def = scenario.getDefinition();
		try {
			if (reqCtx.getActiveSpringProfileConfiguration() != null
					&& reqCtx.getActiveSpringProfileConfiguration().equals("xsa")) {
				schema = sqlExecutor.getSchema();
			}
			SQLProviderFactory factory = SQLProviderFactory.createInstance(getDriver(reqCtx));
			List<String> scopes = scenario.getScope();
			for (String scope : scopes) {
				List<ScenarioDefinition.Deployment> deployments = def.getDeployment();
				for (ScenarioDefinition.Deployment deployment : deployments) {
					if (scope.equals(deployment.getScope())) {
						List<ScenarioDefinition.Persistency> tables = deployment.getPersistency();
						for (ScenarioDefinition.Persistency persistency : tables) {
							if (persistency.getPatientColumn() != null) {
								if (factory.supportVersioning()) {
									Tabledefinition td = persistency.getDefinition();
									td.setSchema(schema);
									Table table = td.getTableModel();
									table.setSchema(schema);
									Column columnName = table.getColumnByName(SQLUtils.ensureQuoting(
											SQLUtils.assertValidSQLIdentifier(persistency.getPatientColumn()), '"'));
									ArrayList<ObjectNode> contentVersions = factory.getWithId(table, columnName, id,
											sqlExecutor);
									resultContent.addAll(contentVersions);
								} else {
									Tabledefinition td = persistency.getDefinition();
									td.setSchema(schema);
									String tableName = SQLUtils.ensureQuoting(
											SQLUtils.assertValidSQLIdentifier(td.getFullTableName()), '"');
									String columnName = SQLUtils.ensureQuoting(
											SQLUtils.assertValidSQLIdentifier(persistency.getPatientColumn()), '"');

									// get the data corresponding to table name and column name
									String sql = "SELECT * FROM " + tableName + " where " + columnName + "=?";
									try (PreparedStatement stmt = sqlExecutor.connect().prepareStatement(sql);) {
										stmt.setString(1, id);
										ResultSet result = stmt.executeQuery();
										resultContent.add(
												FhirUtils.getTableContentResource(result, td.getUrl(), td.getTable()));
									}
								}
							}
						}
					}
				}
			}
			if (ownTransaction) {
				ctx.commit();
			}
		} catch (SQLException | FhirException e) {
			throw new FHIRResourceHandlingException("Error getting patient with ID:" + id, e);
		} finally {
			if (ownTransaction) {
				ctx.closeConnection();
			}
		}

		return FhirUtils.toBundle("", resultContent, id, reqCtx.getMetaRepo());
	}

	protected String getSchema(Scenario scenario) {
		List<Scenario.Parameter> list = scenario.getParameter();
		for (Scenario.Parameter parameter : list) {
			if ("schema".equals(parameter.getName())) {
				return parameter.getValueString();
			}
		}
		return null;
	}

	@Override
	public Structure readResourceByCanonicalID(String url, String version, StructureDefinition sd,
			RequestContext reqCtx, TransactionContext ctx) throws FHIRResourceHandlingException {
		throw new UnsupportedOperationException();
	}

	private void updateScenarioWithSchemaInfo(Scenario scenario, String schema, Structure resource,
			Scenario oldScenario) throws FHIRResourceHandlingException {

		if (resource != null && oldScenario == null) {

			checkSchemaEntry(resource);

			createEntryInParameter(resource, schema, scenario);

		} else if (resource != null) {

			JsonNode node = ((JSONStructure) resource).getRoot();

			ArrayNode list = (ArrayNode) node.findPath("parameter");

			if (list != null) {
				List<String> listString = list.findValuesAsText("name");
				boolean foundEntry = false;
				Iterator<String> iterator = listString.iterator();
				while (iterator.hasNext()) {
					if (iterator.next().equals("schema")) {
						updateFieldValue(scenario, getSchemaNameFromScenario(oldScenario), node);

						scenario.setContentRepository(this.contentRepository);
						scenario.fromStructure(resource);
						scenario.setResolved();
						foundEntry = true;
						break;
					}
				}

				if (!foundEntry) {
					createEntryInParameter(resource, getSchemaNameFromScenario(oldScenario), scenario);
				}

			}
		}
	}

	private void checkSchemaEntry(Structure resource) throws FHIRResourceHandlingException {
		// TODO Auto-generated method stub

		JsonNode node = ((JSONStructure) resource).getRoot();

		ArrayNode list = (ArrayNode) node.findPath("parameter");

		if (list != null) {
			List<String> listString = list.findValuesAsText("name");

			Iterator<String> iterator = listString.iterator();
			while (iterator.hasNext()) {
				if (iterator.next().equals("schema")) {
					throw new FHIRResourceHandlingException(
							"User provided schema name is not allowed during initial apply", null);
				}
			}
		}

	}

	private void createEntryInParameter(Structure resource, String schema, Scenario scenario) {
		// TODO Auto-generated method stub

		JsonNode node = ((JSONStructure) resource).getRoot();

		ObjectNode objectNode = JsonNodeFactory.instance.objectNode();
		objectNode.put("name", "schema");
		objectNode.put("valueString", schema);

		ArrayNode list = (ArrayNode) node.findPath("parameter");
		if (list != null) {
			list.addPOJO(objectNode);
			scenario.setContentRepository(this.contentRepository);
			scenario.fromStructure(resource);
			scenario.setResolved();
		}

	}

	private String getSchemaNameFromScenario(Scenario scenario) {
		List<Parameter> listParam = scenario.getParameter();
		Iterator<Parameter> iterator = listParam.iterator();
		Parameter parameter = null;
		String schemaName = null;
		while (iterator.hasNext()) {
			parameter = iterator.next();
			if (parameter.getName().equals("schema")) {
				schemaName = parameter.getValueString();
				break;
			}
		}
		return schemaName;
	}

	private void updateFieldValue(Scenario scenario, String schemaName, JsonNode node) {
		// TODO Auto-generated method stub
		if (schemaName != null) {
			ArrayNode list = (ArrayNode) node.findPath("parameter");
			Iterator<JsonNode> jsonIterator = list.iterator();
			while (jsonIterator.hasNext()) {
				JsonNode innerNode = jsonIterator.next();
				if (innerNode.has("name") && innerNode.get("name") != null
						&& innerNode.get("name").textValue().equals("schema")) {
					((ObjectNode) innerNode).put("valueString", schemaName);
					break;
				}
			}

		}
	}

}
