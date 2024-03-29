package com.legacy.health.fhir.meta.xml;

import org.w3c.dom.Element;
import com.legacy.health.fhir.meta.instance.ArrayElement;
import com.legacy.health.fhir.meta.instance.DefaultComplexElement;

public class XMLArrayElement extends DefaultComplexElement<Element> implements ArrayElement<Element> {

    public void setArrayElement(Element xmlElement) {
        this.internalValue = xmlElement;
    }

    public int currentIndex() {
        return this.elements.size();
    }

    @Override
    public boolean isArrayType() {
        return true;
    }

}
