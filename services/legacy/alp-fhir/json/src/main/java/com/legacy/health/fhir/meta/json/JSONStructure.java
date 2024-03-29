package com.legacy.health.fhir.meta.json;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;
import com.legacy.health.fhir.meta.instance.ArrayElement;
import com.legacy.health.fhir.meta.instance.ComplexElement;
import com.legacy.health.fhir.meta.instance.DefaultStructure;
import com.legacy.health.fhir.meta.instance.ValueElement;

public class JSONStructure extends DefaultStructure<JsonNode> {

    public JSONStructure(JsonNode root) {
        super(root);
    }

    @Override
    public void setId(String id) {
        ValueElement idElement = (ValueElement) this.getElementByPath(this.definition.getId() + ".id");
        if (idElement != null) {
            idElement.updateValue(id);
        } else {
            idElement = new JSONValueElement();
            idElement.setDefinition(this.definition.getDataElementByName("id"));
            idElement.setPath("id");
            idElement.setContainer(this);
            idElement.setStructure(this);
            idElement.setValue(new TextNode(id));
            this.addElement(idElement);
            ((ObjectNode) this.root).put("id", id);
        }
    }

    @Override
    public ValueElement getNewValueElement() {
        return new JSONValueElement();
    }

    @Override
    public ComplexElement getNewComplexElement() {
        return new JSONComplexElement();
    }

    @Override
    public ArrayElement getNewArrayElement() {
        return new JSONArrayElement();
    }

}
