package com.legacy.health.fhir.meta.sql.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.json.JSONWalker;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.sql.catalog.CatalogFHIRResourceRepository;
import com.legacy.health.fhir.meta.xml.XMLWalker;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.Calendar;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Element;

public class FhirUtils {

	private static final Logger log = LoggerFactory.getLogger(CatalogFHIRResourceRepository.class);

	// private static MetaRepository repository;
	// private static UUIDGenerator uuidGenerator;

	// @Autowired
	// public FhirUtils(MetaRepository repository, UUIDGenerator uuidGenerator) {
	// FhirUtils.repository = repository;
	// FhirUtils.uuidGenerator = uuidGenerator;
	// }

	// public static Structure toBundle(String type, List<ObjectNode> resources) {
	// ObjectNode bundle = JsonNodeFactory.instance.objectNode();
	// bundle.put("resourceType", "Bundle");
	// bundle.put("id", uuidGenerator.generateId());
	// bundle.set("links", JsonNodeFactory.instance.arrayNode());
	// bundle.put("type", type);
	// bundle.set("entry", JsonNodeFactory.instance.arrayNode());
	// for (ObjectNode resource : resources) {
	// ((ArrayNode) bundle.get("entry")).add(resource);
	// }
	// bundle.put("total", resources.size());
	// return FhirUtils.toStructure(bundle);
	// }

	public static Structure toBundle(String idValue, List<ObjectNode> resources, String patientId,
			MetaRepository metaRepository) {
		ObjectNode bundle = JsonNodeFactory.instance.objectNode();
		bundle.put("resourceType", "Bundle");
		bundle.put("id", patientId + "-SearchResult");
		bundle.set("links", JsonNodeFactory.instance.arrayNode());
		bundle.put("type", "search-set");
		bundle.set("entry", JsonNodeFactory.instance.arrayNode());
		for (ObjectNode resource : resources) {
			((ArrayNode) bundle.get("entry")).add(resource);
		}
		bundle.put("total", resources.size());
		return FhirUtils.toStructure(bundle, metaRepository);
	}

	public static Structure toStructure(JsonNode json, MetaRepository repository) {
		JSONWalker walker = new JSONWalker();
		walker.setMetaRepository(repository);
		return walker.fromJSON(json);
	}

	public static Structure toStructure(Element xml, MetaRepository repository) {
		XMLWalker walker = new XMLWalker();
		walker.setMetaRepository(repository);
		return walker.fromXML(xml);
	}

	public static JsonNode toJson(Structure structure) {
		return new JSONWalker().toJSON(structure);
	}

	public static Element toXml(Structure structure) {
		return new XMLWalker().toXML(structure);
	}

	public static ObjectNode getTableContentResource(ResultSet rs, String defRef, String tableName)
			throws SQLException {

		ObjectMapper mapper = new ObjectMapper();
		mapper.enable(SerializationFeature.INDENT_OUTPUT);

		ObjectNode root = mapper.createObjectNode();
		root.put("resourceType", "TableContent");
		if (tableName != null && tableName.contains("\"")) {
			tableName = tableName.replace("\"", "");
		}

		root.put("id", tableName); // what should be the id? TableName is sufficient?
		// root.put("url", urlPrefix.replace("StructureDefinition",
		// "TableContent")+"/"+reference+"_DATA");
		// root.put("version", version);
		ObjectNode definition = mapper.createObjectNode();
		root.set("definition", definition);
		// definition.put("reference", reference);
		definition.put("reference", defRef);
		ArrayNode rows = mapper.createArrayNode();
		root.set("row", rows);
		ResultSetMetaData md = rs.getMetaData();
		while (rs.next()) {
			ObjectNode row = mapper.createObjectNode();
			rows.add(row);
			ArrayNode columns = mapper.createArrayNode();
			row.set("column", columns);
			for (int i = 1; i <= md.getColumnCount(); i++) {
				String name = md.getColumnLabel(i);
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
						log.error(value + "UTF-8 Conversion error", e);
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
		return root;
	}
}
