package com.legacy.health.fhir.meta.fhirpath;

import com.legacy.health.fhir.meta.fhirpath.node.CollectionNode;
import com.legacy.health.fhir.meta.fhirpath.node.DefaultCollectionNode;

public class UnionElement implements FhirPathElement {
	protected FhirPathElement left;
	protected FhirPathElement right;

	public UnionElement left(FhirPathElement left) {
		this.left = left;
		return this;
	}

	public FhirPathElement left() {
		return left;
	}

	public UnionElement right(FhirPathElement right) {
		this.right = right;
		return this;
	}

	public FhirPathElement right() {
		return right;
	}

	@Override
	public CollectionNode evaluate(CollectionNode ctx) {
		DefaultCollectionNode ret = new DefaultCollectionNode();
		CollectionNode l = left.evaluate(ctx.getRoot());
		CollectionNode r = right.evaluate(ctx.getRoot());
		for (int i = 0; i < l.size(); i++) {
			ret.addNode(l.get(i));
		}
		for (int i = 0; i < r.size(); i++) {
			if (ret.contains(r.get(i)))
				continue;
			ret.addNode(r.get(i));
		}
		return ret;
	}
}
