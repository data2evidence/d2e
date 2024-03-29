package com.legacy.health.fhir.meta.map;

import static org.junit.Assert.assertNotNull;

import java.io.File;

import org.junit.BeforeClass;
import org.junit.Test;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.RepositoryBuilder;
import com.legacy.health.fhir.meta.repsitory.ZipSpecificationProvider;

public class StructureMapTest {

	static MetaRepository repo;
	ObjectMapper mapper = new ObjectMapper();

	@BeforeClass
	public static void setUp() throws Exception {
		File file = new File(StructureMapTest.class.getClassLoader().getResource("spec.zip").getFile());
		ZipSpecificationProvider provider = new ZipSpecificationProvider();
		provider.setZipFilePath(file);
		repo = RepositoryBuilder.createRepository(provider);

	}

	@Test
	public void test() throws Exception {
		File file = new File(StructureMapTest.class.getClassLoader().getResource("test_structuremap.json").getFile());
		JsonNode node = mapper.readTree(file);
		StructureMap map = StructureMapBuilder.createStructureMap(node, repo, null);
		assertNotNull(map);
	}

}
