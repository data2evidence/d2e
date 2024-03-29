package com.legacy.health.fhir.meta.sql;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Properties;

import com.legacy.health.fhir.extension.TransactionContext;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.RequestContext;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.json.JSONWalker;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.RepositoryBuilder;
import com.legacy.health.fhir.meta.repsitory.ZipSpecificationProvider;
import com.legacy.health.fhir.util.Utils;

public class FHIRResourceRepositoryImpTest {

	static Properties testProperties = new Properties();
	static ZipSpecificationProvider provider;
	static MetaRepository repo;
	private static String SCHEMA = "FHIR_RESOURCES";
	private static String TEST_CONNECTION_FILENAME = "test.properties";

	private static GenericFHIRResoureRepository fhirResourceImpl = null;

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		ClassLoader classLoader = FHIRResourceRepositoryImpTest.class.getClassLoader();
		fhirResourceImpl = new GenericFHIRResoureRepository();
		File zipFile = new File(
				FHIRResourceRepositoryImpl_BundleTest.class.getClassLoader().getResource("spec.zip").getFile());
		provider = new ZipSpecificationProvider();
		provider.setZipFilePath(zipFile);
		repo = RepositoryBuilder.createRepository(provider);
		Structure patientStructure = prepareStructure("testCapabilityStatement.json");
		RequestContext requestCtx = new RequestContext();
		requestCtx.setEndPoint(SCHEMA);
		requestCtx.setActiveSpringProfileConfiguration("test");
		requestCtx.setMetaRepo(repo);
		requestCtx.setConnectionDetails(getProperties(TEST_CONNECTION_FILENAME));
		// Initialiatization is triggerd
		fhirResourceImpl.doInit(patientStructure, requestCtx);
	}

	@Before
	public void setUp() throws Exception {

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

	private static Structure prepareStructure(String jsonFileName) throws IOException {
		ObjectMapper mapper = new ObjectMapper();
		File resourceFile = new File(
				FHIRResourceRepositoryImpTest.class.getClassLoader().getResource(jsonFileName).getFile());
		FileInputStream fis = new FileInputStream(resourceFile);
		JsonNode resource = mapper.readTree(fis);
		String type = resource.get("resourceType").asText();
		StructureDefinition sd = repo.getStructureDefinitionById(type);
		JSONWalker walker = new JSONWalker();
		return walker.fromJSON(resource, sd);
	}

	@Test
	public void testCreateResource() throws Exception {

		// Test data
		Structure patientStructure = prepareStructure("testpatient.json");
		Structure structureAfterCreate = createResoure(patientStructure);
		Assert.assertNotNull("Return value is null after create operation", structureAfterCreate);
		Assert.assertArrayEquals("Structure 'ids' does not match", patientStructure.getId().toCharArray(),
				structureAfterCreate.getId().toCharArray());
	}

	@Test
	public void testUpdateResource() throws Exception {

		// test data for create
		Structure patientStructure = prepareStructure("testpatient.json");
		GenericFHIRResoureRepository fhirResourceImpl = new GenericFHIRResoureRepository();

		createResoure(patientStructure);

		// Test data for update
		Structure updatePatientStructure = prepareStructure("testUpdatePatient.json");

		RequestContext requestCtx = new RequestContext();
		requestCtx.setEndPoint(SCHEMA);
		requestCtx.setActiveSpringProfileConfiguration("test");
		requestCtx.setConnectionDetails(getProperties(TEST_CONNECTION_FILENAME));

		StructureDefinition sd = repo.getStructureDefinitionById(updatePatientStructure.getResourceType());

		Structure structureAfterUpdate = fhirResourceImpl.updateResource(updatePatientStructure, sd, requestCtx, null);
		Assert.assertNotNull("Return value is null after update operation", structureAfterUpdate);
		Assert.assertArrayEquals("Structure 'ids' does not match", patientStructure.getId().toCharArray(),
				structureAfterUpdate.getId().toCharArray());

		Assert.assertArrayEquals("Structure 'Address' does not match", "\"California\"".toCharArray(),
				structureAfterUpdate.getElementByPath("Patient.address[0].city").getElementNode().toString().trim()
						.toCharArray());
	}

	@Test
	public void testGetResource() throws Exception {
		// test data for create
		Structure patientStructure = prepareStructure("testpatient.json");

		createResoure(patientStructure);

		MockHttpServletRequest request = new MockHttpServletRequest();
		// request.setRequestURI("http://localhost:8080");

		GenericFHIRResoureRepository fhirResourceImpl = new GenericFHIRResoureRepository();
		StructureDefinition sd = repo.getStructureDefinitionById(patientStructure.getResourceType());
		RequestContext requestCtx = new RequestContext();
		requestCtx.setEndPoint(SCHEMA);
		requestCtx.setMetaRepo(repo);
		requestCtx.setActiveSpringProfileConfiguration("test");
		requestCtx.setResourceType(sd.getId());
		requestCtx.setRequest(request);
		requestCtx.setConnectionDetails(getProperties(TEST_CONNECTION_FILENAME));

		Structure structureAfterCreate = fhirResourceImpl.readResource(patientStructure.getId(), sd, requestCtx, null);
		Assert.assertNotNull("Return value is null after update operation", structureAfterCreate);

		fhirResourceImpl.deleteResource(patientStructure.getId(), sd, requestCtx, null);
	}

	@Test
	public void testGetResourceHistory() throws Exception {
		// test data for create
		// test data for create
		Structure patientStructure = prepareStructure("testpatient.json");
		GenericFHIRResoureRepository fhirResourceImpl = new GenericFHIRResoureRepository();

		createResoure(patientStructure);

		// Test data for update
		Structure updatePatientStructure = prepareStructure("testUpdatePatient.json");

		RequestContext requestCtx = new RequestContext();
		requestCtx.setEndPoint(SCHEMA);
		requestCtx.setActiveSpringProfileConfiguration("test");
		requestCtx.setConnectionDetails(getProperties(TEST_CONNECTION_FILENAME));

		StructureDefinition sd = repo.getStructureDefinitionById(updatePatientStructure.getResourceType());

		List<Structure> structureList = fhirResourceImpl
				.readResourceHistory(Utils.checkUUID(updatePatientStructure.getId()), sd, requestCtx, null);
		Assert.assertNotNull("Return value is null after update operation", structureList);
		// Assert.assertArrayEquals("Structure 'ids' does not match",
		// patientStructure.getId().toCharArray(),
		// structureAfterUpdate.getId().toCharArray());
		//
		// Assert.assertArrayEquals("Structure 'Address' does not match",
		// "\"California\"".toCharArray() ,
		// structureAfterUpdate.getElementByPath("Patient.address[0].city").getElementNode().toString().trim().toCharArray());
	}

	@Test
	public void testGetResourceByVersion() throws Exception {
		// test data for create
		Structure patientStructure = prepareStructure("testpatient.json");
		createResoure(patientStructure);

		GenericFHIRResoureRepository fhirResourceImpl = new GenericFHIRResoureRepository();
		StructureDefinition sd = repo.getStructureDefinitionById(patientStructure.getResourceType());
		RequestContext requestCtx = new RequestContext();
		requestCtx.setEndPoint(SCHEMA);
		requestCtx.setActiveSpringProfileConfiguration("test");
		requestCtx.setMetaRepo(repo);
		requestCtx.setResourceType(sd.getId());
		requestCtx.setVersionId("1234");
		requestCtx.setConnectionDetails(getProperties(TEST_CONNECTION_FILENAME));

		Structure structureAfterCreate = fhirResourceImpl.readResourceByVersion(patientStructure.getId(), sd,
				requestCtx,
				null);
		Assert.assertNotNull("Return value is null after update operation", structureAfterCreate);

		fhirResourceImpl.deleteResource(patientStructure.getId(), sd, requestCtx, null);
	}

	@Test
	public void testdeleteResource() throws Exception {
		// test data for create
		Structure patientStructure = prepareStructure("testpatient.json");

		createResoure(patientStructure);
		StructureDefinition sd = repo.getStructureDefinitionById(patientStructure.getResourceType());

		RequestContext requestCtx = new RequestContext();
		requestCtx.setEndPoint(SCHEMA);
		requestCtx.setResourceType(patientStructure.getResourceType());
		MockHttpServletRequest request = new MockHttpServletRequest();
		requestCtx.setMetaRepo(repo);
		requestCtx.setActiveSpringProfileConfiguration("test");
		requestCtx.setRequest(request);
		requestCtx.setConnectionDetails(getProperties(TEST_CONNECTION_FILENAME));

		fhirResourceImpl.deleteResource(patientStructure.getId(), sd, requestCtx, null);

		requestCtx.setResourceType(sd.getId());
		Structure structureAfterDelete = fhirResourceImpl.readResource(patientStructure.getId(), sd, requestCtx, null);
		int elementSize = structureAfterDelete.getElements().size();
		Assert.assertEquals("Structure is filled even after delete operation", 0, elementSize);

	}

	private static Properties getProperties(String fileName) throws FhirException {
		FileInputStream fis = null;
		Properties properties = null;
		File file = new File(
				FHIRResourceRepositoryImpl_BundleTest.class.getClassLoader().getResource(fileName).getFile());
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
}
