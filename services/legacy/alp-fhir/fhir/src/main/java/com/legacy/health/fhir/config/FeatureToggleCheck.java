package com.legacy.health.fhir.config;

import java.lang.annotation.*;

@Target(ElementType.METHOD) // can use in method only.
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Documented
public @interface FeatureToggleCheck {

    String value();

    boolean activeByDefault() default false;
}
