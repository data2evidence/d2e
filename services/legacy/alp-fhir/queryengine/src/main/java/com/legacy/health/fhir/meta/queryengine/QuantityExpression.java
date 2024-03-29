package com.legacy.health.fhir.meta.queryengine;

public class QuantityExpression extends Expression {
	protected Expression value;
	protected Expression unit;

	public QuantityExpression value(Expression value) {
		this.value = value;
		return this;
	}

	public Expression value() {
		return this.value;
	}

	public Expression unit() {
		return this.unit;
	}

	public QuantityExpression unit(Expression unit) {
		this.unit = unit;
		return this;
	}
}
