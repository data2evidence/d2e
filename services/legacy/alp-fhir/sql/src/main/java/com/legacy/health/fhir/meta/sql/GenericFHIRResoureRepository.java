package com.legacy.health.fhir.meta.sql;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.legacy.health.fhir.content.model.Role;
import com.legacy.health.fhir.extension.ExtensionMetadata;
import com.legacy.health.fhir.extension.FHIRResourceRepository;
import com.legacy.health.fhir.extension.TransactionContext;
import com.legacy.health.fhir.extension.exceptions.FHIRResourceHandlingException;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.FhirRuntimeException;
import com.legacy.health.fhir.meta.entity.RequestContext;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.ArrayElement;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.instance.ValueElement;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.queryengine.QueryBuilder;
import com.legacy.health.fhir.meta.queryengine.ResultElement;
import com.legacy.health.fhir.meta.queryengine.extension.QueryExecutorExtension;
import com.legacy.health.fhir.meta.sql.catalog.RoleCreator;
import com.legacy.health.fhir.meta.sql.queryengine.GenericQueryExecutor;
import com.legacy.health.fhir.meta.sql.queryengine.SQLInExpression;
import com.legacy.health.fhir.meta.sql.queryengine.SQLListValue;
import com.legacy.health.fhir.meta.sql.queryengine.SQLQuery;
import com.legacy.health.fhir.meta.sql.queryengine.SQLQueryBuilder;
import com.legacy.health.fhir.util.UUIDGeneratorImpl;
import com.legacy.health.fhir.util.Utils;

public class GenericFHIRResoureRepository implements FHIRResourceRepository {

	private static Log log = LogFactory.getLog(GenericFHIRResoureRepository.class);
	private static final String DEFAULT_CAPABILITY_STATEMENT_ID = "fhir-capabilitystatement";
	private static final String RESOURCE_TYPE = "CapabilityStatement";

	private SQLExecutor sqlExecutor = null;

	private RelationSchemaController controller = null;

	@Override
	public ExtensionMetadata getMetaData() {
		return null;
	}

	@Override
	public TransactionContext startTransaction(boolean autocommit, RequestContext reqCtx)
			throws FHIRResourceHandlingException {
		try {
			sqlExecutor = new SQLExecutor();
			sqlExecutor.setSchema(reqCtx.getEndPoint()); // for non instane based access
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
	public Structure createResource(Structure resource, RequestContext reqCtx, TransactionContext ctx)
			throws FHIRResourceHandlingException {
		// TODO Auto-generated method stub
		try {

			if (ctx == null) {
				ctx = startTransaction(true, reqCtx);
			}
			setSQLExecutor(reqCtx, ctx);
			String id = resource.getId();

			if (id == null || id.trim().isEmpty()) {
				resource.setId(new UUIDGeneratorImpl().generateId());
			}

			if (!(ctx instanceof TransactionContextImpl)) {
				throw new FhirRuntimeException("Incompatible context", null);
			}
			TransactionContextImpl ctx1 = (TransactionContextImpl) ctx;

			SQLDataConsumer consumer = ctx1.getDataConsumer(sqlExecutor.getSchema());

			consumer.writeStructure(resource, newSQLContext(sqlExecutor.getSchema(), sqlExecutor.connect()));

			if (ctx1.isAutoCommit()) {

				consumer.flushData();

			}

		} catch (FhirException e) {
			throw new FHIRResourceHandlingException(e.getLocalizedMessage(), e);
		} catch (SQLException e) {
			throw new FHIRResourceHandlingException(e.getLocalizedMessage(), e);
		} finally {
			try {
				closeConnection(ctx);
			} catch (NullPointerException e) {
				log.error("Error Closing Connection: ", e);
			}
		}
		return resource;

	}

	@Override
	public Structure updateResource(Structure resource, StructureDefinition sd, RequestContext reqCtx,
			TransactionContext ctx) throws FHIRResourceHandlingException {
		Structure structureData = null;
		try {

			if (ctx == null) {
				ctx = startTransaction(true, reqCtx);
			}
			setSQLExecutor(reqCtx, ctx);

			delete(resource.getId(), sd, reqCtx, false, false);

			SQLUpdateHandler sqlUpdateHandler = new SQLUpdateHandler();

			sqlUpdateHandler.setController(controller);

			sqlUpdateHandler.update(sqlExecutor.getSchema(), resource, false,
					newSQLContext(sqlExecutor.getSchema(), sqlExecutor.connect()));

			structureData = createResource(resource, reqCtx, ctx);

		} catch (FhirException | SQLException e) {
			// TODO Auto-generated catch block
			throw new FHIRResourceHandlingException(e.getLocalizedMessage(), e);
		} finally {

			try {
				closeConnection(ctx);
			} catch (NullPointerException e) {
				log.error("Error Closing Connection: ", e);
			}

		}

		return structureData;
	}

	@Override
	public void deleteResource(String resourceId, StructureDefinition sd, RequestContext reqCtx, TransactionContext ctx)
			throws FHIRResourceHandlingException {
		// TODO Auto-generated method stub
		try {

			if (ctx == null) {
				ctx = startTransaction(true, reqCtx);
			}
			setSQLExecutor(reqCtx, ctx);

			resourceId = Utils.checkUUID(resourceId);

			delete(resourceId, sd, reqCtx, true, true);

		} catch (FhirException | SQLException e) {
			// TODO Auto-generated catch block
			throw new FHIRResourceHandlingException(e.getLocalizedMessage(), e);
		} finally {

			try {
				closeConnection(ctx);
			} catch (NullPointerException e) {
				log.error("Error Closing Connection: ", e);
			}

		}
	}

	@Override
	public Structure readResource(String resourceId, StructureDefinition sd, RequestContext reqCtx,
			TransactionContext ctx) throws FHIRResourceHandlingException {
		// TODO Auto-generated method stub
		try {

			if (ctx == null) {
				ctx = startTransaction(true, reqCtx);
			}
			setSQLExecutor(reqCtx, ctx);

			resourceId = Utils.checkUUID(resourceId);

			QueryBuilder qBuilder = new QueryBuilder();
			QueryExecutorExtension queryExecutor = new GenericQueryExecutor();
			ResultElement fullResource = qBuilder.out(sd);
			ResultElement idAttribute = qBuilder.out(sd, String.format("%s.id", sd.getId()));
			Query query = qBuilder.query("Get Resource By Id").from(qBuilder.from(sd))
					.filter(qBuilder.eq(idAttribute, qBuilder.string(resourceId))).out(fullResource);
			qBuilder.setMetaRepository(reqCtx.getMetaRepo());

			return queryExecutor.doQuery(query, reqCtx, false,
					newSQLContext(sqlExecutor.getSchema(), sqlExecutor.connect()));

		} catch (FhirException | SQLException e) {
			// TODO Auto-generated catch block
			throw new FHIRResourceHandlingException(e.getLocalizedMessage(), e);

		} finally {

			try {
				closeConnection(ctx);
			} catch (NullPointerException e) {
				log.error("Error Closing Connection: ", e);
			}

		}
	}

	@Override
	public Structure readResourceByVersion(String resourceId, StructureDefinition sd, RequestContext reqCtx,
			TransactionContext ctx) throws FHIRResourceHandlingException {
		// TODO Auto-generated method stub
		try {

			if (ctx == null) {
				ctx = startTransaction(true, reqCtx);
			}
			setSQLExecutor(reqCtx, ctx);

			getSchemaController(reqCtx, sqlExecutor.connect());

			resourceId = Utils.checkUUID(resourceId);

			SQLHistoryHandler sqlHistoryHandler = new SQLHistoryHandler();

			sqlHistoryHandler.setController(controller);

			return sqlHistoryHandler.getVersion(reqCtx.getEndPoint(), sd, resourceId, reqCtx.getVersionId(),
					newSQLContext(reqCtx.getEndPoint(), sqlExecutor.connect()));

		} catch (FhirException | SQLException e) {
			// TODO Auto-generated catch block
			throw new FHIRResourceHandlingException(e.getLocalizedMessage(), e);
		} finally {

			try {
				closeConnection(ctx);
			} catch (NullPointerException e) {
				log.error("Error Closing Connection: ", e);
			}

		}
	}

	@Override
	public List<Structure> readResourceHistory(String resourceId, StructureDefinition sd, RequestContext reqCtx,
			TransactionContext ctx) throws FHIRResourceHandlingException {
		// TODO Auto-generated method stub

		try {

			if (ctx == null) {
				ctx = startTransaction(true, reqCtx);
			}
			setSQLExecutor(reqCtx, ctx);

			getSchemaController(reqCtx, sqlExecutor.connect());

			SQLHistoryHandler sqlHistoryHandler = new SQLHistoryHandler();

			sqlHistoryHandler.setController(controller);

			return sqlHistoryHandler.getHistory(reqCtx.getEndPoint(), sd, resourceId,
					newSQLContext(reqCtx.getEndPoint(), sqlExecutor.connect()));

		} catch (FhirException | SQLException e) {
			// TODO Auto-generated catch block
			throw new FHIRResourceHandlingException(e.getLocalizedMessage(), e);
		} finally {

			try {
				closeConnection(ctx);
			} catch (NullPointerException e) {
				log.error("Error Closing Connection: ", e);
			}

		}
	}

	public Map<String, Boolean> checkResourceIds(List<Structure> structures, RequestContext reqCtx,
			TransactionContext ctx) throws FHIRResourceHandlingException {
		HashMap<String, Boolean> ret = new HashMap<String, Boolean>();
		int i = 0;
		int batchSize = 200;
		ArrayList<Structure> batch = new ArrayList<Structure>();
		for (Structure structure : structures) {
			batch.add(structure);
			i++;
			if (i % batchSize == 0) {
				ret.putAll(this.checkResourceIdsIteration(batch, reqCtx, ctx));
				batch.clear();
			}

		}
		if (batch.size() > 0) {
			ret.putAll(this.checkResourceIdsIteration(batch, reqCtx, ctx));
		}
		return ret;
	}

	protected Map<String, Boolean> checkResourceIdsIteration(List<Structure> structures, RequestContext reqCtx,
			TransactionContext ctx) throws FHIRResourceHandlingException {
		Boolean ownTransactionRequired = ctx == null;
		try {
			HashMap<String, Boolean> ret = new HashMap<String, Boolean>();
			for (Structure structure : structures) {
				ret.put(structure.getId(), false);
			}
			ArrayList<String> list = new ArrayList<String>(ret.keySet());
			if (ownTransactionRequired) {
				ctx = startTransaction(true, reqCtx);
			}
			setSQLExecutor(reqCtx, ctx);

			getSchemaController(reqCtx, sqlExecutor.connect());
			Table table = controller.getResourceTable();
			Column column = table.getStructureLinkColumn();
			SQLQueryBuilder qb = new SQLQueryBuilder();
			SQLQuery iQuery = qb.query();
			iQuery.from(qb.from(table, "a1"));
			iQuery.column(qb.column(column, "a1"));

			SQLListValue value = new SQLListValue();
			value.addList(list);
			SQLInExpression expr = new SQLInExpression();
			expr.left(qb.column(column, "a1"));
			expr.list(value);
			iQuery.filter(expr);
			PreparedStatement istmt = iQuery.getStatement(sqlExecutor.connect());
			ResultSet rs = istmt.executeQuery();
			while (rs.next()) {
				String id = rs.getString(1);
				ret.put(id, true);
			}
			return ret;

		} catch (FhirException | SQLException e) {
			throw new FHIRResourceHandlingException(e.getLocalizedMessage(), e);
		} finally {
			if (ownTransactionRequired) {
				try {
					closeConnection(ctx);
				} catch (NullPointerException e) {
					log.error("Error Closing Connection: ", e);
				}
			}
		}
	}

	public Structure revokeRole(Object scenario, Object roleDefinition, String user, RequestContext reqCtx,
			TransactionContext tctx) throws FHIRResourceHandlingException {
		if (roleDefinition instanceof Role) {
			List<String> ddls = new LinkedList<>();
			boolean ownTransaction = false;
			try {

				if (tctx == null) {
					tctx = this.startTransaction(true, reqCtx);
					ownTransaction = true;
				}
				ddls.addAll(RoleCreator.createRevokeStatementsDDLs(user, sqlExecutor.getSchema(),
						((Role) roleDefinition)));
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
		if (roleDefinition instanceof Role) {
			List<String> ddls = new LinkedList<>();
			boolean ownTransaction = false;
			try {

				if (tctx == null) {
					tctx = this.startTransaction(true, reqCtx);
					ownTransaction = true;
				}

				ddls.addAll(RoleCreator.createGrantStatementsDDLs(user, sqlExecutor.getSchema(),
						((Role) roleDefinition)));
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

	public Structure doInit(Structure resource, RequestContext reqCtx) throws FHIRResourceHandlingException {
		TransactionContext tx = this.startTransaction(true, reqCtx);
		try {
			if (reqCtx.getActiveSpringProfileConfiguration() != null
					&& reqCtx.getActiveSpringProfileConfiguration().equals("xsa")) {
				// need the schema name from the start
				// initialize the instance manager for a new instance
				sqlExecutor.initializeInstancemanager(reqCtx.getEndPoint());
				controller = null;
			}

			setSQLExecutor(reqCtx, tx);
			getSchemaController(reqCtx, sqlExecutor.connect());

			resource.setId(DEFAULT_CAPABILITY_STATEMENT_ID);

			log.info("Current Physical Schema: " + sqlExecutor.getSchema());

			controller.initializeDatabaseForProfile(sqlExecutor.connect(), reqCtx);

			boolean hasCapabilityStatement = false;

			int restSize = ((ArrayElement) resource.getElementByPath(String.format("%s.rest", RESOURCE_TYPE)))
					.getElements().size();
			ArrayList<String> handledType = new ArrayList<String>();
			for (int i = 0; i < restSize; i++) {
				int resourceSize = ((ArrayElement) resource
						.getElementByPath(String.format("%s.rest[%d].resource", RESOURCE_TYPE, i))).getElements()
						.size();
				for (int j = 0; j < resourceSize; j++) {
					String resourceType = ((ValueElement) resource
							.getElementByPath(String.format("%s.rest[%d].resource[%d].type", RESOURCE_TYPE, i, j)))
							.getValue().toString();
					if (handledType.contains(resourceType)) {
						log.debug("ResourceType:" + resourceType + " twice in capability statement");
						continue;
					}
					if ("ValueSet".equals(resourceType)) {
						continue; // ValueSet is already created during
									// initialization
					} else if (RESOURCE_TYPE.equals(resourceType)) {
						hasCapabilityStatement = true;
					}
					controller.createSchema(reqCtx.getMetaRepo().getStructureDefinitionById(resourceType));
				}
			}

			if (!hasCapabilityStatement && !controller.hasDefinition(RESOURCE_TYPE)) {
				controller.createSchema(reqCtx.getMetaRepo().getStructureDefinitionById(RESOURCE_TYPE));
			}

			createTables(reqCtx, controller.getTables());

			createResource(resource, reqCtx, tx);
			SQLProviderFactory factory = SQLProviderFactory.createInstance(getDriver(reqCtx));

			Role defSupportRole = RoleCreator.getDefaultSupportRole();
			Role superSupportRole = RoleCreator.getSuperSupportRole();

			if (factory.supportRoleCreation()) {
				List<String> ddls = new LinkedList<>();
				ddls.addAll(RoleCreator.createRoleGeneric(sqlExecutor.getSchema(), defSupportRole,
						defSupportRole.getVersion(), reqCtx.getEndPoint()));
				ddls.addAll(RoleCreator.createRoleGeneric(sqlExecutor.getSchema(), superSupportRole,
						superSupportRole.getVersion(), reqCtx.getEndPoint()));
				for (String d : ddls) {
					sqlExecutor.executeDDL(d, false);
				}
			}

		} catch (FhirException e) {
			throw new FHIRResourceHandlingException(e.getLocalizedMessage(), e);
		} catch (SQLException e) {
			throw new FHIRResourceHandlingException(e.getLocalizedMessage(), e);
		} finally {
			if (tx != null) {
				tx.closeConnection();
			}
		}
		return resource;

	}

	private void createTables(RequestContext reqCtx, List<Table> tables) throws SQLException, FhirException {
		// TODO Auto-generated method stub
		Collection<Table> missingTables = sqlExecutor.getMissingTables(reqCtx.getEndPoint(), tables,
				reqCtx.getActiveSpringProfileConfiguration());
		List<String> tableDDLs = new ArrayList<>();
		for (Table table : missingTables) {
			log.info(String.format("Creating Table : %s", table.getFullTableName()));

			String ddl = getSchemaController(reqCtx, sqlExecutor.connect()).getDDL(table);
			tableDDLs.add(ddl);
			try {
				sqlExecutor.executeDDL(ddl, false);
			} catch (SQLException e) {
				log.error(ddl, e);
				throw new FhirException(e.getMessage(), e);
			}
		}
		// sqlExecutor.executeBatch(tableDDLs, false);
	}

	private void setSQLExecutor(RequestContext reqCtx, TransactionContext ctx)
			throws FhirException, SQLException {
		if (ctx != null && !(ctx instanceof TransactionContextImpl)) {
			throw new FhirRuntimeException("Incompatible context", null);
		}
		TransactionContextImpl ctx1 = (TransactionContextImpl) ctx;
		if (ctx1 != null && ctx1.getSqlExecutor() != null) {
			sqlExecutor = ctx1.getSqlExecutor();
		} else {
			throw new FhirRuntimeException("SQL Execution enabler not retrieved, SQLExecutor set failed",
					null);
		}
	}

	private void delete(String resourceId, StructureDefinition sd, RequestContext reqCtx, boolean ownTransaction,
			boolean markAsDeleted) throws FhirException, SQLException {

		SQLDeleteHandler deleteHandler = new SQLDeleteHandler();
		deleteHandler.setConnection(sqlExecutor.connect());

		RelationSchemaController controllerSet = getSchemaController(reqCtx, sqlExecutor.connect());
		controllerSet.createSchema(sd);
		deleteHandler.setController(controllerSet);
		deleteHandler.delete(reqCtx.getEndPoint(), sd, resourceId, ownTransaction, markAsDeleted);
	}

	private void closeConnection(TransactionContext ctx) {

		try {
			if (sqlExecutor.connect().getAutoCommit() == true) {
				ctx.closeConnection();
			}
		} catch (SQLException | FhirException e) {
			// TODO Auto-generated catch block
			log.error("Error closing connection " + e);
			e.printStackTrace();
		}

	}

	private String getDriver(RequestContext context) {
		return context.getConnectionDetails().getProperty("datasource.driver");
	}

	private RelationSchemaController getSchemaController(RequestContext reqCtx, Connection connection)
			throws SQLException {
		if (controller == null) {
			// controller =
			// RelationSchemaController.createRelationSchemaController(reqCtx.getEndPoint(),
			// reqCtx.getConnectionDetails().getProperty("datasource.driver"));
			controller = RelationSchemaController.createRelationSchemaController(sqlExecutor.getSchema(),
					reqCtx.getConnectionDetails().getProperty("datasource.driver"));

			controller.setMetaRepository(reqCtx.getMetaRepo());
			// controller.setSQLProviderFactory(sqlFactory);
		}
		controller.setSchema(sqlExecutor.getSchema());
		return controller;
	}

	private SQLContext newSQLContext(String schemaName, Connection connection) throws SQLException {
		SQLContext context = new SQLContext();
		context.setConnection(connection);
		context.setController(controller);
		context.setSchema(schemaName);
		return context;
	}

	private SQLDataConsumer getDataConsumer(String schemaName) {
		SQLDataConsumer consumer = new SQLDataConsumer();
		consumer.setSchema(schemaName);
		return consumer;
	}

	@Override
	public String getRepositoryType() {
		return "generic";
	}

	@Override
	public Structure readResourceByCanonicalID(String url, String version, StructureDefinition sd,
			RequestContext reqCtx, TransactionContext ctx) throws FHIRResourceHandlingException {

		Boolean ownTransactionRequired = ctx == null;
		try {

			if (ownTransactionRequired) {
				ctx = startTransaction(true, reqCtx);
			}
			setSQLExecutor(reqCtx, ctx);

			QueryBuilder qBuilder = new QueryBuilder();
			QueryExecutorExtension queryExecutor = new GenericQueryExecutor();
			ResultElement fullResource = qBuilder.out(sd);
			ResultElement urlAttribute = qBuilder.out(sd, String.format("%s.url", sd.getId()));
			ResultElement versionAttribute = qBuilder.out(sd, String.format("%s.version", sd.getId()));
			Query query = qBuilder.query("Get Resource By Url and Version").from(qBuilder.from(sd))
					.filter(qBuilder.and(
							qBuilder.eq(urlAttribute, qBuilder.string(url)),
							qBuilder.eq(versionAttribute, qBuilder.string(version))))
					.out(fullResource);
			qBuilder.setMetaRepository(reqCtx.getMetaRepo());

			return queryExecutor.doQuery(query, reqCtx, false,
					newSQLContext(sqlExecutor.getSchema(), sqlExecutor.connect()));

		} catch (FhirException | SQLException e) {
			throw new FHIRResourceHandlingException(e.getLocalizedMessage(), e);
		} finally {
			if (ownTransactionRequired) {
				try {
					closeConnection(ctx);
				} catch (NullPointerException e) {
					log.error("Error Closing Connection: ", e);
				}
			}

		}
	}

	public Map<String, Boolean> checkCanonicalIds(List<Structure> structures, RequestContext reqCtx,
			TransactionContext ctx) throws FHIRResourceHandlingException {
		// TODO Auto-generated method stub
		HashMap<String, Boolean> ret = new HashMap<String, Boolean>();
		int i = 0;
		int batchSize = 200;
		ArrayList<Structure> batch = new ArrayList<Structure>();
		for (Structure structure : structures) {
			batch.add(structure);
			i++;
			if (i % batchSize == 0) {
				ret.putAll(this.checkCanonicalIDsIteration(batch, reqCtx, ctx));
				batch.clear();
			}

		}
		if (batch.size() > 0) {
			ret.putAll(this.checkCanonicalIDsIteration(batch, reqCtx, ctx));
		}
		return ret;
	}

	protected Map<String, Boolean> checkCanonicalIDsIteration(List<Structure> structures, RequestContext reqCtx,
			TransactionContext ctx) throws FHIRResourceHandlingException {
		Boolean ownTransactionRequired = ctx == null;
		try {
			HashMap<String, Boolean> ret = new HashMap<String, Boolean>();
			for (Structure structure : structures) {
				ret.put(structure.getCanonicalReference(), false);
			}
			ArrayList<String> list = new ArrayList<String>(ret.keySet());
			if (ownTransactionRequired) {
				ctx = startTransaction(true, reqCtx);
			}
			setSQLExecutor(reqCtx, ctx);

			getSchemaController(reqCtx, sqlExecutor.connect());
			Table table = controller.getResourceTable();
			Column column = controller.getResourceTable().getColumnByName("\"CANONICAL_ID\"");
			SQLQueryBuilder qb = new SQLQueryBuilder();
			SQLQuery iQuery = qb.query();
			iQuery.from(qb.from(table, "a1"));
			iQuery.column(qb.column(column, "a1"));

			SQLListValue value = new SQLListValue();
			value.addList(list);
			SQLInExpression expr = new SQLInExpression();
			expr.left(qb.column(column, "a1"));
			expr.list(value);
			iQuery.filter(expr);
			PreparedStatement istmt = iQuery.getStatement(sqlExecutor.connect());
			ResultSet rs = istmt.executeQuery();
			while (rs.next()) {
				String id = rs.getString(1);
				ret.put(id, true);
			}
			return ret;

		} catch (FhirException | SQLException e) {
			throw new FHIRResourceHandlingException(e.getLocalizedMessage(), e);
		} finally {
			if (ownTransactionRequired) {
				try {
					closeConnection(ctx);
				} catch (NullPointerException e) {
					log.error("Error Closing Connection: ", e);
				}
			}
		}
	}
}
