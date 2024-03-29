package com.legacy.health.fhir.executor;

import com.legacy.health.fhir.executor.SearchHelper.SearchContext;
import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.SearchParameter;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.queryengine.Expression;
import com.legacy.health.fhir.meta.queryengine.QuantitySearchExpression;
import com.legacy.health.fhir.meta.queryengine.ResultElement;

public class SearchQuantityHandler extends AbstractSearchTypeHandler {

	@Override
	public Expression search(StructureDefinition typeSD, Expression expression, String[] values, SearchParameter sp,
			String key) {
		SearchContext ctx = SearchHelper.provideContext(typeSD, sp);
		String value = values[0];
		String[] parts = value.split(",");
		Expression inner = null;
		for (int i = 0; i < parts.length; i++) {
			String part = parts[i];
			String operation = "eq";
			String number = null;
			String system = null;
			String code = null;
			String[] segments = part.split("\\|");
			if (segments.length == 3) {
				number = segments[0];
				system = segments[1];
				code = segments[2];
			} else {
				return null;
			}
			DataElement de = (DataElement) ctx.definition;
			ResultElement attribute = qb.out(typeSD, ctx.path);
			attribute.withDataElement(typeSD, de);
			QuantitySearchExpression expr = qb.searchQuantity(attribute, system, code, Double.valueOf(number), code,
					operation);
			inner = inner == null ? expr : qb.or(inner, expr);
		}

		expression = expression == null ? inner : qb.and(expression, inner);

		return expression;
	}
}
