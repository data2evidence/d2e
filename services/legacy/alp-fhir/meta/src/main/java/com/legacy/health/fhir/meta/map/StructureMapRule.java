package com.legacy.health.fhir.meta.map;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class StructureMapRule {
	private String name;
	private List<RuleSource> sources = new ArrayList<RuleSource>();
	private List<RuleTarget> targets = new ArrayList<RuleTarget>();

	public String getName() {
		return name;
	}

	public void addSource(RuleSource source) {
		sources.add(source);
	}

	public List<RuleSource> getSources() {
		return Collections.unmodifiableList(sources);
	}

	public List<RuleTarget> getTargets() {
		return Collections.unmodifiableList(targets);
	}

	public void addTarget(RuleTarget target) {
		targets.add(target);
	}

	protected void setName(String name) {
		this.name = name;
	}
}
