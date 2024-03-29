package com.legacy.health.fhir.executor;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.legacy.health.fhir.executor.SearchHelper.SearchContext;
import com.legacy.health.fhir.meta.entity.SearchParameter;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.queryengine.BinaryExpression;
import com.legacy.health.fhir.meta.queryengine.Expression;
import com.legacy.health.fhir.meta.queryengine.ResultElement;
import com.legacy.health.fhir.meta.queryengine.StringExpression;

public class SearchDateHandler extends AbstractSearchTypeHandler {

	@Override
	public Expression search(StructureDefinition typeSD, Expression expression, String[] values, SearchParameter sp,
			String key) {
		SearchContext ctx = SearchHelper.provideContext(typeSD, sp);
		ResultElement searchAttribute = qb.out(typeSD, ctx.path);
		String value = values[0];
		Pattern p = Pattern.compile("([a-z]{2})(\\d.*)");
		Matcher m = p.matcher(value);
		BinaryExpression operation = null;
		boolean hasPrefix = m.matches();
		if (hasPrefix) {
			String prefix = m.group(1);
			value = m.group(2);
			StringExpression searchValue = qb.string(value);
			String op = qb.mapOperation(prefix);
			operation = new BinaryExpression().left(searchAttribute).operation(op).right(searchValue);
		} else {
			StringExpression searchValue = qb.string(value);
			operation = qb.eq(searchAttribute, searchValue);
		}
		if (expression == null) {
			expression = operation;
		} else {
			expression = qb.and(expression, operation);
		}
		return expression;
	}

}
