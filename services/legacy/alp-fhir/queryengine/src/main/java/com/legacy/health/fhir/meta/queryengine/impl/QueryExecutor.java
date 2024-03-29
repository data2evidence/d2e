package com.legacy.health.fhir.meta.queryengine.impl;

import java.util.ArrayList;
import java.util.List;

import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.queryengine.From;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.repsitory.StructureConsumer;

public class QueryExecutor implements StructureConsumer {

    protected Query query;
    protected StructureConsumer target;
    protected List<DefaultQueryElement> queryElements = new ArrayList();
    protected boolean initialized = false;

    public QueryExecutor(Query query, StructureConsumer target) {
        this.query = query;
        initialized = false;
        this.target = target;
    }

    protected void prepare() {
        if (initialized) {
            return;
        }
        initialized = true;
        From from = query.from();
        StructureDefinitionFilter fromFilter = new StructureDefinitionFilter();
        fromFilter.setType(from.getStructureDefinition());
        queryElements.add(fromFilter);
        Projection projection = new Projection();
        projection.setOutput(query.getResultElements());
        queryElements.add(projection);
    }

    @Override
    public void writeStructure(Structure structure, Context context) throws Exception {
        prepare();
        Structure current = null;
        for (int i = 0; i < queryElements.size(); i++) {
            DefaultQueryElement element = queryElements.get(i);
            current = element.execute(structure);
            if (current == null) {
                break;
            }
        }
        if (current != null) {
            target.writeStructure(current, context);
        }

    }

}
