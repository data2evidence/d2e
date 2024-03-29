package com.legacy.health.fhir.meta.sql.queryengine;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Locale;

import com.legacy.health.fhir.meta.FhirException;

public class SQLBinaryExpression extends SQLExpression {

	SQLExpression leftExpression;
	SQLExpression rightExpression;
	String operand;

	public SQLBinaryExpression left(SQLExpression left) {
		this.leftExpression = left;
		return this;
	}

	public SQLBinaryExpression right(SQLExpression right) {
		this.rightExpression = right;
		return this;
	}

	public SQLBinaryExpression op(String operand) {
		this.operand = operand;
		return this;
	}

	@Override
	public String getSQL(PreparedStatementValues val) throws FhirException {
		if (isValidDateField(leftExpression, rightExpression)) {
			return "( TO_DATE(TO_CHAR(" + leftExpression.getSQL(val) + ")) " + operand + " "
					+ rightExpression.getSQL(val) + ")";
		}
		return "(" + leftExpression.getSQL(val) + " " + operand + " " + rightExpression.getSQL(val) + ")";
	}

	public SQLExpression getLeftExpression() {
		return leftExpression;
	}

	public void setLeftExpression(SQLExpression leftExpression) {
		this.leftExpression = leftExpression;
	}

	public SQLExpression getRightExpression() {
		return rightExpression;
	}

	public void setRightExpression(SQLExpression rightExpression) {
		this.rightExpression = rightExpression;
	}

	public String getOperand() {
		return this.operand;
	}

	private boolean isValidDateField(SQLExpression left, SQLExpression right) {
		if (left instanceof SQLResultColumn) {
			if ("TIMESTAMP".equals(((SQLResultColumn) left).getColumn().getType())) {
				return isValidFormat("yyyy-mm-dd", ((SQLStringValue) right).value(), Locale.ENGLISH);
			}
		}
		return false;
	}

	private boolean isValidFormat(String format, String value, Locale locale) {
		try {
			SimpleDateFormat sdFormat = new SimpleDateFormat(format, Locale.ENGLISH);
			sdFormat.parse(value);
			return true;
		} catch (ParseException e) {
			return false;
		}
	}
}
