package com.legacy.health.fhir.meta.queryengine.extension;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.extension.Extension;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.RequestContext;

@com.legacy.health.fhir.meta.queryengine.extension.annotation.MartControllerAnnotation
public interface MartControllerExtension extends Extension {

	void createDataMart(String id, ObjectNode definition, RequestContext reqCtx) throws FhirException;

	void deleteDataMart(String id, RequestContext reqCtx) throws FhirException;

	// public static ExtensionPoint<MartControllerAnnotation,
	// MartControllerExtension> MartController() {
	// return new ExtensionPoint<>(MartControllerAnnotation.class,
	// MartControllerExtension.class);
	// }

}