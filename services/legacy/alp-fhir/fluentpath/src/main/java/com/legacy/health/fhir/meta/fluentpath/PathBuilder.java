package com.legacy.health.fhir.meta.fluentpath;

public class PathBuilder {

	public QualifiedIdentifier qi() {
		return new QualifiedIdentifier();
	}

	public Union union() {
		return new Union();
	}

	public Identifier identifier(String name) {
		return new Identifier().name(name);
	}

}
