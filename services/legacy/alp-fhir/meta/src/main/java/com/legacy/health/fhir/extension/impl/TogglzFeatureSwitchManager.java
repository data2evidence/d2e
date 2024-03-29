package com.legacy.health.fhir.extension.impl;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import java.util.Set;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.togglz.core.Feature;
import org.togglz.core.manager.FeatureManager;
import org.togglz.core.manager.FeatureManagerBuilder;
import org.togglz.core.repository.FeatureState;
import org.togglz.core.util.NamedFeature;

import com.legacy.health.fhir.extension.ExtensionMetadata;
import com.legacy.health.fhir.extension.ExtensionProvider;
import com.legacy.health.fhir.extension.FeatureSwitchManagerExtension;

public class TogglzFeatureSwitchManager implements FeatureSwitchManagerExtension {

    private static FeatureManager featureManager = null;
    private static ExtPropertyFeatureProvider fProvider = null;

    private static Log log = LogFactory.getLog(TogglzFeatureSwitchManager.class);

    public TogglzFeatureSwitchManager() {
        if (featureManager == null) {
            InputStream s = null;
            InputStream s2 = null;
            try {
                Properties p = new Properties();

                ExtPropertyBasedStateRepository extPropertyBasedStateRepository = null;
                if ((s = ExtensionProvider.class.getClassLoader()
                        .getResourceAsStream("extensions.properties")) != null) {
                    p.load(s);
                    s.close();
                    if ((s2 = ExtensionProvider.class.getClassLoader()
                            .getResourceAsStream("application.properties")) != null) {
                        p.load(s2);
                        s2.close();
                    }
                    extPropertyBasedStateRepository = new ExtPropertyBasedStateRepository(new File(
                            ExtensionProvider.class.getClassLoader().getResource("extensions.properties").getFile()));
                } else {
                    extPropertyBasedStateRepository = new ExtPropertyBasedStateRepository(
                            File.createTempFile(".extensions", null, null));
                }
                Set<String> keys = p.stringPropertyNames();
                for (String key : keys) {
                    extPropertyBasedStateRepository.setFeatureState(
                            new FeatureState(new NamedFeature(key), p.getProperty(key).equalsIgnoreCase("true")));
                }
                fProvider = new ExtPropertyFeatureProvider(p);
                featureManager = new FeatureManagerBuilder()
                        .featureProvider(fProvider)
                        .stateRepository(extPropertyBasedStateRepository)
                        .activationStrategyProvider(new ExtDefaultActivationStrategyProvider())
                        .build();
            } catch (IOException e) {
                e.printStackTrace();
                log.error(" IOException " + e.getLocalizedMessage());
            } finally {
                try {
                    if (s != null)
                        s.close();
                } catch (IOException e) {
                    log.error(" IOException while closing " + e.getLocalizedMessage(), e);
                }
                try {
                    if (s2 != null)
                        s2.close();
                } catch (IOException e) {
                    log.error(" IOException while closing " + e.getLocalizedMessage(), e);
                }
            }
        }
    }

    @Override
    public boolean isActive(String feature, boolean defaultValue) {
        Feature f = new NamedFeature(feature);
        if (System.getenv().containsKey(feature)) {
            return System.getenv(feature).equals("true");
        }
        if (!fProvider.getFeatures().contains(f)) {
            return defaultValue;
        }
        return featureManager.isActive(f);
    }

    @Override
    public ExtensionMetadata getMetaData() {
        return new ExtensionMetadata("TogglzFeatureSwitchImplementation", "0.9", "");
    }

    @Override
    public void enableFeature(String feature) {
        fProvider.features.add(new NamedFeature(feature));
        featureManager.setFeatureState(new FeatureState(new NamedFeature(feature), true));
    }

    @Override
    public void disableFeature(String feature) {
        fProvider.features.add(new NamedFeature(feature));
        featureManager.setFeatureState(new FeatureState(new NamedFeature(feature), false));
    }

    @Override
    public void reloadFeaturesStates() {
        // Nothing to do here currently
    }
}
