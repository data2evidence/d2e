package com.legacy.health.fhir.meta.sql.mart;

import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.repsitory.StructureConsumer;
import com.legacy.health.fhir.meta.sql.SQLContext;
import com.legacy.health.fhir.meta.sql.SQLSchemaController;
import com.legacy.health.fhir.meta.sql.queryengine.PreparedStatementValues;
import com.legacy.health.fhir.meta.sql.queryengine.SQLQuery;
import com.legacy.health.fhir.meta.sql.queryengine.consumer.SQLQueryConsumer;

import java.util.Map;

public class SQLMartQueryConsumer implements SQLQueryConsumer {

	protected SQLQuery sqlQuery;

	@Override
	public void executeQuery(StructureDefinition targetType, Query query, SQLQuery sqlQuery, StructureConsumer consumer,
			SQLSchemaController schemaControl, SQLContext context) throws Exception {
		this.sqlQuery = sqlQuery;
	}

	public String toSQL() throws FhirException {
		PreparedStatementValues vals = new PreparedStatementValues();
		String sql = sqlQuery.getSQL(vals);
		for (Map.Entry<String, String> entry : vals.get().entrySet()) {
			sql = sql.replace(
					":" + entry.getKey(), "'" + entry.getValue() + "'");
		}
		return sql;
	}

}
