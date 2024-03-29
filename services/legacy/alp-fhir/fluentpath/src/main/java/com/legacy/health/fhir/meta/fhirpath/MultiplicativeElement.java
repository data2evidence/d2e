package com.legacy.health.fhir.meta.fhirpath;

import com.legacy.health.fhir.meta.fhirpath.node.CollectionNode;
import com.legacy.health.fhir.meta.fhirpath.node.DefaultCollectionNode;
import com.legacy.health.fhir.meta.fhirpath.node.NumberNode;

public class MultiplicativeElement extends BinaryOperationElement {

	boolean isConcat = false;

	public MultiplicativeElement concat() {
		this.isConcat = true;
		return this;
	}

	public boolean isConcat() {
		return isConcat;
	}

	@Override
	public CollectionNode evaluate(CollectionNode ctx) {
		CollectionNode l = left.evaluate(ctx.getRoot());
		CollectionNode r = right.evaluate(ctx.getRoot());

		if (l.size() == 0 || r.size() == 0) {
			return DefaultCollectionNode.create(ctx.getRoot());
		}

		if (l.isInteger() && r.isInteger()) {// pure integer
			Integer lint = l.asInteger();
			Integer rint = r.asInteger();
			Double ret = null;
			switch (this.operation()) {
				case "*":
					ret = (0.0 + lint) * rint;
					break;
				case "/":
					ret = (0.0 + lint) / rint;
					break;
				default:
					return null;
			}

			return DefaultCollectionNode.create(ctx.getRoot(), NumberNode.number(ret));
		}
		if (l.isDouble() && (r.isDouble() || r.isInteger())) {
			Double ld = l.asDouble();
			Double rd = r.asDouble();
			Double ret = null;
			switch (this.operation()) {
				case "*":
					ret = ld * rd;
					break;
				case "/":
					ret = ld / rd;
					break;
				default:
					return null;
			}
			return DefaultCollectionNode.create(ctx.getRoot(), NumberNode.number(ret));
		}
		if (r.isDouble() && (l.isDouble() || l.isInteger())) {
			Double ld = l.asDouble();
			Double rd = r.asDouble();
			Double ret = null;
			switch (this.operation()) {
				case "*":
					ret = ld * rd;
					break;
				case "/":
					ret = ld / rd;
					break;
				default:
					return null;
			}
			return DefaultCollectionNode.create(ctx.getRoot(), NumberNode.number(ret));
		}
		return DefaultCollectionNode.create(ctx.getRoot());
	}

}
