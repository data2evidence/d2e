package com.legacy.health.fhir.meta.map;

public class GroupInput {

	private String name;
	private String type;
	private String mode;

	protected void setName(String name) {
		this.name = name;
	}

	protected void setType(String type) {
		this.type = type;
	}

	protected void setMode(String mode) {
		this.mode = mode;
	}

	public String getName() {
		return name;
	}

	public String getType() {
		return type;
	}

	public String getMode() {
		return mode;
	}

}
