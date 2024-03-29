package com.legacy.health.fhir.meta.repsitory;

import com.legacy.health.fhir.extension.extensionpoints.ExtensionPoint;

@StructureDefinitionProviderAnnotation
public interface StructureDefinitionProviderExtension extends StructureDefinitionProvider {

    public static ExtensionPoint<StructureDefinitionProviderAnnotation, StructureDefinitionProviderExtension> extensionPoint() {
        return new ExtensionPoint<>(StructureDefinitionProviderAnnotation.class,
                StructureDefinitionProviderExtension.class);
    }
}
