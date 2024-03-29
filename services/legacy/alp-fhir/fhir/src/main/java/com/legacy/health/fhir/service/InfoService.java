package com.legacy.health.fhir.service;

import com.legacy.health.fhir.content.ContentRepository;
import com.legacy.health.fhir.meta.AuthorizationException;
import com.legacy.health.fhir.meta.entity.RequestContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.*;

@Service
public class InfoService extends AbstractService {

    @Autowired
    private FHIRResourceService resourceService;

    Resource[] resources;

    InfoService() throws IOException {
        resources = new PathMatchingResourcePatternResolver().getResources("classpath*:*_git.properties");
    }

    private final Log log = LogFactory.getLog(InfoService.class);

    public Map<String, Map<String, String>> getInfo() throws AuthorizationException {

        // authorization check
        // Security Check for Admin Operation
        // An Admin who calls /init needs $XSAPPNAME.FHIR_INIT_ADMIN scope
        List<String> securityScopes = new ArrayList<String>();
        securityScopes.add("FHIR_INIT_ADMIN");
        securityScopes.add("FHIR_CONTENT_ADMIN");
        securityScopes.add("FHIR_SCENARIO_ADMIN");
        securityScopes.add("FHIR_COMPLETE_PATIENT_DELETE_ADMIN");
        securityScopes.add("FHIR_COMPLETE_PATIENT_READ_ADMIN");

        Map<String, Map<String, String>> ret = new TreeMap<>();
        readGitProperties(ret);
        readContentSchema(ret);
        return ret;
    }

    private Map<String, Map<String, String>> readContentSchema(Map<String, Map<String, String>> ret) {
        RequestContext context = initializeRequestContext("content");
        ContentRepository repo = this.contentRepositoryFactory.getContentRepository();
        Map<String, String> contentSchema = new HashMap<>();
        contentSchema.put("schema", repo.getTechnicalID(context));
        ret.put("content", contentSchema);
        return ret;
    }

    private Map<String, Map<String, String>> readGitProperties(Map<String, Map<String, String>> properties) {
        for (Resource r : this.resources) {
            Map<String, String> componentProps = new HashMap<>();
            properties.put(r.getFilename(), componentProps);
            try (InputStream inputStream = r.getInputStream()) {
                try (BufferedReader br = new BufferedReader(new InputStreamReader(inputStream))) {
                    String line;
                    while ((line = br.readLine()) != null) {
                        String[] split = line.split("=");
                        if (split.length == 2) {
                            componentProps.put(split[0], split[1]);
                        }
                    }
                }
            } catch (IOException e) {
                log.error("Could not read version information", e);
                return new HashMap<>();
            }
        }
        return properties;
    }
}
