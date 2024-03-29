package com.legacy.health.fhir.meta.queryengine.extension.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE) // can use in method only.
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Documented
public @interface MartControllerAnnotation {

}
