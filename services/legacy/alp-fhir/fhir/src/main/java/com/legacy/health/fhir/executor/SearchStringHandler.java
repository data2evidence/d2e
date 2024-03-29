package com.legacy.health.fhir.executor;

import com.legacy.health.fhir.executor.SearchHelper.SearchContext;
import com.legacy.health.fhir.meta.entity.SearchParameter;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.queryengine.BinaryExpression;
import com.legacy.health.fhir.meta.queryengine.Expression;
import com.legacy.health.fhir.meta.queryengine.ResultElement;
import com.legacy.health.fhir.meta.queryengine.StringExpression;
import com.legacy.health.fhir.util.Utils;

public class SearchStringHandler extends AbstractSearchTypeHandler {

	@Override
	public Expression search(StructureDefinition typeSD, Expression expression, String[] values, SearchParameter sp,
			String key) {
		SearchContext ctx = SearchHelper.provideContext(typeSD, sp);
		ResultElement searchAttribute = qb.out(typeSD, ctx.path);
		String value = values[0];
		value = Utils.checkUUID(value);// Could be problematic when later searching for other UUID's
		StringExpression searchValue = qb.string(value + "%");
		if (expression == null) {
			expression = new BinaryExpression().left(searchAttribute).operation("LIKE").right(searchValue);
		} else {
			expression = qb.and(expression, qb.eq(searchAttribute, searchValue));
		}
		return expression;
	}
}
