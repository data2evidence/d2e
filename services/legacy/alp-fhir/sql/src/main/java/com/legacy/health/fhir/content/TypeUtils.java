package com.legacy.health.fhir.content;

import org.apache.commons.lang3.StringUtils;
import org.apache.velocity.VelocityContext;

import com.fasterxml.jackson.databind.JsonNode;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;

public class TypeUtils {

	private VelocityContext vContext;

	public void setVelocityContext(VelocityContext vContext) {
		this.vContext = vContext;
	}

	public int dec(String cnt) {
		return Integer.parseInt(cnt) - 1;
	}

	public int dec(Integer cnt) {
		return cnt - 1;
	}

	public String toJava(ContextHelper typeCtx, ContextHelper element) {
		JsonNode node = null;
		if (typeCtx == null) {// e.g. ContentReference
			if (element.getJsonElement().get("contentReference") != null) {
				String contentReference = element.getJsonElement().get("contentReference").asText();
				JsonNode root = ((ContextHelper) vContext.get("root")).getJsonElement();
				contentReference = contentReference.substring(1);
				JsonNode elements = root.path("snapshot").path("element");
				for (int i = 0; i < elements.size(); i++) {
					JsonNode current = elements.get(i);
					if (current.get("id").asText().equals(contentReference)) {
						node = current.get("type").get(0);
					}
				}
			}
			if (node == null) {
				return "Object";
			}
		} else {
			node = ((ContextHelper) typeCtx).getJsonElement();
		}
		String type = node.get("code").asText();
		switch (type) {
			case "code":
			case "id":
			case "string":
			case "uri":
				return "String";
			case "boolean":
				return "Boolean";
			case "Reference":
				return findReference(element.getJsonElement());
			case "BackboneElement":
				ContextHelper id = (ContextHelper) element.get("id");
				String name = id.dot(1);
				return StringUtils.capitalize(name);
			default:
				return "";
		}
	}

	public boolean isContentReference(ContextHelper element) {
		JsonNode node = element.getJsonElement();
		boolean ret = node.get("contentReference") != null;
		return ret;
	}

	public boolean isBackbone(ContextHelper typeCtx) {
		JsonNode node = ((ContextHelper) typeCtx).getJsonElement();
		String type = node.get("code").asText();
		return type.equals("BackboneElement");
	}

	public boolean isStructureDefinition(ContextHelper element) {
		JsonNode ref = element.getJsonElement().get("type");
		if (ref != null && ref.isArray()) {
			if (ref.get(0).get("targetProfile") != null) {
				String profile = ref.get(0).get("targetProfile").asText();
				MetaRepository repo = (MetaRepository) vContext.get("repo");
				StructureDefinition sd = repo.getStructureDefinitionByUrl(profile, null);
				if (sd == null)
					return false;
				if (sd.getProfiles().contains("http://data4life.care/health/fhir/profile/StructureDefinition")) {
					return true;
				}
			}
		}
		return false;
	}

	public String capitalize(String content) {
		return StringUtils.capitalize(content);
	}

	public String findReference(JsonNode element) {
		JsonNode ref = element.get("type");
		if (ref != null && ref.isArray()) {
			if (ref.get(0).get("targetProfile") != null) {
				String profile = ref.get(0).get("targetProfile").asText();
				MetaRepository repo = (MetaRepository) vContext.get("repo");
				StructureDefinition sd = repo.getStructureDefinitionByUrl(profile, null);
				if (sd == null)
					return "Structure";
				if (sd.getProfiles().contains("http://data4life.care/health/fhir/profile/StructureDefinition")) {
					return sd.getId();
				}
				if (sd.getId().equals("StructureDefinition")) {
					return "StructureDefinition";
				}
				return "Structure";
			}
		}
		return "Referencable";
	}
}
