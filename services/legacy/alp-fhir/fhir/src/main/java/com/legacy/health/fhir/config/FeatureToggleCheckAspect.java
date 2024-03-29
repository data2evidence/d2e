package com.legacy.health.fhir.config;

import com.legacy.health.fhir.extension.ExtensionProvider;
import com.legacy.health.fhir.extension.FeatureSwitchManagerExtension;
import com.legacy.health.fhir.meta.FhirException;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class FeatureToggleCheckAspect {
    // for any method with @LogDuration, no matter what the return type, name, or
    // arguments are, call this method
    @Around("@annotation(com.legacy.health.fhir.config.FeatureToggleCheck) && execution(* *(..))")
    public Object CheckFeatureActive(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        FeatureToggleCheck x = signature.getMethod().getAnnotation(FeatureToggleCheck.class);
        String feature = x.value();
        FeatureSwitchManagerExtension switchManager = ExtensionProvider
                .getExtensionsForExtensionPoint(FeatureSwitchManagerExtension.FeatureSwitchManager()).get(0);
        if (switchManager.isActive(feature, x.activeByDefault())) {
            return joinPoint.proceed();
        } else {
            throw new FhirException("Feature disabled", null);
        }
    }
}
