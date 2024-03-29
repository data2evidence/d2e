package com.legacy.health.fhir.meta.sql.queryengine;

/**
 * String value - support for prepared statements not yet supported
 * 
 * @author D042355
 *
 */
public class SQLIntegerValue extends SQLExpression {

	protected Integer value;

	public SQLIntegerValue value(Integer value) {
		this.value = value;
		return this;
	}

	public Integer value() {
		return value;
	}

	@Override
	public String getSQL(PreparedStatementValues prepValues) {
		return value.toString();
	}

}
