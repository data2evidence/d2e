package com.legacy.health.fhir.extension.extensionpoints;

import com.legacy.health.fhir.extension.FHIRResourceRepository;
import com.legacy.health.fhir.extension.StructureValidatorExtension;
import com.legacy.health.fhir.extension.extensionpoints.annotations.FHIRResourceAnnotation;
import com.legacy.health.fhir.extension.extensionpoints.annotations.StructureValidator;

public class ExtensionPoint<S, T> {
    Class<S> extensionPointType;
    Class<T> extensionPointResultType;

    public ExtensionPoint(Class<S> extensionPointType, Class<T> extensionPointResultType) {
        this.extensionPointType = extensionPointType;
        this.extensionPointResultType = extensionPointResultType;
    }

    public boolean isClassSatisfying(Class<?> c) {
        if (extensionPointResultType.isAssignableFrom(c) && extensionPointResultType != c) {
            return true; // Could check here for additional values in this class
        }
        return false;
    }

    public Class getExtClass() {
        return extensionPointType;
    }

    public static ExtensionPoint<StructureValidator, StructureValidatorExtension> ValidatorExtensionPoint() {
        return new ExtensionPoint<>(StructureValidator.class, StructureValidatorExtension.class);
    }

    public static ExtensionPoint<FHIRResourceAnnotation, FHIRResourceRepository> FHIRResourceRepositoryExtensionPoint() {
        return new ExtensionPoint<>(FHIRResourceAnnotation.class, FHIRResourceRepository.class);
    }

}
