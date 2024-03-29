package com.legacy.health.fhir.meta.fhirpath;

import java.util.ArrayList;
import java.util.List;

import com.legacy.health.fhir.meta.fhirpath.node.CollectionNode;
import com.legacy.health.fhir.meta.fhirpath.node.DefaultCollectionNode;
import com.legacy.health.fhir.meta.fhirpath.node.NumberNode;
import com.legacy.health.fhir.meta.fhirpath.node.StringNode;

public class FunctionElement extends InvocableElement {

	private List<FhirPathElement> params = new ArrayList<FhirPathElement>();

	public FunctionElement addParams(List<FhirPathElement> params) {
		this.params.addAll(params);
		return this;
	}

	@Override
	protected CollectionNode ownEvaluation(CollectionNode ctx) {
		if (id.equals("count")) {
			return DefaultCollectionNode.create(ctx.getRoot(), NumberNode.number(ctx.size()));
		}
		if (id.equals("indexOf")) {
			String value = ctx.asString();
			if (value != null) {
				if (this.params.size() == 1) {
					String sub = params.get(0).evaluate(ctx.getRoot()).asString();
					if (sub != null) {
						Integer result = value.indexOf(sub);
						return DefaultCollectionNode.create(ctx.getRoot(), NumberNode.number(result));
					}
				}
			}
		}
		if (id.equals("substring")) {
			String value = ctx.asString();
			if (value != null) {
				if (this.params.size() == 1) {
					Integer from = params.get(0).evaluate(ctx.getRoot()).asInteger();
					if (from != null) {
						String result = value.substring(from);
						return DefaultCollectionNode.create(ctx.getRoot(), new StringNode().value(result));
					}
				}
				if (this.params.size() == 2) {
					Integer from = params.get(0).evaluate(ctx.getRoot()).asInteger();
					Integer length = params.get(1).evaluate(ctx.getRoot()).asInteger();
					if (from != null && length != null) {
						Integer vLength = value.length();
						Integer to = from + (from + length > vLength ? vLength : length);
						String result = value.substring(from, to);
						return DefaultCollectionNode.create(ctx.getRoot(), new StringNode().value(result));
					}
				}
			}
		}
		if (id.equals("toInteger")) {
			String value = ctx.asString();
			if (value != null) {
				Integer val = Integer.parseInt(value);
				return DefaultCollectionNode.create(ctx.getRoot(), NumberNode.number(val));
			}
			Integer iValue = ctx.asInteger();
			if (iValue != null) {
				return DefaultCollectionNode.create(ctx.getRoot(), NumberNode.number(iValue));
			}
		}
		if (id.equals("toDecimal")) {
			String value = ctx.asString();
			if (value != null) {
				Double val = Double.parseDouble(value);
				return DefaultCollectionNode.create(ctx.getRoot(), NumberNode.number(val));
			}
			Double dValue = ctx.asDouble();
			if (dValue != null) {
				return DefaultCollectionNode.create(ctx.getRoot(), NumberNode.number(dValue));
			}
			Integer iValue = ctx.asInteger();
			if (iValue != null) {
				return DefaultCollectionNode.create(ctx.getRoot(), NumberNode.number(0.0 + iValue));
			}
		}
		return null;
	}

}
