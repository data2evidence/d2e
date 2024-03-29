package com.legacy.health.fhir.meta.sql.queryengine;

import com.legacy.health.fhir.meta.FhirException;

public interface SQLQueryElement {

	String getSQL(PreparedStatementValues prepValues) throws FhirException;
}
