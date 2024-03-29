package com.legacy.health.fhir.meta.queryengine;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class BinaryExpression extends Expression {
	protected Expression left;
	protected Expression right;
	protected String operation;

	public BinaryExpression left(Expression left) {
		this.left = left;
		return this;
	}

	public Expression left() {
		return left;
	}

	public BinaryExpression right(Expression right) {
		this.right = right;
		return this;
	}

	public Expression right() {
		return right;
	}

	public BinaryExpression operation(String operation) {
		this.operation = operation;
		return this;
	}

	public String operation() {
		return operation;
	}

	@Override
	public JsonNode toJson() {
		ObjectNode node = mapper.createObjectNode();
		node.put("type", "binaryexpression");
		if (left != null) {
			node.set("left", left.toJson());
		}
		if (right != null) {
			node.set("right", right.toJson());
		}
		if (operation != null) {
			node.put("operation", operation);
		}
		return node;
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

	// public List<DataElementStructureLink> getDataElements(){
	// List<DataElementStructureLink>ret = new
	// ArrayList<DataElementStructureLink>();
	// if(left!=null){
	// ret.addAll(left.getDataElements());
	// }
	// if(right!=null){
	// ret.addAll(right.getDataElements());
	// }
	// return ret;
	// }

	@Override
	public void fromJson(JsonNode node) {
		if (node.has("left")) {
			this.left = (Expression) queryBuilder.fromJson(node.get("left"));
		}

		if (node.has("right")) {
			this.right = (Expression) queryBuilder.fromJson(node.get("right"));
		}

		if (node.has("operation")) {
			this.operation = (String) node.get("operation").asText();
		}

	}

}
