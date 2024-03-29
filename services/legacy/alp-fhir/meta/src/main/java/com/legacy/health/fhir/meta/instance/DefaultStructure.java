package com.legacy.health.fhir.meta.instance;

import java.util.*;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.StructureDefinition;

public abstract class DefaultStructure<T> implements Structure<T> {

    private static Log log = LogFactory.getLog(DefaultStructure.class);

    protected final T root;

    protected StructureDefinition definition;
    protected HashMap<String, Element> elementRegistry = new HashMap<>();
    protected List<Element> elements = new ArrayList<>();

    protected DefaultStructure(T root) {
        this.root = root;
    }

    @Override
    public List<Element> getElements() {
        return elements;
    }

    @Override
    public Collection<Element> getAllElements() {
        return elementRegistry.values();
    }

    @Override
    public String getLogicalPath() {
        return definition.getId();
    }

    @Override
    public void setDefinition(StructureDefinition definition) {
        this.definition = definition;
    }

    @Override
    public StructureDefinition getDefinition() {
        return this.definition;
    }

    @Override
    public void addElement(Element element) {
        if (elements.contains(element)) {
            return;
        }
        elements.add(element);
        element.setContainer(this);
        element.setStructure(this);
    }

    protected void registerElement(Element element) {
        this.elementRegistry.put(element.getLogicalPath(), element);
    }

    @Override
    public Element getElementByPath(String path) {
        return this.elementRegistry.get(path);
    }

    @Override
    public final T getRoot() {
        return this.root;
    }

    @Override
    public final String getId() {
        ValueElement idElement = (ValueElement) this.getElementByPath(this.getResourceType() + ".id");
        if (idElement == null)
            return null;

        Object value = idElement.getValue();
        return value == null ? null : value.toString();
    }

    @Override
    public final String getResourceType() {
        return this.definition.getId();
    }

    public Element<?> getOrCreateChildElement(String childname) {
        Element<?> e = elementRegistry.get(this.getDefinition().getId() + "." + childname);
        if (e != null) {
            return e;
        } else {
            DataElement datatype = getDefinition().getDataElement(childname);
            if (datatype.getMax() > 1) {
                e = this.getNewArrayElement();
            } else if (datatype.getType().isComplex()) {
                e = this.getNewComplexElement();
            } else {
                e = this.getNewValueElement();
            }
            e.setDefinition(datatype);
            e.setPath(childname);
            e.setContainer(this);
            e.setStructure(this);
            return e;
        }
    }

    public String getCanonicalReference() {
        ValueElement urlElement = (ValueElement) this.getElementByPath(this.getResourceType() + ".url");
        ValueElement versionElement = (ValueElement) this.getElementByPath(this.getResourceType() + ".version");
        if (urlElement == null || urlElement.getValue() == null) {
            return null;
        }
        String ret = (String) urlElement.getValue();
        if (versionElement != null && versionElement.getValue() != null) {
            ret = ret + "|" + (String) versionElement.getValue();
        }
        return ret;
    }

}
