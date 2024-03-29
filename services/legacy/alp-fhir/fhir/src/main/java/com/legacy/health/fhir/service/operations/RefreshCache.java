package com.legacy.health.fhir.service.operations;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.legacy.health.fhir.helper.FhirUtils;
import com.legacy.health.fhir.meta.OperationOutcomeBuilder;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.OperationOutcome;
import com.legacy.health.fhir.meta.entity.Issue.Severity;
import com.legacy.health.fhir.meta.instance.Structure;

@Service("$refreshCache")
public class RefreshCache extends AbstractOperationExecutor {

	@Override
	public Structure execute(Map<String, String[]> requestParameters, Map<String, String[]> headers, Structure input,
			String schemaName, String resourceType) throws FhirException, SQLException {

		if (!resourceType.equalsIgnoreCase("Scenario")) {
			throw new FhirException("Operation $refreshCache not valid for resource " + resourceType, null);
		}

		OperationOutcome outcome = null;

		try {

			HashMap<String, String> security = new HashMap<String, String>();
			security.put("scope", "FHIR_SCENARIO_ADMIN");
			// forceful update of the list all scenario cache
			contentRepositoryFactory.getContentRepository().getAllScenarios(true);

			outcome = new OperationOutcomeBuilder()
					.addIssue(Severity.information, "operation-refreshCache")
					.withDetails("Scenario cache is refreshed successfully")
					.issue()
					.outcome();

		} catch (FhirException e) {
			outcome = new OperationOutcomeBuilder()
					.addIssue(Severity.error, "operation-refreshCache")
					.withDetails(e)
					.issue()
					.outcome();
		}

		return FhirUtils.toStructure(outcome);

	}
}
