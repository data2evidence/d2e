package com.legacy.health.fhir.meta.queryengine;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class IsXXNullExpression extends Expression {
	Expression expression;
	boolean isNot = false;

	public IsXXNullExpression expression(Expression expression) {
		this.expression = expression;
		return this;
	}

	public IsXXNullExpression not() {
		isNot = true;
		return this;
	}

	public Expression getExpression() {
		return this.expression;
	}

	public Boolean isNot() {
		return isNot;
	}

	@Override
	public JsonNode toJson() {
		ObjectNode node = mapper.createObjectNode();
		node.put("type", "isnullexpression");
		if (expression != null) {
			node.set("expression", this.expression.toJson());
		}

		node.put("isNot", isNot);

		return node;
	}

	@Override
	public void fromJson(JsonNode node) {
		this.expression = (Expression) queryBuilder.fromJson(node.get("expression"));
		this.isNot = node.get("isNot").asBoolean();
	}
}
