package com.legacy.health.fhir.exception;

import com.legacy.health.fhir.meta.FhirException;

public class StructureNotReadableException extends FhirException {

    public StructureNotReadableException(String message, Exception innerException) {
        super(message, innerException);
    }

    @Override
    public String getIssueType() {
        return "structure";
    }

}
