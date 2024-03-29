package com.legacy.health.fhir.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClientException;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Element;
import org.xml.sax.SAXException;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.exception.UnsupportedFormatException;
import com.legacy.health.fhir.extension.TransactionContext;
import com.legacy.health.fhir.extension.exceptions.CapabilityValidationException;
import com.legacy.health.fhir.helper.FhirUtils;
import com.legacy.health.fhir.meta.OperationOutcomeBuilder;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.Issue.Severity;
import com.legacy.health.fhir.meta.entity.OperationOutcome;
import com.legacy.health.fhir.meta.instance.Structure;

@Service
public class FileUploaderService extends AbstractService {

	private static String ENDPOINT_URL = "/upload";

	@Autowired
	private FHIRBundleService bundleService;

	@Autowired
	private FHIRResourceService resourceService;

	Logger log = Logger.getLogger(AbstractService.class.getClass());

	@Transactional(rollbackFor = SQLException.class)
	public Structure processFile(String schemaName, MultipartFile file) throws FhirException, SQLException,
			IOException, RestClientException, URISyntaxException, InterruptedException, ExecutionException {

		// check resource security authorization
		// read for multiple records
		// ( FIRST Security Check If API is accessable )
		HashMap<String, String> operation = new HashMap<String, String>();
		operation.put("operation", "create");
		String fileName = file.getOriginalFilename();

		List<Structure> structureList = new ArrayList<Structure>();
		List<ObjectNode> nodeList = new ArrayList<ObjectNode>();

		if (fileName.substring(fileName.lastIndexOf(".")).equalsIgnoreCase(".zip")) {

			structureList.addAll(processZipFile(schemaName, file));

		} else if (fileName.substring(fileName.lastIndexOf(".")).equalsIgnoreCase(".json")
				|| fileName.substring(fileName.lastIndexOf(".")).equalsIgnoreCase(".xml")) {

			try (InputStream inputStream = file.getInputStream();) {

				structureList.addAll(
						resourceService.processResources(schemaName, Arrays.asList(getStructure(inputStream)), null));
			}
		} else {
			throw new UnsupportedFormatException("Format "
					+ fileName.substring(fileName.lastIndexOf(".")) + " is not supported",
					null);
		}

		for (Structure struct : structureList) {
			nodeList.add((ObjectNode) FhirUtils.toJson(struct));
		}

		return FhirUtils.toBundle("search-set", nodeList);
	}

	private Structure getStructure(InputStream inputStream) {
		try {
			JsonNode resource = objectMapper.readTree(inputStream);
			return FhirUtils.toStructure(resource);
		} catch (IOException ex) {
			// Unable to parse. Probably not a JSON file.
			log.error(ex);
		}

		try {
			DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
			dbf.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
			dbf.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
			DocumentBuilder documentBuilder = dbf.newDocumentBuilder();
			Element resourceNode = documentBuilder.parse(inputStream).getDocumentElement();
			return FhirUtils.toStructure(resourceNode);
		} catch (ParserConfigurationException | SAXException | IOException ex) {
			// Unable to parse. Probably not an XML file.
			log.error(ex);
		}

		return null;
	}

	private List<Structure> processZipFile(String schemaName, MultipartFile file)
			throws RestClientException, FhirException, SQLException, URISyntaxException, InterruptedException,
			ExecutionException, IOException {
		List<Structure> structuteList = new ArrayList<Structure>();
		TransactionContext transactionContext = resourceService.startTransaction(schemaName, false);
		try {
			try (ZipInputStream inputStream = new ZipInputStream(file.getInputStream())) {
				ZipEntry entry;
				List<Structure> resources = new ArrayList<>();
				while ((entry = inputStream.getNextEntry()) != null) {
					final String fileName = entry.getName();
					logger.info("Processing File: " + fileName);
					InputStream zipEntryInputStream = new ByteArrayInputStream(IOUtils.toByteArray(inputStream));
					long start = System.currentTimeMillis();
					Structure structure = getStructure(zipEntryInputStream);
					long stop = System.currentTimeMillis();
					logger.info("Structure transform took:" + (stop - start));
					if (structure != null && "Bundle".equals(structure.getResourceType())) {
						// bundleService.processBundle(schemaName, structure);
						// bundleService.processBatchOrTransaction(schemaName, structure, "transaction",
						// transactionContext);
						structuteList.add(
								bundleService.processCollection(schemaName, structure, null, transactionContext, true));
					} else {
						resources.add(structure);
					}
				}
				structuteList.addAll(resourceService.processResources(schemaName, resources, transactionContext));
			}
			transactionContext.commit();
		} catch (SQLException | FhirException | RestClientException e) {
			log.error(e);

			OperationOutcome outcome = null;

			if (e instanceof CapabilityValidationException) {
				outcome = ((CapabilityValidationException) e).getOperationOutcome();
			} else {
				outcome = new OperationOutcomeBuilder()
						.addIssue(Severity.error, "data-upload-failure")
						.withDetails(e)
						.issue()
						.outcome();
			}

			structuteList.add(FhirUtils.toStructure(outcome));

			transactionContext.rollback();
		} finally {
			transactionContext.closeConnection();
		}
		return structuteList;
	}
}
