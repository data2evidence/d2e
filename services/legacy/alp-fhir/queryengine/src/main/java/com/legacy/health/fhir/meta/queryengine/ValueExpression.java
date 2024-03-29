package com.legacy.health.fhir.meta.queryengine;

public class ValueExpression extends Expression {

	protected String type;
	protected Object value;

	public ValueExpression type(String type) {
		this.type = type;
		return this;
	}

	public ValueExpression value(Object value) {
		this.value = value;
		return this;
	}

}
