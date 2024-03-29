package com.legacy.health.fhir.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.legacy.health.fhir.exception.ResourceNotFoundException;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;

@RestController
public class FHIRAllUnmappedRequestController {

	@SuppressFBWarnings("SPRING_CSRF_UNRESTRICTED_REQUEST_MAPPING")
	@RequestMapping("/**")
	public void allRequest() throws ResourceNotFoundException {
		throw new ResourceNotFoundException("Unsupported request URL", null);
	}
}
