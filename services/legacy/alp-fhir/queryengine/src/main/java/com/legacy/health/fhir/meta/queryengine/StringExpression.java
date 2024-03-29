package com.legacy.health.fhir.meta.queryengine;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class StringExpression extends ValueExpression {

	public StringExpression() {
		super();
		type = "string";
	}

	public String getValue() {
		return (String) value;
	}

	@Override
	public JsonNode toJson() {
		ObjectNode node = (ObjectNode) super.toJson();
		node.put("type", "stringexpression");
		if (value != null) {
			node.put("value", (String) value);
		}

		return node;
	}

	@Override
	public void fromJson(JsonNode node) {
		super.fromJson(node);
		if (node.has("value")) {
			value = node.get("value").asText();
		}
	}

}
