package com.legacy.health.fhir.meta.fluentpath;

import java.util.List;
import java.util.Vector;

import com.legacy.health.fhir.meta.entity.StructureDefinition;

public class Union implements PathElement {
	protected Vector<PathElement> children = new Vector<PathElement>();

	public Union addChild(PathElement element) {
		children.add(element);
		return this;
	}

	public List<PathElement> getChildren() {
		return children;
	}

	@Override
	public PathCheckResult checkStructureDefinition(StructureDefinition definition) {
		PathCheckResult ret = null;
		for (PathElement pathElement : children) {
			ret = pathElement.checkStructureDefinition(definition);
			if (ret != null)
				return ret;
		}
		return ret;
	}
}
