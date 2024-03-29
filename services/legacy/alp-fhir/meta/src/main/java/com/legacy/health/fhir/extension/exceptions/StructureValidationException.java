package com.legacy.health.fhir.extension.exceptions;

import com.legacy.health.fhir.meta.FhirException;

public class StructureValidationException extends FhirException {
    public StructureValidationException(String message, Exception innerException) {
        super(message, innerException);
    }
}
