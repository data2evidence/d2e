package com.legacy.health.fhir.meta;

import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.meta.entity.Issue;

public class IssueBuilder {

    private final Issue issue;
    private final OperationOutcomeBuilder outcomeBuilder;

    public IssueBuilder(Issue.Severity severity, String code, OperationOutcomeBuilder outcomeBuilder) {
        this.issue = new Issue(severity, code);
        this.outcomeBuilder = outcomeBuilder;
    }

    public IssueBuilder withDetails(Exception ex) {
        ObjectNode details = JsonNodeFactory.instance.objectNode();
        details.put("text", ex.getMessage());
        this.issue.setDetails(details);
        return this;
    }

    public IssueBuilder withDetails(String text) {
        ObjectNode details = JsonNodeFactory.instance.objectNode();
        details.put("text", text);
        this.issue.setDetails(details);
        return this;
    }

    public IssueBuilder withDetails(String system, String version, String code, String display, Boolean userSelected) {
        ObjectNode details = JsonNodeFactory.instance.objectNode();
        ObjectNode coding = JsonNodeFactory.instance.objectNode();

        if (system != null)
            coding.put("system", system);
        if (version != null)
            coding.put("version", version);
        if (code != null)
            coding.put("code", code);
        if (display != null)
            coding.put("display", display);
        if (userSelected != null)
            coding.put("userSelected", userSelected);

        details.set("coding", JsonNodeFactory.instance.arrayNode().add(coding));
        this.issue.setDetails(details);
        return this;
    }

    public IssueBuilder withDiagnostics(String diagnostics) {
        this.issue.setDiagnostics(diagnostics);
        return this;
    }

    public IssueBuilder addLocation(String location) {
        this.issue.addLocation(location);
        return this;
    }

    public IssueBuilder addExpression(String expression) {
        this.issue.addExpression(expression);
        return this;
    }

    public OperationOutcomeBuilder issue() {
        this.outcomeBuilder.addIssue(issue);
        return this.outcomeBuilder;
    }

}
