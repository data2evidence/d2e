package com.legacy.health.fhir.service.operations;

import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.queryengine.InstanceAuthorizationHook;

import java.util.Map;

public interface OperationExecutor {

        public Structure execute(Map<String, String[]> requestParameters, Map<String, String[]> headers,
                        Structure input,
                        String schemaName) throws Exception;

        public Structure execute(Map<String, String[]> requestParameters, Map<String, String[]> headers,
                        Structure input,
                        String schemaName, String resourceType) throws Exception;

        public Structure execute(Map<String, String[]> requestParameters, Map<String, String[]> headers,
                        Structure input,
                        String schemaName, String resourceType, String id) throws Exception;

        public void setAuthorizationHook(InstanceAuthorizationHook authorizationHook);

}
