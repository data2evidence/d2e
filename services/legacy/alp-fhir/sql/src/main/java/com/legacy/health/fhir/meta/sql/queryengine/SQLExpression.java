package com.legacy.health.fhir.meta.sql.queryengine;

public abstract class SQLExpression implements SQLQueryElement {
	protected String label;

	public SQLExpression label(String label) {
		this.label = label;
		return this;
	}

	public String label() {
		return label;
	}
}
