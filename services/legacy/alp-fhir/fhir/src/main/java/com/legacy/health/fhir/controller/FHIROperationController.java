package com.legacy.health.fhir.controller;

import com.legacy.health.fhir.service.FHIROperationService;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static com.legacy.health.fhir.helper.FhirMediaTypes.APPLICATION_FHIR_JSON;
import static com.legacy.health.fhir.helper.FhirMediaTypes.APPLICATION_FHIR_XML;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.http.MediaType.APPLICATION_XML_VALUE;

import com.legacy.health.fhir.exception.InvalidRequestException;
import com.legacy.health.fhir.meta.instance.Structure;

@RestController
public class FHIROperationController {

    private static final String URL_PREFIX = "/{schema}/fhir";
    private static final String ID_SUFFIX = "{id:^(?![$]).*}";
    private static final String OPERATION_SUFFIX = "{operation:[$][a-zA-Z-]+}";

    @Autowired
    private FHIROperationService operationService;

    @GetMapping(value = URL_PREFIX + "/" + OPERATION_SUFFIX, produces = {
            APPLICATION_FHIR_JSON,
            APPLICATION_FHIR_XML,
            APPLICATION_JSON_VALUE,
            APPLICATION_XML_VALUE
    })
    public Structure execute(
            @PathVariable("schema") String schema,
            @PathVariable("operation") String operation,
            HttpServletRequest request) throws Exception {
        return execute(schema, operation, request, null);
    }

    @PostMapping(value = URL_PREFIX + "/" + OPERATION_SUFFIX, produces = {
            APPLICATION_FHIR_JSON,
            APPLICATION_FHIR_XML,
            APPLICATION_JSON_VALUE,
            APPLICATION_XML_VALUE
    })
    public Structure execute(
            @PathVariable("schema") String schema,
            @PathVariable("operation") String operation,
            HttpServletRequest request,
            @RequestBody(required = false) Structure input) throws Exception {
        return operationService.execute(operation, request.getParameterMap(), getHeaders(request), input, schema);
    }

    @GetMapping(value = URL_PREFIX + "/{type}/" + OPERATION_SUFFIX, produces = {
            APPLICATION_FHIR_JSON,
            APPLICATION_FHIR_XML,
            APPLICATION_JSON_VALUE,
            APPLICATION_XML_VALUE
    })
    public Structure execute(
            @PathVariable("schema") String schema,
            @PathVariable("type") String resourceType,
            @PathVariable("operation") String operation,
            HttpServletRequest request) throws Exception {
        return execute(schema, resourceType, operation, request, null);
    }

    @PostMapping(value = URL_PREFIX + "/{type}/" + OPERATION_SUFFIX, produces = {
            APPLICATION_FHIR_JSON,
            APPLICATION_FHIR_XML,
            APPLICATION_JSON_VALUE,
            APPLICATION_XML_VALUE
    })
    public Structure execute(
            @PathVariable("schema") String schema,
            @PathVariable("type") String resourceType,
            @PathVariable("operation") String operation,
            HttpServletRequest request,
            @RequestBody(required = false) Structure input) throws Exception {
        return operationService.execute(operation, request.getParameterMap(), getHeaders(request), input, schema,
                resourceType);
    }

    @DeleteMapping(value = URL_PREFIX + "/{type}/" + ID_SUFFIX + "/" + OPERATION_SUFFIX)
    public Structure executeDelete(
            @PathVariable("schema") String schema,
            @PathVariable("type") String resourceType,
            @PathVariable("id") String id,
            @PathVariable("operation") String operation,
            HttpServletRequest request) throws Exception {
        return execute(schema, resourceType, id, operation, request, null);
    }

    @GetMapping(value = URL_PREFIX + "/{type}/" + ID_SUFFIX + "/" + OPERATION_SUFFIX, produces = {
            APPLICATION_FHIR_JSON,
            APPLICATION_FHIR_XML,
            APPLICATION_JSON_VALUE,
            APPLICATION_XML_VALUE
    })
    public Structure execute(
            @PathVariable("schema") String schema,
            @PathVariable("type") String resourceType,
            @PathVariable("id") String id,
            @PathVariable("operation") String operation,
            HttpServletRequest request) throws Exception {
        if (operation.equals("$fulldelete")) {
            throw new InvalidRequestException("$fulldelete is not a GET request", null);
        }
        return execute(schema, resourceType, id, operation, request, null);
    }

    @PostMapping(value = URL_PREFIX + "/{type}/" + ID_SUFFIX + "/" + OPERATION_SUFFIX, produces = {
            APPLICATION_FHIR_JSON,
            APPLICATION_FHIR_XML,
            APPLICATION_JSON_VALUE,
            APPLICATION_XML_VALUE
    })
    public Structure execute(
            @PathVariable("schema") String schema,
            @PathVariable("type") String resourceType,
            @PathVariable("id") String id,
            @PathVariable("operation") String operation,
            HttpServletRequest request,
            @RequestBody(required = false) Structure input) throws Exception {
        return operationService.execute(operation, request.getParameterMap(), getHeaders(request), input, schema,
                resourceType, id);
    }

    private Map<String, String[]> getHeaders(HttpServletRequest request) {
        Map<String, String[]> headers = new HashMap<>();
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            Enumeration<String> headerValues = request.getHeaders(headerName);
            List<String> values = new ArrayList<>();
            while (headerValues.hasMoreElements()) {
                values.add(headerValues.nextElement());
            }

            headers.put(headerName, values.toArray(new String[values.size()]));
        }
        return headers;
    }

}
