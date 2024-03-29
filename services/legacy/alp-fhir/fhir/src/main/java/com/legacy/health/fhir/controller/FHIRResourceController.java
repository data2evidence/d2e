package com.legacy.health.fhir.controller;

import com.legacy.health.fhir.config.FeatureToggleCheck;
import com.legacy.health.fhir.exception.InvalidResourceException;
import com.legacy.health.fhir.helper.ParameterStringHelper;
import com.legacy.health.fhir.service.FHIRResourceService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.http.MediaType.APPLICATION_XML_VALUE;

import java.io.UnsupportedEncodingException;
import java.sql.SQLException;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

import static com.legacy.health.fhir.helper.FhirMediaTypes.APPLICATION_FHIR_JSON;
import static com.legacy.health.fhir.helper.FhirMediaTypes.APPLICATION_FHIR_XML;

import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.service.FHIRResourceValidatorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
public class FHIRResourceController {

        private static final String URL_PREFIX = "/{schema}/fhir/{type}";
        private static final String ID_SUFFIX = "{id:^(?![$]).*}";

        @Autowired
        private FHIRResourceService resourceService;

        @Autowired
        private FHIRResourceValidatorService validatorService;

        Logger log = Logger.getLogger(FHIRResourceController.class.getClass());

        @ApiOperation(value = "Read a FHIR Resource by ID", nickname = "Read Resource", notes = "Accesses the current contents of a FHIR Resource")
        @ApiResponses(value = {
                        @ApiResponse(code = 200, message = "Resource Fetched."),
                        @ApiResponse(code = 410, message = "Resource Deleted."),
                        @ApiResponse(code = 404, message = "Resource Not Found.")
        })
        @GetMapping(value = URL_PREFIX + "/" + ID_SUFFIX, produces = {
                        APPLICATION_FHIR_JSON,
                        APPLICATION_FHIR_XML,
                        APPLICATION_JSON_VALUE,
                        APPLICATION_XML_VALUE
        })
        @FeatureToggleCheck(value = "FHIR_READ_RESSOURCE", activeByDefault = true)
        public Structure read(
                        @PathVariable("schema") String schema,
                        @PathVariable("type") String resourceType,
                        @PathVariable("id") String id,
                        HttpServletRequest request) throws FhirException, SQLException {
                return resourceService.read(schema, resourceType, id, request);
        }

        @ApiOperation(value = "Creates a FHIR Resource", nickname = "Create Resource", notes = "Creates a new resource in a server-assigned location")
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
        public Structure create(
                        @PathVariable("schema") String schema,
                        @PathVariable("type") String resourceType,
                        @RequestHeader(name = "If-None-Exist", required = false) String condition,
                        @RequestBody Structure resource)
                        throws SQLException, FhirException, UnsupportedEncodingException {
                if (!validatorService.validateResource(resource, resourceType)) {
                        throw new InvalidResourceException(String.format("Resource [%s] is invalid.", resourceType),
                                        null);
                }

                if (condition == null) {
                        return resourceService.create(schema, resourceType, resource, null);
                }
                return resourceService.create(schema, resourceType, resource,
                                ParameterStringHelper.splitQuery2Array(condition),
                                null);
        }

        @ApiOperation(value = "Updates a FHIR Resource by ID", nickname = "Update Resource", notes = "Creates a new current version for an existing resource or Creates an initial version if no resource already exists for the given ID")
        @ApiResponses(value = {
                        @ApiResponse(code = 200, message = "Resource Updated."),
                        @ApiResponse(code = 201, message = "Resource Created."),
                        @ApiResponse(code = 400, message = "Resource (Missing/Invalid ID | Non-Parseable | Failed Validation)."),
                        @ApiResponse(code = 401, message = "Missing Authorization."),
                        @ApiResponse(code = 404, message = "ResourceType Not Supported | Not a FHIR endpoint."),
                        @ApiResponse(code = 405, message = "New Resource, but Server doesn't allow client IDs."),
                        @ApiResponse(code = 409, message = "Version Conflict."),
                        @ApiResponse(code = 412, message = "Pre-Condition Failed | Multiple Matches."),
                        @ApiResponse(code = 422, message = "FHIR Resource violates available FHIR profiles or server business rules.")
        })
        @PutMapping(value = URL_PREFIX + "/" + ID_SUFFIX, produces = {
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
        public ResponseEntity<Structure> update(
                        @PathVariable("schema") String schema,
                        @PathVariable("type") String resourceType,
                        @PathVariable("id") String id,
                        @RequestBody Structure resource) throws SQLException, FhirException {
                if (!validatorService.validateResource(resource, resourceType)) {
                        throw new InvalidResourceException(String.format("Resource [%s] is invalid.", resourceType),
                                        null);
                }

                if (resourceService.exists(schema, resourceType, id)) {
                        return ResponseEntity.ok(resourceService.update(schema, resourceType, id, resource, null));
                }

                Structure createdResource = resourceService.create(schema, resourceType, resource, null);
                return ResponseEntity
                                .created(ServletUriComponentsBuilder.fromCurrentRequest().path("/" + ID_SUFFIX)
                                                .buildAndExpand(createdResource.getId()).toUri())
                                .body(createdResource);
        }

        @ApiOperation(value = "Updates a FHIR Resource by Condition", nickname = "Update Resource", notes = "Updates an existing resource based on some identification criteria")
        @ApiResponses(value = {
                        @ApiResponse(code = 200, message = "Resource Updated."),
                        @ApiResponse(code = 201, message = "Resource Created."),
                        @ApiResponse(code = 400, message = "Resource (Missing/Invalid ID | Non-Parseable | Failed Validation)."),
                        @ApiResponse(code = 401, message = "Missing Authorization."),
                        @ApiResponse(code = 404, message = "ResourceType Not Supported | Not a FHIR endpoint."),
                        @ApiResponse(code = 405, message = "New Resource, but Server doesn't allow client IDs."),
                        @ApiResponse(code = 409, message = "Version Conflict."),
                        @ApiResponse(code = 412, message = "Pre-Condition Failed | Multiple Matches."),
                        @ApiResponse(code = 422, message = "FHIR Resource violates available FHIR profiles or server business rules.")
        })
        @PutMapping(value = URL_PREFIX, produces = {
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
        public Structure update(
                        @PathVariable("schema") String schema,
                        @PathVariable("type") String resourceType,
                        WebRequest webRequest,
                        @RequestBody Structure resource) throws FhirException, SQLException {
                if (!validatorService.validateResource(resource, resourceType)) {
                        throw new InvalidResourceException(String.format("Resource [%s] is invalid.", resourceType),
                                        null);
                }

                return resourceService.update(schema, resourceType, webRequest.getParameterMap(), resource, null);
        }

        @ApiOperation(value = "Deletes a FHIR Resource by ID", nickname = "Delete Resource", notes = "Removes an existing resource")
        @ApiResponses(value = {
                        @ApiResponse(code = 204, message = "No Content.")
        })
        @DeleteMapping(URL_PREFIX + "/" + ID_SUFFIX)
        @ResponseStatus(HttpStatus.NO_CONTENT)
        public void delete(
                        @PathVariable("schema") String schema,
                        @PathVariable("type") String resourceType,
                        @PathVariable("id") String id) throws FhirException, SQLException {
                resourceService.delete(schema, resourceType, id, true, true, null);
        }

}
