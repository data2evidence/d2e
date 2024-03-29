package com.legacy.health.fhir.extension;

import com.legacy.health.fhir.extension.extensionpoints.annotations.ActiveByDefault;

@ActiveByDefault
public class TestExtensionPointImpl2 implements TestExtension {
    @Override
    public ExtensionMetadata getMetaData() {
        return new ExtensionMetadata("test2", "test2", "test2");
    }
}
