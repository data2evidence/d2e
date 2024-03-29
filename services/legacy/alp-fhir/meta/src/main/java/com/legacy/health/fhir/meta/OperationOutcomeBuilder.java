package com.legacy.health.fhir.meta;

import com.legacy.health.fhir.meta.entity.Issue;
import com.legacy.health.fhir.meta.entity.OperationOutcome;
import com.legacy.health.fhir.util.UUIDGenerator;

public class OperationOutcomeBuilder {

    private final OperationOutcome operationOutcome;

    public OperationOutcomeBuilder() {
        this.operationOutcome = new OperationOutcome();
    }

    public OperationOutcomeBuilder withIDGenerator(UUIDGenerator generator) {
        this.operationOutcome.setId(generator.generateId());
        return this;
    }

    public IssueBuilder addIssue(Issue.Severity severity, String code) {
        return new IssueBuilder(severity, code, this);
    }

    public OperationOutcome outcome() {
        if (operationOutcome.isEmpty()) {
            this.addIssue(Issue.Severity.error, "exception")
                    .withDetails("No appropriate issue found.")
                    .issue();
        }
        return this.operationOutcome;
    }

    void addIssue(Issue issue) {
        this.operationOutcome.addIssue(issue);
    }

}
