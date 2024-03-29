package com.legacy.health.fhir.meta.entity;

import java.util.List;

public class DataType extends StructureDefinition {
	boolean isComplex;
	boolean isBackbone;

	public DataType(String id, List<DataElement> elements, boolean isComplex, boolean isBackbone) {
		super(id, elements);
		this.isComplex = isComplex;
		this.isBackbone = isBackbone;
	}

	public DataType(String id, List<DataElement> elements, boolean isComplex) {
		this(id, elements, isComplex, false);
	}

	public DataType(String id, boolean isComplex) {
		super(id);
		this.isComplex = isComplex;
	}

	public boolean isComplex() {
		return isComplex;
	}

	public boolean isBackbone() {
		return isBackbone;
	}

}
