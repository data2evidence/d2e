package com.legacy.health.fhir.meta.fhirpath.node;

public class NumberNode implements ValueNode {
	protected Double value;
	protected String type;

	public NumberNode value(Double value) {
		this.value = value;
		return this;
	}

	public NumberNode value(Integer value) {
		int iValue = value;
		double dValue = iValue;
		this.value = dValue;
		return this;
	}

	public Double value() {
		return value;
	}

	public static NumberNode number(Integer value) {
		return new NumberNode().value(value);
	}

	public static NumberNode number(Double value) {
		return new NumberNode().value(value);
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((value == null) ? 0 : value.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		NumberNode other = (NumberNode) obj;
		if (value == null) {
			if (other.value != null)
				return false;
		} else if (!value.equals(other.value))
			return false;
		return true;
	}

	@Override
	public String getType() {
		if (Math.round(value) == value)
			return "Integer";
		else
			return "Double";
	}

	@Override
	public Object getRawValue() {
		return value;
	}

}
