package com.legacy.health.fhir.service;

import com.legacy.health.fhir.content.ContentRepository;
import com.legacy.health.fhir.content.model.Scenario;
import com.legacy.health.fhir.extension.FHIRResourceRepository;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.RequestContext;
import com.legacy.health.fhir.meta.instance.Structure;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Locale;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FHIRCapabilityStatementService extends AbstractService {

    private static final String RESOURCE_TYPE = "CapabilityStatement";
    private static final String DEFAULT_CAPABILITY_STATEMENT_ID = "fhir-capabilitystatement";

    @Autowired
    private FHIRResourceService resourceService;

    /**
     * Capability create enables FHIR project(schema) for a server defined ID
     * 
     * @param schema
     * @param capabilityStatement
     * @return
     * @throws FhirException
     * @throws SQLException
     */
    @Transactional(rollbackFor = SQLException.class)
    public Structure create(String schema, Structure capabilityStatement) throws FhirException, SQLException {
        String schemaName = schema.toUpperCase(Locale.ENGLISH); // Find a better alternative (maybe spring interceptor?)

        // check resource security authorization
        // write for single record
        HashMap<String, String> operation = new HashMap<String, String>();
        operation.put("operation", "create");

        FHIRResourceRepository resourceRepoExtension = getFHIRResourceRepoExtension();
        RequestContext requestContext = initializeRequestContext(schemaName);
        logger.info("look here");
        logger.info(capabilityStatement.toString());
        logger.info(requestContext.toString());
        logger.info("ok done");
        return resourceRepoExtension.doInit(capabilityStatement, requestContext);
    }

    @Transactional(readOnly = true)
    public Structure read(String schemaName, HttpServletRequest request) throws SQLException, FhirException {
        ContentRepository repo = this.contentRepositoryFactory.getContentRepository();
        Scenario scenario = repo.getScenarioForEndpoint(schemaName);
        if (scenario != null) {
            return scenario.getDefinition().getCapabilities();
        } else {
            return resourceService.read(schemaName, RESOURCE_TYPE, DEFAULT_CAPABILITY_STATEMENT_ID, request);
        }
    }

    // How to update? ALTER Tables
    public void update() {
        // TODO : implementation
    }

    // How to delete? DROP schema?
    public void delete() {
        // TODO : implementation
    }

}
