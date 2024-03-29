package com.legacy.health.fhir.meta.fhirpath.node;

import java.util.ArrayList;
import java.util.List;

public class DefaultCollectionNode implements CollectionNode {

	protected List<Node> nodes = new ArrayList<Node>();
	protected CollectionNode root;

	public DefaultCollectionNode() {
		// System.out.println("Created");
	}

	@Override
	public void addNode(Node node) {
		nodes.add(node);
	}

	@Override
	public int size() {
		return nodes.size();
	}

	@Override
	public Node get(int index) {
		return nodes.get(index);
	}

	@Override
	public CollectionNode getLabeledNodes(String label) {
		DefaultCollectionNode ret = new DefaultCollectionNode();
		for (Node node : nodes) {
			if (node instanceof LabeledNode) {
				if (label.equals(((LabeledNode) node).getLabel())) {
					ret.addNode(node);
				}
			}
		}
		return ret;
	}

	@Override
	public boolean contains(Node node) {
		return nodes.contains(node);
	}

	public static CollectionNode create(CollectionNode root, Node node) {
		DefaultCollectionNode ret = new DefaultCollectionNode();
		ret.addNode(node);
		ret.setRoot(root);
		return ret;
	}

	public static DefaultCollectionNode create(CollectionNode root) {
		DefaultCollectionNode ret = new DefaultCollectionNode();
		ret.setRoot(root);
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
