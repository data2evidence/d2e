package com.legacy.health.fhir.meta.fhirpath;

import com.legacy.health.fhir.meta.fhirpath.node.CollectionNode;
import com.legacy.health.fhir.meta.fhirpath.node.DefaultCollectionNode;
import com.legacy.health.fhir.meta.fhirpath.node.DefaultLabeledNode;
import com.legacy.health.fhir.meta.fhirpath.node.Node;
import com.legacy.health.fhir.meta.fhirpath.node.ValueNode;

public class IndexerElement extends InvocableElement {

	protected FhirPathElement expression = null;

	public IndexerElement index(FhirPathElement expression) {
		this.expression = expression;
		return this;
	}

	@Override
	protected CollectionNode ownEvaluation(CollectionNode ctx) {
		CollectionNode index = expression.evaluate(ctx);
		Node n = ctx.get(index.asInteger());
		if (n instanceof DefaultLabeledNode) {
			ValueNode value = ((DefaultLabeledNode) n).getValue();
			if (value != null) {
				return DefaultCollectionNode.create(ctx.getRoot(), n);
			}
		}
		if (n instanceof CollectionNode)
			return (CollectionNode) n;
		return DefaultCollectionNode.create(ctx.getRoot(), n);
	}

}
