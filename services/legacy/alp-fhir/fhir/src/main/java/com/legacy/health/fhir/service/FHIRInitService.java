package com.legacy.health.fhir.service;

import java.io.IOException;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.legacy.health.fhir.content.ContentRepository;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.instance.Structure;

@Service
public class FHIRInitService extends AbstractService {

	ObjectMapper mapper = new ObjectMapper();

	@Autowired
	private FHIRResourceService resourceService;

	public Structure initializePlatform() throws FhirException, IOException {

		// Security Check for Admin Operation
		// An Admin who calls /init needs $XSAPPNAME.FHIR_INIT_ADMIN scope
		HashMap<String, String> security = new HashMap<String, String>();
		security.put("scope", "FHIR_INIT_ADMIN");

		ContentRepository repo = this.contentRepositoryFactory.getContentRepository();
		Structure capabilityStatement = repo.initializeContentRepository();

		return capabilityStatement;
	}

}
