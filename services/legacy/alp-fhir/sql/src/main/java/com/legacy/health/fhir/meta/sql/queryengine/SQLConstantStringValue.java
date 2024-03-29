package com.legacy.health.fhir.meta.sql.queryengine;

/**
 * String value - support for prepared statements not yet supported
 * 
 * @author D042355
 *
 */
public class SQLConstantStringValue extends SQLExpression {

	protected String value;
	private String whitelist = "*";

	public SQLConstantStringValue value(String value) {
		this.value = value;
		return this;
	}

	public String value() {
		return value;
	}

	@Override
	public String getSQL(PreparedStatementValues val) {
		assert whitelist.indexOf(value) != -1;
		return value;
	}

}
