package com.legacy.health.fhir.meta.json;

import com.fasterxml.jackson.databind.JsonNode;
import com.legacy.health.fhir.meta.instance.DefaultComplexElement;

public class JSONComplexElement extends DefaultComplexElement<JsonNode> {

    public void setComplexElement(JsonNode node) {
        this.internalValue = node;
    }

}
