package com.legacy.health.fhir.meta.repsitory;

import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.StructureDefinition;

public interface DeleteHandler {
	void delete(String schema, StructureDefinition sd, String id, boolean ownTransaction, boolean markAsDeleted)
			throws FhirException;
}
