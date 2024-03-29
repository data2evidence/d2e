package com.legacy.health.fhir.meta.fluentpath;

import com.legacy.health.fhir.meta.entity.StructureDefinition;

public interface PathElement {

	PathCheckResult checkStructureDefinition(StructureDefinition definition);

}
