package com.legacy.health.fhir.extension;

public class TestExtensionPointImpl3 implements TestExtension {
    @Override
    public ExtensionMetadata getMetaData() {
        return new ExtensionMetadata("test1", "test1", "test1");
    }
}
