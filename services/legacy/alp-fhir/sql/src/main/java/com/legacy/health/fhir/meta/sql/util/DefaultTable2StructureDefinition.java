package com.legacy.health.fhir.meta.sql.util;

import java.sql.DatabaseMetaData;
import java.sql.JDBCType;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.meta.sql.SQLContext;

public class DefaultTable2StructureDefinition implements Table2StructureDefinition {
	static ObjectMapper mapper = new ObjectMapper();

	@Override
	public JsonNode getStructureDefinition(SQLContext context, String id, String url, String schema, String table)
			throws SQLException {
		ObjectNode root = null;

		DatabaseMetaData md = context.getConnection().getMetaData();
		// context.getController().getProviderFactory();
		if (md != null) {
			ResultSet rs = md.getColumns(null, schema, table, "%");
			while (rs.next()) {
				if (root == null)
					root = getRoot(id, url, schema, table);
				ArrayNode elements = (ArrayNode) root.get("snapshot").get("element");
				String name = rs.getString("COLUMN_NAME");
				int type = rs.getInt("DATA_TYPE");
				String typeName = JDBCType.valueOf(type).getName();
				Integer columnSize = (Integer) rs.getObject("COLUMN_SIZE");
				Integer precission = (Integer) rs.getObject("DECIMAL_DIGITS");
				Integer isNullable = (Integer) rs.getObject("NULLABLE");
				boolean notNull = DatabaseMetaData.columnNoNulls == isNullable;
				elements.add(element(name, typeName, columnSize, precission, notNull));
			}
		}
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

	private ObjectNode getRoot(String id, String url, String schema, String table) {
		ObjectNode root = null;
		root = mapper.createObjectNode();
		root.put("resourceType", "StructureDefinition");
		root.put("id", id);
		root.put("url", url);
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

}
