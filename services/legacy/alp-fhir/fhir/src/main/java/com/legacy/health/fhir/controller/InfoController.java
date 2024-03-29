package com.legacy.health.fhir.controller;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import com.legacy.health.fhir.meta.AuthorizationException;
import com.legacy.health.fhir.service.InfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class InfoController {

    @Autowired
    private InfoService infoService;

    @GetMapping(value = "/info", produces = {
            APPLICATION_JSON_VALUE
    })
    public Map<String, Map<String, String>> versionInformation() throws AuthorizationException {
        return infoService.getInfo();
    }

}
