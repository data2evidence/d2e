package com.legacy.health.fhir.catalog;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.junit.BeforeClass;
import org.junit.Test;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.legacy.health.fhir.content.ClassGeneratorTest;
import com.legacy.health.fhir.content.ContentRepositoryTest;
import com.legacy.health.fhir.content.model.CatalogDefinition;
import com.legacy.health.fhir.content.model.CatalogDefinition.Table;
import com.legacy.health.fhir.content.model.Tabledefinition;
import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.RequestContext;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.json.JSONWalker;
import com.legacy.health.fhir.meta.repsitory.FolderStructureDefinitionProvider;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.RepositoryBuilder;
import com.legacy.health.fhir.meta.repsitory.StructureConsumer;
import com.legacy.health.fhir.meta.repsitory.ZipSpecificationProvider;
import com.legacy.health.fhir.meta.sql.GenericFHIRResoureRepository;
import com.legacy.health.fhir.meta.sql.SQLExecutor;
import com.legacy.health.fhir.meta.sql.catalog.CatalogMappingRenderer;

public class CatalogMappingTest implements StructureConsumer {

	private static String SCHEMA = "CONFIG_TEST";
	private static String TEST_CONNECTION_FILENAME = "test.properties";
	static ObjectMapper mapper = new ObjectMapper();
	static MetaRepository repo;
	private static GenericFHIRResoureRepository fhirResourceImpl = null;
	private static RequestContext requestCtx;
	private static CatalogDefinition catalog;
	private static MockContentRepository cRepo = new MockContentRepository();

	static JsonNode content;

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		final SQLExecutor sql = new SQLExecutor();
		// sql.connect("127.0.0.1", 5432, "firstdb", "testuser", "abcd1234");

		ClassLoader classLoader = ClassGeneratorTest.class.getClassLoader();
		File zipfile = new File(classLoader.getResource("spec.zip").getFile());
		ZipSpecificationProvider provider = new ZipSpecificationProvider();
		provider.setZipFilePath(zipfile);
		repo = RepositoryBuilder.createRepository(provider);
		String fileCtx = classLoader.getResource("content/content_capabilitystatement.json").getFile();
		File f = new File(fileCtx);
		String contentRoot = f.getParent();
		FolderStructureDefinitionProvider sdprovider = new FolderStructureDefinitionProvider();
		// sdprovider.setFolder("C:/fhir/ws/sql/src/test/resources/content");
		sdprovider.setFolder(contentRoot);
		repo.addStructureDefinitionProvider(sdprovider);
		requestCtx = new RequestContext();
		requestCtx.setEndPoint(SCHEMA);
		requestCtx.setActiveSpringProfileConfiguration("test");
		requestCtx.setMetaRepo(repo);
		cRepo.setRequestContext(requestCtx);
	}

	@Test
	public void testPatientCatalog() throws FhirException, FileNotFoundException, IOException {
		CatalogDefinition catalog;
		catalog = new CatalogDefinition();
		catalog.setContentRepository(cRepo);
		catalog.setId("patient_catalog");
		catalog.ensureResolved();
		HashMap<String, HashMap<String, Object>> allContext = fillContext(catalog);
		CatalogMappingRenderer renderer = new CatalogMappingRenderer();
		renderer.build(this, requestCtx, catalog, allContext);
	}

	@Test
	public void testObservationCatalog() throws FhirException, FileNotFoundException, IOException {
		CatalogDefinition catalog;
		catalog = new CatalogDefinition();
		catalog.setContentRepository(cRepo);
		catalog.setId("observation_catalog");
		catalog.ensureResolved();
		HashMap<String, HashMap<String, Object>> allContext = fillContext(catalog);
		CatalogMappingRenderer renderer = new CatalogMappingRenderer();
		renderer.build(this, requestCtx, catalog, allContext);
	}

	protected static Structure prepareStructure(String jsonFileName) throws IOException {
		JsonNode resource = readJsonFile(jsonFileName);
		String type = resource.get("resourceType").asText();
		StructureDefinition sd = repo.getStructureDefinitionById(type);
		JSONWalker walker = new JSONWalker();
		return walker.fromJSON(resource, sd);
	}

	private static JsonNode readJsonFile(String jsonFileName) throws FileNotFoundException, IOException {
		ObjectMapper mapper = new ObjectMapper();
		System.out.println(jsonFileName);
		File resourceFile = new File(
				ContentRepositoryTest.class.getClassLoader().getResource(jsonFileName).getFile());
		FileInputStream fis = new FileInputStream(resourceFile);
		JsonNode resource = mapper.readTree(fis);
		return resource;
	}

	@Override
	public void writeStructure(Structure structure, Context context) throws Exception {
		// TODO Auto-generated method stub

	}

	public HashMap<String, HashMap<String, Object>> fillContext(CatalogDefinition cd)
			throws FileNotFoundException, IOException {
		HashMap<String, HashMap<String, Object>> ret = new HashMap<String, HashMap<String, Object>>();
		for (Table t : cd.getTable()) {
			Tabledefinition td = t.getDefinition();
			td.getFullTableName();
			String id = td.getId();
			JsonNode node = readJsonFile("catalog/" + id + "_DATA.json");
			ArrayNode rows = (ArrayNode) node.path("row");

			for (int i = 0; i < rows.size(); i++) {
				JsonNode rowJson = rows.get(i);
				ArrayNode columns = (ArrayNode) rowJson.path("column");
				HashMap<String, Object> row = new HashMap<String, Object>();
				String key = null;
				for (int c = 0; c < columns.size(); c++) {
					JsonNode column = columns.path(c);
					String columnName = column.path("name").asText();
					String value = null;
					if (column.has("valueString")) {
						value = column.get("valueString").asText();
					}
					if (columnName.equals(t.getReferenceColumn().getName())) {

						key = value;
					}
					DataElement de = td.getDataElementByName(columnName);
					row.put(columnName, value);
				}
				HashMap<String, Object> idContext = ret.get(key);
				if (idContext == null) {
					idContext = new HashMap<String, Object>();
					ret.put(key, idContext);
				}
				if ("1".equals(t.getCardinality())) {
					// HashMap<String,Object> tableContext =(HashMap<String,Object>)
					// idContext.get(t.getId());
					idContext.put(t.getId(), row);
				} else {
					List<HashMap<String, Object>> entries = (List<HashMap<String, Object>>) idContext.get(t.getId());
					if (entries == null) {
						entries = new ArrayList<HashMap<String, Object>>();
						idContext.put(t.getId(), entries);
					}
					entries.add(row);
				}

			}
		}
		return ret;
	}

}
