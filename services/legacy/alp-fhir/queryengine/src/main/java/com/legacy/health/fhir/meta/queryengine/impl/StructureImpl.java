package com.legacy.health.fhir.meta.queryengine.impl;

import com.legacy.health.fhir.meta.instance.ArrayElement;
import com.legacy.health.fhir.meta.instance.ComplexElement;
import com.legacy.health.fhir.meta.instance.DefaultStructure;
import com.legacy.health.fhir.meta.instance.DefaultValueElement;
import com.legacy.health.fhir.meta.instance.PojoArrayElement;
import com.legacy.health.fhir.meta.instance.PojoComplexElement;
import com.legacy.health.fhir.meta.instance.ValueElement;

public class StructureImpl extends DefaultStructure<Object> {

    public StructureImpl(Object root) {
        super(root);
    }

    @Override
    public void setId(String id) {
        ValueElement idElement = (ValueElement) this.getElementByPath(this.definition.getId() + ".id");
        if (idElement != null) {
            idElement.updateValue(id);
        } else {
            idElement = new DefaultValueElement();
            idElement.setDefinition(this.definition.getDataElementByName("id"));
            idElement.setPath("id");
            idElement.setContainer(this);
            idElement.setStructure(this);
            this.addElement(idElement);
        }
    }

    @Override
    public ValueElement getNewValueElement() {
        return new DefaultValueElement();
    }

    @Override
    public ComplexElement getNewComplexElement() {
        return new PojoComplexElement();
    }

    @Override
    public ArrayElement getNewArrayElement() {
        return new PojoArrayElement();
    }

}
