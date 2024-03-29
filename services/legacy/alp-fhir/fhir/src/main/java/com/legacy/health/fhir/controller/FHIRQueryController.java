package com.legacy.health.fhir.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.legacy.health.fhir.service.FHIRQueryService;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.http.MediaType.APPLICATION_XML_VALUE;

import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static com.legacy.health.fhir.helper.FhirMediaTypes.APPLICATION_FHIR_JSON;
import static com.legacy.health.fhir.helper.FhirMediaTypes.APPLICATION_FHIR_XML;

import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.instance.Structure;
import org.springframework.http.MediaType;

@RestController
@ConditionalOnProperty(name = "com.legacy.health.fhir.controller.FHIRQueryController", havingValue = "true", matchIfMissing = false)
public class FHIRQueryController {

        private static final String URL_PREFIX = "/{schema}";

        @Autowired
        private FHIRQueryService queryService;

        @PostMapping(value = URL_PREFIX + "/query", consumes = {
                        MediaType.APPLICATION_JSON_VALUE,
                        MediaType.APPLICATION_JSON_UTF8_VALUE
        }, produces = {
                        APPLICATION_FHIR_JSON,
                        APPLICATION_FHIR_XML,
                        APPLICATION_JSON_VALUE,
                        APPLICATION_XML_VALUE
        })
        public Structure query(
                        @PathVariable("schema") String schema,
                        @RequestBody JsonNode query) throws SQLException, FhirException {
                return queryService.query(schema, query);
        }

}
