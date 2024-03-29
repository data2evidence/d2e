package com.legacy.health.fhir.meta.sql;

import java.io.File;
import java.io.FileInputStream;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.json.JSONDataProvider;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;

public class PrepareDataHelper {

	public void prepareData(Connection connection, MetaRepository repo, RelationSchemaController controller)
			throws FhirException, Exception {
		controller.setMetaRepository(repo);
		controller.initializeDatabase(connection);
		final SQLExecutor sql = new SQLExecutor();
		sql.connect(connection);
		/*
		 * sql.executeDDL("DROP SCHEMA \"FHIR1\" CASCADE", true);
		 * sql.executeDDL("CREATE SCHEMA \"FHIR1\"",false);
		 */
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
			// connection.getMetaData().getDriverName()
			RelationSchemaController controller2 = RelationSchemaController.createRelationSchemaController("fhir1",
					"org.hsqldb.jdbcDriver");
			controller2.setSQLProviderFactory(new SQLProviderFactory());
			controller2.createSchema(sd);
			for (int c = 0; c < controller2.getTables().size(); c++) {
				Table t = controller2.getTables().get(c);
				sql.executeDDL(controller2.getDDL(t), false);
			}
		}
		JSONDataProvider jsonDataProvider = new JSONDataProvider();
		jsonDataProvider.setMetaRepository(repo);
		jsonDataProvider.allowAliases(true);
		// jsonDataProvider.setMapping(repo.getMappingForVersion("1.8.0"));

		SQLDataConsumer sqlDataConsumer = new SQLDataConsumer();
		jsonDataProvider.setStructureConsumer(sqlDataConsumer);
		sqlDataConsumer.setMetaRepository(repo);
		sqlDataConsumer.setSchema("fhir1");

		SQLContext context = new SQLContext().connection(connection);
		jsonDataProvider.setPath(file.getAbsolutePath());
		jsonDataProvider.provideStructures(context);
		sqlDataConsumer.flushData();
	}

	public void prepareData(Properties testProperties, MetaRepository repo, RelationSchemaController controller)
			throws FhirException, Exception {
		Connection connection = SQLConnector.connect(testProperties);
		this.prepareData(connection, repo, controller);
		connection.close();
	}

}
