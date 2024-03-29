package com.legacy.health.fhir.meta.json;

import com.fasterxml.jackson.databind.JsonNode;

public interface JSONNodeConsumer {

    public void convertedStructure(JsonNode node);
}
