package com.legacy.health.fhir.meta.sql.queryengine;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.DataElementStructureLink;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.queryengine.Expression;
import com.legacy.health.fhir.meta.queryengine.Join;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.queryengine.QueryElement;
import com.legacy.health.fhir.meta.queryengine.QueryElementConsumer;
import com.legacy.health.fhir.meta.queryengine.QueryEngine;
import com.legacy.health.fhir.meta.queryengine.QueryWalker;
import com.legacy.health.fhir.meta.queryengine.ResultElement;
import com.legacy.health.fhir.meta.queryengine.RowNumWindowExpression;
import com.legacy.health.fhir.meta.queryengine.Sort;
import com.legacy.health.fhir.meta.repsitory.StructureConsumer;
import com.legacy.health.fhir.meta.sql.Column;
import com.legacy.health.fhir.meta.sql.ExTableNotFoundException;
import com.legacy.health.fhir.meta.sql.SQLContext;
import com.legacy.health.fhir.meta.sql.SQLSchemaController;
import com.legacy.health.fhir.meta.sql.Table;
import com.legacy.health.fhir.meta.sql.queryengine.consumer.ConnectionConsumer;
import com.legacy.health.fhir.meta.sql.queryengine.consumer.DetailedQueryConsumer;
import com.legacy.health.fhir.meta.sql.queryengine.consumer.SQLQueryConsumer;
import com.legacy.health.fhir.meta.sql.queryengine.translator.ExpressionTranslator;

public abstract class BaseSQLQueryEngine implements QueryEngine {

	private static Log log = LogFactory.getLog(BaseSQLQueryEngine.class);
	protected SQLQueryConsumer queryConsumer;

	private SQLStructureMap sMap;
	protected SQLQueryBuilder qb = new SQLQueryBuilder();

	@Override
	public List<Structure> execute(Query query, Context context) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void execute(Query query, StructureConsumer consumer, Context ctx) throws Exception {
		SQLContext context = null;
		if (ctx instanceof SQLContext) {
			context = (SQLContext) ctx;
		}
		QueryWalker walker = new QueryWalker();
		List<DataElementStructureLink> elements = new ArrayList<DataElementStructureLink>();
		walker.walkQueryElements(query, new QueryElementConsumer() {
			@Override
			public void consumeQueryElement(QueryElement element) {
				List<DataElementStructureLink> de = element.getDataElements();
				if (de == null)
					return;
				elements.addAll(element.getDataElements());
			}
		});
		collectInvolvedTables(elements);
		SQLQuery sql = qb.query();
		String fromAlias = buildFrom(query, sql);
		buildJoins(query, sql, fromAlias, context);
		SQLExpression filter = this.getSQLExpression(query);
		buildSort(query, sql);
		if (isFullResourcesQuery(query)) {
			sql.filter(filter);
			// if(consumer instanceof BundleStructureConsumer){
			// getBundleTotal(query, consumer, context, sql);
			// }
			executeFullResourceQuery(query, consumer, sql, fromAlias, context);
		} else {
			if (query.limit() != null) {
				sql.limit(qb.limit(query.limit().limit(), query.limit().offset()));
			}
			executeDetailedQuery(query, consumer, sql, context, filter);
		}
	}

	private void buildSort(Query query, SQLQuery sql) {
		for (Sort sort : query.sortList()) {
			ResultElement resultElement = sort.by();
			DataElementStructureLink link = resultElement.getDataElementStructureLink();
			TableContext tc = getSQLStructureMap().getTableContext(link);
			Column column = getColumnForDataElement(link, tc.getTable());
			SQLResultColumn rc = qb.column(column, tc.getAlias());
			SQLOrderBy by = qb.orderBy(rc, sort.isDescending());
			sql.orderBy(by);
			sql.column(rc);
		}
	}

	@Override
	public void executeAsync(Query query, StructureConsumer consumer, Context context) throws Exception {
		// TODO Auto-generated method stub

	}

	private void collectInvolvedTables(List<DataElementStructureLink> elements) throws ExTableNotFoundException {
		SQLSchemaController schemaControl = getSchemaController();
		for (Iterator<DataElementStructureLink> iterator = elements.iterator(); iterator.hasNext();) {
			DataElementStructureLink link = iterator.next();
			StructureDefinition def = link.getStructureDefinition();
			schemaControl.ensureStructureDefinition(def);
			Table table = schemaControl.getTableForDataElement(link);
			getSQLStructureMap().register(link, table);
		}

	}

	private String buildFrom(Query query, SQLQuery sql) throws ExTableNotFoundException {
		SQLSchemaController schemaControl = getSchemaController();
		StructureDefinition fromDefinition = query.from().getStructureDefinition();
		List<TableContext> tables = this.getSQLStructureMap().getTableContextList(fromDefinition, null);
		if (tables == null) {// the case when no filter or grouping is set and no table was identifier
								// through properties
			schemaControl.ensureStructureDefinition(fromDefinition);
			DataElement de = query.getQueryBuilder().de(fromDefinition.getId() + ".id");// choose ID column
			DataElementStructureLink link = new DataElementStructureLink();
			link.setDataELement(de);
			link.setStructureDefinition(fromDefinition);
			link.setPath(fromDefinition.getId() + ".id");
			Table t = schemaControl.getTableForDataElement(link);
			TableContext ctx = new TableContext(t, fromDefinition.getId() + ".id");
			ctx.setAlias("f0");
			tables = Arrays.asList(ctx);
		}
		String ret = null;
		boolean isFirst = true;
		TableContext context = null;
		for (TableContext t : tables) {
			if (isFirst) {
				sql.from(qb.from(t.getTable(), t.getAlias()));
				ret = t.getAlias();
				context = t;
				isFirst = false;
			} else {
				join2TablesOfSameResource(sql, context, t);
			}
		}

		return ret;
	}

	private void buildJoins(Query query, SQLQuery sql, String fromAlias, SQLContext context) {
		List<String> alreadyJoined = new ArrayList<String>();
		for (Join join : query.joins()) {
			join2Resources(sql, join, fromAlias, alreadyJoined, context);
		}
	}

	public Column getColumnForDataElement(DataElementStructureLink link, Table table) {
		List<Column> columns = table.getColumns();
		for (Column column : columns) {// First check if a path match
			if (column.getSupportedPathList().contains(link.getPath()))
				return column;
		}
		for (Column column : columns) {// Then check data element
			if (column.getDataElement() == null)
				continue;
			if (column.getDataElement().equals(link.getDataElement()))
				return column;
		}
		return null;
	}

	public SQLExpression getSQLExpression(Query query) {
		return ExpressionTranslator.getSQLExpression(query.filter(), getSQLStructureMap(), getSchemaController());
	}

	public SQLExpression getSQLExpression(Expression expr) {
		SQLExpression filter = ExpressionTranslator.getSQLExpression(expr, getSQLStructureMap(), getSchemaController());
		return filter;
	}

	private boolean isFullResourcesQuery(Query query) throws FhirException {
		boolean fullResources = true;
		List<Expression> results = query.getResultElements();

		for (Expression e : results) {
			if (e instanceof ResultElement) {
				ResultElement resultElement = (ResultElement) e;
				if (!resultElement.isFullResource()) {
					fullResources = false;
				} else {
					if (fullResources == false) {
						throw new FhirException(
								"Inconsistent Query - Output either all Full Resources/ or non", null);
					}
				}
			} else {
				if (query.isLastN() && e instanceof RowNumWindowExpression)
					continue;
				fullResources = false;
			}
		}
		return fullResources;
	}

	protected abstract SQLSchemaController getSchemaController();

	protected abstract void join2TablesOfSameResource(SQLQuery query, TableContext t1, TableContext t2);

	protected abstract void join2Resources(SQLQuery query, Join join, String fromAlias, List<String> alreadyJoined,
			SQLContext context);

	protected abstract void executeFullResourceQuery(Query query, StructureConsumer consumer, SQLQuery sql,
			String fromAlias, SQLContext context)
			throws FhirException, SQLException, IOException, JsonProcessingException;

	protected void executeDetailedQuery(Query query, StructureConsumer consumer, SQLQuery sql, SQLContext context,
			SQLExpression filter) throws FhirException, SQLException, Exception {
		StructureDefinition definition = new StructureDefinition(query.getName());
		List<Expression> re = query.getResultElements();
		for (Iterator<Expression> iterator = re.iterator(); iterator.hasNext();) {
			Expression e = iterator.next();
			if (e instanceof ResultElement) {
				ResultElement resultElement = (ResultElement) e;
				log.info(((ResultElement) e).getPath());
				DataElementStructureLink link = resultElement.getDataElementStructureLink();
				TableContext tc = getSQLStructureMap().getTableContext(link);
				definition.addDataElement(link.getDataElement());
				Column column = getColumnForDataElement(link, tc.getTable());
				sql.column(qb.column(column, tc.getAlias()));
				/*
				 * Path p = resultElement.getPath();
				 * if(p != null && p.hasReferencePath()){
				 * Column refColumn = tc.getTable().getColumnByName("\"REFERENCE_PATH\"");
				 * SQLExpression refFilter = qb.eq(qb.column(refColumn,tc.getAlias()), new
				 * SQLStringValue().value(p.getReferencePath()));
				 * filter = filter==null?refFilter:qb.and(filter, refFilter);
				 * }
				 */
			} else {// e.g. min/max/avg
				DataElement element = new DataElement();
				element.setId(definition.getId() + "." + e.label());
				element.setMin(0);
				element.setMax(1);
				element.setType(e.getType());
				definition.addDataElement(element);
				SQLExpression expr = this.getSQLExpression(e);
				sql.column(expr);
			}
		}
		sql.filter(filter);
		for (ResultElement resultElement : query.groupByList()) {
			DataElementStructureLink link = resultElement.getDataElementStructureLink();
			TableContext tc = getSQLStructureMap().getTableContext(link);
			definition.addDataElement(link.getDataElement());
			Column column = getColumnForDataElement(link, tc.getTable());
			sql.groupBy(qb.column(column, tc.getAlias()));
		}

		log.info(sql.getSQL(new PreparedStatementValues()));
		SQLQueryConsumer innerConsumer = queryConsumer != null ? queryConsumer : new DetailedQueryConsumer();
		if (innerConsumer instanceof ConnectionConsumer) {
			((ConnectionConsumer) innerConsumer).setConnection(context.getConnection());
		}
		innerConsumer.executeQuery(definition, query, sql, consumer, getSchemaController(), context);
	}

	protected SQLStructureMap getSQLStructureMap() {
		if (this.sMap == null) {
			sMap = this.getSchemaController().createSQLStructureMapInstance();
		}
		return sMap;
	}

}
