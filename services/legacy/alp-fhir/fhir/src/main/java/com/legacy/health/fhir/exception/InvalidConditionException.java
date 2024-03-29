package com.legacy.health.fhir.exception;

import com.legacy.health.fhir.meta.FhirException;

public class InvalidConditionException extends FhirException {

    public InvalidConditionException(String message, Exception innerException) {
        super(message, innerException);
    }

}
