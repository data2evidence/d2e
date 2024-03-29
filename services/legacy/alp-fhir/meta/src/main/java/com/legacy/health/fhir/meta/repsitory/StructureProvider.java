package com.legacy.health.fhir.meta.repsitory;

import java.io.InputStream;

import com.legacy.health.fhir.meta.Context;

public interface StructureProvider {
	void setMetaRepository(MetaRepository repo);

	void allowAliases(boolean allowAliases);

	void setPreprocessor(String preprocessor) throws Exception;

	void setStructureConsumer(StructureConsumer consumer);

	void provideStructures(Context context) throws Exception;

	/**
	 * Must take care that all resources will also have the "Meta.lastUpdated" flag
	 * set
	 * 
	 * @param is
	 * @throws Exception
	 */
	void provideStructures(InputStream is, boolean newVersion, Context context) throws Exception;
}
