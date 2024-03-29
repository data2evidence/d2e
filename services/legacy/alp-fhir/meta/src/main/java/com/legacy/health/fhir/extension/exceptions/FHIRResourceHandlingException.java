package com.legacy.health.fhir.extension.exceptions;

import com.legacy.health.fhir.meta.FhirException;

public class FHIRResourceHandlingException extends FhirException {

	public FHIRResourceHandlingException(String message, Exception innerException) {
		super(message, innerException);
	}
}
