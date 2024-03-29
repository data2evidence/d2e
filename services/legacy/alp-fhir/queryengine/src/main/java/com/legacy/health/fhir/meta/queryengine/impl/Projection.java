package com.legacy.health.fhir.meta.queryengine.impl;

import java.util.List;

import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.Element;
import com.legacy.health.fhir.meta.instance.InstanceNavigator;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.instance.ValueElement;
import com.legacy.health.fhir.meta.queryengine.Expression;
import com.legacy.health.fhir.meta.queryengine.ResultElement;

public class Projection implements DefaultQueryElement {

    protected List<Expression> out;

    public void setOutput(List<Expression> result) {
        this.out = result;
    }

    @Override
    public Structure execute(Structure structure) {
        StructureDefinition definition = new StructureDefinition(structure.getResourceType() + "Result");
        StructureImpl ret = new StructureImpl(null);
        ret.setDefinition(definition);
        out.forEach(expression -> {
            if (expression instanceof ResultElement) {
                ResultElement element = (ResultElement) expression;
                if (!element.isPath()) {
                    handleNavigationByDataElement(structure, definition, ret, element);
                } else {
                    Element instance = structure.getElementByPath(element.getPath().toString());
                    if (instance != null && instance instanceof ValueElement) {
                        DataElementWrapper wrapper = new DataElementWrapper(instance.getDefinition());
                        wrapper.setOwner(definition);
                        wrapElement(ret, instance, wrapper);
                    }
                }
            }
        });

        return ret;
    }

    private void handleNavigationByDataElement(Structure structure, StructureDefinition definition, StructureImpl ret,
            ResultElement element) {
        DataElementWrapper wrapper = new DataElementWrapper(element.getDataElement());
        wrapper.setOwner(definition);
        List<Element> instances = InstanceNavigator.getElementsByDataElement(structure, element.getDataElement());
        instances.forEach(instance -> {
            wrapElement(ret, instance, wrapper);

        });
    }

    private void wrapElement(StructureImpl ret, Element instance, DataElementWrapper wrapper) {
        ValueElementWrapper elementWrapper = null;
        if (instance instanceof ValueElement) {
            elementWrapper = new ValueElementWrapper();
            elementWrapper.setDefinition(wrapper);
            elementWrapper.setValue(instance);
        }
        ret.addElement(elementWrapper);
    }

}
