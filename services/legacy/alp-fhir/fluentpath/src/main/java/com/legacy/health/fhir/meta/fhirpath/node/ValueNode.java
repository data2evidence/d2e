package com.legacy.health.fhir.meta.fhirpath.node;

public interface ValueNode extends Node {
	default Boolean asBoolean() {
		if (this instanceof BooleanNode) {
			return ((BooleanNode) this).value;
		}
		return null;
	}

	default String asString() {
		if (this instanceof StringNode) {
			return ((StringNode) this).value;
		}
		return null;
	}

	default Double asDouble() {
		if (this instanceof NumberNode) {
			return ((NumberNode) this).value;
		}
		return null;
	}

	default Integer asInteger() {
		if (this instanceof NumberNode) {
			Double value = ((NumberNode) this).value;
			return (int) Math.round(value);
		}
		return null;
	}

	Object getRawValue();

	String getType();
}
