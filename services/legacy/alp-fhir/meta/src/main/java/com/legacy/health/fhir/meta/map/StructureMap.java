package com.legacy.health.fhir.meta.map;

import java.util.ArrayList;
import java.util.List;

public class StructureMap {
	private String id;
	private String uri;

	private List<StructureMode> structures = new ArrayList<StructureMode>();
	private List<StructureMapGroup> groups = new ArrayList<StructureMapGroup>();

	public String getId() {
		return id;
	}

	public String getUri() {
		return uri;
	}

	public List<StructureMode> getStructures() {
		return structures;
	}

	public List<StructureMapGroup> getGroups() {
		return groups;
	}

	protected void addStructure(StructureMode structure) {
		structures.add(structure);
	}

	protected void addGroup(StructureMapGroup group) {
		groups.add(group);
	}

	protected void setId(String id) {
		this.id = id;
	}

	protected void setUri(String uri) {
		this.uri = uri;
	}

}
