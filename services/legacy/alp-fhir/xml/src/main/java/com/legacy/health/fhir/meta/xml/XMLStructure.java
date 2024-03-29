package com.legacy.health.fhir.meta.xml;

import org.w3c.dom.Element;

import com.legacy.health.fhir.meta.instance.ArrayElement;
import com.legacy.health.fhir.meta.instance.ComplexElement;
import com.legacy.health.fhir.meta.instance.DefaultStructure;
import com.legacy.health.fhir.meta.instance.ValueElement;

public class XMLStructure extends DefaultStructure<Element> {

    public XMLStructure(Element element) {
        super(element);
    }

    @Override
    public void setId(String id) {
        ValueElement idElement = (ValueElement) this.getElementByPath(this.definition.getId() + ".id");
        if (idElement != null) {
            idElement.updateValue(id);
        } else {
            idElement = new XMLValueElement();
            idElement.setDefinition(this.definition.getDataElementByName("id"));
            idElement.setPath("id");
            idElement.setContainer(this);
            idElement.setStructure(this);
            this.addElement(idElement);

            Element xmlIdElement = this.root.getOwnerDocument().createElement("id");
            xmlIdElement.setAttribute("value", id);
            this.root.appendChild(xmlIdElement);
        }
    }

    @Override
    public ValueElement getNewValueElement() {
        return new XMLValueElement();
    }

    @Override
    public ComplexElement getNewComplexElement() {
        return new XMLComplexElement();
    }

    @Override
    public ArrayElement getNewArrayElement() {
        return new XMLArrayElement();
    }

}
