package com.legacy.health.fhir.meta.map;

import com.fasterxml.jackson.databind.JsonNode;
import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;

public class StructureMapBuilder {

	public static StructureMap createStructureMap(JsonNode json, MetaRepository repo, Context context) {
		StructureMap ret = new StructureMap();
		ret.setId(safe(json, "id"));
		ret.setUri(safe(json, "url"));
		for (JsonNode jsonNode : json.get("structure")) {
			ret.addStructure(createStructure(jsonNode, repo, context));
		}
		for (JsonNode jsonNode : json.get("group")) {
			ret.addGroup(createGroup(jsonNode, repo, context));
		}
		return ret;
	}

	protected static String safe(JsonNode node, String path) {
		if (node.get(path) != null) {
			return node.get(path).asText();
		} else {
			return null;
		}
	}

	protected static StructureMode createStructure(JsonNode json, MetaRepository repo, Context context) {
		StructureMode ret = new StructureMode();
		ret.setAlias(safe(json, "alias"));
		ret.setDefinition(repo.getStructureDefinitionByUrl(safe(json, "url"), context));
		ret.setMode(safe(json, "mode"));
		return ret;
	}

	protected static StructureMapGroup createGroup(JsonNode json, MetaRepository repo, Context context) {
		StructureMapGroup ret = new StructureMapGroup();
		ret.setName(safe(json, "name"));
		for (JsonNode jsonNode : json.get("input")) {
			ret.addInput(createInput(jsonNode, repo, context));
		}
		for (JsonNode jsonNode : json.get("rule")) {
			ret.addRule(createRule(jsonNode, repo, context));
		}
		return ret;
	}

	protected static GroupInput createInput(JsonNode json, MetaRepository repo, Context context) {
		GroupInput ret = new GroupInput();
		ret.setName(safe(json, "name"));
		ret.setType(safe(json, "type"));
		ret.setMode(safe(json, "mode"));
		return ret;
	}

	protected static StructureMapRule createRule(JsonNode json, MetaRepository repo, Context context) {
		StructureMapRule ret = new StructureMapRule();
		ret.setName(safe(json, "name"));
		for (JsonNode jsonNode : json.get("source")) {
			ret.addSource(createSource(jsonNode, repo, context));
		}
		for (JsonNode jsonNode : json.get("target")) {
			ret.addTarget(createTarget(jsonNode, repo, context));
		}
		return ret;
	}

	protected static RuleSource createSource(JsonNode json, MetaRepository repo, Context context) {
		RuleSource ret = new RuleSource();
		ret.setContext(safe(json, "context"));
		ret.setElement(safe(json, "element"));
		return ret;
	}

	protected static RuleTarget createTarget(JsonNode json, MetaRepository repo, Context context) {
		RuleTarget ret = new RuleTarget();
		ret.setContext(safe(json, "context"));
		ret.setElement(safe(json, "element"));
		ret.setTransform(safe(json, "transform"));
		return ret;
	}

}
