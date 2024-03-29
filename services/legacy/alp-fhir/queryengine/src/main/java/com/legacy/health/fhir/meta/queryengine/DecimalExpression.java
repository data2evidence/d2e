package com.legacy.health.fhir.meta.queryengine;

import java.math.BigDecimal;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class DecimalExpression extends ValueExpression {

	public DecimalExpression() {
		super();
		type = "integer";
	}

	public BigDecimal getValue() {
		return (BigDecimal) value;
	}

	@Override
	public JsonNode toJson() {
		ObjectNode node = (ObjectNode) super.toJson();
		node.put("type", "decimalexpression");
		if (value != null) {
			node.put("value", (String) value);
		}

		return node;
	}

	@Override
	public void fromJson(JsonNode node) {
		super.fromJson(node);
		if (node.has("value")) {
			value = node.get("value").decimalValue();
		}
	}
}