package com.legacy.health.fhir.meta.sql;

import java.io.File;

import com.legacy.health.fhir.meta.sql.queryengine.PreparedStatementValues;
import org.junit.BeforeClass;
import org.junit.Test;

import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.queryengine.Expression;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.queryengine.QueryBuilder;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.RepositoryBuilder;
import com.legacy.health.fhir.meta.repsitory.StructureConsumer;
import com.legacy.health.fhir.meta.repsitory.ZipSpecificationProvider;
import com.legacy.health.fhir.meta.sql.queryengine.SQLQuery;
import com.legacy.health.fhir.meta.sql.queryengine.SQLQueryEngine;
import com.legacy.health.fhir.meta.sql.queryengine.consumer.SQLQueryConsumer;

public class FlattenerQueriesTest implements SQLQueryConsumer {

	static MetaRepository repo;
	static QueryBuilder qb = new QueryBuilder();
	static RelationSchemaController controller;

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		File zipfile = new File(FlattenerQueriesTest.class.getClassLoader().getResource("spec.zip").getFile());
		ZipSpecificationProvider provider = new ZipSpecificationProvider();
		provider.setZipFilePath(zipfile);
		repo = RepositoryBuilder.createRepository(provider);
		qb.setMetaRepository(repo);
		controller = createSchemaController();
	}

	@Test
	public void testBasicFlattener() throws Exception {
		StructureDefinition sd = repo.getStructureDefinitionById("Patient");
		controller.createSchema(sd);
		Query query = qb.query("check").from(qb.from("Patient"));
		query.out(qb.out(sd, "Patient.address[0].city"));
		System.out.println(query.toJson());
		SQLQueryEngine engine = new SQLQueryEngine();
		engine.setSchemaControllerImpl(controller);
		engine.setSQLQueryConsumer(this);
		engine.execute(query, null, null);
	}

	@Test
	public void testPatientFlattener() throws Exception {
		StructureDefinition sd = repo.getStructureDefinitionById("Patient");
		controller.createSchema(sd);
		Query query = qb.query("check").from(qb.from("Patient"));
		query.out(qb.out(sd, "Patient.gender"));
		query.out(qb.out(sd, "Patient.birthDate"));
		query.out(qb.out(sd, "Patient.address[0].city"));
		query.out(qb.out(sd, "Patient.address[0].state"));
		query.out(qb.out(sd, "Patient.address[0].country"));
		SQLQueryEngine engine = new SQLQueryEngine();
		engine.setSchemaControllerImpl(controller);
		engine.setSQLQueryConsumer(this);
		engine.execute(query, null, null);
	}

	@Test
	public void testPatientObservationPatientFlattener() throws Exception {
		StructureDefinition patient = repo.getStructureDefinitionById("Patient");
		StructureDefinition observation = repo.getStructureDefinitionById("Observation");
		controller.createSchema(patient);
		controller.createSchema(observation);

		Query query = qb.query("check").from(qb.from("Patient"))
				.join(qb.join(observation, "Observation.subject.reference"));
		query.out(qb.out(patient, "Patient.id"));
		query.out(qb.out(patient, "Patient.gender"));
		query.out(qb.out(patient, "Patient.birthDate"));
		query.out(qb.out(patient, "Patient.address[0].city"));
		query.out(qb.out(patient, "Patient.address[0].state"));
		query.out(qb.out(patient, "Patient.address[0].country"));
		query.out(qb.out(observation, "Observation.code.coding[0].code"));
		query.out(qb.out(observation, "Observation.valueQuantity.value"));
		Expression heightFilterSmart = qb.eq(qb.out(observation, "Observation.code.text"),
				qb.string("height"));
		Expression heightFilterSynthea = qb.eq(qb.out(observation, "Observation.code.text"),
				qb.string("Body Height"));
		Expression heightFilter = qb.or(heightFilterSmart, heightFilterSynthea);
		Expression cityNotNullFilter = qb.isNotNull(qb.out(patient, "Patient.address.city"));
		query.filter(qb.and(heightFilter, cityNotNullFilter));

		System.out.println(query.toJson());
		SQLQueryEngine engine = new SQLQueryEngine();
		engine.setSchemaControllerImpl(controller);
		engine.setSQLQueryConsumer(this);
		engine.execute(query, null, null);
	}

	protected static RelationSchemaController createSchemaController() {
		RelationSchemaController controller = RelationSchemaController.createRelationSchemaController("smart",
				"org.hsqldb.jdbcDriver");
		controller.setSQLProviderFactory(new SQLProviderFactory());
		return controller;
	}

	@Override
	public void executeQuery(StructureDefinition targetType, Query query, SQLQuery sqlQuery, StructureConsumer consumer,
			SQLSchemaController schemaControl, SQLContext context) throws Exception {
		System.out.println(sqlQuery.getSQL(new PreparedStatementValues()));

	}

}
