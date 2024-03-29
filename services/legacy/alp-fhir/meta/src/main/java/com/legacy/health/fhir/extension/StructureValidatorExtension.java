package com.legacy.health.fhir.extension;

import com.legacy.health.fhir.extension.exceptions.StructureValidationException;
import com.legacy.health.fhir.meta.entity.OperationOutcome;
import com.legacy.health.fhir.meta.instance.Structure;

@com.legacy.health.fhir.extension.extensionpoints.annotations.StructureValidator
public interface StructureValidatorExtension extends Extension {

   boolean isApplicableFor(Structure structure) throws StructureValidationException;

   OperationOutcome validate(Structure structure) throws StructureValidationException;
}
