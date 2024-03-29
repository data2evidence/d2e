package com.legacy.health.fhir.meta.xml;

import org.w3c.dom.Element;
import com.legacy.health.fhir.meta.instance.AbstractValueElement;

public class XMLValueElement extends AbstractValueElement<Element> {

    @Override
    protected void setObject() {
        String value = this.internalValue.getAttribute("value");
        String type = this.getDefinition().getType().getId();
        switch (type) {
            case "decimal":
                externalValue = Double.parseDouble(value);
                break;
            case "string":
            case "code":
            case "id":
            case "uri":
            case "dateTime":
            case "date":
                externalValue = value;
                break;
            case "boolean":
                externalValue = Boolean.valueOf(value);
                break;
            default:
                externalValue = value;
                break;
        }
    }

    @Override
    public void updateValue(Object value) {
        this.externalValue = value;
        this.internalValue.setAttribute("value", value.toString());
    }

}
