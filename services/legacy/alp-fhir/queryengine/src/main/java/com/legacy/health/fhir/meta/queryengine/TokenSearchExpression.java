package com.legacy.health.fhir.meta.queryengine;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.DataElementStructureLink;
import com.legacy.health.fhir.meta.entity.StructureDefinition;

public class TokenSearchExpression extends Expression {
	protected ResultElement context;
	protected String system;
	protected String code;

	public TokenSearchExpression context(ResultElement context) {
		this.context = context;
		return this;
	}

	public TokenSearchExpression system(String system) {
		this.system = system;
		return this;
	}

	public TokenSearchExpression code(String code) {
		this.code = code;
		return this;
	}

	public boolean hasCode() {
		return code != null;
	}

	public boolean hasSystem() {
		return system != null;
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

	// public List<QueryElement> getQueryElements(){
	// List<QueryElement> ret = Arrays.asList(context);
	// return ret;
	// }

	public List<DataElementStructureLink> getDataElements() {
		List<DataElementStructureLink> ret = new ArrayList<DataElementStructureLink>();
		DataElement de = context.getDataElement();
		StructureDefinition definition = de.getOwner();
		String system = getSystemField(de.getType().getId());
		if (system != null) {
			DataElementStructureLink systemLink = queryBuilder.getMetaRepository().getElementByPath(definition,
					de.getId() + system);
			systemElement = queryBuilder.out(definition, de.getId() + system);
			ret.add(systemLink);
		}
		String code = getCodeField(de.getType().getId());
		if (code != null) {
			DataElementStructureLink codeLink = queryBuilder.getMetaRepository().getElementByPath(definition,
					de.getId() + code);
			codeElement = queryBuilder.out(definition, de.getId() + code);
			ret.add(codeLink);
		}
		return ret;
	}

	protected ResultElement systemElement = null;
	protected ResultElement codeElement = null;

	public ResultElement systemElement() {

		return systemElement;

	}

	public ResultElement codeElement() {
		return codeElement;
	}

	protected static String getSystemField(String type) {
		switch (type) {
			case "Coding":
				return ".system";
			case "CodeableConcept":
				return ".coding.system";
			case "Identifier":
				return ".system";
			default:
				return null;
		}
	}

	protected static String getCodeField(String type) {
		switch (type) {
			case "Coding":
				return ".code";
			case "CodeableConcept":
				return ".coding.code";
			case "Identifier":
				return ".value";
			case "code":
				return "";
			case "string":
				return "";
			default:
				return null;
		}
	}

	@Override
	public JsonNode toJson() {
		ObjectNode node = mapper.createObjectNode();
		node.put("type", "tokenexpression");
		if (context != null) {
			node.set("context", context.toJson());
		}
		if (system != null) {
			node.put("system", system);
		}
		if (code != null) {
			node.put("code", code);
		}
		return node;
	}

	@Override
	public void fromJson(JsonNode node) {
		if (node.has("context")) {
			this.context = (ResultElement) queryBuilder.fromJson(node.get("context"));
		}

		if (node.has("system")) {
			this.system = node.get("system").asText();
		}

		if (node.has("code")) {
			this.code = (String) node.get("code").asText();
		}

	}

}
