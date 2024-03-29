package com.legacy.health.fhir.meta.fhirpath;

import com.legacy.health.fhir.meta.fhirpath.node.BooleanNode;
import com.legacy.health.fhir.meta.fhirpath.node.CollectionNode;
import com.legacy.health.fhir.meta.fhirpath.node.DefaultCollectionNode;
import com.legacy.health.fhir.meta.fhirpath.node.DefaultLabeledNode;
import com.legacy.health.fhir.meta.fhirpath.node.Node;

public class EqualityElement extends BinaryOperationElement {

	@Override
	public CollectionNode evaluate(CollectionNode ctx) {
		CollectionNode l = left.evaluate(ctx.getRoot());
		CollectionNode r = right.evaluate(ctx.getRoot());
		if ("=".equals(operation)) {
			if (l == null || r == null)
				return returnFalse();
			if (l.size() != r.size())
				return returnFalse();
			for (int i = 0; i < l.size(); i++) {
				if (!value(l.get(i)).equals(value(r.get(i))))
					return returnFalse();
			}
			return returnTrue();
		}
		if ("!=".equals(operation)) {
			if (l == null || r == null)
				return returnTrue();
			if (l.size() != r.size())
				return returnTrue();
			for (int i = 0; i < l.size(); i++) {
				if (!value(l.get(i)).equals(value(r.get(i))))
					return returnTrue();
			}
			return returnFalse();
		}
		return returnFalse();
	}

	protected Node value(Node in) {
		if (in instanceof DefaultLabeledNode) {
			return ((DefaultLabeledNode) in).value();
		}
		return in;
	}

	private DefaultCollectionNode returnFalse() {
		DefaultCollectionNode ret = new DefaultCollectionNode();
		BooleanNode bool = new BooleanNode();
		bool.value(false);
		ret.addNode(bool);
		return ret;
	}

	private DefaultCollectionNode returnTrue() {
		DefaultCollectionNode ret = new DefaultCollectionNode();
		BooleanNode bool = new BooleanNode();
		bool.value(true);
		ret.addNode(bool);
		return ret;
	}

}
