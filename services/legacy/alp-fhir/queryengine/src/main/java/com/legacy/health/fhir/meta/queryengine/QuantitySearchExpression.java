package com.legacy.health.fhir.meta.queryengine;

import java.util.ArrayList;
import java.util.List;

import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.DataElementStructureLink;
import com.legacy.health.fhir.meta.entity.StructureDefinition;

public class QuantitySearchExpression extends Expression {
	protected ResultElement context;
	protected Double value;
	protected String operation;
	protected String unit;

	protected String system;
	protected String code;
	protected ResultElement systemElement = null;
	protected ResultElement codeElement = null;
	protected ResultElement valueElement = null;
	protected ResultElement unitElement = null;

	public QuantitySearchExpression context(ResultElement context) {
		this.context = context;
		return this;
	}

	public QuantitySearchExpression system(String system) {
		this.system = system;
		return this;
	}

	public QuantitySearchExpression code(String code) {
		this.code = code;
		this.unit = code;
		return this;
	}

	public QuantitySearchExpression operation(String operation) {
		this.operation = operation;
		return this;
	}

	public QuantitySearchExpression value(Double value) {
		this.value = value;
		return this;
	}

	public String code() {
		return code;
	}

	public String system() {
		return system;
	}

	public ResultElement context() {
		return context;
	}

	public String operation() {
		return operation;
	}

	public Double value() {
		return value;
	}

	public List<DataElementStructureLink> getDataElements() {
		List<DataElementStructureLink> ret = new ArrayList<DataElementStructureLink>();
		if (system != null) {
			systemElement = this.createResultElement(".Quantity.system", ret);
		}
		codeElement = this.createResultElement(".Quantity.code", ret);
		unitElement = this.createResultElement(".Quantity.unit", ret);
		valueElement = this.createResultElement(".Quantity.value", ret);
		return ret;
	}

	protected ResultElement createResultElement(String path, List<DataElementStructureLink> list) {
		DataElement de = context.getDataElement();
		StructureDefinition definition = de.getOwner();
		DataElementStructureLink codeLink = queryBuilder.getMetaRepository().getElementByPath(definition,
				de.getId() + code);
		ResultElement ret = queryBuilder.out(definition, de.getId() + path);
		list.add(codeLink);
		return ret;
	}

	public boolean hasSystem() {
		return system != null;
	}

	public ResultElement systemElement() {
		return systemElement;
	}

	public ResultElement codeElement() {
		return codeElement;
	}

	public ResultElement valueElement() {
		return valueElement;
	}

	public ResultElement unitElement() {
		return unitElement;
	}

}
