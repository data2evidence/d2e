package com.legacy.health.fhir.exception;

import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.Issue;

public class ResourceDeletedException extends FhirException {

    public ResourceDeletedException(String message, Exception innerException) {
        super(message, innerException);
    }

    @Override
    public String getIssueType() {
        return "not-found";
    }

    @Override
    public Issue.Severity getSeverity() {
        return Issue.Severity.information;
    }

}
