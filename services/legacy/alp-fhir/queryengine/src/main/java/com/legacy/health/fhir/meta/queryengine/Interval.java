package com.legacy.health.fhir.meta.queryengine;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class Interval extends Expression {
	protected boolean lowClosed = false;
	protected boolean highClosed = false;
	protected Expression high;
	protected Expression low;

	public Interval lowClosed() {
		lowClosed = true;
		return this;
	}

	public Interval lowClosed(boolean lowClosed) {
		this.lowClosed = lowClosed;
		return this;
	}

	public Interval highClosed(boolean highClosed) {
		this.highClosed = highClosed;
		return this;
	}

	public Interval highClosed() {
		highClosed = true;
		return this;
	}

	public Interval high(Expression high) {
		this.high = high;
		return this;
	}

	public Interval low(Expression low) {
		this.low = low;
		return this;
	}

	public Expression low() {
		return low;
	}

	public Expression high() {
		return high;
	}

	public List<QueryElement> getQueryElements() {
		List<QueryElement> ret = new ArrayList<QueryElement>();
		if (low != null) {
			ret.add(low);
		}
		if (high != null) {
			ret.add(high);
		}
		return ret;
	}

	@Override
	public void fromJson(JsonNode node) {
		if (node.has("high")) {
			this.high = (Expression) queryBuilder.fromJson(node.get("high"));
		}

		if (node.has("low")) {
			this.low = (Expression) queryBuilder.fromJson(node.get("low"));
		}

		if (node.has("lowClosed")) {
			this.lowClosed = node.get("lowClosed").asBoolean();
		}
		if (node.has("highClosed")) {
			this.highClosed = node.get("highClosed").asBoolean();
		}
	}

	@Override
	public JsonNode toJson() {
		ObjectNode node = mapper.createObjectNode();
		node.put("type", "interval");
		if (high != null) {
			node.set("high", high.toJson());
		}
		if (low != null) {
			node.set("low", low.toJson());
		}
		node.put("lowClosed", this.lowClosed);
		node.put("highClosed", this.highClosed);
		return node;
	}
}
