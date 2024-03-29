package com.legacy.health.fhir.meta.hana;

import java.io.File;
import java.io.FileInputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;

import org.junit.BeforeClass;
import org.junit.Test;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legacy.health.fhir.meta.map.StructureMap;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.sql.RelationSchemaController;
import com.legacy.health.fhir.meta.sql.SQLConnector;
import com.legacy.health.fhir.meta.sql.SQLContext;
import com.legacy.health.fhir.meta.sql.util.DefaultTable2StructureDefinition;

public class Table2StructureDefinitionTest {

	static ObjectMapper mapper = new ObjectMapper();
	static MetaRepository repo;
	static Properties testProperties = new Properties();

	static SQLContext context = new SQLContext();
	static StructureMap map;

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		System.out.println("test");
		ClassLoader classLoader = Table2StructureDefinitionTest.class.getClassLoader();
		File file = new File(classLoader.getResource("test.properties").getFile());
		FileInputStream fis = new FileInputStream(file);
		testProperties.load(fis);
		Connection connection = SQLConnector.connect(testProperties);
		context.connection(connection);
		RelationSchemaController helper = RelationSchemaController.createRelationSchemaController("FHIR1",
				testProperties.getProperty("datasource.driver"));
		helper.setMetaRepository(repo);
		context.setController(helper);

	}

	@Test
	public void testPatients() throws SQLException {
		DefaultTable2StructureDefinition testee = new DefaultTable2StructureDefinition();
		JsonNode resource = testee.getStructureDefinition(context, "MIMIC_PATIENTS",
				"http://data4life.care/health/fhir/StructureDefinition/MIMIC_PATIENTS", "MIMICIII", "PATIENTS");
		System.out.println(resource);
	}

	@Test
	public void testAdmissions() throws SQLException {

		DefaultTable2StructureDefinition testee = new DefaultTable2StructureDefinition();
		JsonNode resource = testee.getStructureDefinition(context, "MIMIC_ADMISSIONS",
				"http://data4life.care/health/fhir/StructureDefinition/MIMIC_ADMISSIONS", "MIMICIII", "ADMISSIONS");
		System.out.println(resource);
	}

	@Test
	public void testLabEvents() throws SQLException {
		DefaultTable2StructureDefinition testee = new DefaultTable2StructureDefinition();
		JsonNode resource = testee.getStructureDefinition(context, "MIMIC_LABEVENTS",
				"http://data4life.care/health/fhir/StructureDefinition/MIMIC_LABEVENTS", "MIMICIII", "LABEVENTS");
		System.out.println(resource);
	}

	@Test
	public void testISH() throws SQLException {
		DefaultTable2StructureDefinition testee = new DefaultTable2StructureDefinition();
		JsonNode resource = testee.getStructureDefinition(context, "ISH_PATIENTS",
				"http://data4life.care/health/fhir/StructureDefinition/ISH_PATIENTS", "FHIR",
				"legacy.plugins.ish.db.models::Stage.Patient");
		System.out.println(resource);
		resource = testee.getStructureDefinition(context, "ISH_DIAGNOSIS",
				"http://data4life.care/health/fhir/StructureDefinition/ISH_DIAGNOSIS", "FHIR",
				"legacy.plugins.ish.db.models::Stage.Diagnosis");
		System.out.println(resource);
		resource = testee.getStructureDefinition(context, "ISH_PROCEDURE",
				"http://data4life.care/health/fhir/StructureDefinition/ISH_PROCEDURE", "FHIR",
				"legacy.plugins.ish.db.models::Stage.Procedure");
		System.out.println(resource);
		resource = testee.getStructureDefinition(context, "ISH_STAY",
				"http://data4life.care/health/fhir/StructureDefinition/ISH_STAY", "FHIR",
				"legacy.plugins.ish.db.models::Stage.Stay");
		System.out.println(resource);
		resource = testee.getStructureDefinition(context, "ISH_DRG",
				"http://data4life.care/health/fhir/StructureDefinition/ISH_DRG", "FHIR",
				"legacy.plugins.ish.db.models::Stage.DRG");
		System.out.println(resource);
		resource = testee.getStructureDefinition(context, "ISH_CaseIn",
				"http://data4life.care/health/fhir/StructureDefinition/ISH_CaseIn", "FHIR",
				"legacy.plugins.ish.db.models::Stage.CaseIn");
		System.out.println(resource);
	}

	@Test
	public void testHCIM() throws SQLException {
		DefaultTable2StructureDefinition testee = new DefaultTable2StructureDefinition();
		JsonNode resource = testee.getStructureDefinition(context, "HCIM_PATIENT",
				"http://data4life.care/health/fhir/StructureDefinition/HCIM_PATIENT", "HCIM", "HCIM_PATIENT");
		System.out.println(resource);
		resource = testee.getStructureDefinition(context, "HCIM_PATIENT_ADDRESS_INFORMATION",
				"http://data4life.care/health/fhir/StructureDefinition/HCIM_PATIENT_ADDRESS_INFORMATION", "HCIM",
				"HCIM_PATIENT_ADDRESS_INFORMATION");
		System.out.println(resource);
		resource = testee.getStructureDefinition(context, "HCIM_PATIENT_NAME_INFORMATION",
				"http://data4life.care/health/fhir/StructureDefinition/HCIM_PATIENT_NAME_INFORMATION", "HCIM",
				"HCIM_PATIENT_NAME_INFORMATION");
		System.out.println(resource);
		resource = testee.getStructureDefinition(context, "HCIM_PATIENT_IDENTIFICATION",
				"http://data4life.care/health/fhir/StructureDefinition/HCIM_PATIENT_IDENTIFICATION", "HCIM",
				"HCIM_PATIENT_IDENTIFICATION");
		System.out.println(resource);
	}

	@Test
	public void testFHIRGZ() throws Exception {
		DefaultTable2StructureDefinition testee = new DefaultTable2StructureDefinition();
		JsonNode resource = testee.getStructureDefinition(context, "HCIM_PATIENT",
				"http://data4life.care/health/fhir/StructureDefinition/HCIM_PATIENT", "FHIRGZ", "Patient");
		System.out.println(resource);
	}
}
