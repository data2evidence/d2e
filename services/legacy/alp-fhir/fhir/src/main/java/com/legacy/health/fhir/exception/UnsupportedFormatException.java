package com.legacy.health.fhir.exception;

import com.legacy.health.fhir.meta.FhirException;

public class UnsupportedFormatException extends FhirException {

    public UnsupportedFormatException(String message, Exception innerException) {
        super(message, innerException);
    }

}
