package com.legacy.health.fhir.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.service.FHIRMartLifecycleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

@RestController
@ConditionalOnProperty(name = "com.legacy.health.fhir.controller.FHIRMartLifecycleController", havingValue = "true", matchIfMissing = false)
public class FHIRMartLifecycleController {

    private static final String URL_PREFIX = "/{schema}/mart";

    @Autowired
    private FHIRMartLifecycleService martService;

    @PostMapping(value = URL_PREFIX, consumes = {
            MediaType.APPLICATION_JSON_VALUE,
            MediaType.APPLICATION_JSON_UTF8_VALUE
    })
    @ResponseStatus(HttpStatus.CREATED)
    public void create(
            @PathVariable("schema") String schemaName,
            @RequestBody ObjectNode input) throws FhirException {
        martService.create(schemaName, input);
    }

    @DeleteMapping(URL_PREFIX + "/{id}")
    public void delete(
            @PathVariable("schema") String schemaName,
            @PathVariable("id") String id) throws FhirException {
        martService.delete(schemaName, id);
    }

}
