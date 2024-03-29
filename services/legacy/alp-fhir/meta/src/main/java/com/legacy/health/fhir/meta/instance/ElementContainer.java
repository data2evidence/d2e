package com.legacy.health.fhir.meta.instance;

import java.util.List;

public interface ElementContainer extends InstanceType {

    List<Element> getElements();

    void addElement(Element element);

    Element getOrCreateChildElement(String childname);

    default boolean isArrayType() {
        return false;
    }
}
