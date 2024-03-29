package com.legacy.health.fhir.content;

import java.util.Arrays;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.legacy.health.fhir.content.model.Tabledefinition;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.repsitory.StructureDefinitionDeserializerExtension;

public class TabledefinitionDeserializer implements StructureDefinitionDeserializerExtension {

	@Override
	public List<String> getSupportedProfiles() {
		return Arrays.asList("http://data4life.care/health/fhir/profile/tabledefinition",
				"http://data4life.care/health/fhir/profile/Tabledefinition",
				"http://data4life.care/health/fhir/profile/Viewdefinition");
	}

	public Class<? extends StructureDefinition> getClassForProfile(String profile) {
		if ("http://data4life.care/health/fhir/profile/Tabledefinition".equals(profile)) {
			return Tabledefinition.class;
		}
		if ("http://data4life.care/health/fhir/profile/Tabledefinition".equals(profile)) {
			return Tabledefinition.class;
		}
		if ("http://data4life.care/health/fhir/profile/Viewdefinition".equals(profile)) {
			return Tabledefinition.class;
		}
		return null;
	}

	@Override
	public StructureDefinition deserializeDefinition(JsonNode node) {
		Tabledefinition ret = deserializeDefinition(new Tabledefinition(), node);
		ret.setResolved();
		return ret;
	}

	public static Tabledefinition deserializeDefinition(Tabledefinition ret, JsonNode node) {
		String id = node.get("id").asText();
		ret.setId(id);
		String url = node.get("url").asText();
		ret.setUrl(url);
		String profile = node.path("meta").path("profile").path(0)
				.asText("http://data4life.care/health/fhir/profile/Tabledefinition");
		boolean isView = "http://data4life.care/health/fhir/profile/Viewdefinition".equals(profile);
		String schema = getStringExtension(node, "http://data4life.care/health/fhir/extension/schema");
		String table = getStringExtension(node, "http://data4life.care/health/fhir/extension/table");
		if (isView) {
			String definition = getStringExtension(node, "http://data4life.care/health/fhir/extension/definition");
			ret.setIsView(true);
			ret.setViewDefinition(definition);
		}
		ret.setSchema(schema).setTable(table);
		JsonNode elements = node.get("snapshot").get("element");
		for (JsonNode element : elements) {
			String column = getStringExtension(element, "http://data4life.care/health/fhir/extension/column");
			String type = getStringExtension(element, "http://data4life.care/health/fhir/extension/column-type");
			Integer scale = getPositiveIntExtension(element, "http://data4life.care/health/fhir/extension/columnsize");
			Integer precission = getPositiveIntExtension(element,
					"http://data4life.care/health/fhir/extension/columnprecission");
			Boolean isPrimaryKey = getBooleanExtension(element,
					"http://data4life.care/health/fhir/extension/primaryKey");
			Boolean isReadOnly = getBooleanExtension(element, "http://data4life.care/health/fhir/extension/readOnly");
			String postfix = getStringExtension(element, "http://data4life.care/health/fhir/extension/columnPostfix");
			Boolean notNull = element.path("min").asInt(0) == 1;
			if (column != null && type != null) {
				ret.column(column, type, scale, precission, notNull, isPrimaryKey, postfix, isReadOnly);
			}
		}
		return ret;
	}

	protected static String getStringExtension(JsonNode element, String uri) {

		JsonNode extensions = element.get("extension");
		if (extensions == null)
			return null;
		for (JsonNode extension : extensions) {
			if (extension.has("uri") && extension.get("uri").asText().equals(uri)) {
				return extension.get("valueString").asText();
			}
		}
		return null;
	}

	protected static Boolean getBooleanExtension(JsonNode element, String uri) {

		JsonNode extensions = element.get("extension");
		if (extensions == null)
			return null;
		for (JsonNode extension : extensions) {
			if (extension.has("uri") && extension.get("uri").asText().equals(uri)) {
				return extension.get("valueBoolean").asBoolean();
			}
		}
		return null;
	}

	protected static Integer getPositiveIntExtension(JsonNode element, String uri) {

		JsonNode extensions = element.get("extension");
		if (extensions == null)
			return null;
		for (JsonNode extension : extensions) {
			if (extension.has("uri") && extension.get("uri").asText().equals(uri)) {
				return extension.get("valuePositiveInt").asInt();
			}
		}
		return null;
	}

}
