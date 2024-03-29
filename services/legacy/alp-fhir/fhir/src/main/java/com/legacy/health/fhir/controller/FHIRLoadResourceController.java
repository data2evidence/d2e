package com.legacy.health.fhir.controller;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import java.io.IOException;
import java.net.URISyntaxException;
import java.sql.SQLException;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;

import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.service.FileUploaderService;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class FHIRLoadResourceController {

    private static final String URL_PREFIX = "/{schema}";

    @Autowired
    private FileUploaderService uploaderService;

    @PostMapping(value = URL_PREFIX + "/upload", produces = {
            APPLICATION_JSON_VALUE
    })
    public Structure uploadFile(
            @PathVariable("schema") String schema,
            @RequestParam("file") MultipartFile file) throws RestClientException, FhirException, SQLException,
            IOException, URISyntaxException, InterruptedException, ExecutionException {
        return uploaderService.processFile(schema, file);
    }

}
