package com.legacy.health.fhir.meta.queryengine.impl;

import java.util.List;

import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.DataType;
import com.legacy.health.fhir.meta.entity.StructureDefinition;

public class DataElementWrapper extends DataElement {

    protected DataElement inner;

    public DataElementWrapper(DataElement inner) {
        super();
        this.inner = inner;
    }

    @Override
    public void addTargetProfile(String uri) {
        throw new UnsupportedOperationException();
    }

    @Override
    public void addAlias(String alias) {
        throw new UnsupportedOperationException();
    }

    @Override
    public void setAliasesList(List<String> aliases) {
        throw new UnsupportedOperationException();
    }

    @Override
    public List<String> getAliases() {
        return inner.getAliases();
    }

    @Override
    public String getId() {
        return "Projection." + inner.getId();
    }

    @Override
    public String getShortName() {
        return inner.getShortName();
    }

    @Override
    public DataType getType() {
        return inner.getType();
    }

    @Override
    public void setType(DataType type) {
        throw new UnsupportedOperationException();
    }

    @Override
    public int getMin() {
        return inner.getMin();
    }

    @Override
    public void setMin(int min) {
        throw new UnsupportedOperationException();
    }

    @Override
    public int getMax() {
        return inner.getMax();
    }

    @Override
    public void setMax(int max) {
        throw new UnsupportedOperationException();
    }

    @Override
    public void setId(String id) {
        throw new UnsupportedOperationException();
    }

    @Override
    public void setOwner(StructureDefinition owner) {
        super.setOwner(owner);
    }

    @Override
    public StructureDefinition getOwner() {
        return super.getOwner();
    }

}
