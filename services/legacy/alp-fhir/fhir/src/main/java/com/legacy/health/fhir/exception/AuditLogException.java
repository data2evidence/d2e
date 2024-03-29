package com.legacy.health.fhir.exception;

import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.Issue;

public class AuditLogException extends FhirException {

    public AuditLogException(String message, Exception innerException) {
        super(message, innerException);
    }

    @Override
    public String getIssueType() {
        return "security";
    }

    @Override
    public Issue.Severity getSeverity() {
        return Issue.Severity.warning;
    }

}
