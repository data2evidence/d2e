package com.legacy.health.fhir.meta.fhirpath;

import com.legacy.health.fhir.meta.fhirpath.node.CollectionNode;
import com.legacy.health.fhir.meta.fhirpath.node.DefaultCollectionNode;
import com.legacy.health.fhir.meta.fhirpath.node.NumberNode;

public class NumberLiteralElement extends InvocableElement {

	Double value;

	public NumberLiteralElement value(String value) {
		this.value = Double.parseDouble(value);
		return this;
	}

	public NumberLiteralElement value(Double value) {
		this.value = value;
		return this;
	}

	public Double value() {
		return value;
	}

	@Override
	public CollectionNode ownEvaluation(CollectionNode ctx) {
		NumberNode node = new NumberNode();
		node.value(value);
		return DefaultCollectionNode.create(ctx.getRoot(), node);
	}

}
