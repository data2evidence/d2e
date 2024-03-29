package com.legacy.health.fhir.content;

import static org.junit.Assert.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Properties;

import org.junit.BeforeClass;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legacy.health.fhir.content.model.CatalogDefinition;
import com.legacy.health.fhir.content.model.CatalogDefinition.Table;
import com.legacy.health.fhir.content.model.Permission;
import com.legacy.health.fhir.content.model.ScenarioDefinition;
import com.legacy.health.fhir.content.model.ScenarioDefinition.Persistency;
import com.legacy.health.fhir.content.model.Tabledefinition;
import com.legacy.health.fhir.extension.TransactionContext;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.RequestContext;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.json.JSONWalker;
import com.legacy.health.fhir.meta.repsitory.FolderStructureDefinitionProvider;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.RepositoryBuilder;
import com.legacy.health.fhir.meta.repsitory.ZipSpecificationProvider;
import com.legacy.health.fhir.meta.sql.GenericFHIRResoureRepository;
import com.legacy.health.fhir.meta.sql.SQLExecutor;

public class ContentRepositoryTest {

	private static String SCHEMA = "CONFIG_TEST";
	private static String TEST_CONNECTION_FILENAME = "test.properties";
	static ObjectMapper mapper = new ObjectMapper();
	static MetaRepository repo;
	private static GenericFHIRResoureRepository fhirResourceImpl = null;

	static JsonNode content;

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		final SQLExecutor sql = new SQLExecutor();
		// sql.connect("127.0.0.1", 5432, "firstdb", "testuser", "abcd1234");
		sql.connect(getProperties(TEST_CONNECTION_FILENAME), true, "test");
		sql.executeDDL("DROP SCHEMA PUBLIC CASCADE", true);
		sql.executeDDL("DROP SCHEMA \"CONFIG_TEST\" CASCADE", true);

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
		File file = new File(classLoader.getResource("content/hcim.json").getFile());
		content = mapper.readTree(file);
		Structure patientStructure = prepareStructure("content/content_capabilitystatement.json");
		RequestContext requestCtx = new RequestContext();
		requestCtx.setEndPoint(SCHEMA);
		requestCtx.setActiveSpringProfileConfiguration("test");
		requestCtx.setMetaRepo(repo);
		requestCtx.setConnectionDetails(getProperties(TEST_CONNECTION_FILENAME));
		// Initialiatization is triggerd
		fhirResourceImpl = new GenericFHIRResoureRepository();
		fhirResourceImpl.doInit(patientStructure, requestCtx);
	}

	@Test
	public void testGetResource() throws Exception {
		// test data for create
		Structure resource = prepareStructure("content/hcim.json");
		createResoure(resource);
		Structure scenarioStructure = resource;
		resource = prepareStructure("content/bgz_server.json");
		createResoure(resource);
		resource = prepareStructure("content/HCIM_PATIENT.json");
		createResoure(resource);
		resource = prepareStructure("content/coded_patient.json");
		createResoure(resource);
		resource = prepareStructure("content/HCIM_PATIENT_IDENTIFICATION.json");
		createResoure(resource);
		resource = prepareStructure("content/HCIM_PATIENT_NAME_INFORMATION.json");
		createResoure(resource);
		resource = prepareStructure("content/HCIM_PATIENT_ADDRESS_INFORMATION.json");
		createResoure(resource);
		resource = prepareStructure("content/patient_catalog.json");
		createResoure(resource);
		resource = prepareStructure("content/Gender.ConceptMap.json");
		createResoure(resource);
		resource = prepareStructure("content/AddressType.ConceptMap.json");
		createResoure(resource);
		resource = prepareStructure("content/HCIMPatientGroupPermission.json");
		createResoure(resource);
		resource = prepareStructure("content/HCIM_MRI_ACCESS_ROLE.json");
		createResoure(resource);
		MockHttpServletRequest request = new MockHttpServletRequest();
		// request.setRequestURI("http://localhost:8080");

		GenericFHIRResoureRepository fhirResourceImpl = new GenericFHIRResoureRepository();
		StructureDefinition sd = repo.getStructureDefinitionById(scenarioStructure.getResourceType());
		RequestContext requestCtx = new RequestContext();
		requestCtx.setEndPoint(SCHEMA);
		requestCtx.setMetaRepo(repo);
		requestCtx.setActiveSpringProfileConfiguration("test");
		requestCtx.setResourceType(sd.getId());
		requestCtx.setRequest(request);
		requestCtx.setConnectionDetails(getProperties(TEST_CONNECTION_FILENAME));
		ContentRepository repository = new ContentRepository();
		repository.setRequestContext(requestCtx);
		repository.setInnerRepository(fhirResourceImpl);
		ScenarioDefinition definition = new ScenarioDefinition();
		definition.setId(scenarioStructure.getId());
		definition.setContentRepository(repository);
		Persistency p = definition.getDeployment().get(0).getPersistency().get(0);
		System.out.println(p.getConfiguration());
		Structure s = definition.getCapabilities();
		Tabledefinition td = p.getDefinition();
		System.out.println(td.getFullTableName());
		Persistency v = definition.getDeployment().get(0).getPersistency().get(1);
		Tabledefinition vd = v.getDefinition();
		System.out.println(vd.getFullTableName());
		System.out.println(vd.getTableModel().getDDL());
		assertNotNull(vd);
		CatalogDefinition cd = definition.getDeployment().get(0).getCatalog().get(0);
		assertEquals("Patient", cd.getTarget().getId());
		Table t = cd.getTable().get(0);
		assertTrue(t.getDefinition().getTableModel().getDDL()
				.contains("\"identification_number\" NVARCHAR(64) NOT NULL,"));
		assertEquals("1", t.getCardinality());
		assertEquals(td.getFullTableName(), t.getDefinition().getFullTableName());
		List<Permission> permissions = definition.getDeployment().get(0).getPermission();
		assertEquals(1, permissions.size());
		assertEquals("HCIMPatientGroup", permissions.get(0).getGroup());
		assertEquals(2, permissions.get(0).getRequiredAttributes().size());
		assertEquals("attr.socialSecurityNumber", permissions.get(0).getRequiredAttributes().get(0));
		assertEquals("attr.identifierSystem", permissions.get(0).getRequiredAttributes().get(1));
		fhirResourceImpl.deleteResource(scenarioStructure.getId(), sd, requestCtx, null);
	}

	protected static Structure prepareStructure(String jsonFileName) throws IOException {
		ObjectMapper mapper = new ObjectMapper();
		File resourceFile = new File(
				ContentRepositoryTest.class.getClassLoader().getResource(jsonFileName).getFile());
		FileInputStream fis = new FileInputStream(resourceFile);
		JsonNode resource = mapper.readTree(fis);
		String type = resource.get("resourceType").asText();
		StructureDefinition sd = repo.getStructureDefinitionById(type);
		JSONWalker walker = new JSONWalker();
		return walker.fromJSON(resource, sd);
	}

	private static Properties getProperties(String fileName) throws FhirException {
		FileInputStream fis = null;
		Properties properties = null;
		File file = new File(ContentRepositoryTest.class.getClassLoader().getResource(fileName).getFile());
		if (file != null) {
			try {
				fis = new FileInputStream(file);
				properties = new Properties();
				properties.load(fis);
			} catch (FileNotFoundException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				// throw new FhirException("Error providing sql connection", e );
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				// throw new FhirException("Error providing sql connection", e );
			}
		}
		return properties;
	}

	private Structure createResoure(Structure patientStructure) throws FhirException {
		RequestContext requestCtx = new RequestContext();
		requestCtx.setEndPoint(SCHEMA);
		requestCtx.setMetaRepo(repo);
		requestCtx.setActiveSpringProfileConfiguration("test");
		requestCtx.setConnectionDetails(getProperties(TEST_CONNECTION_FILENAME));
		TransactionContext transactionContext = fhirResourceImpl.startTransaction(true, requestCtx);
		Structure resource = fhirResourceImpl.createResource(patientStructure, requestCtx, transactionContext);
		return resource;
	}

}
