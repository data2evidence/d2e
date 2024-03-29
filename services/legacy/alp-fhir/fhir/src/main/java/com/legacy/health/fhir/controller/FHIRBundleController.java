package com.legacy.health.fhir.controller;

import static com.legacy.health.fhir.helper.FhirMediaTypes.APPLICATION_FHIR_JSON;
import static com.legacy.health.fhir.helper.FhirMediaTypes.APPLICATION_FHIR_XML;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.http.MediaType.APPLICATION_XML_VALUE;

import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.sql.SQLException;
import java.util.concurrent.ExecutionException;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;

import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.service.FHIRBundleService;

@RestController
public class FHIRBundleController {

        private static final String URL_PREFIX = "/{schema}/fhir";

        @Autowired
        private FHIRBundleService bundleService;

        @PostMapping(value = URL_PREFIX, consumes = {
                        APPLICATION_FHIR_JSON,
                        APPLICATION_FHIR_XML,
                        APPLICATION_JSON_VALUE,
                        APPLICATION_XML_VALUE
        }, produces = {
                        APPLICATION_FHIR_JSON,
                        APPLICATION_FHIR_XML,
                        APPLICATION_JSON_VALUE,
                        APPLICATION_XML_VALUE
        })
        public Structure bundleUpload(
                        @PathVariable("schema") String schema,
                        @RequestBody Structure bundle,
                        HttpServletRequest request) throws RestClientException, UnsupportedEncodingException,
                        FhirException, SQLException, URISyntaxException, InterruptedException,
                        ExecutionException {
                return bundleService.processBundle(schema, bundle, request);
        }

}
