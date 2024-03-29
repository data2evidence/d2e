package com.legacy.health.fhir.extension.impl;

import org.togglz.core.Feature;
import org.togglz.core.repository.FeatureState;
import org.togglz.core.repository.file.FileBasedStateRepository;

import java.io.File;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class ExtPropertyBasedStateRepository extends FileBasedStateRepository {

    private static final Map<String, Boolean> cache = new ConcurrentHashMap<>();

    ExtPropertyBasedStateRepository(File file) {
        super(file);
    }

    @Override
    public FeatureState getFeatureState(Feature f) {
        if (cache.getOrDefault(f.name(), null) == null) {
            if (System.getenv().getOrDefault(f.name(), null) != null) {
                return new FeatureState(f, System.getenv().get(f.name()).equals("true"));
            } else {
                FeatureState s = super.getFeatureState(f);
                if (s == null) {// workarround for jar file
                    s = new FeatureState(f, true);
                }
                ExtPropertyBasedStateRepository.cache.put(f.name(), s.isEnabled());
                return s;
            }
        } else {
            return new FeatureState(f, cache.get(f.name()));
        }
    }

    @Override
    public void setFeatureState(FeatureState s) {
        ExtPropertyBasedStateRepository.cache.put(s.getFeature().name(), s.isEnabled());
        // super.setFeatureState(s);
    }
}
