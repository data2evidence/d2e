package com.legacy.health.fhir.meta.queryengine;

public class QueryEngineRuntimeException extends RuntimeException {

	public QueryEngineRuntimeException(String msg, ReflectiveOperationException e) {
		super(msg, e);
	}

}
