package com.legacy.health.fhir.meta.sql.queryengine;

import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.sql.Table;

public class SQLBaseTable extends SQLExpression {

	protected String alias;
	protected Table table;

	public SQLBaseTable alias(String name) {
		this.alias = name;
		return this;
	}

	public SQLBaseTable table(Table table) {
		this.table = table;
		return this;
	}

	public Table table() {
		return this.table;
	}

	@Override
	public String getSQL(PreparedStatementValues val) throws FhirException {
		String ret = " " + SQLUtils.ensureQuoting(SQLUtils.assertValidSQLIdentifier(table.getFullTableName()), '"');
		ret += alias != null ? (" " + SQLUtils.ensureQuoting(SQLUtils.assertValidSQLIdentifier(alias), '"') + " ")
				: "";
		return ret;
	}
}
