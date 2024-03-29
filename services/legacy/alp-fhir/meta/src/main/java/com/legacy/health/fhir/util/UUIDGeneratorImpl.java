package com.legacy.health.fhir.util;

import java.util.UUID;

public class UUIDGeneratorImpl implements UUIDGenerator {

    @Override
    public String generateId() {
        return UUID.randomUUID().toString();
    }

}
