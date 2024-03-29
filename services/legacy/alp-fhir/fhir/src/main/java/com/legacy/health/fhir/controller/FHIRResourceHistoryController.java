package com.legacy.health.fhir.controller;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.legacy.health.fhir.service.FHIRResourceHistoryService;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.http.MediaType.APPLICATION_XML_VALUE;

import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;

import static com.legacy.health.fhir.helper.FhirMediaTypes.APPLICATION_FHIR_JSON;
import static com.legacy.health.fhir.helper.FhirMediaTypes.APPLICATION_FHIR_XML;

import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.instance.Structure;

@RestController
public class FHIRResourceHistoryController {

        private static final String URL_PREFIX = "/{schema}/fhir/{type}/{id}/_history";

        @Autowired
        private FHIRResourceHistoryService historyService;

        @ApiOperation(value = "Read a specific version of FHIR Resource by ID", nickname = "Version Read Resource", notes = "Version specific read of the FHIR Resource")
        @ApiResponses(value = {
                        @ApiResponse(code = 200, message = "Resource Fetched."),
                        @ApiResponse(code = 410, message = "Resource Deleted."),
                        @ApiResponse(code = 404, message = "Resource Not Found.")
        })
        @GetMapping(value = URL_PREFIX + "/{vid}", produces = {
                        APPLICATION_FHIR_JSON,
                        APPLICATION_FHIR_XML,
                        APPLICATION_JSON_VALUE,
                        APPLICATION_XML_VALUE
        })
        public Structure read(
                        @PathVariable("schema") String schema,
                        @PathVariable("type") String resourceType,
                        @PathVariable("id") String id,
                        @PathVariable("vid") String version) throws FhirException, SQLException {
                return historyService.read(schema, resourceType, id, version);
        }

        @ApiOperation(value = "Read all versions of FHIR Resource by ID", nickname = "Version Read Resource", notes = "Version specific read of the FHIR Resource")
        @ApiResponses(value = {
                        @ApiResponse(code = 200, message = "Resource Fetched."),
                        @ApiResponse(code = 410, message = "Resource Deleted."),
                        @ApiResponse(code = 404, message = "Resource Not Found.")
        })
        @GetMapping(value = URL_PREFIX, produces = {
                        APPLICATION_FHIR_JSON,
                        APPLICATION_FHIR_XML,
                        APPLICATION_JSON_VALUE,
                        APPLICATION_XML_VALUE
        })
        public Structure read(
                        @PathVariable("schema") String schema,
                        @PathVariable("type") String resourceType,
                        @PathVariable("id") String id) throws FhirException, SQLException {
                return historyService.read(schema, resourceType, id);
        }

}
