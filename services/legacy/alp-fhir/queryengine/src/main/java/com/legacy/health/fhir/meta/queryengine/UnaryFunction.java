package com.legacy.health.fhir.meta.queryengine;

import java.util.Arrays;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.meta.entity.DataType;

public class UnaryFunction extends Expression {

	protected String functionName;
	protected Expression expression;

	public UnaryFunction name(String name) {
		this.functionName = name;
		return this;
	}

	public String name() {
		return functionName;
	}

	public UnaryFunction parameter(Expression expression) {
		this.expression = expression;
		return this;
	}

	public Expression parameter() {
		return expression;
	}

	public List<QueryElement> getQueryElements() {
		return Arrays.asList(expression);
	}

	@Override
	public JsonNode toJson() {
		ObjectNode node = (ObjectNode) super.toJson();
		node.put("type", "unaryfunction");
		if (functionName != null) {
			node.put("function", (String) functionName);
		}
		if (expression != null) {
			node.set("expression", expression.toJson());
		}
		return node;
	}

	@Override
	public void fromJson(JsonNode node) {
		super.fromJson(node);
		if (node.has("function")) {
			functionName = node.get("function").asText();
		}
		if (node.has("expression")) {
			expression = (Expression) queryBuilder.fromJson(node.get("expression"));
		}
	}

	public DataType getType() {
		return expression.getType();
	}

}
