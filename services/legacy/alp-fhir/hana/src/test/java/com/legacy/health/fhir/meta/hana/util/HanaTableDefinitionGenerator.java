package com.legacy.health.fhir.meta.hana.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Properties;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.meta.map.StructureMap;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.sql.RelationSchemaController;
import com.legacy.health.fhir.meta.sql.SQLConnector;
import com.legacy.health.fhir.meta.sql.SQLContext;

public class HanaTableDefinitionGenerator {
	static ObjectMapper mapper = new ObjectMapper();
	MetaRepository repo;
	Properties testProperties = new Properties();

	SQLContext context = new SQLContext();
	StructureMap map;

	public void init() throws Exception {
		ClassLoader classLoader = ViewDefinitionGenerator.class.getClassLoader();
		File file = new File(classLoader.getResource("test.properties").getFile());
		FileInputStream fis = new FileInputStream(file);
		testProperties.load(fis);
		Connection connection = SQLConnector.connect(testProperties);
		context.connection(connection);
		RelationSchemaController helper = RelationSchemaController.createRelationSchemaController("FHIR1",
				testProperties.getProperty("datasource.driver"));
		helper.setMetaRepository(repo);
		context.setController(helper);

	}

	public String generate(String id, String url, String schema, String view, String version)
			throws SQLException, JsonProcessingException {
		Connection con = context.getConnection();
		String ret = null;
		try {
			ret = this.generate(id, url, schema, view, version, con);
		} finally {
			con.close();
		}
		return ret;
	}

	protected String generate(String id, String url, String schema, String view, String version, Connection con)
			throws SQLException, JsonProcessingException {

		ObjectNode root = this.getRoot(id, url, schema, view, version);

		PreparedStatement stmt = con.prepareStatement(
				"select \"COLUMN_NAME\",\"DATA_TYPE_NAME\",\"LENGTH\",\"SCALE\",\"GENERATED_ALWAYS_AS\",\"GENERATION_TYPE\",\"IS_NULLABLE\",\"INDEX_TYPE\" from SYS.COLUMNS where \"SCHEMA_NAME\"=? and \"TABLE_NAME\"=? ORDER BY POSITION ASC");
		stmt.setString(1, schema);
		stmt.setString(2, view);
		ResultSet rs = stmt.executeQuery();
		while (rs.next()) {
			ArrayNode elements = (ArrayNode) root.get("snapshot").get("element");

			String name = rs.getString(1);
			String typeName = rs.getString(2);
			Integer columnSize = rs.getInt(3);
			Integer precission = rs.getInt(4);
			String generated = rs.getString(5);
			String generationType = rs.getString(6);
			Boolean notNull = "FALSE".equals(rs.getString(7));
			String indexType = rs.getString(8);// At the moment treat full Index as Primary Key flag.

			elements.add(
					element(name, typeName, columnSize, precission, notNull, generated, generationType, indexType));
		}
		return root != null ? mapper.writeValueAsString(root) : null;
	}

	private ObjectNode getRoot(String id, String url, String schema, String table, String version) {
		ObjectNode root = null;
		root = mapper.createObjectNode();
		root.put("resourceType", "StructureDefinition");
		root.put("id", id + "_" + version.replace(".", "_"));
		root.put("url", url);
		root.put("version", version);
		root.put("kind", "resource");
		root.put("type", id);
		ObjectNode meta = mapper.createObjectNode();
		ArrayNode profiles = mapper.createArrayNode();
		profiles.add("http://data4life.care/health/fhir/profile/Tabledefinition");
		meta.set("profile", profiles);
		root.set("meta", meta);
		ArrayNode extensions = mapper.createArrayNode();
		root.set("extension", extensions);
		ObjectNode snapshot = mapper.createObjectNode();
		ArrayNode elements = mapper.createArrayNode();
		ObjectNode rootElement = mapper.createObjectNode();
		rootElement.put("id", id);
		rootElement.put("path", id);
		rootElement.put("min", 0);
		rootElement.put("max", "*");
		elements.add(rootElement);
		snapshot.set("element", elements);
		root.set("snapshot", snapshot);
		extensions.add(stringExtension("http://data4life.care/health/fhir/extension/schema", schema));
		extensions.add(stringExtension("http://data4life.care/health/fhir/extension/table", table));
		return root;
	}

	private ObjectNode element(String name, String type, Integer columnSize, Integer precission, boolean notNull,
			String generationExpression, String generationType, String indexType) {
		ObjectNode root = null;
		root = mapper.createObjectNode();
		root.put("id", name);
		ArrayNode extensions = mapper.createArrayNode();
		extensions.add(stringExtension("http://data4life.care/health/fhir/extension/column", name));
		extensions.add(stringExtension("http://data4life.care/health/fhir/extension/column-type", type));
		switch (type) {
			case "NVARCHAR":
				extensions.add(
						positiveIntExtension("http://data4life.care/health/fhir/extension/columnsize", columnSize));
				break;
			case "VARBINARY":
				extensions.add(
						positiveIntExtension("http://data4life.care/health/fhir/extension/columnsize", columnSize));
				break;
			case "DECIMAL":
				extensions.add(
						positiveIntExtension("http://data4life.care/health/fhir/extension/columnsize", columnSize));
				extensions.add(
						positiveIntExtension("http://data4life.care/health/fhir/extension/columnprecission",
								precission));
				break;
			default:
		}
		if (notNull && "FULL".equals(indexType)) {
			extensions.add(booleanExtension("http://data4life.care/health/fhir/extension/primaryKey", true));
		}
		if (notNull) {
			extensions.add(booleanExtension("http://data4life.care/health/fhir/extension/notNull", true));
			root.put("min", 1);
		} else {
			root.put("min", 0);
		}
		if (generationType != null && generationExpression == null) {
			extensions.add(stringExtension("http://data4life.care/health/fhir/extension/columnPostfix",
					" GENERATED " + generationType));
			extensions.add(booleanExtension("http://data4life.care/health/fhir/extension/readOnly", true));
		}
		if (generationType != null && generationExpression != null) {
			extensions.add(stringExtension("http://data4life.care/health/fhir/extension/columnPostfix",
					" GENERATED " + generationType + " " + generationExpression));
			extensions.add(booleanExtension("http://data4life.care/health/fhir/extension/readOnly", true));
		}
		root.set("extension", extensions);
		root.put("max", "*");
		return root;
	}

	protected ObjectNode stringExtension(String uri, String value) {
		ObjectNode ret = mapper.createObjectNode();
		ret.put("uri", uri);
		ret.put("valueString", value);
		return ret;
	}

	protected ObjectNode booleanExtension(String uri, Boolean value) {
		ObjectNode ret = mapper.createObjectNode();
		ret.put("uri", uri);
		ret.put("valueBoolean", value);
		return ret;
	}

	protected ObjectNode positiveIntExtension(String uri, Integer value) {
		ObjectNode ret = mapper.createObjectNode();
		ret.put("uri", uri);
		ret.put("valuePositiveInt", value);
		return ret;
	}

	public void generateFromSchema(String prefix, String schemaName, String urlPrefix, String folder, String version)
			throws Exception {
		mapper.enable(SerializationFeature.INDENT_OUTPUT);
		ObjectNode scenario = getScenarioDefinition(schemaName, folder, urlPrefix, version);
		scenario.put("id", schemaName + "_" + version.replace(".", "_"));
		scenario.put("url", urlPrefix + "/" + schemaName);
		scenario.put("version", version);
		HanaTableDataGenerator dataGen = new HanaTableDataGenerator();
		JsonNode node = scenario.path("deployment").path(0);
		JsonNode nodeTest = scenario.path("deployment").path(1);
		ArrayNode dataArray = mapper.createArrayNode();
		if (nodeTest instanceof ObjectNode) {
			ObjectNode test = (ObjectNode) nodeTest;
			test.set("data", dataArray);
		}
		if (node instanceof ObjectNode) {
			ObjectNode deployment = (ObjectNode) node;
			ArrayNode persistency = mapper.createArrayNode();
			deployment.set("persistency", persistency);
			Connection con = context.getConnection();
			try {
				PreparedStatement stmt = con
						.prepareStatement("SELECT \"TABLE_NAME\" from \"SYS\".\"TABLES\" where \"SCHEMA_NAME\"=?");
				stmt.setString(1, schemaName);
				ResultSet rs = stmt.executeQuery();
				while (rs.next()) {
					String tableName = rs.getString(1);
					if (tableName.endsWith("_HISTORY"))
						continue;
					String definition = this.generate(prefix + tableName, urlPrefix + "/" + prefix + tableName,
							schemaName, tableName, version, con);
					ObjectNode entry = mapper.createObjectNode();
					ArrayNode configuration = mapper.createArrayNode();
					configuration.add("permanent");
					entry.set("configuration", configuration);
					ObjectNode refDefinition = mapper.createObjectNode();
					// refDefinition.put("reference", prefix+tableName);
					refDefinition.put("reference", urlPrefix + "/" + prefix + tableName + "|" + version);
					entry.set("definition", refDefinition);
					persistency.add(entry);
					try (PrintWriter out = new PrintWriter(
							folder + "/" + prefix + tableName + "_" + version.replace(".", "_") + ".json")) {
						out.println(definition);
					} catch (FileNotFoundException e) {
						e.printStackTrace();
					}
					// System.out.println(definition);
					String data = dataGen.generate(prefix + tableName, schemaName, tableName, urlPrefix, version, con);
					ObjectNode dataRef = mapper.createObjectNode();
					// dataRef.put("reference", prefix+tableName+"_DATA");
					dataRef.put("reference", urlPrefix + "/" + prefix + tableName + "_DATA" + "|" + version);
					dataArray.add(dataRef);
					try (PrintWriter out = new PrintWriter(
							folder + "/" + prefix + tableName + "_" + version.replace(".", "_") + "_DATA.json")) {
						out.println(data);
					} catch (FileNotFoundException e) {
						e.printStackTrace();
					}
					// System.out.println(data);
				}
				rs.close();
				createViews(prefix, schemaName, urlPrefix, folder, persistency, con, true, version);
				createViews(prefix, schemaName, urlPrefix, folder, persistency, con, false, version);
				this.workOnCatalogs(urlPrefix, version, folder);
			} finally {
				con.close();
			}
			try (PrintWriter out = new PrintWriter(folder + "/" + schemaName + ".json")) {
				out.println(mapper.writeValueAsString(scenario));
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			}
			System.out.println(scenario.toString());
		}
	}

	private void createViews(String prefix, String schemaName, String urlPrefix, String folder,
			ArrayNode persistency, Connection con, Boolean codeLists, String version) throws Exception {
		HanaTableDataGenerator dataGen = new HanaTableDataGenerator();
		PreparedStatement stmt;
		ResultSet rs;
		ViewDefinitionGenerator viewGen = new ViewDefinitionGenerator();
		stmt = con.prepareStatement("SELECT \"VIEW_NAME\" from \"SYS\".\"VIEWS\" where \"SCHEMA_NAME\"=?");
		stmt.setString(1, schemaName);
		rs = stmt.executeQuery();
		while (rs.next()) {
			String tableName = rs.getString(1);
			if (tableName.endsWith("Codelist") != codeLists)
				continue;
			String definition = viewGen.generate(prefix + tableName, urlPrefix + "/" + prefix + tableName, schemaName,
					tableName, version, con);
			ObjectNode entry = mapper.createObjectNode();
			ArrayNode configuration = mapper.createArrayNode();
			configuration.add("permanent");
			entry.set("configuration", configuration);
			ObjectNode refDefinition = mapper.createObjectNode();
			// refDefinition.put("reference", prefix+tableName);
			refDefinition.put("reference", urlPrefix + "/" + prefix + tableName + "|" + version);
			entry.set("definition", refDefinition);
			persistency.add(entry);
			try (PrintWriter out = new PrintWriter(
					folder + "/" + prefix + tableName + "_" + version.replace(".", "_") + ".json")) {
				out.println(definition);
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			}
			// System.out.println(definition);
			if (!codeLists) {
				String data = dataGen.generate(prefix + tableName, schemaName, tableName, urlPrefix, version, con);
				ObjectNode dataRef = mapper.createObjectNode();
				dataRef.put("reference", prefix + tableName + "_DATA");
				try (PrintWriter out = new PrintWriter(
						folder + "/" + prefix + tableName + "_" + version.replace(".", "_") + "_DATA.json")) {
					out.println(data);
				} catch (FileNotFoundException e) {
					e.printStackTrace();
				}
				// System.out.println(data);
			}
		}
	}

	String[] catalogs = { "patient_catalog", "observation_catalog" };

	protected void workOnCatalogs(String urlPrefix, String version, String folder) throws IOException {
		for (String entry : catalogs) {
			ObjectNode ret = null;
			String fileName = folder + "/" + entry + ".json";
			File f = new File(fileName);
			JsonNode node = f.exists() ? mapper.readTree(f) : null;
			if (node instanceof ObjectNode) {
				ret = (ObjectNode) node;
				adaptTableReferences(urlPrefix, version, ret);
			} else {
				ret = mapper.createObjectNode();
			}
			ret.put("id", entry + "_" + version.replace(".", "_"));
			ret.put("url", urlPrefix + "/" + entry);
			ret.put("version", version);
			try (PrintWriter out = new PrintWriter(fileName)) {
				out.println(mapper.writeValueAsString(ret));
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			}
		}
	}

	private void adaptTableReferences(String urlPrefix, String version, ObjectNode ret) {
		for (int t = 0; t < ret.path("table").size(); t++) {
			JsonNode table = ret.path("table").get(t);
			JsonNode referenceNode = table.path("definition").path("reference");
			if (referenceNode.isValueNode()) {
				ObjectNode def = (ObjectNode) table.path("definition");
				String reference = referenceNode.asText();
				if (reference.startsWith("http") && reference.split("\\|").length == 2) {
					String url = reference.split("\\|")[0];
					def.put("reference", url + "|" + version);
				} else {
					def.put("reference", urlPrefix + "/" + reference + "|" + version);
				}
			}
			adaptTableReferences(urlPrefix, version, (ObjectNode) table);
		}
	}

	protected ObjectNode getScenarioDefinition(String schemaName, String folder, String urlPrefix, String version)
			throws IOException {
		ObjectNode ret = null;
		File f = new File(folder + "/" + schemaName + "Scenario.json");
		JsonNode node = f.exists() ? mapper.readTree(f) : null;
		if (node instanceof ObjectNode) {
			ret = (ObjectNode) node;
		} else {// create Scenario
			ret = mapper.createObjectNode();
			ret.put("id", schemaName);
			ret.put("resourceType", "ScenarioDefinition");
			ret.put("category", "catalog");
			ArrayNode deployment = mapper.createArrayNode();
			ObjectNode base = mapper.createObjectNode();
			deployment.add(base);
			ret.set("deployment", deployment);
			base.put("scope", "base");
			ArrayNode catalogArray = mapper.createArrayNode();
			for (String entry : catalogs) {
				ObjectNode ref = mapper.createObjectNode();
				ref.put("reference", urlPrefix + "/" + entry + "|" + version);
				catalogArray.add(ref);
			}
			base.set("catalog", catalogArray);
			ObjectNode test = mapper.createObjectNode();
			deployment.add(test);
			test.put("scope", "test");
		}
		return ret;
	}

	public static void main(String[] args) throws Exception {
		HanaTableDefinitionGenerator generator = new HanaTableDefinitionGenerator();
		generator.init();
		// System.out.println(generator.generate("OBSERVATION_BASE","http://data4life.care/health/fhir/StructureDefinition/OBSERVATION_BASE","HCIM",
		// "HCIM_OBSERVATION_BASE" ));
		// System.out.println(generator.generate("Patient","http://data4life.care/health/fhir/StructureDefinition/Patient","FHIRGZ",
		// "Patient" ));
		// generator.generateFromSchema("HCIM","FHIRGZ",
		// "http://data4life.care/health/fhir/StructureDefinition",
		// "c:/fhir/ws/content/hcim","0.1");
		generator.generateFromSchema("HCIM", "HCIM_SCENARIO", "http://data4life.care/health/fhir/StructureDefinition",
				"c:/hcim/de/test", "2.0");

	}
}
