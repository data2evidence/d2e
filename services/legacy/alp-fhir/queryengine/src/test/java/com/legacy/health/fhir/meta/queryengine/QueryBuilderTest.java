package com.legacy.health.fhir.meta.queryengine;

import static org.junit.Assert.*;

import java.io.File;
import java.io.FileInputStream;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.junit.Before;
import org.junit.Test;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.DataElementStructureLink;
import com.legacy.health.fhir.meta.instance.Element;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.instance.ValueElement;
import com.legacy.health.fhir.meta.json.JSONDataProvider;
import com.legacy.health.fhir.meta.queryengine.impl.DefaultQueryEngine;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.RepositoryBuilder;
import com.legacy.health.fhir.meta.repsitory.StructureConsumer;
import com.legacy.health.fhir.meta.repsitory.ZipSpecificationProvider;

public class QueryBuilderTest {

	MetaRepository repo;

	@Before
	public void setUp() throws Exception {
		File zipfile = new File(this.getClass().getClassLoader().getResource("spec.zip").getFile());
		ZipSpecificationProvider provider = new ZipSpecificationProvider();
		provider.setZipFilePath(zipfile);

		repo = RepositoryBuilder.createRepository(provider);
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
	}

	@Test
	public void testQueries() throws Exception {
		QueryBuilder qb = new QueryBuilder();
		qb.setMetaRepository(repo);

		JSONDataProvider jsonDataProvider = new JSONDataProvider();
		jsonDataProvider.setMetaRepository(repo);
		jsonDataProvider.allowAliases(true);
		File file = new File(this.getClass().getClassLoader().getResource("testbundle.json").getFile());
		jsonDataProvider.setPath(file.getAbsolutePath());

		DefaultQueryEngine engine = new DefaultQueryEngine();
		engine.setStructureProvider(jsonDataProvider);
		Query query = qb.query("TestQuery").from(
				qb.from(qb.sd("Observation"))).out(qb.out(qb.sd("Observation"), "Observation.valueQuantity.value"))
				.out(qb.out(qb.sd("Observation"), qb.de("Observation.status")));
		JsonNode qjson = query.toJson();
		Query query2 = (Query) qb.fromJson(qjson);
		assertEquals("Observation", query2.from().getStructureDefinition().getId());
		long start = System.currentTimeMillis();
		engine.execute(query, new StructureConsumer() {
			public void writeStructure(Structure structure, Context context) throws SQLException {
				System.out.println(structure.getDefinition().getId());
				for (Iterator<Element> iterator = structure.getElements().iterator(); iterator.hasNext();) {
					Element type = iterator.next();
					if (type instanceof ValueElement) {
						System.out.println(type.getPath() + ":" + ((ValueElement) type).getValue());
					}
				}
			}
		}, null);
		long stop = System.currentTimeMillis();

		System.out.println(stop - start);

	}

	/**
	 * Tests mainly the positive cases of the QueryBuilder
	 */
	@Test
	public void positiveQueryBuilderTest() {
		QueryBuilder qb = new QueryBuilder();
		qb.setMetaRepository(repo);
		Query query = qb.query("TestQuery");
		Limit l1 = qb.limit(100);
		assertEquals(new Integer(100), l1.limit());
		assertNull(l1.offset());
		Limit l2 = qb.limit(50, 10);
		assertEquals(new Integer(50), l2.limit());
		assertEquals(new Integer(10), l2.offset());
		query.limit(l2);
		assertEquals(l2, query.limit());
		From from = qb.from("Patient");
		assertEquals("Patient", from.getStructureDefinition().getId());
		From from2 = qb.from(qb.sd("Patient"));
		assertEquals("Patient", from2.getStructureDefinition().getId());
		query.from(from);
		assertEquals(from, query.from());
		ResultElement re = qb.out(qb.sd("Patient"), "Patient.gender");
		re.getDataElements();
		assertEquals("gender", re.getDataElement().getShortName());
		ResultElement re2 = qb.out(qb.sd("Observation"), "Observation.valueQuantity.value");
		ResultElement re3 = qb.out("Observation", "Observation.category.coding.code");
		ResultElement re4 = qb.out(qb.sd("Observation"), "Observation.valueQuantity");
		re4.getDataElements();
		re4.getQuantityUnitLink();
		re4.getQuantityValueLink();
		DataElement de = qb.de("Observation.code");
		qb.out(qb.sd("Observation"), de);
		assertEquals("code", de.getShortName());
		query.out(re).out(re2).out(re3);
		// Join join = qb.join(qb.sd("Observation"),
		// qb.out("Observation","Observation.subject.reference"));
		Join join2 = qb.join(qb.sd("Observation"), "Observation.subject.reference");
		Join join = join2;
		query.join(join);
		Expression expr = qb.eq(re2, qb.integer(10));
		query.filter(expr);
		Sort sort = qb.sort(re, true);
		assertTrue(sort.isDescending());
		Sort sort2 = qb.sort(re2, false);
		query.groupBy(re3);
		assertFalse(sort2.isDescending());
		query.sortBy(sort2);
		JsonNode qjson = query.toJson();
		JsonNode cmp = qb.fromJson(qjson).toJson();
		query.getQueryElements();
		// query.getResultDefinition(); fails
		assertEquals(qjson, cmp);
		assertEquals(">", qb.mapOperation("gt"));
		assertEquals("=", qb.mapOperation("eq"));
		assertEquals("<", qb.mapOperation("lt"));
		assertEquals("<=", qb.mapOperation("le"));
		Expression expr2 = qb.isNotNull(qb.out("Observation", "Observation.subject.reference"));
		expr2.getQueryElements();
		assertEquals(expr2.toJson(), qb.fromJson(expr2.toJson()).toJson());
	}

	@Test
	public void testExpressions() throws Exception {
		QueryBuilder qb = new QueryBuilder();
		qb.setMetaRepository(repo);
		Query query = qb.query("TestQuery");
		DataElementStructureLink desl = repo.getElementByPath(qb.sd("Observation"), "Observation.category");
		TokenSearchExpression tks = qb.searchToken(qb.out(qb.sd("Observation"), desl.getDataElement()),
				"http://test.com", "1234");
		tks.getDataElements();
		tks = qb.searchToken(qb.out(qb.sd("Observation"), desl.getDataElement()), null, "1234");
		tks.getDataElements();
		tks = qb.searchToken(qb.out(qb.sd("Observation"), "Observation.category"), "http://test.com", null);
		tks.getDataElements();
		JsonNode qjson = tks.toJson();
		assertEquals(qjson, qb.fromJson(qjson).toJson());
		Interval iv = qb.interval(qb.integer(1), qb.integer(100));
		iv.lowClosed().highClosed();
		iv.getDataElements();
		assertEquals(iv.toJson(), qb.fromJson(iv.toJson()).toJson());
		QuantitySearchExpression qse = qb.searchQuantity(qb.out(qb.sd("Observation"), "Observation.valueQuantity"),
				"http://test.com", "weight", 123.0, "kg", "gt");
		qse.getDataElements();
		// json handling of QuantitySearchExpression missing
	}

}
