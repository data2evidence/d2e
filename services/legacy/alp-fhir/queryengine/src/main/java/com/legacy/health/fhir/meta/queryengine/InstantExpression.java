package com.legacy.health.fhir.meta.queryengine;

import java.time.Instant;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class InstantExpression extends ValueExpression {
	public InstantExpression() {
		super();
		type = "date";
	}

	public Instant getInstant() {
		return (Instant) value;
	}

	@Override
	public JsonNode toJson() {
		ObjectNode node = (ObjectNode) super.toJson();
		node.put("type", "instantexpression");
		if (value != null) {
			node.put("value", ((Instant) value).toString());
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
