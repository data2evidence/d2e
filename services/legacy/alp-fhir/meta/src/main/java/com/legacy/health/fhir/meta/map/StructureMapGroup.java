package com.legacy.health.fhir.meta.map;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class StructureMapGroup {

	private String name;
	private List<GroupInput> inputs = new ArrayList<GroupInput>();
	private List<StructureMapRule> rules = new ArrayList<StructureMapRule>();

	public List<GroupInput> getInputs() {
		return Collections.unmodifiableList(inputs);
	}

	public List<StructureMapRule> getRules() {
		return Collections.unmodifiableList(rules);
	}

	protected void addInput(GroupInput input) {
		inputs.add(input);
	}

	protected void addRule(StructureMapRule rule) {
		rules.add(rule);
	}

	public String getName() {
		return name;
	}

	protected void setName(String name) {
		this.name = name;
	}

}
