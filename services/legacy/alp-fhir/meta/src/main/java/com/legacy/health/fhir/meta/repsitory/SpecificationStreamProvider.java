package com.legacy.health.fhir.meta.repsitory;

import java.io.InputStream;

import com.legacy.health.fhir.meta.FhirException;

public interface SpecificationStreamProvider {
	InputStream provideTypes() throws FhirException;

	InputStream provideResourceDefinitions() throws FhirException;

	InputStream provideSearchParameters() throws FhirException;
}
