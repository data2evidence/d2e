package com.legacy.health.fhir.meta.fhirpath;

import com.legacy.health.fhir.meta.FhirRuntimeException;
import com.legacy.health.fhir.meta.fhirpath.node.BooleanNode;
import com.legacy.health.fhir.meta.fhirpath.node.CollectionNode;
import com.legacy.health.fhir.meta.fhirpath.node.DefaultCollectionNode;
import com.legacy.health.fhir.meta.fhirpath.node.DefaultLabeledNode;
import com.legacy.health.fhir.meta.fhirpath.node.Node;

public class InEqualityElement extends BinaryOperationElement {

	@Override
	public CollectionNode evaluate(CollectionNode ctx) {
		CollectionNode l = left.evaluate(ctx.getRoot());
		CollectionNode r = right.evaluate(ctx.getRoot());
		if (l == null || r == null)
			return DefaultCollectionNode.create(ctx.getRoot());
		if (l.size() > 1 || r.size() > 1)
			throw new FhirRuntimeException("Comparision Collections must be single valued", null);
		if (l.size() == 0 || r.size() == 0)
			return DefaultCollectionNode.create(ctx.getRoot());
		if (">".equals(operation)) {
			if (l.isInteger() && r.isInteger()) {// pure integer
				Integer lint = l.asInteger();
				Integer rint = r.asInteger();
				return lint > rint ? returnTrue() : returnFalse();
			}
			if (l.isDouble() && (r.isDouble() || r.isInteger())) {
				Double ld = l.asDouble();
				Double rd = r.asDouble();
				return ld > rd ? returnTrue() : returnFalse();

			}
			if (r.isDouble() && (l.isDouble() || l.isInteger())) {
				Double ld = l.asDouble();
				Double rd = r.asDouble();
				return ld > rd ? returnTrue() : returnFalse();
			}
			if (l.isString() && r.isString()) {
				String ls = l.asString();
				String rs = r.asString();
				return ls.compareTo(rs) > 0 ? returnTrue() : returnFalse();
			}
		}
		if (">=".equals(operation)) {
			if (l.isInteger() && r.isInteger()) {// pure integer
				Integer lint = l.asInteger();
				Integer rint = r.asInteger();
				return lint >= rint ? returnTrue() : returnFalse();
			}
			if (l.isDouble() && (r.isDouble() || r.isInteger())) {
				Double ld = l.asDouble();
				Double rd = r.asDouble();
				return ld >= rd ? returnTrue() : returnFalse();

			}
			if (r.isDouble() && (l.isDouble() || l.isInteger())) {
				Double ld = l.asDouble();
				Double rd = r.asDouble();
				return ld >= rd ? returnTrue() : returnFalse();
			}
			if (l.isString() && r.isString()) {
				String ls = l.asString();
				String rs = r.asString();
				return ls.compareTo(rs) >= 0 ? returnTrue() : returnFalse();
			}
		}
		if ("<".equals(operation)) {
			if (l.isInteger() && r.isInteger()) {// pure integer
				Integer lint = l.asInteger();
				Integer rint = r.asInteger();
				return lint < rint ? returnTrue() : returnFalse();
			}
			if (l.isDouble() && (r.isDouble() || r.isInteger())) {
				Double ld = l.asDouble();
				Double rd = r.asDouble();
				return ld < rd ? returnTrue() : returnFalse();

			}
			if (r.isDouble() && (l.isDouble() || l.isInteger())) {
				Double ld = l.asDouble();
				Double rd = r.asDouble();
				return ld < rd ? returnTrue() : returnFalse();
			}
			if (l.isString() && r.isString()) {
				String ls = l.asString();
				String rs = r.asString();
				return ls.compareTo(rs) < 0 ? returnTrue() : returnFalse();
			}
		}
		if ("<=".equals(operation)) {
			if (l.isInteger() && r.isInteger()) {// pure integer
				Integer lint = l.asInteger();
				Integer rint = r.asInteger();
				return lint <= rint ? returnTrue() : returnFalse();
			}
			if (l.isDouble() && (r.isDouble() || r.isInteger())) {
				Double ld = l.asDouble();
				Double rd = r.asDouble();
				return ld <= rd ? returnTrue() : returnFalse();

			}
			if (r.isDouble() && (l.isDouble() || l.isInteger())) {
				Double ld = l.asDouble();
				Double rd = r.asDouble();
				return ld <= rd ? returnTrue() : returnFalse();
			}
			if (l.isString() && r.isString()) {
				String ls = l.asString();
				String rs = r.asString();
				return ls.compareTo(rs) <= 0 ? returnTrue() : returnFalse();
			}
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
