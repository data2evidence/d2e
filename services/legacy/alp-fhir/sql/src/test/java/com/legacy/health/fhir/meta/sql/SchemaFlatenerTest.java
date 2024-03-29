package com.legacy.health.fhir.meta.sql;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.MetaRepositoryImpl;
import com.legacy.health.fhir.meta.repsitory.RepositoryBuilder;
import com.legacy.health.fhir.meta.repsitory.ZipSpecificationProvider;

public class SchemaFlatenerTest {
	MetaRepository repo = new MetaRepositoryImpl();

	static Properties testProperties = new Properties();
	static ZipSpecificationProvider provider;

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		System.out.println("test");
		ClassLoader classLoader = SchemaFlatenerTest.class.getClassLoader();
		File file = new File(classLoader.getResource("test.properties").getFile());
		FileInputStream fis = new FileInputStream(file);
		testProperties.load(fis);
		File zipFile = new File(SchemaFlatenerTest.class.getClassLoader().getResource("spec.zip").getFile());
		provider = new ZipSpecificationProvider();
		provider.setZipFilePath(zipFile);

	}

	@AfterClass
	public static void tearDownClass() throws Exception {
		System.out.println("test-end");

	}

	@Before
	public void setUp() throws Exception {

	}

	@Test
	public void testSchemaFlatener() throws Exception {
		final SQLExecutor sql = new SQLExecutor();
		sql.connect(testProperties);

		MetaRepository repo = RepositoryBuilder.createRepository(provider);
		long start = System.currentTimeMillis();
		ObjectMapper mapper = new ObjectMapper();

		List<String> types = new ArrayList<String>();

		types.add("Patient");
		for (int f = 0; f < types.size(); f++) {
			StructureDefinition sd = repo.getStructureDefinitionById(types.get(f));
			SchemaFlatener flatener = new SchemaFlatener("fhir1");
			flatener.flattenSchema(sd);

		}
		long stop = System.currentTimeMillis();
		System.out.println(stop - start);
	}

}
