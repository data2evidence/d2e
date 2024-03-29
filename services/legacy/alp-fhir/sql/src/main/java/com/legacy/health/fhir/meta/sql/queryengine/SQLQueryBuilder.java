package com.legacy.health.fhir.meta.sql.queryengine;

import com.legacy.health.fhir.meta.sql.Column;
import com.legacy.health.fhir.meta.sql.Table;

public class SQLQueryBuilder {

	public SQLQuery query() {
		return new SQLQuery();
	}

	public SQLFrom from(Table t, String alias) {
		SQLBaseTable base = new SQLBaseTable();
		base.table(t).alias(alias);
		SQLFrom from = new SQLFrom();
		from.table(base);
		return from;
	}

	public SQLLimit limit(Integer limit, Integer offset) {
		return new SQLLimit().limit(limit).offset(offset);
	}

	public SQLResultColumn column(Column c, String alias) {
		SQLResultColumn ret = new SQLResultColumn();
		ret.column(c).alias(alias);
		return ret;
	}

	public SQLBinaryExpression eq(SQLExpression left, SQLExpression right) {
		SQLBinaryExpression ret = new SQLBinaryExpression();
		ret.left(left).op("=").right(right);
		return ret;
	}

	public SQLBinaryExpression and(SQLExpression left, SQLExpression right) {
		SQLBinaryExpression ret = new SQLBinaryExpression();
		ret.left(left).op(" AND ").right(right);
		return ret;
	}

	public SQLBinaryExpression or(SQLExpression left, SQLExpression right) {
		SQLBinaryExpression ret = new SQLBinaryExpression();
		ret.left(left).op(" OR ").right(right);
		return ret;
	}

	public SQLBinaryExpression op(SQLExpression left, String op, SQLExpression right) {
		SQLBinaryExpression ret = new SQLBinaryExpression();
		ret.left(left).op(" " + op + " ").right(right);
		return ret;
	}

	public SQLIsXXNullExpression isNull(SQLExpression expression) {
		SQLIsXXNullExpression ret = new SQLIsXXNullExpression().expression(expression);
		return ret;
	}

	public SQLIsXXNullExpression isNotNull(SQLExpression expression) {
		SQLIsXXNullExpression ret = new SQLIsXXNullExpression().expression(expression).not();
		return ret;
	}

	public SQLOrderBy orderBy(SQLResultColumn c, boolean descending) {
		SQLOrderBy ret = new SQLOrderBy();
		ret.sortColumn(c);
		if (descending)
			ret.descending();
		else
			ret.ascending();
		return ret;
	}

	public SQLJoin join(Table t, String alias, SQLExpression onExpression) {
		SQLBaseTable base = new SQLBaseTable();
		base.table(t).alias(alias);
		SQLJoin ret = new SQLJoin();
		ret.table(base).on(onExpression);
		return ret;
	}
}
