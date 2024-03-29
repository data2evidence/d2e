package com.legacy.health.fhir.meta.sql.util;

import java.sql.SQLException;

import com.fasterxml.jackson.databind.JsonNode;
import com.legacy.health.fhir.meta.sql.SQLContext;

public interface Table2StructureDefinition {
	JsonNode getStructureDefinition(SQLContext context, String id, String url, String schema, String table)
			throws SQLException;
}
