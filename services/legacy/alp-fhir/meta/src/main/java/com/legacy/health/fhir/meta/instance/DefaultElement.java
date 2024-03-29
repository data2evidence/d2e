package com.legacy.health.fhir.meta.instance;

import com.legacy.health.fhir.meta.entity.DataElement;

public abstract class DefaultElement<T> implements Element<T> {

    protected Structure structure;
    protected DataElement metaElement;
    protected ElementContainer container;
    protected String path;

    protected T internalValue;

    @Override
    public void setContainer(ElementContainer container) {
        this.container = container;
    }

    @Override
    public ElementContainer getContainer() {
        return this.container;
    }

    @Override
    public void setDefinition(DataElement element) {
        this.metaElement = element;
    }

    @Override
    public DataElement getDefinition() {
        return this.metaElement;
    }

    @Override
    public void setPath(String path) {
        this.path = path;
    }

    @Override
    public String getPath() {
        return path;
    }

    @Override
    public String getLogicalPath() {
        return structure.getResourceType() + "." + this.path;
    }

    @Override
    public void setStructure(Structure structure) {
        this.structure = structure;
        if (structure instanceof DefaultStructure) {
            ((DefaultStructure) structure).registerElement(this);
        }
    }

    @Override
    public final T getElementNode() {
        return this.internalValue;
    }

}
