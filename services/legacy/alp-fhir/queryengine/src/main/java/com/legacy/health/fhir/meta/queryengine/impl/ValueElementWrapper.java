package com.legacy.health.fhir.meta.queryengine.impl;

import com.legacy.health.fhir.meta.instance.AbstractValueElement;
import com.legacy.health.fhir.meta.instance.Element;
import com.legacy.health.fhir.meta.instance.ValueElement;

public class ValueElementWrapper extends AbstractValueElement<Element> {

    @Override
    protected void setObject() {
        this.externalValue = ((ValueElement) internalValue).getValue();
    }

    @Override
    public void updateValue(Object value) {
        // TODO: Implementation...
    }

    @Override
    public void setPath(String path) {
        throw new UnsupportedOperationException();
    }

    @Override
    public String getPath() {
        return internalValue.getPath();
    }

}
