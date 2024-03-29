package com.legacy.health.fhir.meta.queryengine;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class IntegerExpression extends ValueExpression {

	public IntegerExpression() {
		super();
		type = "integer";
	}

	public Integer getValue() {
		return (Integer) value;
	}

	@Override
	public JsonNode toJson() {
		ObjectNode node = (ObjectNode) super.toJson();
		node.put("type", "integerexpression");
		if (value != null) {
			node.put("value", value.toString());
		}

		return node;
	}

	@Override
	public void fromJson(JsonNode node) {
		super.fromJson(node);
		if (node.has("value")) {
			value = (Integer) node.get("value").asInt();
		}
	}
}
