package com.legacy.health.fhir.meta.fhirpath.node;

import com.legacy.health.fhir.meta.instance.ArrayElement;
import com.legacy.health.fhir.meta.instance.ComplexElement;
import com.legacy.health.fhir.meta.instance.Element;
import com.legacy.health.fhir.meta.instance.ElementContainer;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.instance.ValueElement;

public class FhirCollectionNode implements CollectionNode, LabeledNode {

	String type;
	CollectionNode root;
	ElementContainer container;

	public FhirCollectionNode(ElementContainer container) {
		this.container = container;
		if (container instanceof Structure) {
			type = ((Structure) container).getDefinition().getId();
		}
	}

	@Override
	public void addNode(Node node) {
		throw new UnsupportedOperationException();

	}

	@Override
	public int size() {
		return container.getElements().size();
	}

	@Override
	public Node get(int index) {
		Node ret = null;
		Element element = container.getElements().get(index);
		if (element instanceof ValueElement) {
			Object value = ((ValueElement) element).getValue();
			ret = DefaultLabeledNode.labeledValue(element.getDefinition().getShortName(), value);
		}
		if (element instanceof ElementContainer) {
			ret = new FhirCollectionNode((ElementContainer) element);
		}
		return ret;
	}

	@Override
	public CollectionNode getLabeledNodes(String label) {
		if (container instanceof ArrayElement) {
			DefaultCollectionNode col = DefaultCollectionNode.create(root);
			for (int i = 0; i < container.getElements().size(); i++) {
				Node node = get(i);
				if (node instanceof FhirCollectionNode) {
					FhirCollectionNode inner = (FhirCollectionNode) node;
					for (int c = 0; c < inner.container.getElements().size(); c++) {
						LabeledNode lnode = (LabeledNode) inner.get(c);
						if (label.equals(lnode.getLabel())) {
							col.addNode(lnode);
						}
					}
				}
				if (node instanceof DefaultLabeledNode) {
					col.addNode(node);
				}
			}
			return col;
		}
		for (int i = 0; i < container.getElements().size(); i++) {
			LabeledNode node = (LabeledNode) get(i);
			if (label.equals(node.getLabel())) {
				if (node instanceof DefaultLabeledNode) {
					return DefaultCollectionNode.create(root, node);
				} else
					return (CollectionNode) node;
			}
		}
		return DefaultCollectionNode.create(root);
	}

	@Override
	public boolean contains(Node node) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public String getLabel() {
		if (container instanceof ArrayElement) {
			return ((ArrayElement) container).getDefinition().getShortName();
		}
		if (container instanceof ComplexElement) {
			return ((ComplexElement) container).getDefinition().getShortName();
		}
		return "";
	}

	public String getType() {
		return type;
	}

	public static FhirCollectionNode create(CollectionNode root, ElementContainer container) {
		FhirCollectionNode ret = new FhirCollectionNode(container);
		ret.setRoot(root);
		return ret;
	}

	public static FhirCollectionNode create(ElementContainer container) {
		FhirCollectionNode ret = new FhirCollectionNode(container);
		ret.setRoot(ret);
		return ret;
	}

	@Override
	public CollectionNode setRoot(CollectionNode root) {
		this.root = root;
		return this;
	}

	@Override
	public CollectionNode getRoot() {
		return root;
	}

}
