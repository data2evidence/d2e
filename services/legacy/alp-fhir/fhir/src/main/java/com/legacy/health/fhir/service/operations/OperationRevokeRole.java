package com.legacy.health.fhir.service.operations;

import com.legacy.health.fhir.content.ContentRepository;
import com.legacy.health.fhir.content.model.Role;
import com.legacy.health.fhir.content.model.Scenario;
import com.legacy.health.fhir.content.model.ScenarioDefinition;
import com.legacy.health.fhir.exception.InvalidRequestException;
import com.legacy.health.fhir.extension.FHIRResourceRepository;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.sql.catalog.RoleCreator;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("$revokeRole")
public class OperationRevokeRole extends AbstractOperationExecutor {
    @Autowired
    HttpServletRequest request;

    private Log log = LogFactory.getLog(OperationRevokeRole.class);

    @Override
    public Structure execute(Map<String, String[]> requestParameters, Map<String, String[]> headers, Structure input,
            String schemaName, String resourceType, String id) throws FhirException, SQLException {

        if (!resourceType.equalsIgnoreCase("Scenario")) {
            throw new FhirException("Operation $assignRole not valid for resource " + resourceType, null);
        }
        if (!request.getMethod().equalsIgnoreCase("POST")) {
            return null;
        }

        String[] roles = requestParameters.get("role");
        String[] users = requestParameters.get("user");
        if (roles == null || roles.length != 1) {
            throw new InvalidRequestException("Invalid number of roles", null);
        }
        if (users == null || users.length != 1) {
            throw new InvalidRequestException("Invalid number of roles", null);
        }

        if (id.equalsIgnoreCase("content")) {
            ContentRepository repo = this.contentRepositoryFactory.getContentRepository();
            if (roles[0].equalsIgnoreCase("SupportRole")) {
                repo.grantRole(null, RoleCreator.getDefaultSupportRole(), users[0], initializeRequestContext(id), null);

            } else if (roles[0].equalsIgnoreCase("SuperSupportRole")) {
                repo.grantRole(null, RoleCreator.getSuperSupportRole(), users[0], initializeRequestContext(id), null);
            } else {
                throw new InvalidRequestException("Unknown role", null);
            }
            return null;
        }

        ContentRepository repo = contentRepositoryFactory.getContentRepository();
        Scenario scenario = repo.getScenarioForEndpoint(id);
        String endpoint = id;
        if (scenario == null) {
            throw new InvalidRequestException("Invalid Scenario", null);
        }

        ScenarioDefinition def = scenario.getDefinition();
        String category = def.getCategory();
        FHIRResourceRepository resRepo = FHIRResourceRepository.getFHIRResourceRepoExtension(category);

        HashMap<String, String> security = new HashMap<String, String>();
        security.put("scope", "FHIR_SCENARIO_ADMIN");
        security.put("attributeName", "endpoint");
        security.put("attributeValue", id);

        boolean foundRole = false;
        // read role name from parameters
        for (String scope : scenario.getScope()) {
            List<ScenarioDefinition.Deployment> deployments = scenario.getDefinition().getDeployment();
            for (ScenarioDefinition.Deployment deployment : deployments) {
                if (scope.equals(deployment.getScope())) {
                    for (Role r : deployment.getRole()) {
                        if (r.getId() != null && r.getId().equalsIgnoreCase(roles[0])) {
                            foundRole = true;
                            resRepo.revokeRole(scenario, r, users[0], initializeRequestContext(endpoint), null);
                        }
                    }
                }

            }
        }

        if (roles[0].equalsIgnoreCase("SupportRole")) {
            if (foundRole) {
                log.warn("Warning support role was overwritten by Scenario");
            } else {
                resRepo.revokeRole(scenario, RoleCreator.getDefaultSupportRole(), users[0],
                        initializeRequestContext(endpoint), null);
            }
        } else if (roles[0].equalsIgnoreCase("SuperSupportRole")) {
            if (foundRole) {
                log.warn("Warning support role was overwritten by Scenario");
            } else {
                resRepo.revokeRole(scenario, RoleCreator.getSuperSupportRole(), users[0],
                        initializeRequestContext(endpoint), null);
            }
        } else {
            if (!foundRole) {
                throw new InvalidRequestException("Unknown role", null);
            }
        }
        return null;
    }

}
