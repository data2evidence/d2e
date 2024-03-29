package com.legacy.health.fhir.meta.hana;

import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.sql.queryengine.PreparedStatementValues;
import com.legacy.health.fhir.meta.sql.queryengine.SQLTimeBetweenExpression;

public class HanaSQLTimeBetweenExpression extends SQLTimeBetweenExpression {
	@Override
	public String getSQL(PreparedStatementValues val) throws FhirException {
		if (precission.equals("YEAR")) {
			String sql = " YEARS_BETWEEN(" + leftExpression.getSQL(val) + " , " + rightExpression.getSQL(val) + ") ";
			return sql;
		}
		return null;
	}
}
