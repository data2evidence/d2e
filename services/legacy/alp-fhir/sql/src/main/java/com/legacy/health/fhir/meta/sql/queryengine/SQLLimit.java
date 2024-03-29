package com.legacy.health.fhir.meta.sql.queryengine;

public class SQLLimit implements SQLQueryElement {

	protected Integer limit;
	protected Integer offset;

	public Integer limit() {
		return limit;
	}

	public SQLLimit limit(Integer limit) {
		this.limit = limit;
		return this;
	}

	public Integer offset() {
		return offset;
	}

	public SQLLimit offset(Integer offset) {
		this.offset = offset;
		return this;
	}

	@Override
	public String getSQL(PreparedStatementValues val) {
		String ret = "";
		if (limit != null) {
			ret += " limit " + limit + " ";
		}
		if (offset != null) {
			ret += " offset " + offset + " ";
		}
		return ret;
	}

}
