package com.legacy.health.fhir.meta.utils;

import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.StructureDefinition;

public class PathBuilder {

    protected String path;
    protected StructureDefinition def;
    DataElement elem;

    public PathBuilder(StructureDefinition def) {
        this.def = def;
        this.elem = null;
        this.path = "";
    }

    public PathBuilder getDirectChildPath(DataElement elem) {
        PathBuilder p = new PathBuilder(this.def);
        p.elem = elem;
        p.path += getPath().isEmpty() ? elem.getShortName() : getPath() + "." + elem.getShortName();
        return p;

    }

    public String getPath() {
        return this.path;
    }
}
