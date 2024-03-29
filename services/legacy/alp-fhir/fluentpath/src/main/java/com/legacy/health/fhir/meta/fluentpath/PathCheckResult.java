package com.legacy.health.fhir.meta.fluentpath;

import com.legacy.health.fhir.meta.entity.MetaData;

public class PathCheckResult {
	MetaData definition;
	String path;

	public MetaData getDefintion() {
		return definition;
	}

	public String getPath() {
		return path;
	}
}
