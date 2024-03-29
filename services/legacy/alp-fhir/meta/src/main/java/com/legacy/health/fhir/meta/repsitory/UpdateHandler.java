package com.legacy.health.fhir.meta.repsitory;

import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.instance.Structure;

public interface UpdateHandler {
	void update(String schema, Structure resource, boolean ownTransaction, Context context)
			throws FhirException;
}
