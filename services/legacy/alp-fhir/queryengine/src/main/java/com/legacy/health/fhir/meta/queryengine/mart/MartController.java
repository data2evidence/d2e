package com.legacy.health.fhir.meta.queryengine.mart;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.FhirException;

public interface MartController {

    void createDataMart(String id, ObjectNode definition, Context context) throws FhirException;

    void deleteDataMart(String id, Context context) throws FhirException;
}