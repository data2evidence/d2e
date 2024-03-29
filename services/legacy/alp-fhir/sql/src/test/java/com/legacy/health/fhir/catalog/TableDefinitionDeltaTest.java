package com.legacy.health.fhir.catalog;

import static org.junit.Assert.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;

import org.junit.BeforeClass;
import org.junit.Test;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legacy.health.fhir.content.TabledefinitionDeltaHandler;
import com.legacy.health.fhir.content.TabledefinitionDeltaHandler.Delta;
import com.legacy.health.fhir.content.TabledefinitionDeserializer;
import com.legacy.health.fhir.content.model.Tabledefinition;

public class TableDefinitionDeltaTest {

	static ObjectMapper mapper = new ObjectMapper();

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {

	}

	@Test
	public void test() throws IOException {
		Tabledefinition td1 = this.getTableDefinition("catalog/HCIMPatient.json");
		Tabledefinition td2 = this.getTableDefinition("catalog/HCIMPatient2.json");
		Tabledefinition td3 = this.getTableDefinition("catalog/HCIMPatient3.json");
		TabledefinitionDeltaHandler deltaHandler = new TabledefinitionDeltaHandler();
		assertEquals(0, deltaHandler.getDeltas(td1, td1).size());
		List<Delta> delta = deltaHandler.getDeltas(td2, td1);
		assertEquals(1, delta.size());
		delta = deltaHandler.getDeltas(td3, td2);
		assertEquals(1, delta.size());

	}

	protected Tabledefinition getTableDefinition(String path) throws IOException {
		File file = new File(this.getClass().getClassLoader().getResource(path).getFile());
		FileInputStream fis = new FileInputStream(file);
		JsonNode p1 = mapper.readTree(fis);
		Tabledefinition td1 = TabledefinitionDeserializer.deserializeDefinition(new Tabledefinition(), p1);
		td1.setResolved();
		return td1;
	}

}
