package com.legacy.health.fhir.meta.fhirpath;

import com.legacy.health.fhir.meta.fhirpath.node.CollectionNode;

public interface FhirPathElement {
	CollectionNode evaluate(CollectionNode ctx);
}
