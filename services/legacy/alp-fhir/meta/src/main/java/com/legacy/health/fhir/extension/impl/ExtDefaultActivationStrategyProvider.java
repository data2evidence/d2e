package com.legacy.health.fhir.extension.impl;

import org.togglz.core.activation.ActivationStrategyProvider;
import org.togglz.core.activation.DefaultActivationStrategyProvider;
import org.togglz.core.spi.ActivationStrategy;

import java.util.List;

public class ExtDefaultActivationStrategyProvider implements ActivationStrategyProvider {

    private final List<ActivationStrategy> strategies;

    public ExtDefaultActivationStrategyProvider() {
        DefaultActivationStrategyProvider p = new DefaultActivationStrategyProvider();
        this.strategies = p.getActivationStrategies();
    }

    public List<ActivationStrategy> getActivationStrategies() {
        return this.strategies;
    }
}
