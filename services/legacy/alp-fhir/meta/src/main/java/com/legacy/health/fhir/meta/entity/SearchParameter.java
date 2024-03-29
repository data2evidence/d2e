package com.legacy.health.fhir.meta.entity;

import java.util.List;
import java.util.Vector;

public class SearchParameter implements MetaData {

	protected String id;
	protected String code;
	protected String type;
	protected String expression;
	protected Vector<String> base = new Vector<>();
	protected Vector<String> target = new Vector<>();

	public void setId(String id) {
		this.id = id;
	}

	@Override
	public String getId() {
		return id;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getCode() {
		return this.code;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getType() {
		return type;
	}

	public void setExpression(String expression) {
		this.expression = expression;
	}

	public String getExpression() {
		return this.expression;
	}

	public void addBase(String base) {
		this.base.add(base);
	}

	public List<String> getBase() {
		return base;
	}

	public void addTarget(String target) {
		this.target.addElement(target);
	}

	public List<String> getTarget() {
		return target;
	}

}
