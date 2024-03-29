package com.legacy.health.fhir.meta.repsitory;

import com.legacy.health.fhir.meta.Context;

public interface StructureDefinitionProvider {
	default boolean hasStructureDefinitionById(String id) {
		return false;
	}

	default boolean hasStructureDefinitionByUrl(String url) {
		return false;
	}

	default boolean provideStructureDefinitionById(MetaRepository repo, String id, Context context) {
		return false;
	}

	default void provideStructureDefinitionByUrl(MetaRepository repo, String url, Context context) {
		return;
	}
}
