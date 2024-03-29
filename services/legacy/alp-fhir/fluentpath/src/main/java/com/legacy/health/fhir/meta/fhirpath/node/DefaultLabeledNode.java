package com.legacy.health.fhir.meta.fhirpath.node;

public class DefaultLabeledNode extends DefaultCollectionNode implements LabeledNode {

	protected String label;
	protected ValueNode value;

	public DefaultLabeledNode() {
		super();
	}

	public DefaultLabeledNode label(String label) {
		this.label = label;
		return this;
	}

	@Override
	public String getLabel() {
		return label;
	}

	public DefaultLabeledNode value(ValueNode value) {
		this.value = value;
		return this;
	}

	public ValueNode value() {
		return value;
	}

	@Override
	public ValueNode getValue() {
		return value;
	}

	public static DefaultLabeledNode labeledValue(String label, Object value) {
		DefaultLabeledNode ret = new DefaultLabeledNode();
		ret.label(label);
		if (value instanceof String) {
			StringNode val = new StringNode();
			val.value((String) value);
			ret.value(val);
		}
		if (value instanceof Boolean) {
			BooleanNode val = new BooleanNode();
			val.value((Boolean) value);
			ret.value(val);
		}
		if (value instanceof Integer) {
			ret.value(NumberNode.number((Integer) value));
		}
		if (value instanceof Double) {
			ret.value(NumberNode.number((Double) value));
		}
		return ret;
	}

}
