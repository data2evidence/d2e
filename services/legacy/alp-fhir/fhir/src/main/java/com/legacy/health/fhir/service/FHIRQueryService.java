package com.legacy.health.fhir.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.queryengine.Query;

import java.sql.SQLException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FHIRQueryService extends AbstractService {

    @Transactional(readOnly = true)
    public Structure query(String schemaName, JsonNode queryJson) throws SQLException, FhirException {
        Query query = (Query) queryBuilder.fromJson(queryJson);
        return getQueryExecutorExtension().doQuery(query, initializeRequestContext(schemaName), true, null);
    }

}
