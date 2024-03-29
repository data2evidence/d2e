package com.legacy.health.fhir.meta.queryengine.impl;

import com.legacy.health.fhir.meta.instance.Structure;

public interface DefaultQueryElement {

    Structure execute(Structure structure);
}
