package com.legacy.health.fhir.meta.sql.queryengine;

/**
 * String value - support for prepared statements not yet supported
 * 
 * @author D042355
 *
 */
public class SQLStringValue extends SQLExpression {

	protected String value;

	public SQLStringValue value(String value) {
		this.value = value;
		return this;
	}

	public String value() {
		return value;
	}

	@Override
	public String getSQL(PreparedStatementValues val) {
		String id = val.getNameForValue(value);
		return ":" + id;
	}

}
