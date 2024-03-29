package com.legacy.health.fhir.extension;

import java.util.ArrayList;
import java.util.HashMap;

import com.legacy.health.fhir.extension.exceptions.CapabilityValidationException;
import com.legacy.health.fhir.meta.entity.OperationOutcome;
import com.legacy.health.fhir.meta.instance.Structure;

@com.legacy.health.fhir.extension.extensionpoints.annotations.CapabilityValidator
public interface CapabilityValidatorExtension extends Extension {
	OperationOutcome validate(Structure capabilityStatement, String resourceType, String operationType,
			HashMap<String, ArrayList<String>> searchOperands) throws CapabilityValidationException;
}
