package com.legacy.health.fhir.meta.json;

import java.util.Iterator;
import java.util.Vector;

import com.fasterxml.jackson.databind.JsonNode;
import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.repsitory.StructureConsumer;

public class JSONStructureConsumer implements StructureConsumer {

    protected boolean useBuffer = false;
    protected Vector<JSONNodeConsumer> listener = new Vector<JSONNodeConsumer>();

    public void addResultListener(JSONNodeConsumer consumer) {
        listener.addElement(consumer);
    }

    @Override
    public void writeStructure(Structure structure, Context context) throws Exception {
        if (structure instanceof JSONStructure) {
            JsonNode node = ((JSONStructure) structure).getRoot();
            for (Iterator iterator = listener.iterator(); iterator.hasNext();) {
                JSONNodeConsumer jsonNodeConsumer = (JSONNodeConsumer) iterator.next();
                jsonNodeConsumer.convertedStructure(node);
            }
        }
    }

}
