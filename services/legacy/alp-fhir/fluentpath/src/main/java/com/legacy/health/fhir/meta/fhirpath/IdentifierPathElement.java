package com.legacy.health.fhir.meta.fhirpath;

import com.legacy.health.fhir.meta.fhirpath.node.CollectionNode;

public class IdentifierPathElement extends InvocableElement {

	@Override
	protected CollectionNode ownEvaluation(CollectionNode ctx) {
		if (predecessor == null) {
			if (this.id.equals(ctx.getType())) {
				return ctx;
			}
		}
		return ctx.getLabeledNodes(id);
	}

}
