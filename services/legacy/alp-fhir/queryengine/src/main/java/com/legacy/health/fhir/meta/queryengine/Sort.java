package com.legacy.health.fhir.meta.queryengine;

import java.util.Arrays;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class Sort extends AbstractQueryElement {

	protected ResultElement attribute;
	protected boolean descending = false;

	public Sort by(ResultElement attribute) {
		this.attribute = attribute;
		return this;
	}

	public Sort descending() {
		this.descending = true;
		return this;
	}

	public Sort ascending() {
		this.descending = false;
		return this;
	}

	public ResultElement by() {
		return this.attribute;
	}

	public boolean isDescending() {
		return descending;
	}

	public List<QueryElement> getQueryElements() {
		return Arrays.asList(attribute);
	}

	@Override
	public JsonNode toJson() {
		ObjectNode node = mapper.createObjectNode();
		node.put("type", "sort");
		node.set("by", attribute.toJson());
		node.put("descending", descending);
		return node;
	}

	@Override
	public void fromJson(JsonNode node) {
		JsonNode desc = node.get("descending");

		descending = desc.asBoolean();
		if (node.has("by")) {
			attribute = (ResultElement) queryBuilder.fromJson(node.get("by"));
		}

	}

}
