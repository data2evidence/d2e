package com.legacy.health.fhir.meta.fhirpath;

import com.legacy.health.fhir.meta.fhirpath.node.CollectionNode;

public class ParenthizedElement implements FhirPathElement {

	protected FhirPathElement inner;

	public ParenthizedElement inner(FhirPathElement inner) {
		this.inner = inner;
		return this;
	}

	public FhirPathElement inner() {
		return inner;
	}

	@Override
	public CollectionNode evaluate(CollectionNode ctx) {
		return inner.evaluate(ctx);
	}

}
