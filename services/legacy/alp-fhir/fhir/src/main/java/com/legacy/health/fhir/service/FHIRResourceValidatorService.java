package com.legacy.health.fhir.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.legacy.health.fhir.content.ContentRepository;
import com.legacy.health.fhir.content.ContentRepositoryFactory;
import com.legacy.health.fhir.content.model.Scenario;
import com.legacy.health.fhir.executor.SearchExecutor;
import com.legacy.health.fhir.extension.CapabilityValidatorExtension;
import com.legacy.health.fhir.extension.ExtensionProvider;
import com.legacy.health.fhir.extension.exceptions.CapabilityValidationException;
import com.legacy.health.fhir.extension.extensionpoints.ExtensionPoint;
import com.legacy.health.fhir.extension.extensionpoints.annotations.CapabilityValidator;
import com.legacy.health.fhir.helper.FhirUtils;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.OperationOutcome;
import com.legacy.health.fhir.meta.entity.RequestContext;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.queryengine.extension.QueryExecutorExtension;
import com.legacy.health.fhir.meta.queryengine.extension.annotation.QueryAnnotation;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FHIRResourceValidatorService {

    @Autowired
    String activeProfile;

    public boolean validateResource(Structure resource) {
        return true;
    }

    public boolean validateResource(Structure resource, String resourceType) {
        if (resource == null || resource.getElements().isEmpty())
            return false;
        if (!resource.getResourceType().equals(resourceType))
            return false;
        return validateResource(resource);
    }

    @SuppressWarnings("unlikely-arg-type")
    public void validateCapabilityAgainstEndpoint(String endpoint, String resourceType, String operationType,
            HashMap<String, ArrayList<String>> searchOperands, ContentRepositoryFactory contentRepositoryFactory,
            SearchExecutor searchExecutor, MetaRepository repository, Properties connectionProperties)
            throws FhirException, SQLException {
        ContentRepository repo = contentRepositoryFactory.getContentRepository();

        CapabilityValidatorExtension capabilityValidator = getCapabilityValidatorExtension();
        Structure capabilityStatement = null;

        // load all the scenarios
        repo.getAllScenarios();
        Scenario scenario = repo.getScenarioForEndpoint(endpoint);

        // if a scenario is found.
        if (scenario != null) {
            capabilityStatement = scenario.getDefinition().getCapabilities();
        } else {
            // handle for generic persistancy
            Structure StructureBundle = null;
            StructureBundle = this.getCapabilityResources(searchExecutor, new HashMap<>(), repository, endpoint,
                    connectionProperties, "CapabilityStatement");

            JsonNode bundleAsJson = FhirUtils.toJson(StructureBundle);

            JsonNode entries = bundleAsJson.get("entry");

            JsonNode entryCapability = null;
            for (JsonNode entry : entries) {
                entryCapability = entry.get("resource");
                if (endpoint.equalsIgnoreCase("content") &&
                        entryCapability.has("url") &&
                        entryCapability.get("url").asText()
                                .equals("http://email.com/health/fhir/content/CapabilityStatement/content")) {
                    // for content we use our custom capability ( where we also store the reference
                    // scenario capability also )
                    break;
                }
            }
            capabilityStatement = FhirUtils.toStructure(entryCapability);
        }

        OperationOutcome outcome = capabilityValidator.validate(capabilityStatement, resourceType, operationType,
                searchOperands);

        if (FhirUtils.operationOutcomeHasErrorCheck(outcome)) {
            CapabilityValidationException exception = new CapabilityValidationException(
                    "Failure in Validating Capability", null);
            exception.setOperationOutcome(outcome);

            throw exception;
        }
    }

    private Structure getCapabilityResources(SearchExecutor searchExecutor, Map<String, String[]> parameters,
            MetaRepository repository, String schemaName, Properties connectionProperties, String resourceType)
            throws FhirException, SQLException {

        Query query = searchExecutor.doSearch(resourceType, parameters, repository, false);
        return (getQueryExecutorExtension("generic") != null) ? getQueryExecutorExtension("generic").doQuery(query,
                initializeRequestContext(schemaName, repository, connectionProperties), true, null) : null;

    }

    private RequestContext initializeRequestContext(String schemaName, MetaRepository repository,
            Properties connectionProperties) {
        RequestContext requestContext = new RequestContext();
        requestContext.setEndPoint(schemaName);
        requestContext.setMetaRepo(repository);
        requestContext.setActiveSpringProfileConfiguration(activeProfile);
        requestContext.setConnectionDetails(connectionProperties);
        return requestContext;
    }

    private QueryExecutorExtension getQueryExecutorExtension(String type) {
        ExtensionPoint<QueryAnnotation, QueryExecutorExtension> queryExecutorExtension = new ExtensionPoint<>(
                QueryAnnotation.class, QueryExecutorExtension.class);
        List<QueryExecutorExtension> extensionsForExtensionPoint = ExtensionProvider
                .getExtensionsForExtensionPoint(queryExecutorExtension);
        for (QueryExecutorExtension exec : extensionsForExtensionPoint) {
            if (type.equals(exec.getRepositoryType())) {
                return exec;
            }
        }
        return null;
    }

    private CapabilityValidatorExtension getCapabilityValidatorExtension() {
        ExtensionPoint<CapabilityValidator, CapabilityValidatorExtension> capabilityValidator = new ExtensionPoint<>(
                CapabilityValidator.class, CapabilityValidatorExtension.class);
        List<CapabilityValidatorExtension> extensions = ExtensionProvider
                .getExtensionsForExtensionPoint(capabilityValidator);
        return extensions.get(0);
    }

}
