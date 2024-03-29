package com.legacy.health.fhir;

import java.io.File;
import java.util.HashMap;

import com.legacy.health.fhir.meta.sql.*;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import com.legacy.health.fhir.executor.SearchExecutor;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.queryengine.QueryBuilder;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.RepositoryBuilder;
import com.legacy.health.fhir.meta.repsitory.StructureConsumer;
import com.legacy.health.fhir.meta.repsitory.ZipSpecificationProvider;
import com.legacy.health.fhir.meta.sql.queryengine.SQLQuery;
import com.legacy.health.fhir.meta.sql.queryengine.SQLQueryEngine;
import com.legacy.health.fhir.meta.sql.queryengine.consumer.SQLQueryConsumer;

public class SearchTest implements SQLQueryConsumer {

	static MetaRepository repo;
	QueryBuilder qb = new QueryBuilder();
	static RelationSchemaController controller;

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		File zipfile = new File(SearchTest.class.getClassLoader().getResource("spec.zip").getFile());
		ZipSpecificationProvider provider = new ZipSpecificationProvider();
		provider.setZipFilePath(zipfile);
		repo = RepositoryBuilder.createRepository(provider);
		controller = createSchemaController();
	}

	@Before
	public void setUp() throws Exception {
	}

	@Test
	public void testSearchStringSimple() throws Exception {
		SearchExecutor searchExecutor = new SearchExecutor();
		HashMap<String, String[]> map = new HashMap<String, String[]>();
		String[] values = { "Test" };
		map.put("given", values);
		Query query = searchExecutor.doSearch("Patient", map, repo, false);
		SQLQueryEngine engine = new SQLQueryEngine();
		engine.setSchemaControllerImpl(controller);
		engine.setSQLQueryConsumer(this);
		engine.execute(query, null);
	}

	@Test
	public void testSearchStringSimpleLimit() throws Exception {
		SearchExecutor searchExecutor = new SearchExecutor();
		HashMap<String, String[]> map = new HashMap<String, String[]>();
		String[] values = { "Test" };
		map.put("given", values);
		Query query = searchExecutor.doSearch("Patient", map, repo, false);
		query.limit(qb.limit(10, 100));
		SQLQueryEngine engine = new SQLQueryEngine();
		engine.setSchemaControllerImpl(controller);
		engine.setSQLQueryConsumer(this);
		engine.execute(query, null);
	}

	@Test
	public void testTokenCodingSimple() throws Exception {
		SearchExecutor searchExecutor = new SearchExecutor();
		HashMap<String, String[]> map = new HashMap<String, String[]>();
		String[] values = { "Test" };
		map.put("class", values);
		Query query = searchExecutor.doSearch("Encounter", map, repo, false);
		SQLQueryEngine engine = new SQLQueryEngine();
		engine.setSchemaControllerImpl(controller);
		engine.setSQLQueryConsumer(this);
		engine.execute(query, null);
	}

	@Test
	public void testTokenIDSimple() throws Exception {
		SearchExecutor searchExecutor = new SearchExecutor();
		HashMap<String, String[]> map = new HashMap<String, String[]>();
		String[] values = { "Test" };
		map.put("_id", values);
		Query query = searchExecutor.doSearch("Patient", map, repo, false);
		SQLQueryEngine engine = new SQLQueryEngine();
		engine.setSchemaControllerImpl(controller);
		engine.setSQLQueryConsumer(this);
		engine.execute(query, null);
	}

	@Test
	public void testIncludeSimple() throws Exception {
		SearchExecutor searchExecutor = new SearchExecutor();
		HashMap<String, String[]> map = new HashMap<String, String[]>();
		String[] values = { "Observation:subject" };
		map.put("_include", values);
		Query query = searchExecutor.doSearch("Observation", map, repo, false);
		SQLQueryEngine engine = new SQLQueryEngine();
		engine.setSchemaControllerImpl(controller);
		engine.setSQLQueryConsumer(this);
		engine.execute(query, null, null);
	}

	@Test
	public void testTokenCodeableConceptComplex() throws Exception {
		SearchExecutor searchExecutor = new SearchExecutor();
		HashMap<String, String[]> map = new HashMap<String, String[]>();
		String[] values = { "http://snomed.info/sct|74400008" };
		map.put("reason", values);
		Query query = searchExecutor.doSearch("Encounter", map, repo, false);
		SQLQueryEngine engine = new SQLQueryEngine();
		engine.setSchemaControllerImpl(controller);
		engine.setSQLQueryConsumer(this);
		engine.execute(query, null);
	}

	@Test
	public void testReferenceSimple() throws Exception {
		SearchExecutor searchExecutor = new SearchExecutor();
		HashMap<String, String[]> map = new HashMap<String, String[]>();
		String[] reasonValues = { "urn:uuid:ee889657-efa7-482d-87bc-39d9e479995f" };
		map.put("patient", reasonValues);

		Query query = searchExecutor.doSearch("Observation", map, repo, false);
		SQLQueryEngine engine = new SQLQueryEngine();
		engine.setSchemaControllerImpl(controller);
		engine.setSQLQueryConsumer(this);
		engine.execute(query, null);
	}

	@Test
	public void testDate() throws Exception {
		SearchExecutor searchExecutor = new SearchExecutor();
		HashMap<String, String[]> map = new HashMap<String, String[]>();
		String[] reasonValues = { "gt1900-01-01" };
		map.put("_lastUpdated", reasonValues);

		Query query = searchExecutor.doSearch("Observation", map, repo, false);
		SQLQueryEngine engine = new SQLQueryEngine();
		engine.setSchemaControllerImpl(controller);
		engine.setSQLQueryConsumer(this);
		engine.execute(query, null);
	}

	@Test
	public void testTokenCombined() throws Exception {
		SearchExecutor searchExecutor = new SearchExecutor();
		HashMap<String, String[]> map = new HashMap<String, String[]>();
		String[] reasonValues = { "http://snomed.info/sct|74400008" };
		map.put("reason", reasonValues);
		String[] classValues = { "Test" };
		map.put("class", classValues);

		Query query = searchExecutor.doSearch("Encounter", map, repo, false);
		SQLQueryEngine engine = new SQLQueryEngine();
		engine.setSchemaControllerImpl(controller);
		engine.setSQLQueryConsumer(this);
		engine.execute(query, null);
	}

	@Test
	public void testSearchAll() throws Exception {
		SearchExecutor searchExecutor = new SearchExecutor();
		HashMap<String, String[]> map = new HashMap<String, String[]>();
		Query query = searchExecutor.doSearch("Patient", map, repo, false);
		SQLQueryEngine engine = new SQLQueryEngine();
		engine.setSchemaControllerImpl(controller);
		engine.setSQLQueryConsumer(this);
		engine.execute(query, null);
	}

	@Test
	public void testSearchAllSorted() throws Exception {
		SearchExecutor searchExecutor = new SearchExecutor();
		HashMap<String, String[]> map = new HashMap<String, String[]>();
		String[] val = { "given" };
		map.put("_sort", val);
		Query query = searchExecutor.doSearch("Patient", map, repo, false);
		SQLQueryEngine engine = new SQLQueryEngine();
		engine.setSchemaControllerImpl(controller);
		engine.setSQLQueryConsumer(this);
		engine.execute(query, null);
	}

	protected static RelationSchemaController createSchemaController() {
		RelationSchemaController controller = RelationSchemaController.createRelationSchemaController("fhir1",
				"org.hsqldb.jdbcDriver");
		// controller.setSQLProviderFactory(new SQLProviderFactory());
		return controller;
	}

	@Override
	public void executeQuery(StructureDefinition targetType, Query query, SQLQuery sqlQuery, StructureConsumer consumer,
			SQLSchemaController schemaControl, SQLContext context) throws Exception {
		System.out.println(sqlQuery.getSQL(null));

	}

}
