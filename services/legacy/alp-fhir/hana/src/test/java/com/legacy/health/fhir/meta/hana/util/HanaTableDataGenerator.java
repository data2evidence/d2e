package com.legacy.health.fhir.meta.hana.util;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.Arrays;
import java.util.Calendar;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.List;

public class HanaTableDataGenerator {

	ObjectMapper mapper = new ObjectMapper();

	String[] ignore = { "_validFrom", "_validTo", "DeathIndicator" };

	public String generate(String reference, String schema, String table, String urlPrefix, String version,
			Connection con) throws Exception {
		mapper.enable(SerializationFeature.INDENT_OUTPUT);
		ObjectNode root = mapper.createObjectNode();
		List<String> filter = Arrays.asList(ignore);
		root.put("resourceType", "TableContent");
		root.put("id", reference + "_DATA" + "_" + version.replace(".", "_"));
		root.put("url", urlPrefix.replace("StructureDefinition", "TableContent") + "/" + reference + "_DATA");
		root.put("version", version);
		ObjectNode definition = mapper.createObjectNode();
		root.set("definition", definition);
		// definition.put("reference", reference);
		definition.put("reference", urlPrefix + "/" + reference + "|" + version);
		ArrayNode rows = mapper.createArrayNode();
		root.set("row", rows);
		PreparedStatement ps = con.prepareStatement("select * from \"" + schema + "\".\"" + table + "\" LIMIT 1000");
		ResultSet rs = ps.executeQuery();
		ResultSetMetaData md = rs.getMetaData();
		while (rs.next()) {
			ObjectNode row = mapper.createObjectNode();
			rows.add(row);
			ArrayNode columns = mapper.createArrayNode();
			row.set("column", columns);
			for (int i = 1; i <= md.getColumnCount(); i++) {
				String name = md.getColumnLabel(i);
				if (filter.contains(name))
					continue;
				ObjectNode column = mapper.createObjectNode();
				columns.add(column);
				String type = md.getColumnTypeName(i);
				column.put("name", name);
				Object value = rs.getObject(i);
				// System.out.println(type);
				if (value instanceof String) {
					column.put("valueString", (String) value);
				}
				if (value != null && value.getClass().isArray() && value instanceof byte[]) {
					try {
						value = new String((byte[]) value, "UTF-8");
						column.put("valueString", (String) value);
					} catch (UnsupportedEncodingException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if ("TIMESTAMP".equals(type) && value != null) {
					Calendar start = Calendar.getInstance();
					start.setTimeInMillis(((java.sql.Timestamp) value).getTime());
					column.put("valueString", start.toInstant().toString());
				}
				if ("INTEGER".equals(type) && value != null) {
					column.put("valueString", value.toString());
				}
				if ("DECIMAL".equals(type) && value != null) {
					column.put("valueString", ((BigDecimal) value).toPlainString());
				}
				if ("BOOLEAN".equals(type) && value != null) {
					column.put("valueString", "" + value);
				}
			}
		}
		return mapper.writeValueAsString(root);
	}
}
