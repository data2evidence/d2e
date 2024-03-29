package com.legacy.health.fhir.meta.sql;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Properties;
import java.util.stream.Collectors;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.DataElement;

import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.sql.queryengine.SQLStructureMap;
import com.legacy.health.fhir.meta.entity.DataElementStructureLink;
import com.legacy.health.fhir.meta.entity.DataType;
import com.legacy.health.fhir.meta.entity.RequestContext;

public class SchemaControllerImpl implements RelationSchemaController {

	private static Log log = LogFactory.getLog(SchemaControllerImpl.class);

	protected ArrayList<Table> ddlStatements = new ArrayList<>();
	protected HashMap<String, HashMap<String, Table>> elementMap = new HashMap<>();
	protected String schema;
	protected SQLTypeMapper mapper = null;
	protected SQLProviderFactory factory = null;// new SQLProviderFactory();
	protected List<String> definitions = new ArrayList<>();
	protected Connection connection = null;
	protected MetaRepository repo;

	private Table valueSetExpansion;
	private Table ressourceTable;
	private Table martTable;
	private Table referenceTable;
	// private Table valueSetTable;

	SchemaControllerImpl(String schema, String driverName) {
		this.schema = schema.toUpperCase(Locale.ROOT);
		this.factory = SQLProviderFactory.createInstance(driverName);
	}

	@Override
	public void initializeDatabase(Connection con) throws FhirException {
		SQLExecutor sql = new SQLExecutor();
		sql.connect(con);
		try {
			List<String> ddls = new ArrayList<>();
			sql.executeDDL("DROP SCHEMA \"" + this.schema + "\" CASCADE", true);
			sql.executeDDL("CREATE SCHEMA \"" + this.schema + "\"", false);

			clearDDLs();
			log.debug(" DROP & CREATE of SCHEMA " + this.schema + "  is done");
			ddls.add(getResourceTable().getDDL());
			ddls.add(getReferenceTable().getDDL());
			ddls.add(getMartTable().getDDL());

			StructureDefinition sd = repo.getStructureDefinitionById("ValueSet");
			// RelationSchemaController controller =
			// SchemaControllerFactory.createSchemaController(schema, factory);
			this.setMetaRepository(repo);
			this.createSchema(sd);
			for (int c = 0; c < this.getTables().size(); c++) {
				ddls.add(this.getDDL(this.getTables().get(c)));
			}
			// ddls.add(StaticTables.getValueSetExpansionDDL(this.schema));

			sql.executeBatch(ddls, false); // Execute all DDLs as a batch
			sql.executeDDL(StaticTables.getValueSetExpansionDDL(this), false);
		} catch (SQLException e) {
			throw new FhirException("Error while performing initialization of Database", e);
		}

	}

	@Override
	public void initializeDatabaseForProfile(Connection con, RequestContext reqCtx) throws FhirException {
		String activeProfile = reqCtx.getActiveSpringProfileConfiguration();
		SQLExecutor sql = new SQLExecutor();
		sql.connect(con);
		try {
			List<String> ddls = new ArrayList<>();
			if (activeProfile == null || (!activeProfile.equals("xsa"))) {
				sql.executeDDL("DROP SCHEMA \"" + this.schema + "\" CASCADE", true);
				sql.executeDDL("CREATE SCHEMA \"" + this.schema + "\"", false);
			}

			clearDDLs();
			log.debug(" DROP & CREATE of SCHEMA " + this.schema + "  is done");
			ddls.add(getResourceTable().getDDL());
			ddls.add(getReferenceTable().getDDL());
			ddls.add(getMartTable().getDDL());

			StructureDefinition sd = repo.getStructureDefinitionById("ValueSet");
			// RelationSchemaController controller =
			// SchemaControllerFactory.createSchemaController(schema, factory);
			this.setMetaRepository(repo);
			this.createSchema(sd);
			for (int c = 0; c < this.getTables().size(); c++) {
				// ddls.add(this.getDDL(this.getTables().get(c)));
				ddls.add(this.getTables().get(c).getDDL());
			}
			// ddls.add(StaticTables.getValueSetExpansionDDL(this.schema));

			sql.executeBatch(ddls, false); // Execute all DDLs as a batch
			sql.executeDDL(StaticTables.getValueSetExpansionDDL(this), false);
		} catch (SQLException e) {
			throw new FhirException("Error while performing initialization of Database", e);
		}

	}

	private void clearDDLs() {
		// TODO Auto-generated method stub
		ddlStatements.clear();
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
	public Table getMartTable() {
		if (martTable == null) {
			martTable = StaticTables.getMartTable(this.factory, this.schema);
		}
		return martTable;
	}

	@Override
	public Table getReferenceTable() {
		if (referenceTable == null) {
			referenceTable = StaticTables.getReferenceTable(this.factory, this.schema);
		}
		return referenceTable;
	}

	@Override
	public boolean createSchema(StructureDefinition definition) {
		if (!definition.getId().equals(definition.getType()))
			return true;
		long start = System.currentTimeMillis();
		Context ctx = new Context();
		ctx.root = definition;
		ctx.isRoot = true;
		definitions.add(definition.getId());
		boolean ret = createSchemaInternal(definition, ctx, "");
		long stop = System.currentTimeMillis();
		log.debug("Create Schema:" + (stop - start));
		return ret;
	}

	@Override
	public boolean hasDefinition(String definition) {
		return definitions.contains(definition);
	}

	@Override
	public void setSQLProviderFactory(SQLProviderFactory factory) {
		this.factory = factory;
	}

	protected boolean createSchemaInternal(StructureDefinition definition, Context context, String prefix) {
		handleRootElements(definition, context, prefix);
		handleSimpleTypeArray(definition, context, prefix);
		handleComplexTypes(definition, context, prefix);
		return true;
	}

	protected void handleRootElements(StructureDefinition definition, Context context, String prefix) {
		String tableName = buildTableName(context, prefix, definition);
		List<DataElement> rootElements = definition.getDataElements().stream()
				.filter(element -> element.getMax() == 1 && element.getType() != null && !element.getType().isComplex())
				.collect(Collectors.toList());
		if (definition.getId().toLowerCase(Locale.ROOT).equals("reference")) {
			rootElements.forEach(element -> {
				HashMap<String, Table> structureTables = elementMap.get(element.getId());
				if (structureTables == null) {
					structureTables = new HashMap<>();
					elementMap.put(element.getId(), structureTables);
				}
				Table r = StaticTables.getReferenceTable(this.factory, this.schema);
				String columnName = buildColumnName(element.getId(), definition.getId());
				Column c = r.getColumnByName(columnName);
				if (c.getDataElement() == null) {
					c.setDataElement(element);
				}
				structureTables.put(context.root.getId(), StaticTables.getReferenceTable(this.factory, this.schema));
				// registerTable(element, this.getReferenceTable());
			});
		} else {
			Table t = factory.createTable();
			t.setDefinition(context.root);
			t.schema = '"' + this.schema + '"';
			t.name = tableName;
			if (!context.isRoot) {
				Column idColumn = new Column("\"PARENT_ID\"", "VARCHAR(60)");
				t.setStructureLinkColumn(idColumn);
				t.addColumn(idColumn);
				t.addColumn(new Column("\"DATAELEMENT_ID\"", "VARCHAR(100)"));
				t.addColumn(new Column("\"REFERENCE_PATH\"", "VARCHAR(100)"));
				t.addColumn(new Column("\"LOGICAL_PATH\"", "VARCHAR(100)"));
			}
			t.addColumn(new Column("\"CANONICAL_ID\"", "VARCHAR(255)"));

			rootElements.forEach(element -> {
				registerTable(element, t);
				Column c = new Column(buildColumnName(element.getId(), definition.getId()),
						this.getSQLTypeMapper().getSQLType(element), element);
				if (context.isRoot && element.getShortName().equals("id")) {
					t.setStructureLinkColumn(c);
				}
				t.addColumn(c);
			});
			ddlStatements.add(t);
		}
		context.isRoot = false;
	}

	protected void registerTable(DataElement element, Table table) {
		StructureDefinition definition = table.getDefinition();
		HashMap<String, Table> structureTables = elementMap.get(element.getId());
		if (structureTables == null) {
			structureTables = new HashMap<>();
			elementMap.put(element.getId(), structureTables);
		}
		structureTables.put(definition.getId(), table);
	}

	protected void handleSimpleTypeArray(StructureDefinition definition, Context context, String prefix) {
		String rootTableName = prefix + definition.getId().toUpperCase(Locale.ROOT);
		List<DataElement> arrayElements = definition.getDataElements().stream()
				.filter(element -> element.getMax() > 1 && element.getType() != null && !element.getType().isComplex())
				.collect(Collectors.toList());
		arrayElements.forEach(element -> {
			Table t = factory.createTable();
			t.setDefinition(context.root);
			t.schema = '"' + this.schema + '"';
			t.name = '"' + context.root.getId().toUpperCase(Locale.ROOT) + "_" + rootTableName + "_"
					+ element.getShortName().toUpperCase(Locale.ROOT) + '"';
			registerTable(element, t);
			Column parentId = new Column();
			parentId.name = "\"PARENT_ID\"";
			parentId.type = "VARCHAR(60)";
			t.addColumn(parentId);
			t.setStructureLinkColumn(parentId);
			Column pos = new Column();
			pos.name = "\"POS\"";
			pos.type = "INTEGER";
			t.addColumn(pos);
			t.addColumn(new Column("\"CANONICAL_ID\"", "VARCHAR(255)"));
			Column parentPath = new Column();
			parentPath.name = "\"PARENT_PATH\"";
			parentPath.type = "VARCHAR(100)";
			t.addColumn(parentPath);
			Column path = new Column();
			path.name = "\"PATH\"";
			path.type = "VARCHAR(100)";
			t.addColumn(path);
			Column value = new Column();
			value.name = "\"VALUE\"";
			value.type = getSQLTypeMapper().getSQLType(element);
			value.setDataElement(element);
			t.addColumn(value);

			this.ddlStatements.add(t);
		});
	}

	protected Table getTable(String name) {
		for (Iterator<Table> iterator = ddlStatements.iterator(); iterator.hasNext();) {
			Table table = iterator.next();
			if (table.name.equals(name)) {
				return table;
			}
		}
		return null;
	}

	protected boolean hasTable(String name) {
		Table t = getTable(name);
		return t != null;
	}

	protected String buildTableName(Context context, String prefix, StructureDefinition definition) {
		String defId = definition.getId();
		if (definition instanceof DataType) {
			if (((DataType) definition).isBackbone()) {
				String id = definition.getId();
				defId = id.substring(id.indexOf(".") + 1);
			}
		}
		String ret = (context.isRoot ? "" : (context.root.getId() + "_")) + prefix + defId;
		if (ret.length() > 60) {
			log.warn("too long:" + ret);
		}
		return '"' + ret.toUpperCase(Locale.ROOT).replaceAll("\\.", "_") + '"';
	}

	protected String buildColumnName(String dataElementName, String rootName) {
		if (dataElementName.startsWith(rootName)) {
			int l = rootName.length();
			return '"' + dataElementName.substring(l + 1).toUpperCase(Locale.ROOT) + '"';
		}
		String[] seg = dataElementName.split("\\.");
		return '"' + seg[seg.length - 1].toUpperCase(Locale.ROOT) + '"';
	}

	protected SQLTypeMapper getSQLTypeMapper() {
		if (this.mapper == null) {
			this.mapper = factory.createSQLTypeMapper();
		}
		return this.mapper;
	}

	@Override
	public Table getResourceTable() {

		if (ressourceTable == null) {
			ressourceTable = StaticTables.getResourceTable(this.factory, this.schema);
		}
		return ressourceTable;
	}

	@Override
	public Table getValueSetExpansionTable() {
		if (valueSetExpansion == null) {
			valueSetExpansion = StaticTables.getValueSetExpansionTable(this.factory, this.schema);
		}
		return valueSetExpansion;
	}

	protected void handleComplexTypes(StructureDefinition definition, Context context, String prefix) {
		List<DataElement> complexElements = definition.getDataElements().stream()
				.filter(element -> element.getType() != null && element.getType().isComplex())
				.collect(Collectors.toList());
		if (definition.getId().equals("Extension")) {
			return;
		}
		complexElements.forEach(element -> {
			String tableName = buildTableName(context, prefix, element.getType());
			if (!hasTable(tableName)) {
				this.createSchemaInternal(element.getType(), context, prefix);
			}
			// System.out.println(tableName + ":"+element.getType().getId());
			if (!element.getType().getId().equals("Reference")) {
				registerTable(element, getTable(tableName));
			}
		});
	}

	public String toSQL() {
		final StringBuffer ret = new StringBuffer();
		this.ddlStatements.forEach(table -> {
			ret.append(table.getDDL());
		});
		return ret.toString();
	}

	@Override
	public String getDDL(Table table) {
		return table.getDDL();
	}

	@Override
	public List<Table> getTables() {
		return this.ddlStatements;
	}

	@Override
	public List<Table> getTablesForStructureDefinition(StructureDefinition sd) {
		ArrayList<Table> ret = new ArrayList<>();
		for (Table table : ddlStatements) {
			if (table.getDefinition().equals(sd)) {
				ret.add(table);
			}
		}
		return ret;
	}

	@Override
	public Table getTableForDataElement(DataElementStructureLink link) {
		StructureDefinition def = link.getStructureDefinition();
		if (!hasDefinition(def.getId())) {
			createSchema(def);
		}
		HashMap<String, Table> structureTables = elementMap.get(link.getDataElement().getId());
		if (structureTables == null) {
			return null;
		}
		return structureTables.get(link.getStructureDefinition().getId());
	}

	static class Context {
		StructureDefinition root;
		boolean isRoot;
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
		// TODO Auto-generated method stub
		this.schema = phsSchema.toUpperCase(Locale.ENGLISH);
	}

}
