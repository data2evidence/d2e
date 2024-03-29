package com.legacy.health.fhir.meta.sql.util;

import java.io.File;
import java.io.FileInputStream;
import java.sql.Connection;
import java.util.Properties;

import org.junit.BeforeClass;
import org.junit.Test;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.legacy.health.fhir.meta.map.StructureMap;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.sql.SQLConnector;
import com.legacy.health.fhir.meta.sql.SQLContext;
import com.legacy.health.fhir.meta.sql.SQLQueryEngineTest;

public class Table2StructureDefinitionTest {

	static ObjectMapper mapper = new ObjectMapper();
	static MetaRepository repo;
	static Properties testProperties = new Properties();

	static SQLContext context = new SQLContext();
	static StructureMap map;

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		System.out.println("test");
		ClassLoader classLoader = SQLQueryEngineTest.class.getClassLoader();
		File file = new File(classLoader.getResource("test.properties").getFile());
		FileInputStream fis = new FileInputStream(file);
		testProperties.load(fis);
		Connection connection = SQLConnector.connect(testProperties);
		context.connection(connection);

	}

	@Test
	public void testPatients() {
		// DefaultTable2StructureDefinition testee = new
		// DefaultTable2StructureDefinition();
		// JsonNode resource =
		// testee.getStructureDefinition(context,"MIMIC_PATIENTS","http://data4life.care/health/fhir/StructureDefinition/MIMIC_PATIENTS",
		// "MIMIC", "PATIENTS");
		// System.out.println(resource);
	}

}
