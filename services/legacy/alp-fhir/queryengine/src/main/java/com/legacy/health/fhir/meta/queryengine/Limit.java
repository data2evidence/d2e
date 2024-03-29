package com.legacy.health.fhir.meta.queryengine;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class Limit extends AbstractQueryElement implements QueryElement {

	protected Integer limit;
	protected Integer offset;

	public Integer limit() {
		return limit;
	}

	public Limit limit(Integer limit) {
		this.limit = limit;
		return this;
	}

	public Integer offset() {
		return offset;
	}

	public Limit offset(Integer offset) {
		this.offset = offset;
		return this;
	}

	@Override
	public JsonNode toJson() {
		ObjectNode node = mapper.createObjectNode();
		node.put("type", "limit");
		if (limit != null) {
			node.put("limit", limit);
		}
		if (offset != null) {
			node.put("offset", offset);
		}
		return node;
	}

	@Override
	public void fromJson(JsonNode node) {
		if (node.has("limit")) {
			this.limit = node.get("limit").asInt();
		}
		if (node.has("offset")) {
			this.offset = node.get("offset").asInt();
		}
	}

}
