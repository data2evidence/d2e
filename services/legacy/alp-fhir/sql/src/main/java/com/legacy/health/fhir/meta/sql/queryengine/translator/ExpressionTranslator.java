package com.legacy.health.fhir.meta.sql.queryengine.translator;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.DataElementStructureLink;
import com.legacy.health.fhir.meta.queryengine.BinaryExpression;
import com.legacy.health.fhir.meta.queryengine.DecimalExpression;
import com.legacy.health.fhir.meta.queryengine.Expression;
import com.legacy.health.fhir.meta.queryengine.InValueSetExpression;
import com.legacy.health.fhir.meta.queryengine.InstantExpression;
import com.legacy.health.fhir.meta.queryengine.IntegerExpression;
import com.legacy.health.fhir.meta.queryengine.Interval;
import com.legacy.health.fhir.meta.queryengine.IsXXNullExpression;
import com.legacy.health.fhir.meta.queryengine.OverlapsExpression;
import com.legacy.health.fhir.meta.queryengine.QuantityExpression;
import com.legacy.health.fhir.meta.queryengine.ResultElement;
import com.legacy.health.fhir.meta.queryengine.RowNumWindowExpression;
import com.legacy.health.fhir.meta.queryengine.StringExpression;
import com.legacy.health.fhir.meta.queryengine.TimeBetweenExpression;
import com.legacy.health.fhir.meta.queryengine.TokenSearchExpression;
import com.legacy.health.fhir.meta.queryengine.UnaryFunction;
import com.legacy.health.fhir.meta.sql.Column;
import com.legacy.health.fhir.meta.sql.SQLSchemaController;
import com.legacy.health.fhir.meta.sql.Table;
import com.legacy.health.fhir.meta.sql.queryengine.SQLBinaryExpression;
import com.legacy.health.fhir.meta.sql.queryengine.SQLDecimalValue;
import com.legacy.health.fhir.meta.sql.queryengine.SQLExpression;
import com.legacy.health.fhir.meta.sql.queryengine.SQLInValueSetExpression;
import com.legacy.health.fhir.meta.sql.queryengine.SQLIntegerValue;
import com.legacy.health.fhir.meta.sql.queryengine.SQLIsXXNullExpression;
import com.legacy.health.fhir.meta.sql.queryengine.SQLQueryBuilder;
import com.legacy.health.fhir.meta.sql.queryengine.SQLRowNumberWindowExpression;
import com.legacy.health.fhir.meta.sql.queryengine.SQLStringValue;
import com.legacy.health.fhir.meta.sql.queryengine.SQLStructureMap;
import com.legacy.health.fhir.meta.sql.queryengine.SQLTimeBetweenExpression;
import com.legacy.health.fhir.meta.sql.queryengine.SQLUnaryFunction;
import com.legacy.health.fhir.meta.sql.queryengine.TableContext;

public class ExpressionTranslator {
	protected static Log log = LogFactory.getLog(ExpressionTranslator.class);

	protected static SQLQueryBuilder qb = new SQLQueryBuilder();

	protected static boolean isTypeExpression(Expression expr, String type) {
		if (expr instanceof ResultElement) {
			ResultElement re = (ResultElement) expr;
			DataElement de = re.getDataElementStructureLink().getDataElement();
			if (de != null) {
				String cmpType = de.getType().getId();
				return type.equals(cmpType);
			}
		}
		return false;
	}

	protected static boolean isQuantityOperationExpression(BinaryExpression expression) {
		boolean leftQuantity = false, rightQuantity = false;
		Expression left = expression.left();
		Expression right = expression.right();
		leftQuantity = (left instanceof QuantityExpression) || isTypeExpression(left, "Quantity");
		rightQuantity = (right instanceof QuantityExpression) || isTypeExpression(right, "Quantity");
		return leftQuantity && rightQuantity;
	}

	/**
	 * Works with Quantity Expressions
	 * 
	 * @return
	 */
	protected static SQLExpression getValueExpression(Expression value, SQLStructureMap sMap,
			SQLSchemaController schemaControl) {
		if (value instanceof ResultElement) {
			ResultElement re = (ResultElement) value;
			if (re.getType().getId().equals("Quantity")) {
				DataElementStructureLink link = re.getQuantityValueLink();
				TableContext tc = sMap.getTableContext(link);
				Column column = getColumnForDataElement(link, tc.getTable());
				return qb.column(column, tc.getAlias());
			}
		}
		if (value instanceof QuantityExpression) {
			QuantityExpression qe = (QuantityExpression) value;
			return getSQLExpression(qe.value(), sMap, schemaControl);
		}
		return null;
	}

	protected static SQLExpression getUnitExpression(Expression unit, SQLStructureMap sMap,
			SQLSchemaController schemaControl) {
		if (unit instanceof ResultElement) {
			ResultElement re = (ResultElement) unit;
			if (re.getType().getId().equals("Quantity")) {
				DataElementStructureLink link = re.getQuantityUnitLink();
				TableContext tc = sMap.getTableContext(link);
				Column column = getColumnForDataElement(link, tc.getTable());
				return qb.column(column, tc.getAlias());
			}
		}
		if (unit instanceof QuantityExpression) {
			QuantityExpression qe = (QuantityExpression) unit;
			return getSQLExpression(qe.unit(), sMap, schemaControl);
		}
		return null;
	}

	public static SQLExpression getSQLExpression(Expression expression, SQLStructureMap sMap,
			SQLSchemaController schemaControl) {

		if (expression instanceof BinaryExpression) {
			BinaryExpression be = (BinaryExpression) expression;
			if (isQuantityOperationExpression(be)) {// Take Quality in a specific way
				log.info("Is Quantity");
				SQLExpression leftValue = getValueExpression(be.left(), sMap, schemaControl);
				SQLExpression leftUnit = getUnitExpression(be.left(), sMap, schemaControl);
				SQLExpression rightValue = getValueExpression(be.right(), sMap, schemaControl);
				SQLExpression rightUnit = getUnitExpression(be.right(), sMap, schemaControl);
				return qb.and(qb.op(leftValue, be.operation(), rightValue), qb.eq(leftUnit, rightUnit));

			}
			SQLExpression left = getSQLExpression(((BinaryExpression) expression).left(), sMap, schemaControl);
			SQLExpression right = getSQLExpression(((BinaryExpression) expression).right(), sMap, schemaControl);
			String operation = ((BinaryExpression) expression).operation();
			SQLBinaryExpression binary = new SQLBinaryExpression();
			binary.left(left).op(operation).right(right);
			return binary;
		}

		if (expression instanceof TokenSearchExpression) {
			TokenSearchExpression tokenSearch = (TokenSearchExpression) expression;
			return TokenSearchTranslator.getSQLExpression(tokenSearch, sMap, schemaControl);
		}
		if (expression instanceof StringExpression) {
			SQLStringValue ret = new SQLStringValue();
			ret.value(((StringExpression) expression).getValue());
			return ret;
		}
		if (expression instanceof IntegerExpression) {
			SQLIntegerValue ret = new SQLIntegerValue();
			ret.value(((IntegerExpression) expression).getValue());
			return ret;
		}
		if (expression instanceof DecimalExpression) {
			SQLDecimalValue ret = new SQLDecimalValue();
			ret.value(((DecimalExpression) expression).getValue());
			return ret;
		}
		if (expression instanceof ResultElement) {
			ResultElement e = (ResultElement) expression;
			DataElementStructureLink link = e.getDataElementStructureLink();
			TableContext tc = sMap.getTableContext(link);
			Column column = getColumnForDataElement(link, tc.getTable());
			return qb.column(column, tc.getAlias());
		}

		if (expression instanceof UnaryFunction) {
			UnaryFunction ae = (UnaryFunction) expression;
			SQLExpression inner = getSQLExpression(ae.parameter(), sMap, schemaControl);
			SQLUnaryFunction unary = new SQLUnaryFunction();
			unary.name(ae.name());
			unary.parameter(inner);
			unary.label(ae.label());
			return unary;
		}
		if (expression instanceof TimeBetweenExpression) {
			TimeBetweenExpression tbe = (TimeBetweenExpression) expression;
			SQLExpression left = getSQLExpression(tbe.left(), sMap, schemaControl);
			SQLExpression right = getSQLExpression(tbe.right(), sMap, schemaControl);
			String precission = tbe.precission();
			SQLTimeBetweenExpression ret = schemaControl.getProviderFactory().getTimeBetweenExpression();
			ret.left(left).right(right).precission(precission);
			return ret;
		}

		if (expression instanceof OverlapsExpression) {
			OverlapsExpression overlaps = (OverlapsExpression) expression;
			Expression eLeft = overlaps.left();
			Expression eRight = overlaps.right();
			if (eLeft instanceof Interval && eRight instanceof Interval) {
				Interval iLeft = (Interval) eLeft;
				Interval iRight = (Interval) eRight;
				SQLExpression sLeftLow = getSQLExpression(iLeft.low(), sMap, schemaControl);
				SQLExpression sLeftHigh = getSQLExpression(iLeft.high(), sMap, schemaControl);
				SQLExpression sRightLow = getSQLExpression(iRight.low(), sMap, schemaControl);
				SQLExpression sRightHigh = getSQLExpression(iRight.high(), sMap, schemaControl);
				SQLExpression ret = qb.and(qb.op(sLeftHigh, ">=", sRightLow),
						qb.op(sLeftLow, "<=", sRightHigh));
				return ret;
			}
			return null;
		}

		if (expression instanceof InValueSetExpression) {
			InValueSetExpression ivs = (InValueSetExpression) expression;
			SQLExpression code = getSQLExpression(ivs.atomicCode(), sMap, schemaControl);
			String id = ivs.valueSet();
			SQLInValueSetExpression ret = new SQLInValueSetExpression();
			ret.control(schemaControl);
			ret.code(code).valueSet(id);
			return ret;
		}

		if (expression instanceof InstantExpression) {
			InstantExpression ie = (InstantExpression) expression;
			Instant instant = ie.getInstant();

			DateTimeFormatter formatter = DateTimeFormatter.ISO_INSTANT;
			// .withZone( ZoneId.systemDefault() );
			String output = formatter.format(instant);
			SQLStringValue ret = new SQLStringValue();
			ret.value(output);
			return ret;
		}

		if (expression instanceof IsXXNullExpression) {
			IsXXNullExpression ie = (IsXXNullExpression) expression;
			SQLIsXXNullExpression isNull = new SQLIsXXNullExpression();
			SQLExpression inner = getSQLExpression(ie.getExpression(), sMap, schemaControl);
			isNull.expression(inner);
			if (ie.isNot()) {
				isNull.not();
			}
			return isNull;
		}
		if (expression instanceof RowNumWindowExpression) {
			RowNumWindowExpression rn = (RowNumWindowExpression) expression;
			SQLRowNumberWindowExpression rownum = new SQLRowNumberWindowExpression();
			SQLExpression partition = getSQLExpression(rn.partition(), sMap, schemaControl);
			SQLExpression orderBy = getSQLExpression(rn.orderBy(), sMap, schemaControl);
			rownum.partition(partition);
			rownum.orderby(orderBy);
			rownum.desc(rn.isDesc());
			rownum.label(rn.label());
			return rownum;
		}
		return null;
	}

	public static Column getColumnForDataElement(DataElementStructureLink link, Table table) {
		List<Column> columns = table.getColumns();
		for (Column column : columns) {// First check if a path match
			if (column.getSupportedPathList().contains(link.getPath()))
				return column;
		}
		DataElement element = link.getDataElement();
		for (Column column : columns) {
			if (column.getDataElement() == null)
				continue;
			if (column.getDataElement().equals(element))
				return column;
		}
		return null;
	}
}
