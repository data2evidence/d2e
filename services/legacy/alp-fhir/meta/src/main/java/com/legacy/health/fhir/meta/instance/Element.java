package com.legacy.health.fhir.meta.instance;

import com.legacy.health.fhir.meta.entity.DataElement;

public interface Element<T> extends InstanceType {

    void setStructure(Structure structure);

    void setDefinition(DataElement element);

    DataElement getDefinition();

    void setPath(String path);

    String getPath();

    ElementContainer getContainer();

    void setContainer(ElementContainer container);

    T getElementNode();

}
