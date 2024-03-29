package com.legacy.health.fhir.service;

import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.service.operations.OperationExecutor;
import java.sql.SQLException;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FHIROperationService extends AbstractService {

    private OperationExecutor getOperationExecutor(String operation) {
        OperationExecutor ret = this.factory.getBean(operation, OperationExecutor.class);
        ret.setAuthorizationHook(this);
        return ret;
    }

    @Transactional(rollbackFor = SQLException.class)
    public Structure execute(String operation, Map<String, String[]> requestParameters,
            Map<String, String[]> requestHeaders, Structure input, String schemaName) throws Exception {
        return getOperationExecutor(operation).execute(requestParameters, requestHeaders, input, schemaName);
    }

    @Transactional(rollbackFor = SQLException.class)
    public Structure execute(String operation, Map<String, String[]> requestParameters,
            Map<String, String[]> requestHeaders, Structure input, String schemaName, String resourceType)
            throws Exception {
        return getOperationExecutor(operation).execute(requestParameters, requestHeaders, input, schemaName,
                resourceType);
    }

    @Transactional(rollbackFor = SQLException.class)
    public Structure execute(String operation, Map<String, String[]> requestParameters,
            Map<String, String[]> requestHeaders, Structure input, String schemaName, String resourceType, String id)
            throws Exception {
        return getOperationExecutor(operation).execute(requestParameters, requestHeaders, input, schemaName,
                resourceType, id);
    }

}
