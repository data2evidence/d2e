package com.legacy.health.fhir.meta.queryengine;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class Parameter extends AbstractQueryElement {

	protected String name;
	protected String type;
	protected Expression defValue;
	protected Expression value;

	public Parameter name(String name) {
		this.name = name;
		return this;
	}

	public Parameter type(String type) {
		this.type = type;
		return this;
	}

	public Parameter value(Expression value) {
		this.value = value;
		return this;
	}

	public Parameter defaultValue(Expression defValue) {
		this.defValue = defValue;
		return this;
	}

	public String getName() {
		return this.name;
	}

	public Expression getValue() {
		return value != null ? value : defValue;
	}

	@Override
	public JsonNode toJson() {
		ObjectNode node = mapper.createObjectNode();
		node.put("type", "parameter");
		if (defValue != null) {
			node.set("defValue", defValue.toJson());
		}
		node.put("name", this.name);
		node.put("type", this.type);
		return node;
	}

	@Override
	public void fromJson(JsonNode node) {
		if (node.has("default")) {
			this.defValue = (Expression) queryBuilder.fromJson(node.get("default"));
		}

		if (node.has("name")) {
			this.name = node.get("name").asText();
		}
		if (node.has("type")) {
			this.type = node.get("type").asText();
		}

	}

}
