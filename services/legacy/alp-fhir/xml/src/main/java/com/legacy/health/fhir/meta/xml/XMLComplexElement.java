package com.legacy.health.fhir.meta.xml;

import org.w3c.dom.Element;
import org.w3c.dom.Node;
import com.legacy.health.fhir.meta.instance.DefaultComplexElement;

public class XMLComplexElement extends DefaultComplexElement<Element> {

    public void setComplexElement(Node xmlElement) {
        this.internalValue = (Element) xmlElement;
    }

}
