package com.legacy.health.fhir.meta.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.util.ArrayList;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class Issue {

	public static enum Severity {
		fatal, error, warning, information
	}

	private final Severity severity;
	private final String code;
	private ObjectNode details;
	private String diagnostics;
	private final List<String> location = new ArrayList<>();
	private final List<String> expression = new ArrayList<>();

	public Issue(Severity severity, String code) {
		this.severity = severity;
		this.code = code;
	}

	public String getSeverity() {
		return this.severity.name();
	}

	public String getCode() {
		return this.code;
	}

	public void setDetails(ObjectNode details) {
		this.details = details;
	}

	public ObjectNode getDetails() {
		return this.details;
	}

	public void setDiagnostics(String diagnostics) {
		this.diagnostics = diagnostics;
	}

	public String getDiagnostics() {
		return this.diagnostics;
	}

	public void addLocation(String location) {
		this.location.add(location);
	}

	public List<String> getLocation() {
		return this.location;
	}

	public void addExpression(String expression) {
		this.expression.add(expression);
	}

	public List<String> getExpression() {
		return this.expression;
	}
}
