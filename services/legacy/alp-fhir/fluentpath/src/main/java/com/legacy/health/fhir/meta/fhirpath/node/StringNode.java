package com.legacy.health.fhir.meta.fhirpath.node;

public class StringNode implements ValueNode {
	String value;

	public StringNode value(String value) {
		this.value = value;
		return this;
	}

	public String value() {
		return value;
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
		StringNode other = (StringNode) obj;
		if (value == null) {
			if (other.value != null)
				return false;
		} else if (!value.equals(other.value))
			return false;
		return true;
	}

	@Override
	public String getType() {
		return "String";
	}

	@Override
	public Object getRawValue() {
		return value;
	}

}
