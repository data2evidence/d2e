package com.legacy.health.fhir.exception;

import com.legacy.health.fhir.meta.FhirException;

public class InvalidResourceException extends FhirException {

    public InvalidResourceException(String message, Exception innerException) {
        super(message, innerException);
    }

    @Override
    public String getIssueType() {
        return "invalid";
    }

}
