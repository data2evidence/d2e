package com.legacy.health.fhir.meta.repsitory;

import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.legacy.health.fhir.extension.extensionpoints.ExtensionPoint;
import com.legacy.health.fhir.meta.entity.StructureDefinition;

@StructureDefinitionDeserializer
public interface StructureDefinitionDeserializerExtension {

	public List<String> getSupportedProfiles();

	public StructureDefinition deserializeDefinition(JsonNode node);

	public static ExtensionPoint<StructureDefinitionDeserializer, StructureDefinitionDeserializerExtension> extensionPoint() {
		return new ExtensionPoint<>(StructureDefinitionDeserializer.class,
				StructureDefinitionDeserializerExtension.class);
	}
}
