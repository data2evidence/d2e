package com.legacy.health.fhir.meta.sql.queryengine.translator;

import com.legacy.health.fhir.meta.queryengine.QuantitySearchExpression;
import com.legacy.health.fhir.meta.queryengine.ResultElement;
import com.legacy.health.fhir.meta.sql.RelationSchemaController;
import com.legacy.health.fhir.meta.sql.queryengine.SQLExpression;
import com.legacy.health.fhir.meta.sql.queryengine.SQLStructureMap;

public class QuantitySearchTranslator {

	public static SQLExpression getSQLExpression(QuantitySearchExpression quantitySearch, SQLStructureMap sMap,
			RelationSchemaController schemaControl) {
		ResultElement rc = quantitySearch.context();

		SQLExpression system = ExpressionTranslator.getSQLExpression(quantitySearch.systemElement(), sMap,
				schemaControl);
		SQLExpression code = ExpressionTranslator.getSQLExpression(quantitySearch.codeElement(), sMap, schemaControl);

		return null;
	}
}