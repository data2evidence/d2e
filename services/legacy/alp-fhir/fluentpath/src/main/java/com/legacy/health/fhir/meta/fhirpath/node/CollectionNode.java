package com.legacy.health.fhir.meta.fhirpath.node;

import java.util.ArrayList;
import java.util.List;

public interface CollectionNode extends Node {

	public CollectionNode setRoot(CollectionNode root);

	public CollectionNode getRoot();

	public void addNode(Node node);

	public int size();

	public Node get(int index);

	public CollectionNode getLabeledNodes(String label);

	public boolean contains(Node node);

	default Boolean asBoolean() {
		ValueNode val = getValue();
		if (val != null) {
			return val.asBoolean();
		}
		return null;
	}

	default String asString() {
		ValueNode val = getValue();
		if (val != null) {
			return val.asString();
		}
		return null;
	}

	default boolean isInteger() {
		return "Integer".equals(getType());
	}

	default boolean isDouble() {
		return "Double".equals(getType());
	}

	default boolean isString() {
		return "String".equals(getType());
	}

	default boolean isBoolean() {
		return "Boolean".equals(getType());
	}

	default Double asDouble() {
		ValueNode val = getValue();
		if (val != null) {
			return val.asDouble();
		}
		return null;
	}

	default Integer asInteger() {
		ValueNode val = getValue();
		if (val != null) {
			return val.asInteger();
		}
		return null;
	}

	default String getType() {
		ValueNode val = getValue();
		if (val != null) {
			return val.getType();
		}
		return null;
	}

	default ValueNode getValue() {
		if (size() == 1) {
			Node n = get(0);
			if (n instanceof ValueNode) {
				return (ValueNode) n;
			}
			if (n instanceof DefaultLabeledNode) {
				return ((DefaultLabeledNode) n).value();
			}
		}
		return null;
	}

	default List<String> asStringList() {
		List<String> ret = new ArrayList<String>();
		for (int i = 0; i < size(); i++) {
			Node n = get(i);
			ValueNode vn = null;
			if (n instanceof ValueNode) {
				vn = (ValueNode) n;
			}
			if (n instanceof DefaultLabeledNode) {
				vn = ((DefaultLabeledNode) n).value();
			}
			if (vn != null && vn.asString() != null) {
				ret.add(vn.asString());
			}
		}
		return ret;
	}
}
