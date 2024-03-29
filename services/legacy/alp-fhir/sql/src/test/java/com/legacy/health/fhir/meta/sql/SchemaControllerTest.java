package com.legacy.health.fhir.meta.sql;

import static org.junit.Assert.assertFalse;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;
import java.util.Set;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;

import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.MetaRepositoryImpl;
import com.legacy.health.fhir.meta.repsitory.RepositoryBuilder;
import com.legacy.health.fhir.meta.repsitory.ZipSpecificationProvider;

public class SchemaControllerTest {
	MetaRepository repo = new MetaRepositoryImpl();
	ScriptEngineManager sem = new ScriptEngineManager();
	ScriptEngine engine = sem.getEngineByName("javascript");
	static Properties testProperties = new Properties();
	static ZipSpecificationProvider provider;

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		System.out.println("test");
		ClassLoader classLoader = SchemaControllerTest.class.getClassLoader();
		File file = new File(classLoader.getResource("test.properties").getFile());
		FileInputStream fis = new FileInputStream(file);
		testProperties.load(fis);
		File zipFile = new File(SchemaControllerTest.class.getClassLoader().getResource("spec.zip").getFile());
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
	public void testSchemaControllerWithFhirMedicationRequest() throws Exception {
		final SQLExecutor sql = new SQLExecutor();
		// sql.connect("127.0.0.1", 5432, "firstdb", "testuser", "abcd1234");
		sql.connect(testProperties);
		sql.executeDDL("DROP SCHEMA \"FHIR1\" CASCADE", true);
		sql.executeDDL("CREATE SCHEMA \"FHIR1\"", false);

		MetaRepository repo = RepositoryBuilder.createRepository(provider);
		// final SchemaControllerImpl controller = new SchemaControllerImpl("fhir1");
		StructureDefinition sd = repo.getStructureDefinitionById("MedicationRequest");
		RelationSchemaController controller = RelationSchemaController.createRelationSchemaController("fhir1",
				"org.hsqldb.jdbcDriver");
		controller.createSchema(sd);
		for (int c = 0; c < controller.getTables().size(); c++) {
			Table t = controller.getTables().get(c);
			sql.executeDDL(controller.getDDL(t), false);
		}
		sql.closeConnection();
	}

	@Test
	public void testSchemaControllerTableNameCreation() throws Exception {

		MetaRepository repo = RepositoryBuilder.createRepository(provider);

		RelationSchemaController controller = RelationSchemaController.createRelationSchemaController("fhir1",
				"org.hsqldb.jdbcDriver");
		HashMap<String, StructureDefinition> index = repo.getBaseResourceIndex();
		Set<String> keys = index.keySet();
		for (Iterator iterator = keys.iterator(); iterator.hasNext();) {
			String key = (String) iterator.next();
			StructureDefinition sd = repo.getStructureDefinitionById(key);
			if (sd.getId().equals(sd.getType())) {
				controller.createSchema(sd);
			}
		}
		ArrayList<String> list = new ArrayList<String>();
		for (int c = 0; c < controller.getTables().size(); c++) {
			Table t = controller.getTables().get(c);
			String name = t.getTableName();
			assertFalse(list.contains(name));
			list.add(name);

		}

	}

	@Test
	public void testSchemaControllerWithFhir() throws Exception {
		final SQLExecutor sql = new SQLExecutor();
		sql.connect(testProperties);
		sql.executeDDL("DROP SCHEMA \"FHIR1\" CASCADE", true);
		sql.executeDDL("CREATE SCHEMA \"FHIR1\"", false);

		MetaRepository repo = RepositoryBuilder.createRepository(provider);
		long start = System.currentTimeMillis();
		ObjectMapper mapper = new ObjectMapper();
		File file = new File(this.getClass().getClassLoader().getResource("testbundle.json").getFile());
		FileInputStream fis = new FileInputStream(file);

		JsonNode bundle = mapper.readTree(fis);
		JsonNode entries = bundle.get("entry");
		List<String> types = new ArrayList<String>();
		for (int e = 0; e < entries.size(); e++) {
			JsonNode entry = entries.get(e);
			JsonNode resource = entry.get("resource");
			String type = resource.get("resourceType").asText();
			if (!types.contains(type)) {
				types.add(type);

			}
		}
		types.add("AllergyIntolerance");
		for (int f = 0; f < types.size(); f++) {
			StructureDefinition sd = repo.getStructureDefinitionById(types.get(f));
			RelationSchemaController controller = RelationSchemaController.createRelationSchemaController("fhir1",
					"org.hsqldb.jdbcDriver");
			controller.createSchema(sd);
			for (int c = 0; c < controller.getTables().size(); c++) {
				Table t = controller.getTables().get(c);
				sql.executeDDL(controller.getDDL(t), false);
			}
		}
		long stop = System.currentTimeMillis();
		System.out.println(stop - start);
	}

}
