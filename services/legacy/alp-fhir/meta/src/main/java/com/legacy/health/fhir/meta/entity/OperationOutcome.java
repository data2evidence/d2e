package com.legacy.health.fhir.meta.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.ArrayList;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class OperationOutcome {

    private final String resourceType = "OperationOutcome";
    private String id;

    private final List<Issue> issue = new ArrayList<>();

    public void setId(String id) {
        this.id = id;
    }

    public void addIssue(Issue issue) {
        if (issue != null) {
            this.issue.add(issue);
        }
    }

    public String getResourceType() {
        return this.resourceType;
    }

    public String getId() {
        return this.id;
    }

    public List<Issue> getIssue() {
        return this.issue;
    }

    @JsonIgnore
    public boolean isEmpty() {
        return this.issue.isEmpty();

    }
}
