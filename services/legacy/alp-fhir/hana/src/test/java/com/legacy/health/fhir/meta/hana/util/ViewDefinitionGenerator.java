package com.legacy.health.fhir.meta.hana.util;

import java.io.File;
import java.io.FileInputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Properties;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.meta.map.StructureMap;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.sql.RelationSchemaController;
import com.legacy.health.fhir.meta.sql.SQLConnector;
import com.legacy.health.fhir.meta.sql.SQLContext;

public class ViewDefinitionGenerator {

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
		return this.generate(id, url, schema, view, version, con);
	}

	public String generate(String id, String url, String schema, String view, String version, Connection con)
			throws SQLException, JsonProcessingException {
		mapper.enable(SerializationFeature.INDENT_OUTPUT);
		// Connection con = context.getConnection();
		PreparedStatement stmt = con
				.prepareStatement("select \"DEFINITION\" from SYS.VIEWS where \"SCHEMA_NAME\"=? and \"VIEW_NAME\"=?");
		stmt.setString(1, schema);
		stmt.setString(2, view);
		String definition = null;
		ResultSet rs = stmt.executeQuery();
		ObjectNode root = null;
		while (rs.next()) {
			definition = rs.getString(1);
		}
		if (definition != null) {
			root = this.getRoot(id, url, schema, view, definition, version);

			stmt.close();
			stmt = con.prepareStatement(
					"select \"COLUMN_NAME\",\"DATA_TYPE_NAME\",\"LENGTH\",\"SCALE\" from SYS.VIEW_COLUMNS where \"SCHEMA_NAME\"=? and \"VIEW_NAME\"=?");
			stmt.setString(1, schema);
			stmt.setString(2, view);
			rs = stmt.executeQuery();
			while (rs.next()) {
				ArrayNode elements = (ArrayNode) root.get("snapshot").get("element");

				String name = rs.getString(1);
				String typeName = rs.getString(2);
				Integer columnSize = rs.getInt(3);
				Integer precission = rs.getInt(4);
				elements.add(element(name, typeName, columnSize, precission, false));

			}
		}
		return root != null ? mapper.writeValueAsString(root) : null;
	}

	private ObjectNode getRoot(String id, String url, String schema, String table, String definition, String version) {
		definition = definition.replaceAll("\"" + schema + "\"", "%%SCHEMA%%");
		ObjectNode root = null;
		root = mapper.createObjectNode();
		root.put("resourceType", "StructureDefinition");
		root.put("id", id + "_" + version.replace(".", "_"));
		root.put("url", url);
		root.put("kind", "resource");
		root.put("version", version);
		root.put("type", id);
		ObjectNode meta = mapper.createObjectNode();
		ArrayNode profiles = mapper.createArrayNode();
		profiles.add("http://data4life.care/health/fhir/profile/Viewdefinition");
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
		extensions.add(stringExtension("http://data4life.care/health/fhir/extension/definition", definition));
		return root;
	}

	private ObjectNode element(String name, String type, Integer columnSize, Integer precission, boolean notNull) {
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
			default:
		}
		if (notNull) {
			extensions.add(booleanExtension("http://data4life.care/health/fhir/extension/notNull", true));
			root.put("min", 1);
		} else {
			root.put("min", 0);
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

	public static void main(String[] args) throws Exception {
		ViewDefinitionGenerator generator = new ViewDefinitionGenerator();
		generator.init();
		// System.out.println(generator.generate("OBSERVATION_BASE","http://data4life.care/health/fhir/StructureDefinition/OBSERVATION_BASE","HCIM",
		// "HCIM_OBSERVATION_BASE" ));
		System.out.println(generator.generate("HCIMGenderCodelist",
				"http://data4life.care/health/fhir/StructureDefinition/HCIMGenderCodelist", "FHIRGZ", "GenderCodelist",
				"0.1"));
	}
}
