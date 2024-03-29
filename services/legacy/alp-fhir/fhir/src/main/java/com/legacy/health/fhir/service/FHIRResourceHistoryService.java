package com.legacy.health.fhir.service;

import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.exception.ResourceNotFoundException;
import com.legacy.health.fhir.extension.FHIRResourceRepository;
import com.legacy.health.fhir.helper.FhirUtils;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.RequestContext;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.instance.ValueElement;
import com.legacy.health.fhir.meta.json.JSONStructure;
import com.legacy.health.fhir.util.Utils;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Service
public class FHIRResourceHistoryService extends AbstractService {

    @Autowired
    private FHIRResourceValidatorService validatorService;

    @Transactional(readOnly = true)
    public Structure read(String schema, String resourceType, String id, String version)
            throws FhirException, SQLException {

        // validate capability for an endpoint
        validatorService.validateCapabilityAgainstEndpoint(schema, resourceType, "history-instance", null,
                contentRepositoryFactory, searchExecutor, repository, connectionProperties);

        // check resource security authorization
        // read for single record
        HashMap<String, String> operation = new HashMap<String, String>();
        operation.put("operation", "read");
        id = Utils.checkUUID(id);
        StructureDefinition definition = this.repository.getStructureDefinitionById(resourceType);
        // version = Utils.checkUUID(version);
        FHIRResourceRepository resourceRepoExtension = getFHIRResourceRepoExtension();
        RequestContext requestContext = initializeRequestContext(schema);
        Structure structure = resourceRepoExtension.readResourceByVersion(id, definition, requestContext, null);

        if (structure.getElements().isEmpty()) {
            throw new ResourceNotFoundException(
                    String.format("Resource [%s] with id [%s] not found.", resourceType, id), null);
        }

        return structure;
    }

    @Transactional(readOnly = true)
    public Structure read(String schema, String resourceType, String id) throws FhirException, SQLException {

        // validate capability for an endpoint
        validatorService.validateCapabilityAgainstEndpoint(schema, resourceType, "history-instance", null,
                contentRepositoryFactory, searchExecutor, repository, connectionProperties);

        // check resource security authorization
        // read for multiple records
        HashMap<String, String> operation = new HashMap<String, String>();
        operation.put("operation", "read");

        id = Utils.checkUUID(id);
        StructureDefinition definition = this.repository.getStructureDefinitionById(resourceType);

        // Verify if this returns appropriate value
        StringBuilder prefix = new StringBuilder(
                ServletUriComponentsBuilder.fromCurrentRequest().build().toUriString());
        prefix.delete(prefix.lastIndexOf("/"), prefix.length());

        List<ObjectNode> resources = new ArrayList<>();
        FHIRResourceRepository resourceRepoExtension = getFHIRResourceRepoExtension();
        RequestContext requestContext = initializeRequestContext(schema);
        List<Structure> history = resourceRepoExtension.readResourceHistory(id, definition, requestContext, null);
        for (Structure structure : history) {
            if (structure instanceof JSONStructure) {
                JSONStructure jsonStructure = (JSONStructure) structure;
                ObjectNode entry = (ObjectNode) jsonStructure.getRoot();
                ValueElement ve = (ValueElement) structure.getElementByPath(resourceType + ".meta.versionId");
                String versionId = ve.getValue().toString();
                if (versionId.startsWith("urn:uuid:")) {
                    versionId = versionId.substring("urn:uuid:".length());
                }
                ObjectNode wrapper = JsonNodeFactory.instance.objectNode();
                wrapper.put("fullUrl", String.format("%s/_history/%s", prefix, versionId));
                wrapper.set("resource", entry);
                resources.add(wrapper);
            }
        }
        return FhirUtils.toBundle("history", resources);
    }

}
