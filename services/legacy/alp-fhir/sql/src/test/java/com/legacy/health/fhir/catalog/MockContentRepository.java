package com.legacy.health.fhir.catalog;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.HashMap;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legacy.health.fhir.content.ContentRepository;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.json.JSONWalker;

public class MockContentRepository extends ContentRepository {

	HashMap<String, String> idMap = new HashMap<String, String>();

	public Structure readContent(String id, String structureDefinition) throws FhirException {
		if (idMap.size() == 0) {
			idMap.put("bgzgender", "Gender.ConceptMap");
			idMap.put("bgzaddresstype", "AddressType.ConceptMap");
			idMap.put("bgznumbertype", "NumberType.ConceptMap");
			idMap.put("bgzemailaddresstype", "EmailAddressType.ConceptMap");
			idMap.put("bgztelecomtype", "TelecomType.ConceptMap");
		}
		id = idMap.containsKey(id) ? idMap.get(id) : id;
		StructureDefinition sd = context.getMetaRepo().getStructureDefinitionById(structureDefinition);
		if ("patient_catalog".equals(id)) {
			try {
				return loadStructure("catalog/patient_catalog.json");
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		} else {
			try {
				return loadStructure("catalog/" + id + ".json");
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return null;
	}

	protected Structure loadStructure(String jsonFileName) throws IOException {
		ObjectMapper mapper = new ObjectMapper();
		File resourceFile = new File(
				MockContentRepository.class.getClassLoader().getResource(jsonFileName).getFile());
		FileInputStream fis = new FileInputStream(resourceFile);
		JsonNode resource = mapper.readTree(fis);
		String type = resource.get("resourceType").asText();
		StructureDefinition sd = context.getMetaRepo().getStructureDefinitionById(type);
		JSONWalker walker = new JSONWalker();
		return walker.fromJSON(resource, sd);
	}

	public Structure readContentWithSDUrl(String id, String url) throws FhirException {
		StructureDefinition sd = context.getMetaRepo().getStructureDefinitionByUrl(url, context);
		return readContent(id, sd.getId());
	}

}
