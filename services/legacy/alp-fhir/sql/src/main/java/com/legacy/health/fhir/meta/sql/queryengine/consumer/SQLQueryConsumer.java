package com.legacy.health.fhir.meta.sql.queryengine.consumer;

import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.repsitory.StructureConsumer;
import com.legacy.health.fhir.meta.sql.SQLContext;
import com.legacy.health.fhir.meta.sql.SQLSchemaController;
import com.legacy.health.fhir.meta.sql.queryengine.SQLQuery;

public interface SQLQueryConsumer {

	void executeQuery(StructureDefinition targetType, Query query, SQLQuery sqlQuery, StructureConsumer consumer,
			SQLSchemaController schemaControl, SQLContext context) throws Exception;
}
