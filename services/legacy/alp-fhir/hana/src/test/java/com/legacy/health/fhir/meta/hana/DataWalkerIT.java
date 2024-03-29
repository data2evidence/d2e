package com.legacy.health.fhir.meta.hana;

import java.io.File;
import java.io.FileInputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import com.legacy.health.fhir.meta.sql.*;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.json.JSONDataProvider;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.RepositoryBuilder;
import com.legacy.health.fhir.meta.repsitory.ZipSpecificationProvider;

public class DataWalkerIT {

	static Properties testProperties = new Properties();
	static ZipSpecificationProvider provider;

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		System.out.println("test");
		ClassLoader classLoader = DataWalkerIT.class.getClassLoader();
		File file = new File(classLoader.getResource("test.properties").getFile());
		FileInputStream fis = new FileInputStream(file);
		testProperties.load(fis);
		File zipFile = new File(DataWalkerIT.class.getClassLoader().getResource("spec.zip").getFile());
		provider = new ZipSpecificationProvider();
		provider.setZipFilePath(zipFile);
	}

	@Before
	public void setUp() throws Exception {
		MetaRepository repo = RepositoryBuilder.createRepository(provider);
		RelationSchemaController prep = RelationSchemaController.createRelationSchemaController("fhir1",
				testProperties.getProperty("datasource.driver"));
		prep.setMetaRepository(repo);
		prep.setSQLProviderFactory(new HanaSQLProviderFactory());
		prep.initializeDatabase(testProperties);
		final SQLExecutor sql = new SQLExecutor();
		sql.connect(testProperties);
		/*
		 * sql.executeDDL("DROP SCHEMA \"FHIR1\" CASCADE", true);
		 * sql.executeDDL("CREATE SCHEMA \"FHIR1\"",false);
		 */

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
					testProperties.getProperty("datasource.driver"));
			controller.setSQLProviderFactory(new HanaSQLProviderFactory());
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

		JSONDataProvider jsonDataProvider = new JSONDataProvider();
		jsonDataProvider.setMetaRepository(repo);
		jsonDataProvider.allowAliases(true);
		// jsonDataProvider.setMapping(repo.getMappingForVersion("1.8.0"));

		SQLDataConsumer sqlDataConsumer = new SQLDataConsumer();
		jsonDataProvider.setStructureConsumer(sqlDataConsumer);
		sqlDataConsumer.setMetaRepository(repo);
		sqlDataConsumer.setSchema("fhir1");
		Connection con = connect(testProperties);
		con.setAutoCommit(false);
		SQLContext context = new SQLContext().connection(con);
		File file = new File(this.getClass().getClassLoader().getResource("testbundle.json").getFile());
		jsonDataProvider.setPath(file.getAbsolutePath());
		jsonDataProvider.provideStructures(context);
		sqlDataConsumer.flushData();
		long stop = System.currentTimeMillis();
		System.out.println(stop - start);
		con.commit();
		con.close();

	}
}
