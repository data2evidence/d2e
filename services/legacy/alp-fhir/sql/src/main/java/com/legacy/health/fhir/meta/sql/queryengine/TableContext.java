package com.legacy.health.fhir.meta.sql.queryengine;

import com.legacy.health.fhir.meta.sql.Table;

public class TableContext {

	protected Table table;
	protected String context;
	protected String alias;
	protected String scope;

	public TableContext(Table table, String context) {
		super();
		this.table = table;
		this.context = context;
	}

	public Table getTable() {
		return table;
	}

	public String getContext() {
		return context;
	}

	public void setScope(String scope) {
		this.scope = scope;
	}

	public String getScope() {
		return this.scope;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	public String getAlias() {
		if (scope != null) {
			return scope + "_" + alias;
		}
		return alias;
	}

}
