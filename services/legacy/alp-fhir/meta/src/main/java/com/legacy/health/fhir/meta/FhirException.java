package com.legacy.health.fhir.meta;

import com.legacy.health.fhir.meta.entity.Issue;

public class FhirException extends Exception {

	public FhirException(String message, Exception innerException) {
		super(message, innerException);
	}

	public String getIssueType() {
		return "exception";
	}

	public Issue.Severity getSeverity() {
		return Issue.Severity.error;
	}

	/**
	 * 
	 */
	private static final long serialVersionUID = 6024933608517709321L;

}
