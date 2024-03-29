package com.legacy.health.fhir.meta.fhirpath;

import com.legacy.health.fhir.meta.instance.InstanceType;
import com.legacy.health.fhir.meta.instance.Structure;

public class EvaluationContext {
	protected Structure structure;
	protected InstanceType current;

	public Structure getStructure() {
		return structure;
	}

	public void setStructure(Structure structure) {
		this.structure = structure;
	}

	public InstanceType getCurrent() {
		return current;
	}

	public void setCurrent(InstanceType current) {
		this.current = current;
	}

	public EvaluationContext navigate(InstanceType next) {
		return create(this.structure, next);
	}

	public static EvaluationContext create(Structure structure, InstanceType current) {
		EvaluationContext ret = new EvaluationContext();
		ret.setStructure(structure);
		ret.setCurrent(current);
		return ret;
	}

}
