package com.legacy.health.fhir.meta.sql.queryengine;

import com.legacy.health.fhir.meta.FhirException;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.*;

public class SQLSelectString {

    final String SELECT = "SELECT";
    final String DISTINCT = "DISTINCT";
    final String WHERE = "WHERE";
    final String GROUP = "GROUP BY";
    final String ORDER = "ORDER BY";

    StringJoiner joiner = new StringJoiner(" ");
    PreparedStatementValues prepValues;

    public SQLSelectString(PreparedStatementValues prepValues) {
        if (prepValues == null) {
            this.prepValues = new PreparedStatementValues();
        } else {
            this.prepValues = prepValues;
        }
        joiner.add(SELECT);
    }

    public SQLSelectString distinct(boolean enabled) {
        if (enabled) {
            joiner.add(DISTINCT);
        }
        return this;
    }

    public SQLSelectString columns(List<SQLExpression> columns) throws FhirException {
        StringJoiner result = new StringJoiner(",");
        for (SQLExpression o : columns) {
            String sql = o.getSQL(prepValues);
            result.add(sql);
        }
        joiner.add(result.toString());
        return this;
    }

    public SQLSelectString from(SQLFrom from) throws FhirException {
        joiner.add(from.getSQL(prepValues));
        return this;
    }

    public SQLSelectString join(List<SQLJoin> joins) throws FhirException {
        for (SQLJoin join : joins) {
            joiner.add(join.getSQL(prepValues));
        }
        return this;
    }

    public SQLSelectString filter(SQLExpression filterExpression) throws FhirException {
        if (filterExpression != null) {
            joiner.add(WHERE);
            joiner.add(filterExpression.getSQL(prepValues));
        }

        return this;
    }

    public SQLSelectString groupby(List<SQLResultColumn> groupByList) throws FhirException {
        if (!groupByList.isEmpty()) {
            joiner.add(GROUP);
            StringJoiner result = new StringJoiner(",");
            for (SQLResultColumn o : groupByList) {
                String sql = o.getSQL(prepValues);
                result.add(sql);
            }
            joiner.add(result.toString());
        }
        return this;
    }

    public SQLSelectString order(List<SQLOrderBy> orderByList) throws FhirException {
        if (!orderByList.isEmpty()) {
            joiner.add(ORDER);
            StringJoiner result = new StringJoiner(",");
            for (SQLOrderBy o : orderByList) {
                String sql = o.getSQL(prepValues);
                result.add(sql);
            }
            joiner.add(result.toString());
        }
        return this;
    }

    public SQLSelectString limit(SQLLimit limit) {
        if (limit != null) {
            joiner.add(limit.getSQL(prepValues));
        }
        return this;
    }

    public String getString() {
        return joiner.toString();
    }

    // TODO delete me after intorducing named prepared stmts
    public String toStringReplace() {
        String ret = joiner.toString();
        for (Map.Entry<String, String> entry : prepValues.get().entrySet()) {
            ret = ret.replaceAll(":" + entry.getKey(), "'" + entry.getValue() + "'");
        }
        return ret;
    }

    public PreparedStatement prepare(Connection con) throws FhirException, SQLException {
        String sqlWithQuestionsmarks = fillIndexInformationOfParameterMap();
        PreparedStatement stmt = con.prepareStatement(sqlWithQuestionsmarks);
        prepValues.fillValues(stmt);
        return stmt;
    }

    public String getParameterizedString() {
        return joiner.toString();
    }

    private enum SqlParseState {
        MAIN,
        IN_ESCAPE_DOUBLE,
        IN_ESCAPE_SINGLE,
        IN_DOUBLE_QUOTE,
        IN_SINGLE_QUOTE,
        PARSE_KEY
    }

    // TODO escape chars may be different per DB
    String fillIndexInformationOfParameterMap() throws FhirException {
        String currentSql = joiner.toString();
        StringBuffer preparedStament = new StringBuffer();
        int valueIndex = 1;
        SqlParseState state = SqlParseState.MAIN;
        int beginVal = -1;
        for (int i = 0; i < currentSql.length(); i++) {
            char currentChar = currentSql.charAt(i);
            Character lookAheadChar = i + 1 < currentSql.length() ? currentSql.charAt(i + 1) : null;
            switch (state) {
                case MAIN:
                    if (currentChar == ':') {
                        state = SqlParseState.PARSE_KEY;
                        beginVal = i;
                        continue;
                    }
                    preparedStament.append(currentChar);
                    if (currentChar == '"') {

                        state = SqlParseState.IN_DOUBLE_QUOTE;
                        continue;
                    }
                    if (currentChar == '\'') {
                        state = SqlParseState.IN_SINGLE_QUOTE;
                        continue;
                    }
                    break;
                case PARSE_KEY:
                    if (Character.isJavaIdentifierPart(currentChar)) {
                        continue;
                    }
                    String key = currentSql.substring(beginVal + 1, i);
                    this.prepValues.setIndex(key, valueIndex++);
                    preparedStament.append('?');
                    preparedStament.append(currentChar);
                    state = SqlParseState.MAIN;
                    continue;
                case IN_DOUBLE_QUOTE:
                    preparedStament.append(currentChar);
                    if (currentChar == '"' && (lookAheadChar == null || lookAheadChar != '"')) {
                        state = SqlParseState.MAIN;
                        continue;
                    }
                    if (currentChar == '"' && lookAheadChar != null && lookAheadChar == '"') {
                        state = SqlParseState.IN_ESCAPE_DOUBLE;
                        continue;
                    }
                    break;
                case IN_SINGLE_QUOTE:
                    preparedStament.append(currentChar);
                    if (currentChar == '\'' && (lookAheadChar == null || lookAheadChar != '\'')) {
                        state = SqlParseState.MAIN;
                        continue;
                    }
                    if (currentChar == '\'' && lookAheadChar != null && lookAheadChar == '\'') {
                        state = SqlParseState.IN_ESCAPE_SINGLE;
                        continue;
                    }
                    break;
                case IN_ESCAPE_DOUBLE:
                    preparedStament.append(currentChar);
                    state = SqlParseState.IN_DOUBLE_QUOTE;
                    continue;
                case IN_ESCAPE_SINGLE:
                    preparedStament.append(currentChar);
                    state = SqlParseState.IN_SINGLE_QUOTE;
                    continue;
                default:
                    throw new FhirException("Unknown State in SQL parser during prepared statement creation",
                            null);
            }
        }
        return preparedStament.toString();

    }

}
