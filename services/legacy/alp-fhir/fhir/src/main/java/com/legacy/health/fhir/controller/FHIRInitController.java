package com.legacy.health.fhir.controller;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import java.io.IOException;
import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.service.FHIRInitService;

@RestController
public class FHIRInitController {

	@Autowired
	private FHIRInitService initService;

	@PostMapping(value = "/init", produces = {
			APPLICATION_JSON_VALUE
	})
	public Structure init() throws SQLException, FhirException, IOException {
		return initService.initializePlatform();
	}
}
