package com.legacy.health.fhir.meta.sql.queryengine;

import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.sql.RelationSchemaController;
import com.legacy.health.fhir.meta.sql.SQLSchemaController;
import com.legacy.health.fhir.util.Utils;

public class SQLInValueSetExpression extends SQLExpression {

	protected String valueSet;
	protected SQLExpression code;
	protected RelationSchemaController control;

	public SQLInValueSetExpression valueSet(String valueSet) {
		this.valueSet = valueSet;
		return this;
	}

	public SQLInValueSetExpression code(SQLExpression code) {
		this.code = code;
		return this;
	}

	public SQLInValueSetExpression control(SQLSchemaController control) {
		assert (control instanceof RelationSchemaController);
		this.control = (RelationSchemaController) control;
		return this;
	}

	@Override
	public String getSQL(PreparedStatementValues val) throws FhirException {
		String ret = " ";
		String vsrName = SQLUtils.ensureQuoting(
				SQLUtils.assertValidSQLIdentifier(control.getValueSetExpansionTable().getFullTableName()), '"');
		String id = val.getNameForValue(Utils.getLastElementOfUri(valueSet));
		ret += code.getSQL(val) + " IN(select \"CODE\" FROM " + vsrName + " where \"ID\"=:" + id + ")";
		return ret;
	}

}
