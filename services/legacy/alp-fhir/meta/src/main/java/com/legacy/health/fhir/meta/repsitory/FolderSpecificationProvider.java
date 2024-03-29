package com.legacy.health.fhir.meta.repsitory;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;

import com.legacy.health.fhir.meta.FhirException;

public class FolderSpecificationProvider implements SpecificationStreamProvider {

	protected String metaDataDir;

	public void setSpecificationPath(String metaDataDir) {
		this.metaDataDir = metaDataDir;
	}

	public InputStream provideTypes() throws FhirException {
		try {
			return new FileInputStream(metaDataDir + "/profiles-types.json");
		} catch (FileNotFoundException e) {
			throw new FhirException("'profiles-types.json' not found", e);
		}
	}

	public InputStream provideResourceDefinitions() throws FhirException {
		try {
			return new FileInputStream(metaDataDir + "/profiles-resources.json");
		} catch (FileNotFoundException e) {
			throw new FhirException("'profiles-resources.json' not found", e);
		}
	}

	@Override
	public InputStream provideSearchParameters() throws FhirException {
		try {
			return new FileInputStream(metaDataDir + "/search-parameters.json");
		} catch (FileNotFoundException e) {
			throw new FhirException("'search-parameters.json' not found", e);
		}
	}

}
