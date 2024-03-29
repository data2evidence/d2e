package com.legacy.health.fhir.meta.sql;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.extension.TransactionContext;
import com.legacy.health.fhir.extension.exceptions.FHIRResourceHandlingException;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.RequestContext;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.json.JSONWalker;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.RepositoryBuilder;
import com.legacy.health.fhir.meta.repsitory.ZipSpecificationProvider;
import com.legacy.health.fhir.meta.sql.util.FhirUtils;

public class FHIRResourceRepositoryImpl_BundleTest {

	static Properties testProperties = new Properties();
	static ZipSpecificationProvider provider;
	static MetaRepository repo;
	private static String SCHEMA = "FHIR_RESOURCES";
	private static String TEST_CONNECTION_FILENAME = "test.properties";

	private static GenericFHIRResoureRepository fhirResourceImpl = null;

	private static RequestContext requestCtx;

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		ClassLoader classLoader = FHIRResourceRepositoryImpl_BundleTest.class.getClassLoader();
		fhirResourceImpl = new GenericFHIRResoureRepository();
		File zipFile = new File(
				FHIRResourceRepositoryImpl_BundleTest.class.getClassLoader().getResource("spec.zip").getFile());
		provider = new ZipSpecificationProvider();
		provider.setZipFilePath(zipFile);
		repo = RepositoryBuilder.createRepository(provider);
		Structure patientStructure = prepareStructure("testCapabilityStatement.json");
		requestCtx = new RequestContext();
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

	private Structure createResoure(Structure patientStructure, TransactionContext transContext)
			throws FHIRResourceHandlingException {
		RequestContext requestCtx = new RequestContext();
		requestCtx.setEndPoint(SCHEMA);
		requestCtx.setMetaRepo(repo);

		return fhirResourceImpl.createResource(patientStructure, requestCtx, transContext);
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
	public void testBundleCreateResource() throws Exception {
		TransactionContext transContext = null;
		try {
			ObjectMapper mapper = new ObjectMapper();
			File resourceFile = new File(
					FHIRResourceRepositoryImpTest.class.getClassLoader().getResource("testbundle.json").getFile());
			FileInputStream fis = new FileInputStream(resourceFile);
			JsonNode resourceNode = mapper.readTree(fis);

			JsonNode entries = resourceNode.get("entry");

			List<ObjectNode> resources = new ArrayList<>();

			Map<String, Set<String>> resourceTypeIdMapping = new HashMap<>();

			transContext = fhirResourceImpl.startTransaction(false, requestCtx);

			System.out.println(" ==> Transaction started ");
			List<Structure> structures = new ArrayList<Structure>();
			for (JsonNode entry : entries) {
				JsonNode node = entry.get("resource");
				// FhirUtils fhirUtils = new FhirUtils(repo, null);
				Structure resourceStructure = FhirUtils.toStructure(node, repo);
				structures.add(resourceStructure);
				// createResoure(resourceStructure, transContext);
			}
			final Map<String, Boolean> chk = fhirResourceImpl.checkResourceIds(structures, requestCtx, transContext);
			System.out.println(chk.keySet().stream().filter(x -> chk.get(x) == true).count());
			for (Structure structure : structures) {
				createResoure(structure, transContext);
			}

			transContext.commit();
			final Map<String, Boolean> chk2 = fhirResourceImpl.checkResourceIds(structures, requestCtx, null);
			System.out.println(chk2.keySet().stream().filter(x -> chk2.get(x) == true).count());
			System.out.println(" ==> Transaction commit ");
		} catch (Exception ex) {
			try {
				transContext.rollback();
			} catch (Exception e) {
				ex.printStackTrace();
				throw e;
			}
		} finally {
			try {
				transContext.closeConnection();
			} catch (Exception e) {
				// TODO: handle exception
			}
		}

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