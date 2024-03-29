package com.legacy.health.fhir.meta.queryengine;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.entity.DataElementStructureLink;
import com.legacy.health.fhir.meta.entity.DataType;
import com.legacy.health.fhir.meta.instance.Path;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;

public class ResultElement extends Expression implements QueryElement, ScopeConsumer {

	protected DataElement element;
	protected StructureDefinition definition;
	protected Path path;
	protected String scope;

	protected DataElementStructureLink link = null;

	public ResultElement withStructureDefinition(StructureDefinition def) {
		this.definition = def;
		return this;
	}

	public void setScope(String scope) {
		this.scope = scope;
	}

	public String getScope() {
		return scope;
	}

	public ResultElement withDataElement(StructureDefinition definition, DataElement element) {
		this.element = element;
		link = new DataElementStructureLink();
		link.setDataELement(element);
		link.setStructureDefinition(definition);
		link.setScope(scope);
		if (path != null) {
			link.setPath(path.toString());
		}
		this.definition = definition;
		return this;
	}

	public ResultElement withPath(StructureDefinition definition, Path path) {
		this.definition = definition;
		this.path = path;
		return this;
	}

	public DataElement getDataElement() {
		if (element == null && definition != null && path != null) {
			element = definition.getDataElement(path.toString());
		}
		return element;
	}

	public StructureDefinition getStructureDefinition() {
		return this.definition;
	}

	public Path getPath() {
		return path;
	}

	public boolean isPath() {
		return path != null;
	}

	public boolean isFullResource() {
		return path == null && element == null;
	}

	public DataElementStructureLink getDataElementStructureLink() {
		if (isFullResource()) {
			return null;
		}
		DataElementStructureLink l = link != null ? link
				: queryBuilder.getMetaRepository().getElementByPath(definition, path.toString());
		if (l != null) {
			l.setScope(scope);
		}
		return l;
	}

	public DataType getType() {
		DataElementStructureLink l = getDataElementStructureLink();
		if (l == null)
			return null;
		return l.getDataElement().getType();
	}

	public DataElementStructureLink getQuantityValueLink() {
		if (getType().getId().equals("Quantity")) {
			MetaRepository repo = queryBuilder.getMetaRepository();
			DataElementStructureLink valueLink = repo.getElementByPath(definition, path.toString() + ".value");
			valueLink.setScope(scope);
			return valueLink;
		}
		return null;
	}

	public DataElementStructureLink getQuantityUnitLink() {
		if (getType().getId().equals("Quantity")) {
			MetaRepository repo = queryBuilder.getMetaRepository();
			DataElementStructureLink unitLink = repo.getElementByPath(definition, path.toString() + ".unit");
			unitLink.setScope(scope);
			return unitLink;
		}
		return null;
	}

	public List<DataElementStructureLink> getDataElements() {
		List<DataElementStructureLink> ret = new ArrayList<DataElementStructureLink>();
		if (getType() != null && getType().getId().equals("Quantity")) {
			MetaRepository repo = queryBuilder.getMetaRepository();
			DataElementStructureLink valueLink = repo.getElementByPath(definition, path.toString() + ".value");
			valueLink.setScope(scope);
			DataElementStructureLink unitLink = repo.getElementByPath(definition, path.toString() + ".unit");
			unitLink.setScope(scope);
			ret.add(unitLink);
			ret.add(valueLink);
			return ret;
		}
		DataElementStructureLink l = getDataElementStructureLink();
		if (l != null) {
			ret.add(l);
		}

		return ret;
	}

	@Override
	public JsonNode toJson() {
		ObjectNode node = (ObjectNode) super.toJson();
		node.put("type", "resultelement");
		node.put("definition", this.definition.getId());
		if (this.isFullResource()) {
			return node;
		}
		if (isPath()) {
			node.put("path", this.path.toJSON());
		} else {
			node.put("element", this.element.getId());
		}
		return node;
	}

	@Override
	public void fromJson(JsonNode node) {
		super.fromJson(node);
		definition = queryBuilder.sd(node.get("definition").asText());
		if (node.has("path")) {
			Path p = new Path();
			p.withPath(node.get("path").asText());
			this.path = p;
		}
		if (node.has("element")) {
			this.element = queryBuilder.de(node.get("element").asText());
		}
	}
}
