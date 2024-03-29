package com.legacy.health.fhir.meta.repsitory;

import java.util.List;

import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.Structure;

public interface HistoryHandler {
	List<Structure> getHistory(String schema, StructureDefinition sd, String id, Context context);

	Structure getVersion(String schema, StructureDefinition sd, String id, String versionId, Context context);
}
