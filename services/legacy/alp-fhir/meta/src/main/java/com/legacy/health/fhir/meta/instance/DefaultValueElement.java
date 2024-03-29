package com.legacy.health.fhir.meta.instance;

public class DefaultValueElement extends AbstractValueElement<Object> {

    @Override
    protected void setObject() {
        this.externalValue = this.internalValue;
    }

    @Override
    public void updateValue(Object value) {
        this.externalValue = this.internalValue = value;
    }

}
