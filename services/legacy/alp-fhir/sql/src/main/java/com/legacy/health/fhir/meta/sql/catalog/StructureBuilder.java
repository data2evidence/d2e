package com.legacy.health.fhir.meta.sql.catalog;

import java.util.HashMap;

import com.legacy.health.fhir.content.model.CatalogDefinition;
import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.repsitory.StructureConsumer;

public interface StructureBuilder {
	void build(StructureConsumer consumer, Context context, CatalogDefinition def,
			HashMap<String, HashMap<String, Object>> allContext) throws FhirException;

	static StructureBuilder getStructureBuilder(CatalogDefinition def) {
		// if(def.getTemplateId()!=null){
		// return TemplateBasedRenderer.getInstance();
		// }else{
		// return new MappingBasedRenderer();
		// }
		return new CatalogMappingRenderer();
	}
}
