package com.legacy.health.fhir.meta.queryengine;

import java.util.List;

import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.repsitory.StructureConsumer;

public interface QueryEngine {
	public List<Structure> execute(Query query, Context context) throws Exception;

	public void execute(Query query, StructureConsumer consumer, Context context) throws Exception;

	public void executeAsync(Query query, StructureConsumer consumer, Context context) throws Exception;
}
