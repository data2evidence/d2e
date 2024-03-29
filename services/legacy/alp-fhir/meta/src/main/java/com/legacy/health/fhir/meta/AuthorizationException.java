package com.legacy.health.fhir.meta;

import com.legacy.health.fhir.meta.entity.Issue;

public class AuthorizationException extends FhirException {

    public AuthorizationException(String message, Exception innerException) {
        super(message, innerException);
    }

    @Override
    public String getIssueType() {
        return "security";
    }

    @Override
    public Issue.Severity getSeverity() {
        return Issue.Severity.error;
    }

}
