package com.legacy.health.fhir.meta.json;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.legacy.health.fhir.meta.instance.ArrayElement;
import com.legacy.health.fhir.meta.instance.DefaultComplexElement;

public class JSONArrayElement extends DefaultComplexElement<ArrayNode> implements ArrayElement<ArrayNode> {

    public void setArrayElement(ArrayNode node) {
        this.internalValue = node;
    }

    @Override
    public boolean isArrayType() {
        return true;
    }

}
