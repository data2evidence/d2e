package com.legacy.health.fhir.meta.queryengine.impl;

import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.Structure;

public class StructureDefinitionFilter implements DefaultQueryElement {

    protected StructureDefinition sd;

    public void setType(StructureDefinition sd) {
        this.sd = sd;
    }

    @Override
    public Structure execute(Structure structure) {
        if (structure.getDefinition().equals(sd)) {
            return structure;
        }
        return null;
    }
}
