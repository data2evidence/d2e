package com.legacy.health.fhir.meta.sql;

import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.DataElementStructureLink;
import com.legacy.health.fhir.meta.entity.RequestContext;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.sql.queryengine.SQLStructureMap;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.*;

public class TableSetControllerImpl implements RelationSchemaController {

	private static final Log log = LogFactory.getLog(TableSetControllerImpl.class);

	private String schema;
	protected SQLTypeMapper mapper;
	private SQLProviderFactory factory;
	private final List<String> definitions;
	private MetaRepository repo;
	private final RelationalCatalog catalog;
	private final TableSet tables;

	TableSetControllerImpl(String schema, SQLProviderFactory factory) {
		this.schema = schema.toUpperCase(Locale.ENGLISH);
		this.factory = factory;
		mapper = factory.createSQLTypeMapper();
		definitions = new ArrayList<>();
		catalog = new RelationalCatalog();
		tables = new TableSet(this.schema, this.factory, this.catalog);

	}

	@Override
	public void initializeDatabaseForProfile(Connection con, RequestContext reqCtx) throws FhirException {
		String activeProfile = reqCtx.getActiveSpringProfileConfiguration();
		SQLExecutor sql = new SQLExecutor();
		sql.connect(con);
		try {
			if (activeProfile.equals("xsa")) {
				sql.executeDDL("DROP SCHEMA \"" + this.schema + "\" CASCADE", true);
				sql.executeDDL("CREATE SCHEMA \"" + this.schema + "\"", false);
			} else {
				sql.initializeInstancemanager(reqCtx.getEndPoint());
			}

			Table t = StaticTables.getResourceTable(this.factory, this.schema);
			sql.executeDDL(t.getDDL(), false);
			Table ref = StaticTables.getReferenceTable(this.factory, this.schema);
			sql.executeDDL(ref.getDDL(), false);
			Table mart = StaticTables.getMartTable(this.factory, this.schema);
			sql.executeDDL(mart.getDDL(), false);
			String name = "ValueSet";
			StructureDefinition sd = repo.getStructureDefinitionById(name);
			RelationSchemaController controller = new TableSetControllerImpl(schema, this.factory);
			controller.setSQLProviderFactory(this.factory);
			controller.createSchema(sd);
			for (int c = 0; c < controller.getTables().size(); c++) {
				Table t1 = controller.getTables().get(c);
				log.info(controller.getDDL(t1));
				sql.executeDDL(controller.getDDL(t1), false);
			}
			String viewDDL = StaticTables.getValueSetExpansionDDL(this);

			sql.executeDDL(viewDDL, false);
		} catch (SQLException e) {
			throw new FhirException("Error while performing initialization of Database", e);
		}

	}

	@Override
	public void initializeDatabase(Connection con) throws FhirException {
		SQLExecutor sql = new SQLExecutor();
		sql.connect(con);
		try {
			sql.executeDDL("DROP SCHEMA \"" + this.schema + "\" CASCADE", true);
			sql.executeDDL("CREATE SCHEMA \"" + this.schema + "\"", false);
			Table t = StaticTables.getResourceTable(this.factory, this.schema);
			sql.executeDDL(t.getDDL(), false);
			Table ref = StaticTables.getReferenceTable(this.factory, this.schema);
			sql.executeDDL(ref.getDDL(), false);
			Table mart = StaticTables.getMartTable(this.factory, this.schema);
			sql.executeDDL(mart.getDDL(), false);
			String name = "ValueSet";
			StructureDefinition sd = repo.getStructureDefinitionById(name);
			RelationSchemaController controller = new TableSetControllerImpl(schema, this.factory);
			controller.setSQLProviderFactory(this.factory);
			controller.createSchema(sd);
			for (int c = 0; c < controller.getTables().size(); c++) {
				Table t1 = controller.getTables().get(c);
				log.info(controller.getDDL(t1));
				sql.executeDDL(controller.getDDL(t1), false);
			}
			String viewDDL = StaticTables.getValueSetExpansionDDL(this);

			sql.executeDDL(viewDDL, false);
		} catch (SQLException e) {
			throw new FhirException("Error while performing initialization of Database", e);
		}

	}

	@Override
	public MetaRepository getMetaRepository() {
		return repo;
	}

	@Override
	public void setMetaRepository(MetaRepository repo) {
		this.repo = repo;
	}

	@Override
	public String getSchema() {
		return this.schema;
	}

	@Override
	public void initializeDatabase(Properties properties) throws FhirException {
		Connection connection = SQLConnector.connect(properties);
		initializeDatabase(connection);
		try {
			connection.close();
		} catch (SQLException e) {
			throw new FhirException("Error while performing initialization of Database", e);
		}

	}

	@Override
	public SQLProviderFactory getProviderFactory() {
		return factory;
	}

	@Override
	public boolean createSchema(StructureDefinition definition) {
		long start = System.currentTimeMillis();
		this.tables.generateTablesFor(definition);
		long stop = System.currentTimeMillis();
		log.debug("Create Schema:" + (stop - start));
		return true; // TODO
	}

	@Override
	public boolean hasDefinition(String definition) {
		return definitions.contains(definition);
	}

	@Override
	public void setSQLProviderFactory(SQLProviderFactory factory) {
		this.factory = factory;
		this.tables.setSQLProviderFactory(factory);
	}

	protected Table getTable(String name) {
		for (Table table : this.tables.tableDefinitions) {
			if (table.name.equals(name))
				return table;
		}
		return null;
	}

	@Override
	public String getDDL(Table table) {
		return table.getDDL();
	}

	@Override
	public List<Table> getTables() {
		return new LinkedList<>(this.tables.tableDefinitions);
	}

	@Override
	public List<Table> getTablesForStructureDefinition(StructureDefinition sd) {
		return this.tables.getTablesByStructureDefinition(sd);
	}

	@Override
	public Table getTableForDataElement(DataElementStructureLink link) throws ExTableNotFoundException {
		StructureDefinition def = link.getStructureDefinition();
		if (!hasDefinition(def.getId())) {
			createSchema(def);
		}
		return this.catalog.lookUpTableFor(link);
	}

	@Override
	public Table getReferenceTable() {
		return StaticTables.getReferenceTable(this.factory, this.schema);
	}

	@Override
	public Table getResourceTable() {
		return StaticTables.getResourceTable(this.factory, this.schema);
	}

	@Override
	public Table getValueSetExpansionTable() {
		return StaticTables.getValueSetExpansionTable(this.factory, this.schema);
	}

	@Override
	public Table getMartTable() {
		return StaticTables.getMartTable(this.factory, this.schema);
	}

	@Override
	public void ensureStructureDefinition(StructureDefinition definition) {
		if (!hasDefinition(definition.getId())) {
			createSchema(definition);
		}

	}

	@Override
	public SQLStructureMap createSQLStructureMapInstance() {
		return new SQLStructureMap();
	}

	@Override
	public void setSchema(String phsSchema) {
		this.schema = phsSchema.toUpperCase(Locale.ENGLISH);
	}

}
