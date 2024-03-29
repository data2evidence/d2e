package com.legacy.health.fhir.meta.sql.queryengine;

import java.math.BigDecimal;

/**
 * String value - support for prepared statements not yet supported
 * 
 * @author D042355
 *
 */
public class SQLDecimalValue extends SQLExpression {

	protected BigDecimal value;

	public SQLDecimalValue value(BigDecimal value) {
		this.value = value;
		return this;
	}

	public BigDecimal value() {
		return value;
	}

	@Override
	public String getSQL(PreparedStatementValues val) {
		return value.toString();
	}

}
