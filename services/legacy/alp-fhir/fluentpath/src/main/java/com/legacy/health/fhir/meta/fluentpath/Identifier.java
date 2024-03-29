package com.legacy.health.fhir.meta.fluentpath;

import com.legacy.health.fhir.meta.entity.StructureDefinition;

public class Identifier implements PathElement {
	protected String name;

	public Identifier name(String name) {
		this.name = name;
		return this;
	}

	public String name() {
		return name;
	}

	@Override
	public PathCheckResult checkStructureDefinition(StructureDefinition definition) {
		if (definition.getId().equals(name)) {
			PathCheckResult result = new PathCheckResult();
			result.definition = definition;
			return result;
		}
		return null;
	}
}
