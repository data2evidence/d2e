package com.legacy.health.fhir.meta.fhirpath.node;

import java.util.Map;

public class MapBasedCollectionNode implements CollectionNode, LabeledNode {

	CollectionNode root;
	Map<String, Object> map;
	String type;

	@Override
	public String getLabel() {
		return null;
	}

	@Override
	public CollectionNode setRoot(CollectionNode root) {
		return root;
	}

	@Override
	public CollectionNode getRoot() {
		return root != null ? root : this;
	}

	@Override
	public void addNode(Node node) {
		// TODO Auto-generated method stub
		throw new UnsupportedOperationException();
	}

	@Override
	public int size() {
		return map.keySet().size();
	}

	@Override
	public Node get(int index) {
		String key = (String) map.keySet().toArray()[index];
		return getLabeledNodes(key);
	}

	@Override
	public CollectionNode getLabeledNodes(String label) {
		Object obj = map.get(label);
		if (obj == null)
			return DefaultCollectionNode.create(getRoot());
		if (obj instanceof String || obj instanceof Integer || obj instanceof Double) {
			return DefaultCollectionNode.create(getRoot(), DefaultLabeledNode.labeledValue(label, obj));
		}
		if (obj instanceof Map) {
			Map<String, Object> inner = (Map<String, Object>) obj;
			return create(getRoot(), inner);
		}
		return null;
	}

	@Override
	public boolean contains(Node node) {
		// TODO Auto-generated method stub
		return false;
	}

	public static MapBasedCollectionNode create(Map<String, Object> map) {
		MapBasedCollectionNode ret = new MapBasedCollectionNode();
		ret.map = map;
		return ret;
	}

	public static MapBasedCollectionNode create(CollectionNode root, Map<String, Object> map) {
		MapBasedCollectionNode ret = new MapBasedCollectionNode();
		ret.map = map;
		ret.root = root;
		return ret;
	}

	public String getType() {
		return type;
	}

	public MapBasedCollectionNode setType(String type) {
		this.type = type;
		return this;
	}

}
