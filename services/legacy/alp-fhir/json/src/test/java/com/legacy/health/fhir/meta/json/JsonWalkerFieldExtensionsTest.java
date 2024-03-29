package com.legacy.health.fhir.meta.json;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.FileInputStream;

import org.junit.Before;
import org.junit.Test;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.ArrayElement;
import com.legacy.health.fhir.meta.instance.ComplexElement;
import com.legacy.health.fhir.meta.instance.Element;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.instance.ValueElement;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.RepositoryBuilder;
import com.legacy.health.fhir.meta.repsitory.ZipSpecificationProvider;

public class JsonWalkerFieldExtensionsTest {

	private Structure<?> structure;
	private JSONWalker walker;

	@Before
	public void setUp() throws Exception {
		File file = new File(this.getClass().getClassLoader().getResource("spec.zip").getFile());
		ZipSpecificationProvider provider = new ZipSpecificationProvider();
		provider.setZipFilePath(file);
		MetaRepository repo = RepositoryBuilder.createRepository(provider);
		ObjectMapper mapper = new ObjectMapper();
		File resourceFile = new File(this.getClass().getClassLoader().getResource("testpatient.json").getFile());
		FileInputStream fis = new FileInputStream(resourceFile);
		JsonNode resource = mapper.readTree(fis);
		String type = resource.get("resourceType").asText();
		StructureDefinition sd = repo.getStructureDefinitionById(type);
		walker = new JSONWalker();
		walker.setMetaRepository(repo);
		long start = System.currentTimeMillis();
		structure = walker.fromJSON(resource, sd);
		long stop = System.currentTimeMillis();
		System.out.println(stop - start);
	}

	@Test
	public void testDeserialization() throws Exception {
		assertNotNull(structure.getElementByPath("Patient.birthDate")); // testpatient.json has a birthDate
		assertTrue(structure.getElementByPath("Patient.birthDate") instanceof ValueElement); // birthDate is a
																								// ValueElement
		assertNotNull(((ValueElement<?>) structure.getElementByPath("Patient.birthDate")).getValueExtension()); // and
																												// it
																												// has a
																												// fieldextension
																												// assigned

		assertNotNull(structure.getElementByPath("Patient.address")); // testpatient.json has an address
		assertTrue(structure.getElementByPath("Patient.address") instanceof ArrayElement); // address is an array
		assertTrue(((ArrayElement<?>) structure.getElementByPath("Patient.address")).getElements().size() == 1); // and
																													// it
																													// has
																													// a
																													// single
																													// address
		Element<?> address = structure.getElementByPath("Patient.address[0]");
		assertTrue(address != null && address instanceof ComplexElement); // address entry is a record
		Element<?> lines = structure.getElementByPath("Patient.address[0].line");
		assertTrue(lines != null && lines instanceof ArrayElement); // address line array was found
		Element<?> line1 = structure.getElementByPath("Patient.address[0].line[1]");
		assertTrue(line1 != null && line1 instanceof ValueElement); // address line #2 was found
		assertNotNull(((ValueElement<?>) line1).getValueExtension()); // and it has a fieldextension assigned
	}

	@Test
	public void testSerialization() throws Exception {
		ObjectNode json = (ObjectNode) walker.toJSON(structure);
		JsonNode birthdateextension = json.path("_birthDate");
		JsonNode address0 = json.path("address").get(0);
		JsonNode line1extension = json.path("address").get(0).path("_line").get(1);
		assertTrue(birthdateextension instanceof ObjectNode);
		assertTrue(address0 instanceof ObjectNode);
		assertTrue(line1extension instanceof ObjectNode);
	}

}
