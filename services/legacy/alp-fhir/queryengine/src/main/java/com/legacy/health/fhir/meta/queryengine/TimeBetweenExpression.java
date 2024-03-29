package com.legacy.health.fhir.meta.queryengine;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class TimeBetweenExpression extends Expression {

	protected Expression left;
	protected Expression right;
	protected String precission;

	public TimeBetweenExpression left(Expression left) {
		this.left = left;
		return this;
	}

	public Expression left() {
		return left;
	}

	public TimeBetweenExpression right(Expression right) {
		this.right = right;
		return this;
	}

	public Expression right() {
		return right;
	}

	public TimeBetweenExpression precission(String precission) {
		this.precission = precission;
		return this;
	}

	public String precission() {
		return precission;
	}

	public List<QueryElement> getQueryElements() {
		List<QueryElement> ret = new ArrayList<QueryElement>();
		if (left != null) {
			ret.add(left);
		}
		if (right != null) {
			ret.add(right);
		}
		return ret;
	}

	@Override
	public JsonNode toJson() {
		ObjectNode node = mapper.createObjectNode();
		node.put("type", "timebetweenexpression");
		if (left != null) {
			node.set("left", left.toJson());
		}
		if (right != null) {
			node.set("right", right.toJson());
		}
		if (precission != null) {
			node.put("precission", precission);
		}
		return node;
	}

	@Override
	public void fromJson(JsonNode node) {
		if (node.has("left")) {
			this.left = (Expression) queryBuilder.fromJson(node.get("left"));
		}

		if (node.has("right")) {
			this.right = (Expression) queryBuilder.fromJson(node.get("right"));
		}

		if (node.has("precission")) {
			this.precission = (String) node.get("precission").asText();
		}

	}

}
