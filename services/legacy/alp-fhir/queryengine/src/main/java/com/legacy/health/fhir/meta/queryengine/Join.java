package com.legacy.health.fhir.meta.queryengine;

import java.util.Arrays;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.meta.entity.StructureDefinition;

public class Join extends AbstractQueryElement implements QueryElement {

	protected StructureDefinition structureDefinition;
	protected ResultElement link;
	protected String scope;

	public Join withStructureDefinition(StructureDefinition definition) {
		this.structureDefinition = definition;
		return this;
	}

	public StructureDefinition getStructureDefinition() {
		return structureDefinition;
	}

	public Join withScope(String scope) {
		this.scope = scope;
		return this;
	}

	public String getScope() {
		return scope;
	}

	public Join withLink(ResultElement link) {
		this.link = link;
		if (this.link.getScope() == null) {
			this.link.setScope(scope);
		}
		return this;
	}

	public ResultElement getLink() {
		if (this.link.getScope() == null) {
			this.link.setScope(scope);
		}
		return this.link;
	}

	public List<QueryElement> getQueryElements() {
		String linkType = link.getStructureDefinition().getId();
		String joinType = this.structureDefinition.getId();
		if (!linkType.equals(joinType)) {
			ResultElement re = queryBuilder.out(structureDefinition, structureDefinition.getId() + ".id");
			re.setScope(scope);
			return Arrays.asList(re, getLink());
		} else {
			return Arrays.asList(getLink());
		}
	}

	@Override
	public JsonNode toJson() {
		ObjectNode node = mapper.createObjectNode();
		node.put("type", "join");
		node.put("definition", structureDefinition.getId());
		node.set("link", link.toJson());
		return node;
	}

	@Override
	public void fromJson(JsonNode node) {
		JsonNode def = node.get("definition");
		String sd = def.asText();
		structureDefinition = queryBuilder.sd(sd);
		if (node.has("link")) {
			link = (ResultElement) queryBuilder.fromJson(node.get("link"));
		}

	}

}