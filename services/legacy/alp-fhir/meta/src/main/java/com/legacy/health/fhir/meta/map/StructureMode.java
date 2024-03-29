package com.legacy.health.fhir.meta.map;

import com.legacy.health.fhir.meta.entity.StructureDefinition;

public class StructureMode {
	private StructureDefinition definition;
	private String mode;
	private String alias;

	public StructureDefinition getDefinition() {
		return definition;
	}

	public void setDefinition(StructureDefinition definition) {
		this.definition = definition;
	}

	public String getMode() {
		return mode;
	}

	public void setMode(String mode) {
		this.mode = mode;
	}

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

}
