package com.legacy.health.fhir.meta.queryengine;

import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.legacy.health.fhir.meta.entity.DataElementStructureLink;

public interface QueryElement {

	public QueryElement withQueryBuilder(QueryBuilder builder);

	public default List<QueryElement> getQueryElements() {
		return null;
	}

	public default List<DataElementStructureLink> getDataElements() {
		return null;
	}

	public JsonNode toJson();

	public void fromJson(JsonNode node);
}
