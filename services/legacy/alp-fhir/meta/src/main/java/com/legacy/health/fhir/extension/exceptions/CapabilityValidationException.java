package com.legacy.health.fhir.extension.exceptions;

import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.OperationOutcome;

public class CapabilityValidationException extends FhirException {
	OperationOutcome outcome;

	public CapabilityValidationException(String message, Exception innerException) {
		super(message, innerException);
	}

	public void setOperationOutcome(OperationOutcome outcome) {
		this.outcome = outcome;
	}

	public OperationOutcome getOperationOutcome() {
		return this.outcome;
	}

}
