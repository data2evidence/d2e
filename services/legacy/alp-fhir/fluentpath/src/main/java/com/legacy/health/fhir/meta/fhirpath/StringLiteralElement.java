package com.legacy.health.fhir.meta.fhirpath;

import com.legacy.health.fhir.meta.fhirpath.node.CollectionNode;
import com.legacy.health.fhir.meta.fhirpath.node.DefaultCollectionNode;
import com.legacy.health.fhir.meta.fhirpath.node.StringNode;

public class StringLiteralElement extends InvocableElement {

	String value;

	public StringLiteralElement value(String value) {
		this.value = value;
		return this;
	}

	public String value() {
		return value;
	}

	@Override
	public CollectionNode ownEvaluation(CollectionNode ctx) {
		StringNode node = new StringNode();
		node.value(value);
		return DefaultCollectionNode.create(ctx.getRoot(), node);
	}

}
