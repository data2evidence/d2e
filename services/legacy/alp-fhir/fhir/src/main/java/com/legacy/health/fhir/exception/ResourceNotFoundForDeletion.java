package com.legacy.health.fhir.exception;

import com.legacy.health.fhir.meta.FhirException;

public class ResourceNotFoundForDeletion extends FhirException {

    public ResourceNotFoundForDeletion(String message, Exception innerException) {
        super(message, innerException);
    }

    @Override
    public String getIssueType() {
        return "not-found";
    }

}
