package com.legacy.health.fhir.meta.xml;

import org.w3c.dom.Attr;

import com.legacy.health.fhir.meta.instance.AbstractValueElement;

public class XMLAttributeValueElement extends AbstractValueElement<Attr> {

    @Override
    protected void setObject() {
        this.externalValue = this.internalValue.getValue();
    }

    @Override
    public void updateValue(Object value) {
        this.externalValue = value;
        this.internalValue.setValue(value.toString());
    }

}
