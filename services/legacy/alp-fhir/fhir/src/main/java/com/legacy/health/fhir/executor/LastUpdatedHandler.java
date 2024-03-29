package com.legacy.health.fhir.executor;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.queryengine.BinaryExpression;
import com.legacy.health.fhir.meta.queryengine.Expression;
import com.legacy.health.fhir.meta.queryengine.QueryBuilder;
import com.legacy.health.fhir.meta.queryengine.ResultElement;
import com.legacy.health.fhir.meta.queryengine.StringExpression;

public class LastUpdatedHandler {

	protected QueryBuilder qb = new QueryBuilder();

	public void setQueryBuilder(QueryBuilder qb) {
		this.qb = qb;
	}

	public Expression search(StructureDefinition typeSD, Expression expression, String[] values, String key) {
		ResultElement searchAttribute = qb.out(typeSD, typeSD.getId() + ".meta.lastUpdated");
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
