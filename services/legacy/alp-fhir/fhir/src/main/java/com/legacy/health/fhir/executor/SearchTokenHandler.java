package com.legacy.health.fhir.executor;

import com.legacy.health.fhir.executor.SearchHelper.SearchContext;
import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.SearchParameter;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.queryengine.Expression;
import com.legacy.health.fhir.meta.queryengine.ResultElement;
import com.legacy.health.fhir.meta.queryengine.TokenSearchExpression;

public class SearchTokenHandler extends AbstractSearchTypeHandler {

	@Override
	public Expression search(StructureDefinition typeSD, Expression expression, String[] values, SearchParameter sp,
			String key) {
		SearchContext ctx = SearchHelper.provideContext(typeSD, sp);
		String value = values[0];
		String[] parts = value.split(",");
		Expression inner = null;
		if (key.endsWith(":in")) {
			ResultElement path = qb.out(typeSD, ctx.path);
			expression = expression == null ? inner : qb.inValueSet(path, value);
		} else {
			for (int i = 0; i < parts.length; i++) {
				String part = parts[i];
				String system = null;
				String code = null;
				int sep = part.indexOf("|");
				if (sep > -1) {
					system = part.substring(0, sep);
					code = part.substring(sep + 1);
				} else {
					code = part;
				}
				DataElement de = (DataElement) ctx.definition;
				ResultElement attribute = qb.out(typeSD, ctx.path);
				attribute.withDataElement(typeSD, de);
				TokenSearchExpression expr = qb.searchToken(attribute, system, code);
				inner = inner == null ? expr : qb.or(inner, expr);
			}

			expression = expression == null ? inner : qb.and(expression, inner);
		}
		return expression;
	}

}
