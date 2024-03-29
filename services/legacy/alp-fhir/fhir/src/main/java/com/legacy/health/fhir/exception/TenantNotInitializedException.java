package com.legacy.health.fhir.exception;

import com.legacy.health.fhir.meta.FhirException;

public class TenantNotInitializedException extends FhirException {

    public TenantNotInitializedException(String message, Exception innerException) {
        super(message, innerException);
    }

}
