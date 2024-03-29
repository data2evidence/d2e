package com.legacy.health.fhir.meta.queryengine;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.meta.entity.DataType;

public class Expression extends AbstractQueryElement implements QueryElement {

	protected String label;

	protected String key;

	public Expression label(String label) {
		this.label = label;
		return this;
	}

	public String label() {
		return label;
	}

	public DataType getType() {
		return null;
	}

	@Override
	public JsonNode toJson() {
		ObjectNode node = mapper.createObjectNode();
		if (label != null) {
			node.put("label", this.label);
		}
		return node;
	}

	@Override
	public void fromJson(JsonNode node) {
		if (node.has("label")) {
			this.label = node.get("label").asText();
		}
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getKey() {
		return this.key;
	}

}
