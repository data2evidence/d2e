package com.legacy.health.fhir.meta.sql.queryengine.translator;

import com.legacy.health.fhir.meta.queryengine.ResultElement;
import com.legacy.health.fhir.meta.queryengine.TokenSearchExpression;
import com.legacy.health.fhir.meta.sql.SQLSchemaController;
import com.legacy.health.fhir.meta.sql.queryengine.SQLBinaryExpression;
import com.legacy.health.fhir.meta.sql.queryengine.SQLExpression;
import com.legacy.health.fhir.meta.sql.queryengine.SQLStringValue;
import com.legacy.health.fhir.meta.sql.queryengine.SQLStructureMap;

public class TokenSearchTranslator {

	public static SQLExpression getSQLExpression(TokenSearchExpression tokenSearch, SQLStructureMap sMap,
			SQLSchemaController schemaControl) {
		ResultElement rc = tokenSearch.context();

		SQLExpression system = ExpressionTranslator.getSQLExpression(tokenSearch.systemElement(), sMap, schemaControl);
		SQLExpression code = ExpressionTranslator.getSQLExpression(tokenSearch.codeElement(), sMap, schemaControl);

		SQLExpression ret = null;
		if (tokenSearch.hasCode()) {
			SQLExpression inner = new SQLStringValue().value(tokenSearch.code());
			ret = new SQLBinaryExpression().left(code).op("=").right(inner);
		}
		if (tokenSearch.hasSystem()) {
			SQLExpression inner = new SQLStringValue().value(tokenSearch.system());
			inner = new SQLBinaryExpression().left(system).op("=").right(inner);
			ret = ret == null ? inner : new SQLBinaryExpression().left(ret).op("and").right(inner);
		}
		return ret;
	}

}
