package com.legacy.health.fhir.meta.sql.queryengine;

import java.sql.JDBCType;
import java.util.ArrayList;
import java.util.List;

import com.legacy.health.fhir.meta.FhirException;

public class SQLListValue extends SQLExpression {

	protected ArrayList list = new ArrayList();
	protected boolean splitList = false;
	protected JDBCType type = null;

	public SQLListValue addList(List list) {
		this.list.addAll(list);
		return this;
	}

	@Override
	public String getSQL(PreparedStatementValues prepValues) throws FhirException {
		String ret = "";
		String sep = "";
		for (Object entry : list) {
			ret += sep + ":" + prepValues.getNameForValue(entry, JDBCType.OTHER);
			sep = ",";
		}
		return ret;
	}

}
