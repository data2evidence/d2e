package com.legacy.health.fhir.meta.fhirpath.node;

public class BooleanNode implements ValueNode {
	protected Boolean value;

	public BooleanNode value(Boolean value) {
		this.value = value;
		return this;
	}

	public Boolean value() {
		return this.value;
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
		BooleanNode other = (BooleanNode) obj;
		if (value == null) {
			if (other.value != null)
				return false;
		} else if (!value.equals(other.value))
			return false;
		return true;
	}

	@Override
	public String getType() {
		return "Boolean";
	}

	@Override
	public Object getRawValue() {
		return value;
	}

}
