package com.legacy.health.fhir.meta;

public class ResourceTypeNotSupportedException extends FhirException {

    public ResourceTypeNotSupportedException(String message, Exception innerException) {
        super(message, innerException);
    }

    @Override
    public String getIssueType() {
        return "not-supported";
    }

}
