package com.legacy.health.fhir.extension;

import com.legacy.health.fhir.extension.extensionpoints.ExtensionPoint;

@TestExtensionPoint
public interface TestExtension extends Extension {

    public static ExtensionPoint<TestExtensionPoint, TestExtension> ExtensionPoint() {
        return new ExtensionPoint<TestExtensionPoint, TestExtension>(TestExtensionPoint.class, TestExtension.class);
    }
}
