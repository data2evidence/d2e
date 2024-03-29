package com.legacy.health.fhir.meta.fluentpath;

import java.util.List;
import java.util.Vector;

import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.StructureDefinition;

public class QualifiedIdentifier implements Expression {
	protected Vector<Identifier> path = new Vector<Identifier>();

	public QualifiedIdentifier addIdentifier(Identifier element) {
		path.add(element);
		return this;
	}

	public List<Identifier> getPath() {
		return path;
	}

	@Override
	public PathCheckResult checkStructureDefinition(StructureDefinition definition) {
		PathCheckResult ret = new PathCheckResult();
		boolean first = true;
		String cmp = null;
		String pathTxt = "";
		for (Identifier identifier : path) {
			if (first) {
				ret = identifier.checkStructureDefinition(definition);
				cmp = definition.getId();
				pathTxt = identifier.name();
				first = false;
			} else {
				String name = identifier.name();
				pathTxt += "." + name;
				if (ret.definition instanceof StructureDefinition) {
					cmp += "." + name;
					ret.definition = ((StructureDefinition) ret.definition).getDataElement(cmp);
				} else {
					cmp = ((DataElement) ret.definition).getType().getId() + "." + name;
					ret.definition = ((DataElement) ret.definition).getType().getDataElement(cmp);
				}
			}
			if (ret == null || ret.definition == null)
				return null;
		}
		ret.path = pathTxt;
		return ret;
	}
}
