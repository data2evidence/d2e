package com.legacy.health.fhir.exception;

import com.legacy.health.fhir.meta.FhirException;

public class InvalidRequestException extends FhirException {

    public InvalidRequestException(String message, Exception innerException) {
        super(message, innerException);
    }

    @Override
    public String getIssueType() {
        return "invalid";
    }

}
