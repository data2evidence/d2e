package com.legacy.health.fhir.meta.repsitory;

import java.util.HashMap;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.DataElementStructureLink;
import com.legacy.health.fhir.meta.entity.DataType;
import com.legacy.health.fhir.meta.entity.SearchParameter;
import com.legacy.health.fhir.meta.entity.StructureDefinition;

public interface MetaRepository {
	void registerStructureDefinition(StructureDefinition metadata);

	void registerStructureDefinitionSource(String id, JsonNode data);

	void registerDataElement(DataElement element);

	DataType getTypeById(String id);

	StructureDefinition getStructureDefinitionById(String id);

	StructureDefinition getStructureDefinitionById(String id, Context context);

	StructureDefinition getStructureDefinitionByUrl(String url, Context context);

	DataElement getElementById(String id);

	JsonNode getMappingForVersion(String version);

	DataElementStructureLink getElementByPath(StructureDefinition definition, String path);

	void registerSearchParameter(SearchParameter searchParameter);

	SearchParameter getSearchParameterById(String id);

	List<SearchParameter> getSearchParametersByType(StructureDefinition sd);

	SearchParameter getSearchParameterByTypeAndCode(StructureDefinition sd, String code);

	HashMap<String, DataElement> getElements();

	HashMap<String, StructureDefinition> getBaseResourceIndex();

	List<JsonNode> getAllStructureDefinitions();

	void addStructureDefinitionProvider(StructureDefinitionProvider provider);

	boolean isStructureRegisteredById(String id);
}
