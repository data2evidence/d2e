package com.legacy.health.fhir.meta.repsitory;

import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.instance.Structure;

public interface StructureConsumer {
	void writeStructure(Structure structure, Context context) throws Exception;
}
