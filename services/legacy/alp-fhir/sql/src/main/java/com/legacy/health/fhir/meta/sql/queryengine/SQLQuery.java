package com.legacy.health.fhir.meta.sql.queryengine;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.sql.Table;

public class SQLQuery extends SQLExpression {

	protected SQLFrom from;

	protected SQLLimit limit;

	protected String distinct = "";

	protected List<SQLExpression> columns = new ArrayList<SQLExpression>();

	protected List<SQLJoin> joins = new ArrayList<SQLJoin>();

	protected SQLExpression filterExpression;

	protected List<SQLResultColumn> groupByList = new ArrayList<SQLResultColumn>();

	protected List<SQLOrderBy> orderByList = new ArrayList<SQLOrderBy>();

	public SQLQuery from(SQLFrom from) {
		this.from = from;
		return this;
	}

	public Table getFromTable() {
		return this.from.basetable.table();
	}

	public SQLQuery distinct() {
		this.distinct = "distinct ";
		return this;
	}

	public SQLQuery column(SQLExpression column) {
		this.columns.add(column);
		return this;
	}

	public SQLQuery groupBy(SQLResultColumn column) {
		this.groupByList.add(column);
		return this;
	}

	public SQLQuery join(SQLJoin join) {
		joins.add(join);
		return this;
	}

	public SQLQuery orderBy(SQLOrderBy orderby) {
		this.orderByList.add(orderby);
		return this;
	}

	public SQLQuery limit(SQLLimit limit) {
		this.limit = limit;
		return this;
	}

	public SQLLimit limit() {
		return limit;
	}

	public SQLQuery filter(SQLExpression filterExpression) {
		this.filterExpression = filterExpression;
		return this;
	}

	public String getSQL(PreparedStatementValues prepValues) throws FhirException {
		try {
			return new SQLSelectString(prepValues)
					.distinct(!distinct.isEmpty())
					.columns(columns)
					.from(from)
					.join(joins)
					.filter(filterExpression)
					.groupby(groupByList)
					.order(orderByList)
					.limit(limit).getParameterizedString();
		} catch (FhirException e) {
			throw new FhirException("", e); // TODO
		}
	}

	public PreparedStatement getStatement(Connection conn) throws FhirException, SQLException {
		return new SQLSelectString(new PreparedStatementValues())
				.distinct(!distinct.isEmpty())
				.columns(columns)
				.from(from)
				.join(joins)
				.filter(filterExpression)
				.groupby(groupByList)
				.order(orderByList)
				.limit(limit).prepare(conn);
	}

}
