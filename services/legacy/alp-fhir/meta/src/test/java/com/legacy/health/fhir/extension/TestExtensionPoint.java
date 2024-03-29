package com.legacy.health.fhir.extension;

import java.lang.annotation.*;

@Target(ElementType.TYPE) // can use in method only.
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Documented
public @interface TestExtensionPoint {
}
