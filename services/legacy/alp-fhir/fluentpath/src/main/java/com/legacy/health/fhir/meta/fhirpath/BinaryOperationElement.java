package com.legacy.health.fhir.meta.fhirpath;

public abstract class BinaryOperationElement implements FhirPathElement {
	protected FhirPathElement left;
	protected FhirPathElement right;
	protected String operation;

	public BinaryOperationElement left(FhirPathElement left) {
		this.left = left;
		return this;
	}

	public FhirPathElement left() {
		return left;
	}

	public BinaryOperationElement right(FhirPathElement right) {
		this.right = right;
		return this;
	}

	public FhirPathElement right() {
		return right;
	}

	public BinaryOperationElement operation(String operation) {
		this.operation = operation;
		return this;
	}

	public String operation() {
		return this.operation;
	}

}
