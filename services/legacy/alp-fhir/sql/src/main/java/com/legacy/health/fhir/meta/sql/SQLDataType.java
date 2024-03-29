package com.legacy.health.fhir.meta.sql;

import com.legacy.health.fhir.meta.entity.DataType;

public class SQLDataType extends DataType {

	private Integer precission;
	private Integer scale;
	private boolean isPrimaryKey;
	private String postFix; // e.g. GENERATED ALWAYS

	public SQLDataType(String id) {
		super(id, false);
	}

	public SQLDataType scale(int scale) {
		this.scale = scale;
		return this;
	}

	public SQLDataType precission(int precission) {
		this.precission = precission;
		return this;
	}

	public SQLDataType primaryKey(boolean primaryKey) {
		this.isPrimaryKey = primaryKey;
		return this;
	}

	public SQLDataType postfix(String postfix) {
		this.postFix = postfix;
		return this;
	}

	public boolean isPrimaryKey() {
		return this.isPrimaryKey;
	}

	public Integer scale() {
		return scale;
	}

	public Integer precission() {
		return precission;
	}

	public String postfix() {
		return this.postFix;
	}

	public String toString() {
		String ret = this.getId();
		if (scale != null) {
			ret += "(" + scale + ")";
		}
		return ret;
	}

}
