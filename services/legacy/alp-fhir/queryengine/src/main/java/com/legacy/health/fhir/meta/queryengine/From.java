package com.legacy.health.fhir.meta.queryengine;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.meta.entity.StructureDefinition;

public class From extends AbstractQueryElement implements QueryElement {

	protected StructureDefinition structureDefinition;

	public From withStructureDefinition(StructureDefinition definition) {
		this.structureDefinition = definition;
		return this;
	}

	public StructureDefinition getStructureDefinition() {
		return structureDefinition;
	}

	@Override
	public JsonNode toJson() {
		ObjectNode node = mapper.createObjectNode();
		node.put("type", "from");
		node.put("definition", structureDefinition.getId());
		return node;
	}

	@Override
	public void fromJson(JsonNode node) {
		JsonNode def = node.get("definition");
		String sd = def.asText();
		structureDefinition = queryBuilder.sd(sd);

	}
}
