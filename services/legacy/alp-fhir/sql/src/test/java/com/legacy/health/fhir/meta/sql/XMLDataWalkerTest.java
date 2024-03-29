package com.legacy.health.fhir.meta.sql;

import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMResult;
import javax.xml.transform.stream.StreamSource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.queryengine.QueryBuilder;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.RepositoryBuilder;
import com.legacy.health.fhir.meta.repsitory.StructureConsumer;
import com.legacy.health.fhir.meta.repsitory.ZipSpecificationProvider;
import com.legacy.health.fhir.meta.sql.queryengine.SQLQueryEngine;
import com.legacy.health.fhir.meta.xml.XMLDataProvider;

public class XMLDataWalkerTest {

	private static Log log = LogFactory.getLog(XMLDataWalkerTest.class);

	static Properties testProperties = new Properties();
	static ZipSpecificationProvider provider;

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		/*
		 * System.out.println("test");
		 * ClassLoader classLoader = SchemaControllerTest.class.getClassLoader();
		 * File file = new File(classLoader.getResource("test.properties").getFile());
		 * FileInputStream fis = new FileInputStream(file);
		 * testProperties.load(fis);
		 * File zipFile = new
		 * File(SchemaControllerTest.class.getClassLoader().getResource("spec.zip").
		 * getFile());
		 * provider = new ZipSpecificationProvider();
		 * provider.setZipFilePath(zipFile);
		 */

		log.info("test");
		ClassLoader classLoader = SchemaControllerTest.class.getClassLoader();
		File file = new File(classLoader.getResource("test.properties").getFile());
		FileInputStream fis = new FileInputStream(file);
		testProperties.load(fis);
		File zipFile = new File(SchemaControllerTest.class.getClassLoader().getResource("spec.zip").getFile());
		provider = new ZipSpecificationProvider();
		provider.setZipFilePath(zipFile);
	}

	@Before
	public void setUp() throws Exception {
		/*
		 * final SQLExecutor sql = new SQLExecutor();
		 * sql.connect(testProperties);
		 */

		final SQLExecutor sql = new SQLExecutor();
		sql.connect(testProperties);
		// sql.executeDDL("DROP SCHEMA \"FHIR1\" CASCADE", true);
		// sql.executeDDL("CREATE SCHEMA \"FHIR1\"",false);
		File zipFile = new File(SchemaControllerTest.class.getClassLoader().getResource("spec.zip").getFile());
		provider = new ZipSpecificationProvider();
		provider.setZipFilePath(zipFile);
		MetaRepository repo = RepositoryBuilder.createRepository(provider);
		long start = System.currentTimeMillis();
		ObjectMapper mapper = new ObjectMapper();
		File file = new File(this.getClass().getClassLoader().getResource("testbundle.json").getFile());
		FileInputStream fis = new FileInputStream(file);

		RelationSchemaController helper = RelationSchemaController.createRelationSchemaController("fhirxml",
				"org.hsqldb.jdbcDriver");
		helper.setMetaRepository(repo);
		helper.initializeDatabase(sql.connect());

		List<String> types = new ArrayList<String>();
		types.add("Patient");
		types.add("MedicationAdministration");
		types.add("Encounter");
		types.add("Procedure");
		types.add("Condition");

		for (int f = 0; f < types.size(); f++) {
			StructureDefinition sd = repo.getStructureDefinitionById(types.get(f));
			RelationSchemaController controller = RelationSchemaController.createRelationSchemaController("fhirxml",
					"org.hsqldb.jdbcDriver");
			controller.createSchema(sd);
			for (int c = 0; c < controller.getTables().size(); c++) {
				Table t = controller.getTables().get(c);
				sql.executeDDL(controller.getDDL(t), false);
			}
		}
	}

	public Connection connect(Properties properties) throws FhirException {
		try {
			Class.forName(properties.getProperty("datasource.driver"));
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		String url = properties.getProperty("datasource.url");
		try {
			Connection con = DriverManager.getConnection(url, properties.getProperty("datasource.username"),
					properties.getProperty("datasource.password"));
			return con;
		} catch (SQLException e) {
			throw new FhirException("Error while connecting to database", e);
		}
	}

	@Test
	public void testBundleElement() throws Exception {
		long start = System.currentTimeMillis();
		MetaRepository repo = RepositoryBuilder.createRepository(provider);

		XMLDataProvider xmlDataProvider = new XMLDataProvider();
		xmlDataProvider.setMetaRepository(repo);
		xmlDataProvider.allowAliases(true);
		// jsonDataProvider.setMapping(repo.getMappingForVersion("1.8.0"));

		SQLDataConsumer sqlDataConsumer = new SQLDataConsumer();
		xmlDataProvider.setStructureConsumer(sqlDataConsumer);
		sqlDataConsumer.setMetaRepository(repo);
		sqlDataConsumer.setSchema("fhirxml");
		sqlDataConsumer.setIdPrefix("");
		Connection con = connect(testProperties);
		// con.setAutoCommit(false);

		SQLContext context = new SQLContext().connection(con);

		File file = new File(this.getClass().getClassLoader().getResource("testbundle.xml").getFile());
		xmlDataProvider.setPath(file.getAbsolutePath());
		xmlDataProvider.provideStructures(context);
		sqlDataConsumer.flushData();
		long stop = System.currentTimeMillis();
		System.out.println(stop - start);
		con.commit();
		con.close();

	}

	// @Test
	public void testWalkandTransform() throws Exception {

		MetaRepository repo = RepositoryBuilder.createRepository(provider);

		XMLDataProvider xmlDataProvider = new XMLDataProvider();
		xmlDataProvider.setMetaRepository(repo);
		xmlDataProvider.allowAliases(true);
		// jsonDataProvider.setMapping(repo.getMappingForVersion("1.8.0"));

		SQLDataConsumer sqlDataConsumer = new SQLDataConsumer();
		xmlDataProvider.setStructureConsumer(sqlDataConsumer);
		sqlDataConsumer.setMetaRepository(repo);
		sqlDataConsumer.setSchema("fhirxml");
		Connection con = connect(testProperties);
		con.setAutoCommit(false);
		long start = System.currentTimeMillis();
		File transform = new File(this.getClass().getClassLoader().getResource("transform.xslt").getFile());
		TransformerFactory factory = TransformerFactory.newInstance();
		Source xslt = new StreamSource(transform);

		Transformer transformer = factory.newTransformer(xslt);
		String path = "./src/test/resources/XMLWalker";
		Files.walk(Paths.get(path)).forEach(filePath -> {
			File source = filePath.toFile();
			if (source.isDirectory())
				return;
			Source text = new StreamSource(source);
			DOMResult result = new DOMResult();
			try {
				transformer.transform(text, result);
				Document resultDoc = (Document) result.getNode();
				Element root = resultDoc.getDocumentElement();
				xmlDataProvider.provideStructures(root, true, null);
			} catch (Exception e) {
				System.out.println(filePath.toString());
				e.printStackTrace();
			}
		});

		sqlDataConsumer.flushData();
		long stop = System.currentTimeMillis();
		System.out.println(stop - start);
		con.commit();
		con.close();
		testQueryExecution(repo);

	}

	protected void testQueryExecution(MetaRepository repo) throws Exception {
		QueryBuilder qb = new QueryBuilder();
		qb.setMetaRepository(repo);
		RelationSchemaController controller = RelationSchemaController.createRelationSchemaController("fhirxml",
				"org.hsqldb.jdbcDriver");

		controller.createSchema(qb.sd("Patient"));
		// controller.createSchema(qb.sd("Observation"));

		SQLQueryEngine engine = new SQLQueryEngine();

		// engine.setStructureProvider(jsonDataProvider);
		engine.setSchemaControllerImpl(controller);

		long start = System.currentTimeMillis();
		Query query = qb.query("TestPatientQuery").from(
				qb.from(qb.sd("Patient"))).out(qb.out(qb.sd("Patient"), qb.de("Patient.gender")));
		engine.execute(query, new StructureConsumer() {
			public void writeStructure(Structure structure, Context context) throws SQLException {
				// System.out.println(structure.getDefinition().getId());
			}
		}, null);
	}

}
