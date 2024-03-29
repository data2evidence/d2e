package com.legacy.health.fhir.meta.map;

public class RuleTarget {
	private String context;
	private String element;
	private String transform;

	public String getContext() {
		return context;
	}

	public void setContext(String context) {
		this.context = context;
	}

	public String getElement() {
		return element;
	}

	public void setElement(String element) {
		this.element = element;
	}

	public String getTransform() {
		return transform;
	}

	public void setTransform(String transform) {
		this.transform = transform;
	}

}
