package com.legacy.health.fhir.meta.queryengine;

import java.sql.SQLException;

import com.legacy.health.fhir.meta.AuthorizationException;
import com.legacy.health.fhir.meta.ResourceTypeNotSupportedException;
import com.legacy.health.fhir.meta.FhirException;

public interface InstanceAuthorizationHook {

	void injectInstanceAuthorization(String schema, String resourceType, Query query)
			throws SQLException, FhirException, ResourceTypeNotSupportedException, AuthorizationException;
}
