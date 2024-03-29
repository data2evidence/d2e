package com.legacy.health.fhir.extension;

public class ExtensionMetadata {

	String name;
	String version;
	String description;

	public ExtensionMetadata(String name, String version, String description) {
		this.name = name;
		this.version = version;
		this.description = description;
	}

	public String getName() {
		return name;
	}

	public String getVersion() {
		return version;
	}

	public String getDescription() {
		return description;
	}

}
