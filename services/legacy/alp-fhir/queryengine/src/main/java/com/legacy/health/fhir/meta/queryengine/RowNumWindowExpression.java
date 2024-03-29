package com.legacy.health.fhir.meta.queryengine;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class RowNumWindowExpression extends Expression {
	protected Expression partition;
	protected Expression orderBy;
	protected boolean desc;

	public RowNumWindowExpression withPartition(Expression partition) {
		this.partition = partition;
		return this;
	}

	public RowNumWindowExpression withOrderBy(Expression orderBy) {
		this.orderBy = orderBy;
		return this;
	}

	public RowNumWindowExpression desc() {
		this.desc = true;
		return this;
	}

	public Expression partition() {
		return partition;
	}

	public Expression orderBy() {
		return orderBy;
	}

	public boolean isDesc() {
		return desc;
	}

	@Override
	public JsonNode toJson() {
		ObjectNode node = mapper.createObjectNode();
		node.put("type", "rownumwindowexpression");
		if (partition != null) {
			node.set("partition", partition.toJson());
		}
		if (orderBy != null) {
			node.set("orderby", orderBy.toJson());
		}
		node.put("operation", desc);
		return node;
	}

	@Override
	public void fromJson(JsonNode node) {
		if (node.has("partition")) {
			this.partition = (Expression) queryBuilder.fromJson(node.get("partition"));
		}

		if (node.has("orderby")) {
			this.orderBy = (Expression) queryBuilder.fromJson(node.get("orderby"));
		}

		if (node.has("desc")) {
			this.desc = (Boolean) node.get("desc").asBoolean();
		}

	}

	public List<QueryElement> getQueryElements() {
		List<QueryElement> ret = new ArrayList<QueryElement>();
		if (partition != null) {
			ret.add(partition);
		}
		if (orderBy != null) {
			ret.add(orderBy);
		}
		return ret;
	}

}
