package com.legacy.health.fhir.meta.queryengine;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.Path;

public class InValueSetExpression extends Expression implements ScopeConsumer {
	protected Expression code;
	protected String valueSet;
	protected String scope;

	public InValueSetExpression code(Expression code) {
		this.code = code;
		return this;
	}

	public Expression code() {
		return code;
	}

	public Expression atomicCode() {
		if (code instanceof ResultElement) {
			ResultElement re = (ResultElement) code;
			re.setScope(scope);
			Path p = re.path;
			StructureDefinition sd = re.definition;
			DataElement element = queryBuilder.getMetaRepository().getElementByPath(sd, p.toString()).getDataElement();

			if (element.getType().getId().equals("CodeableConcept")) {
				re = queryBuilder.out(sd, p.toString() + ".coding.code");
				re.setScope(scope);
				return re;
			}
		}
		return code;

	}

	public String valueSet() {
		return valueSet;
	}

	public InValueSetExpression valueSet(String id) {
		this.valueSet = id;
		return this;
	}

	public List<QueryElement> getQueryElements() {
		List<QueryElement> ret = new ArrayList<QueryElement>();
		if (code != null) {
			ret.add(this.atomicCode());
		}

		return ret;
	}

	@Override
	public JsonNode toJson() {
		ObjectNode node = mapper.createObjectNode();
		node.put("type", "invaluesetexpression");
		if (code != null) {
			node.set("code", code.toJson());
		}
		if (valueSet != null) {
			node.put("valueset", valueSet);
		}
		return node;
	}

	@Override
	public void fromJson(JsonNode node) {
		if (node.has("code")) {
			this.code = (Expression) queryBuilder.fromJson(node.get("code"));
		}

		if (node.has("valueset")) {
			this.valueSet = (String) node.get("valueset").asText();
		}

	}

	@Override
	public String getScope() {

		return scope;
	}

	@Override
	public void setScope(String scope) {
		this.scope = scope;

	}
}
