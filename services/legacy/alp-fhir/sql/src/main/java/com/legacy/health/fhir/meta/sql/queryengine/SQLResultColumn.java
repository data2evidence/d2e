package com.legacy.health.fhir.meta.sql.queryengine;

import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.sql.Column;

public class SQLResultColumn extends SQLExpression {
	protected Column column;
	protected String alias;

	public SQLResultColumn column(Column column) {
		this.column = column;
		return this;
	}

	public SQLResultColumn alias(String alias) {
		this.alias = alias;
		return this;
	}

	@Override
	public String getSQL(PreparedStatementValues vals) throws FhirException {
		String lbl = label != null ? (" " + SQLUtils.ensureQuoting(SQLUtils.assertValidSQLIdentifier(label), '"'))
				: " ";
		String als = alias != null ? (" " + SQLUtils.ensureQuoting(SQLUtils.assertValidSQLIdentifier(alias), '"') + ".")
				: " ";

		String ret = als;
		ret += SQLUtils.ensureQuoting(SQLUtils.assertValidSQLIdentifier(column.getName()), '"');
		ret += lbl;
		return ret;
	}

	public Column getColumn() {
		return column;
	}

	public void setColumn(Column column) {
		this.column = column;
	}
}
