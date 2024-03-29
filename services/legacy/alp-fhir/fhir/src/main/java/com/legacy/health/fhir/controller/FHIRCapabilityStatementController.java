package com.legacy.health.fhir.controller;

import com.legacy.health.fhir.exception.InvalidResourceException;
import com.legacy.health.fhir.service.FHIRCapabilityStatementService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.http.MediaType.APPLICATION_XML_VALUE;

import java.sql.SQLException;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import static com.legacy.health.fhir.helper.FhirMediaTypes.APPLICATION_FHIR_JSON;
import static com.legacy.health.fhir.helper.FhirMediaTypes.APPLICATION_FHIR_XML;

import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.service.FHIRResourceValidatorService;

@RestController
public class FHIRCapabilityStatementController {

        private static final String URL_PREFIX = "/{schema}/fhir/CapabilityStatement";

        @Autowired
        private FHIRCapabilityStatementService capabilityStatementService;

        @Autowired
        private FHIRResourceValidatorService validatorService;

        @ApiOperation(value = "Read a FHIR CapabilityStatement", nickname = "Read CapabilityStatement", notes = "Accesses the current contents of a FHIR Resource of type CapabilityStatement")
        @ApiResponses(value = {
                        @ApiResponse(code = 200, message = "Resource Fetched."),
                        @ApiResponse(code = 410, message = "Resource Deleted."),
                        @ApiResponse(code = 404, message = "Resource Not Found.")
        })
        @GetMapping(value = "/{schema}/fhir/metadata", produces = {
                        APPLICATION_FHIR_JSON,
                        APPLICATION_FHIR_XML,
                        APPLICATION_JSON_VALUE,
                        APPLICATION_XML_VALUE
        })
        public Structure read(@PathVariable("schema") String schema, HttpServletRequest request)
                        throws SQLException, FhirException {
                return capabilityStatementService.read(schema, request);
        }

        @ApiOperation(value = "Creates a FHIR CapabilityStatement", nickname = "Create CapabilityStatement", notes = "Creates a new resource of type CapabilityStatement in a server-assigned location")
        @ApiResponses(value = {
                        @ApiResponse(code = 201, message = "Resource Created."),
                        @ApiResponse(code = 400, message = "Resource (Non-Parseable | Failed Validation)."),
                        @ApiResponse(code = 401, message = "Missing Authorization."),
                        @ApiResponse(code = 404, message = "ResourceType Not Supported | Not a FHIR endpoint."),
                        @ApiResponse(code = 412, message = "Pre-Condition Failed | Multiple Matches."),
                        @ApiResponse(code = 422, message = "FHIR Resource violates available FHIR profiles or server business rules.")
        })
        @PostMapping(value = URL_PREFIX, produces = {
                        APPLICATION_FHIR_JSON,
                        APPLICATION_FHIR_XML,
                        APPLICATION_JSON_VALUE,
                        APPLICATION_XML_VALUE
        }, consumes = {
                        APPLICATION_FHIR_JSON,
                        APPLICATION_FHIR_XML,
                        APPLICATION_JSON_VALUE,
                        APPLICATION_XML_VALUE
        })
        @ResponseStatus(HttpStatus.CREATED)
        public Structure create(@PathVariable("schema") String schema,
                        @RequestHeader(name = "If-None-Exist", required = false) String condition,
                        @RequestBody Structure input)
                        throws FhirException, SQLException {
                // Validate the CapabilityStatement as a Resource
                if (!validatorService.validateResource(input, "CapabilityStatement")) {
                        throw new InvalidResourceException(
                                        String.format("Resource [%s] is invalid.", "CapabilityStatement"), null);
                }

                return capabilityStatementService.create(schema, input);
        }

}
