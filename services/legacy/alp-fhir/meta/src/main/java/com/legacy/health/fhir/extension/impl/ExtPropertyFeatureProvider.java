package com.legacy.health.fhir.extension.impl;

import org.togglz.core.Feature;
import org.togglz.core.manager.PropertyFeatureProvider;
import org.togglz.core.util.NamedFeature;

import java.util.HashSet;
import java.util.Properties;
import java.util.Set;

public class ExtPropertyFeatureProvider extends PropertyFeatureProvider {

    Set<Feature> features = new HashSet<>();

    public ExtPropertyFeatureProvider(Properties properties) {
        super(properties);
        features.addAll(super.getFeatures());
    }

    public void addFeature(String feature) {
        this.features.add(new NamedFeature(feature));
    }

    @Override
    public Set<Feature> getFeatures() {
        return features;
    }
}
