package com.legacy.health.fhir.meta.entity;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;

import org.junit.Before;
import org.junit.Test;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.MetaRepositoryImpl;
import com.legacy.health.fhir.meta.repsitory.RepositoryBuilder;
import com.legacy.health.fhir.meta.repsitory.ZipSpecificationProvider;

public class StructureDefinitionTest {

	MetaRepository repo = new MetaRepositoryImpl();

	@Before
	public void setUp() {
		DataElement deStringValue = new DataElement("string.value", null, 0, 1);
		DataElement deIntegerValue = new DataElement("integer.value", null, 0, 1);

		ArrayList<DataElement> typeElements = new ArrayList<>();
		typeElements.add(deStringValue);
		DataType dtString = new DataType("string", Arrays.asList(deStringValue), false);
		DataType dtInteger = new DataType("integer", Arrays.asList(deIntegerValue), false);

		DataElement deHumanNameFirst = new DataElement("HumanName.first", dtString, 0, 1);
		DataElement deHumanNameLast = new DataElement("HumanName.last", dtString, 0, 1);
		DataType dtHumanName = new DataType("HumanName", Arrays.asList(deHumanNameFirst, deHumanNameLast), true);
		DataElement deAddressStreet = new DataElement("Address.street", dtString, 0, 1);
		DataElement deAddressPostalCode = new DataElement("Address.postalCode", dtInteger, 0, 1);
		DataElement deAddressCity = new DataElement("Address.city", dtString, 0, 1);
		DataElement deAddressCountry = new DataElement("Address.country", dtString, 0, 1);
		DataType dtAddress = new DataType("Address",
				Arrays.asList(deAddressStreet, deAddressPostalCode, deAddressCity, deAddressCountry), true);
		DataElement dePersonId = new DataElement("Person.id", dtInteger, 1, 1);
		DataElement dePersonAge = new DataElement("Person.age", dtInteger, 1, 1);
		DataElement dePersonName = new DataElement("Person.name", dtHumanName, 0, 1);
		DataElement dePersonAddress = new DataElement("Person.address", dtAddress, 0, 1);
		new StructureDefinition("Person", Arrays.asList(
				dePersonId, dePersonAge, dePersonName, dePersonAddress));
		// repo.registerStructureDefinition(sdPerson);
	}

	public boolean isNumeric(String s) {
		if (s == null)
			return false;
		return s.matches("[-+]?\\d*\\.?\\d+");
	}

	@Test
	public void testLoadModel() throws Exception {
		File file = new File(this.getClass().getClassLoader().getResource("spec.zip").getFile());
		ZipSpecificationProvider provider = new ZipSpecificationProvider();
		provider.setZipFilePath(file);
		ObjectMapper mapper = new ObjectMapper();
		JsonNode root = mapper.readTree(provider.provideTypes());
		JsonNode entry = root.get("entry");
		// create all type Instances
		Iterator<JsonNode> it1 = entry.iterator();
		while (it1.hasNext()) {
			JsonNode child = it1.next();
			JsonNode resource = child.get("resource");
			DataType type = new DataType(resource.get("id").asText(),
					resource.get("kind").textValue().equals("complex-type"));
			repo.registerStructureDefinition(type);
		}
		createStructureDefinition(entry);
		// load the Resources
		JsonNode resourceDefinitions = mapper.readTree(provider.provideResourceDefinitions());
		createStructureDefinition(resourceDefinitions.get("entry"));
		// load the SearchParameters
		JsonNode searchParameters = mapper.readTree(provider.provideSearchParameters());
		RepositoryBuilder.createSearchParameter(repo, searchParameters.get("entry"));
	}

	private void createStructureDefinition(JsonNode entry) {
		Iterator<JsonNode> it = entry.iterator();
		while (it.hasNext()) {
			JsonNode child = it.next();
			JsonNode resource = child.get("resource");
			StructureDefinition type = repo.getStructureDefinitionById(resource.get("id").asText());
			if (type == null) {
				type = new StructureDefinition(resource.get("id").asText());
				repo.registerStructureDefinition(type);
			}
			JsonNode snapshot = resource.get("snapshot");
			if (snapshot == null)
				continue;// deal with base
			JsonNode elementArray = snapshot.get("element");
			Iterator<JsonNode> elements = elementArray.iterator();
			while (elements.hasNext()) {
				JsonNode element = elements.next();
				String id = element.get("id").asText();
				int min = element.get("min").asInt();
				int max = 0;
				JsonNode maxJson = element.get("max");
				if (maxJson.isNumber()) {
					max = maxJson.asInt();
				}
				if (maxJson.isTextual() && maxJson.asText().equals("*")) {
					max = Integer.MAX_VALUE;
				}
				if (maxJson.isTextual() && isNumeric(maxJson.asText())) {
					max = Integer.parseInt(maxJson.asText());
				}
				JsonNode typeJson = element.get("type");
				int typeCount = 0;
				if (typeJson != null) {
					typeCount = typeJson.size();
				}
				if (typeCount == 1) {
					JsonNode codeJson = typeJson.get(0).get("code");
					if (codeJson != null) {
						DataElement dataElement = new DataElement(id, repo.getTypeById(codeJson.asText()), min, max);
						type.addDataElement(dataElement);
					}
				}
				if (typeCount > 1) {
					String prefix = id.split("\\[")[0];

					for (JsonNode jsonNode : typeJson) {
						String code = jsonNode.get("code").asText();
						DataElement dataElement = type.getDataElement(code);
						if (dataElement == null) {
							dataElement = new DataElement(prefix + code, repo.getTypeById(code), min, max);
							type.addDataElement(dataElement);
						}
						JsonNode targetProfile = jsonNode.get("targetProfile");
						if (targetProfile != null) {
							dataElement.addTargetProfile(targetProfile.asText());
						}
					}
				}

			}

		}
	}

}
