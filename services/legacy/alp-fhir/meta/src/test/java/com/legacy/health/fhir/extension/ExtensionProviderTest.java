package com.legacy.health.fhir.extension;

import org.junit.Test;

import java.util.List;

import static org.junit.Assert.*;

public class ExtensionProviderTest {

    @Test
    public void getExtensionsForExtensionPoint() {
        long start = System.currentTimeMillis();
        List<TestExtension> extensionsForExtensionPoint = ExtensionProvider
                .getExtensionsForExtensionPoint(TestExtension.ExtensionPoint());
        long duration = System.currentTimeMillis() - start;
        assertEquals(extensionsForExtensionPoint.size(), 2);
        start = System.currentTimeMillis();
        List<TestExtension> extensionsForExtensionPoint2 = ExtensionProvider
                .getExtensionsForExtensionPoint(TestExtension.ExtensionPoint());
        long duration2 = System.currentTimeMillis() - start;
        assertEquals(extensionsForExtensionPoint2.size(), 2);
        assertNotEquals(extensionsForExtensionPoint.get(0), extensionsForExtensionPoint2.get(0));
        assertNotEquals(extensionsForExtensionPoint.get(1), extensionsForExtensionPoint2.get(1));
        assertTrue(duration2 < duration);
        String ext1Name = extensionsForExtensionPoint.get(0).getMetaData().name;
        String ext2Name = extensionsForExtensionPoint.get(1).getMetaData().name;
        if (ext1Name.equals("test1")) {
            assertEquals(ext2Name, "test2");
        } else if (ext1Name.equals("test2")) {
            assertEquals(ext2Name, "test1");
        } else {
            fail("unknown extension");
        }
        ext1Name = extensionsForExtensionPoint2.get(0).getMetaData().name;
        ext2Name = extensionsForExtensionPoint2.get(1).getMetaData().name;
        if (ext1Name.equals("test1")) {
            assertEquals(ext2Name, "test2");
        } else if (ext1Name.equals("test2")) {
            assertEquals(ext2Name, "test1");
        } else {
            fail("unknown extension");
        }

        List<FeatureSwitchManagerExtension> featureSwitchManager = ExtensionProvider
                .getExtensionsForExtensionPoint(FeatureSwitchManagerExtension.FeatureSwitchManager());
        featureSwitchManager.get(0).disableFeature("com.legacy.health.fhir.extension.TestExtensionPointImpl1");
        featureSwitchManager.get(0).disableFeature("com.legacy.health.fhir.extension.TestExtensionPointImpl2");
        featureSwitchManager.get(0).enableFeature("com.legacy.health.fhir.extension.TestExtensionPointImpl3");
        extensionsForExtensionPoint = ExtensionProvider.getExtensionsForExtensionPoint(TestExtension.ExtensionPoint());
        assertEquals(extensionsForExtensionPoint.size(), 1);

        featureSwitchManager.get(0).enableFeature("com.legacy.health.fhir.extension.TestExtensionPointImpl1");
        featureSwitchManager.get(0).enableFeature("com.legacy.health.fhir.extension.TestExtensionPointImpl2");
        featureSwitchManager.get(0).disableFeature("com.legacy.health.fhir.extension.TestExtensionPointImpl3");
        extensionsForExtensionPoint = ExtensionProvider.getExtensionsForExtensionPoint(TestExtension.ExtensionPoint());
        assertEquals(extensionsForExtensionPoint.size(), 2);

        assertEquals(
                ExtensionProvider.isFeatureActive("com.legacy.health.fhir.extension.TestExtensionPointImpl1", false),
                true);
        assertEquals(
                ExtensionProvider.isFeatureActive("com.legacy.health.fhir.extension.TestExtensionPointImpl2", false),
                true);
        assertEquals(
                ExtensionProvider.isFeatureActive("com.legacy.health.fhir.extension.TestExtensionPointImpl3", true),
                false);
        assertEquals(
                ExtensionProvider.isFeatureActive("com.legacy.health.fhir.extension.TestExtensionPointImpl30", true),
                true);
    }
}