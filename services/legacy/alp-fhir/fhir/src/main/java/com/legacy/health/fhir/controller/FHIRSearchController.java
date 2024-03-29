package com.legacy.health.fhir.controller;

import com.legacy.health.fhir.service.FHIRSearchService;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.http.MediaType.APPLICATION_XML_VALUE;

import java.sql.SQLException;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

import static com.legacy.health.fhir.helper.FhirMediaTypes.APPLICATION_FHIR_JSON;
import static com.legacy.health.fhir.helper.FhirMediaTypes.APPLICATION_FHIR_XML;

import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.instance.Structure;

@RestController
public class FHIRSearchController {

    private static final String URL_PREFIX = "/{schema}/fhir/{type}";

    @Autowired
    private FHIRSearchService searchService;

    Logger log = Logger.getLogger(FHIRSearchController.class.getClass());

    @GetMapping(value = URL_PREFIX, produces = {
            APPLICATION_FHIR_JSON,
            APPLICATION_FHIR_XML,
            APPLICATION_JSON_VALUE,
            APPLICATION_XML_VALUE
    })
    public Structure search(
            @PathVariable("schema") String schema,
            @PathVariable("type") String resourceType,
            WebRequest request) throws FhirException, SQLException {
        return searchService.search(schema, resourceType, request.getParameterMap());
    }

    @PostMapping(value = URL_PREFIX + "/_search", produces = {
            APPLICATION_FHIR_JSON,
            APPLICATION_FHIR_XML,
            APPLICATION_JSON_VALUE,
            APPLICATION_XML_VALUE
    })
    public Structure searchPost(
            @PathVariable("schema") String schema,
            @PathVariable("type") String resourceType,
            WebRequest request) throws SQLException, FhirException {
        return searchService.search(schema, resourceType, request.getParameterMap());
    }

}