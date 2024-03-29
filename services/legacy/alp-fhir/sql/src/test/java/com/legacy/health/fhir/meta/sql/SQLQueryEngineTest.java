package com.legacy.health.fhir.meta.sql;

import java.io.File;
import java.io.FileInputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.BeforeClass;
import org.junit.Test;

import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.entity.StructureDefinition;

import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.json.JSONDataProvider;
import com.legacy.health.fhir.meta.queryengine.Expression;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.queryengine.QueryBuilder;
import com.legacy.health.fhir.meta.queryengine.ResultElement;
import com.legacy.health.fhir.meta.queryengine.StringExpression;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.RepositoryBuilder;
import com.legacy.health.fhir.meta.repsitory.StructureConsumer;
import com.legacy.health.fhir.meta.repsitory.ZipSpecificationProvider;
import com.legacy.health.fhir.meta.sql.queryengine.SQLQueryEngine;

public class SQLQueryEngineTest {

	private static Log log = LogFactory.getLog(SQLQueryEngineTest.class);

	static MetaRepository repo;
	static Properties testProperties = new Properties();
	static SQLContext context = new SQLContext();
	static ZipSpecificationProvider provider;

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		log.info("test");
		ClassLoader classLoader = SQLQueryEngineTest.class.getClassLoader();
		File file = new File(classLoader.getResource("test.properties").getFile());
		FileInputStream fis = new FileInputStream(file);
		testProperties.load(fis);
		Connection connection = SQLConnector.connect(testProperties);
		context.connection(connection);
		File zipfile = new File(SQLQueryEngineTest.class.getClassLoader().getResource("spec.zip").getFile());
		provider = new ZipSpecificationProvider();
		provider.setZipFilePath(zipfile);

		repo = RepositoryBuilder.createRepository(provider);
		PrepareDataHelper helper = new PrepareDataHelper();
		RelationSchemaController controller = createSchemaController();
		helper.prepareData(connection, repo, controller);

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
		RelationSchemaController controller = createSchemaController();

		controller.createSchema(qb.sd("Patient"));
		controller.createSchema(qb.sd("Observation"));

		SQLQueryEngine engine = new SQLQueryEngine();

		// engine.setStructureProvider(jsonDataProvider);
		engine.setSchemaControllerImpl(controller);

		long start = System.currentTimeMillis();
		Query query = qb.query("TestPatientQuery").from(
				qb.from(qb.sd("Patient"))).out(qb.out(qb.sd("Patient"), "Patient.gender"));
		engine.execute(query, new StructureConsumer() {
			public void writeStructure(Structure structure, Context context) throws SQLException {
				log.info(structure.getDefinition().getId());
			}
		}, context);
		StructureDefinition observation = qb.sd("Observation");
		query = qb.query("TestObservationQuery").from(
				qb.from(observation)).out(qb.out(observation, "Observation.valueQuantity.value"))
				.out(qb.out(observation, "Observation.status"));

		engine.execute(query, new StructureConsumer() {
			public void writeStructure(Structure structure, Context context) throws SQLException {
				log.info(structure.getDefinition().getId());
			}
		}, context);
		long stop = System.currentTimeMillis();

		log.info("time taken: " + (stop - start));
	}

	protected static RelationSchemaController createSchemaController() {
		RelationSchemaController controller = RelationSchemaController.createRelationSchemaController("fhir1",
				"org.hsqldb.jdbcDriver");
		controller.setSQLProviderFactory(new SQLProviderFactory());
		return controller;
	}

	@Test
	public void testExpression() throws Exception {
		QueryBuilder qb = new QueryBuilder();
		qb.setMetaRepository(repo);

		JSONDataProvider jsonDataProvider = new JSONDataProvider();
		jsonDataProvider.setMetaRepository(repo);
		jsonDataProvider.allowAliases(true);
		File file = new File(this.getClass().getClassLoader().getResource("testbundle.json").getFile());
		jsonDataProvider.setPath(file.getAbsolutePath());
		RelationSchemaController controller = createSchemaController();

		controller.createSchema(qb.sd("Patient"));
		controller.createSchema(qb.sd("Observation"));

		SQLQueryEngine engine = new SQLQueryEngine();

		// engine.setStructureProvider(jsonDataProvider);
		engine.setSchemaControllerImpl(controller);
		Expression patientGender = qb.out(qb.sd("Patient"), "Patient.gender");
		long start = System.currentTimeMillis();

		Query query = qb.query("TestPatientQuery").from(
				qb.from(qb.sd("Patient"))).out(qb.out(qb.sd("Patient"), "Patient.gender"))
				.filter(qb.eq(patientGender, qb.string("male")));

		engine.execute(query, new StructureConsumer() {
			public void writeStructure(Structure structure, Context context) throws SQLException {
				// log.info(((ValueElement)structure.getElementByPath("TestPatientQuery.gender")).getValue());
				// log.info(structure.getDefinition().getId());
			}
		}, context);

		StructureDefinition observation = qb.sd("Observation");
		query = qb.query("TestObservationQuery").from(
				qb.from(observation)).out(qb.out(observation, "Observation.valueQuantity.value"))
				.out(qb.out(observation, "Observation.code.coding.display"))
				.filter(
						qb.eq(qb.out(observation, "Observation.code.coding.code"),
								qb.string("29463-7"))// weight
				);

		log.info(query.toJson());

		engine.execute(query, new StructureConsumer() {
			public void writeStructure(Structure structure, Context context) throws SQLException {
				log.info(structure.getDefinition().getId());
			}
		}, context);
		long stop = System.currentTimeMillis();

		log.info(stop - start);
	}

	@Test
	public void testNavigation() throws Exception {
		QueryBuilder qb = new QueryBuilder();
		qb.setMetaRepository(repo);

		JSONDataProvider jsonDataProvider = new JSONDataProvider();
		jsonDataProvider.setMetaRepository(repo);
		jsonDataProvider.allowAliases(true);
		File file = new File(this.getClass().getClassLoader().getResource("testbundle.json").getFile());
		jsonDataProvider.setPath(file.getAbsolutePath());
		RelationSchemaController controller = createSchemaController();

		controller.createSchema(qb.sd("Patient"));
		controller.createSchema(qb.sd("Observation"));

		SQLQueryEngine engine = new SQLQueryEngine();

		// engine.setStructureProvider(jsonDataProvider);
		engine.setSchemaControllerImpl(controller);
		long start = System.currentTimeMillis();

		StructureDefinition observation = qb.sd("Observation");
		StructureDefinition patient = qb.sd("Patient");
		ResultElement gender = qb.out(patient, "Patient.gender");
		ResultElement value = qb.out(observation, "Observation.valueQuantity.value");
		ResultElement display = qb.out(observation, "Observation.code.coding.display");
		ResultElement code = qb.out(observation, "Observation.code.coding.code");
		StringExpression weight = qb.string("29463-7");

		Query query = qb.query("TestObservationQuery")
				.from(qb.from(patient))
				.join(qb.join(observation, "Observation.subject.reference"))
				.out(display).out(value).out(gender)
				.filter(qb.eq(code, weight));

		log.info(query.toJson());

		engine.execute(query, new StructureConsumer() {
			public void writeStructure(Structure structure, Context context) throws SQLException {
				log.info(structure.getDefinition().getId());
			}
		}, context);
		long stop = System.currentTimeMillis();

		log.info(stop - start);
	}

	@Test
	public void testAggregation() throws Exception {
		QueryBuilder qb = new QueryBuilder();
		qb.setMetaRepository(repo);

		JSONDataProvider jsonDataProvider = new JSONDataProvider();
		jsonDataProvider.setMetaRepository(repo);
		jsonDataProvider.allowAliases(true);
		File file = new File(this.getClass().getClassLoader().getResource("testbundle.json").getFile());
		jsonDataProvider.setPath(file.getAbsolutePath());
		RelationSchemaController controller = createSchemaController();

		controller.createSchema(qb.sd("Patient"));
		controller.createSchema(qb.sd("Observation"));

		SQLQueryEngine engine = new SQLQueryEngine();
		engine.setSchemaControllerImpl(controller);
		long start = System.currentTimeMillis();

		StructureDefinition observation = qb.sd("Observation");
		StructureDefinition patient = qb.sd("Patient");
		ResultElement gender = qb.out(patient, "Patient.gender");
		ResultElement value = qb.out(observation, "Observation.valueQuantity.value");
		// ResultElement display =
		// qb.out(observation,"Observation.code.coding.display");
		ResultElement code = qb.out(observation, "Observation.code.coding.code");
		StringExpression weight = qb.string("29463-7");

		Query query = qb.query("TestObservationQuery")
				.from(qb.from(patient))
				.join(qb.join(observation, "Observation.subject.reference"))
				.out(gender)
				.out(qb.avg(value).label("AverageWeight"))
				.filter(qb.eq(code, weight))
				.groupBy(gender);

		log.info(query.toJson());

		engine.execute(query, new StructureConsumer() {
			public void writeStructure(Structure structure, Context context) throws SQLException {
				log.info(structure.getDefinition().getId());
			}
		}, context);
		long stop = System.currentTimeMillis();

		log.info(stop - start);
	}

	@Test
	public void testGetResourceType() throws Exception {
		QueryBuilder qb = new QueryBuilder();
		qb.setMetaRepository(repo);

		JSONDataProvider jsonDataProvider = new JSONDataProvider();
		jsonDataProvider.setMetaRepository(repo);
		jsonDataProvider.allowAliases(true);
		File file = new File(this.getClass().getClassLoader().getResource("testbundle.json").getFile());
		jsonDataProvider.setPath(file.getAbsolutePath());
		RelationSchemaController controller = RelationSchemaController.createRelationSchemaController("fhir1",
				"org.hsqldb.jdbcDriver");

		controller.createSchema(qb.sd("Patient"));

		SQLQueryEngine engine = new SQLQueryEngine();
		// engine.setStructureProvider(jsonDataProvider);
		engine.setSchemaControllerImpl(controller);

		StructureDefinition patient = qb.sd("Patient");
		ResultElement fullPatient = qb.out(patient);
		ResultElement gender = qb.out(patient, "Patient.gender");
		StringExpression male = qb.string("male");
		Query query = qb.query("TestObservationQuery")
				.from(qb.from(patient))
				.filter(qb.eq(gender, male))
				.out(fullPatient);

		log.info(query.toJson());
		long start = System.currentTimeMillis();
		engine.execute(query, new StructureConsumer() {
			public void writeStructure(Structure structure, Context context) throws SQLException {
				log.info(structure.getDefinition().getId());
			}
		}, context);
		long stop = System.currentTimeMillis();

		log.info(stop - start);
	}

	// @Test
	public void testSearchHumanName() throws Exception {
		QueryBuilder qb = new QueryBuilder();
		qb.setMetaRepository(repo);

		JSONDataProvider jsonDataProvider = new JSONDataProvider();
		jsonDataProvider.setMetaRepository(repo);
		jsonDataProvider.allowAliases(true);
		File file = new File(this.getClass().getClassLoader().getResource("testbundle.json").getFile());
		jsonDataProvider.setPath(file.getAbsolutePath());
		RelationSchemaController controller = RelationSchemaController.createRelationSchemaController("fhir1",
				"org.hsqldb.jdbcDriver");

		controller.createSchema(qb.sd("Patient"));

		SQLQueryEngine engine = new SQLQueryEngine();

		// engine.setStructureProvider(jsonDataProvider);
		engine.setSchemaControllerImpl(controller);

		StructureDefinition patient = qb.sd("Patient");
		ResultElement fullPatient = qb.out(patient);
		ResultElement name = qb.out(patient, "Patient.name");
		StringExpression nameVal = qb.string("Tatjana35");
		Query query = qb.query("TestObservationQuery")
				.from(qb.from(patient))
				.filter(qb.eq(name, nameVal))
				.out(fullPatient);

		log.info(query.toJson());
		long start = System.currentTimeMillis();
		engine.execute(query, new StructureConsumer() {
			public void writeStructure(Structure structure, Context context) throws SQLException {
				log.info(structure.getDefinition().getId());
			}
		}, context);
		long stop = System.currentTimeMillis();

		log.info(stop - start);
	}

}
