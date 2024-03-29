package com.legacy.health.fhir.meta.queryengine.impl;

import java.sql.SQLException;
import java.util.List;

import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.queryengine.QueryEngine;
import com.legacy.health.fhir.meta.repsitory.StructureConsumer;
import com.legacy.health.fhir.meta.repsitory.StructureProvider;

public class DefaultQueryEngine implements QueryEngine {

    protected StructureProvider provider;

    public void setStructureProvider(StructureProvider provider) {
        this.provider = provider;
        // provider.setStructureConsumer(this);
    }

    @Override
    public List<Structure> execute(Query query, Context context) {
        return null;
    }

    @Override
    public void executeAsync(Query query, StructureConsumer consumer, Context context) throws Exception {
        provider.provideStructures(context);

    }

    public void writeStructure(Structure structure) throws SQLException {

    }

    @Override
    public void execute(Query query, StructureConsumer consumer, Context context) throws Exception {
        QueryExecutor executor = new QueryExecutor(query, consumer);
        provider.setStructureConsumer(executor);
        provider.provideStructures(context);
    }
}
