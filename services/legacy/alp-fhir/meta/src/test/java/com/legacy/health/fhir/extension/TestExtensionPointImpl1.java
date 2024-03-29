package com.legacy.health.fhir.extension;

public class TestExtensionPointImpl1 implements TestExtension {
    @Override
    public ExtensionMetadata getMetaData() {
        return new ExtensionMetadata("test1", "test1", "test1");
    }
}
