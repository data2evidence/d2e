package com.legacy.health.fhir.meta.json;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.BooleanNode;
import com.fasterxml.jackson.databind.node.DoubleNode;
import com.fasterxml.jackson.databind.node.IntNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;
import com.legacy.health.fhir.meta.instance.AbstractValueElement;

public class JSONValueElement extends AbstractValueElement<JsonNode> {

    @Override
    protected void setObject() {
        String type = this.getDefinition().getType().getId();
        switch (type) {
            case "decimal":
                if (internalValue.isInt()) {
                    Integer i = internalValue.asInt();
                    externalValue = i.doubleValue();
                } else {
                    externalValue = internalValue.asDouble();
                }
                break;
            default:
                break;
        }

        if (internalValue.isBoolean()) {
            externalValue = internalValue.asBoolean();
        } else if (internalValue.isTextual()) {
            externalValue = internalValue.asText();
        } else if (internalValue.isInt()) {
            externalValue = internalValue.asInt();
        } else if (internalValue.isDouble()) {
            externalValue = internalValue.asDouble();
        } else {
            externalValue = internalValue;
        }
    }

    @Override
    public void updateValue(Object value) {
        this.externalValue = value;

        String type = this.getDefinition().getType().getId();
        switch (type) {
            case "decimal":
                internalValue = new DoubleNode((Double) value);
                break;
            case "boolean":
                internalValue = BooleanNode.valueOf((Boolean) value);
                break;
            case "integer":
            case "unsignedInt":
            case "positiveInt":
                internalValue = new IntNode((Integer) value);
                break;
            case "string":
            case "url":
            case "instant":
            case "date":
            case "dateTime":
            case "time":
            case "code":
            case "oid":
            case "id":
            case "markdown":
            case "base64Binary":
                internalValue = new TextNode(value.toString());
                break;
            default:
                break;
        }

        String path[] = this.path.split("\\.");
        JsonNode node = (JsonNode) this.structure.getRoot();
        for (int i = 0; i < path.length - 1; i++) {
            node = node.get(path[i]);
        }
        ((ObjectNode) node).set(path[path.length - 1], this.internalValue);
    }

}
