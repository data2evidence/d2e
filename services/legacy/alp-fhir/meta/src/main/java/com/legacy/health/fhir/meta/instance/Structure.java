package com.legacy.health.fhir.meta.instance;

import com.legacy.health.fhir.meta.entity.StructureDefinition;

import java.util.Collection;

public interface Structure<T> extends ElementContainer, InstanceType {

    default Collection<Element> getAllElements() {
        throw new UnsupportedOperationException();
    }

    void setDefinition(StructureDefinition definition);

    StructureDefinition getDefinition();

    Element getElementByPath(String path);

    T getRoot();

    void setId(String id);

    String getId();

    String getResourceType();

    ValueElement getNewValueElement();

    ComplexElement getNewComplexElement();

    ArrayElement getNewArrayElement();

    String getCanonicalReference();

}
