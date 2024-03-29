package com.legacy.health.fhir.meta.json;

import java.io.File;
import java.io.FileInputStream;

import org.junit.Before;
import org.junit.Test;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.RepositoryBuilder;
import com.legacy.health.fhir.meta.repsitory.ZipSpecificationProvider;

public class JsonWalkerTest {

	@Before
	public void setUp() throws Exception {
	}

	@Test
	public void test() throws Exception {
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
		JSONWalker walker = new JSONWalker();
		walker.setMetaRepository(repo);
		long start = System.currentTimeMillis();
		Structure structure = walker.fromJSON(resource, sd);
		long stop = System.currentTimeMillis();
		System.out.println(stop - start);
	}

}
