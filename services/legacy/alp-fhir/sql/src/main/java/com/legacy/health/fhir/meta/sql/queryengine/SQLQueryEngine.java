package com.legacy.health.fhir.meta.sql.queryengine;

import java.io.IOException;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;
import java.util.regex.Pattern;

import com.legacy.health.fhir.meta.sql.*;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.DataElementStructureLink;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.Path;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.json.JSONValueElement;
import com.legacy.health.fhir.meta.queryengine.Expression;
import com.legacy.health.fhir.meta.queryengine.Join;
import com.legacy.health.fhir.meta.queryengine.Limit;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.queryengine.QueryElement;
import com.legacy.health.fhir.meta.queryengine.QueryElementConsumer;
import com.legacy.health.fhir.meta.queryengine.QueryEngine;
import com.legacy.health.fhir.meta.queryengine.QueryWalker;
import com.legacy.health.fhir.meta.queryengine.ResultElement;
import com.legacy.health.fhir.meta.queryengine.RowNumWindowExpression;
import com.legacy.health.fhir.meta.queryengine.Sort;
import com.legacy.health.fhir.meta.repsitory.BundleStructureConsumer;
import com.legacy.health.fhir.meta.repsitory.StructureConsumer;
import com.legacy.health.fhir.meta.sql.queryengine.consumer.ConnectionConsumer;
import com.legacy.health.fhir.meta.sql.queryengine.consumer.DetailedQueryConsumer;
import com.legacy.health.fhir.meta.sql.queryengine.consumer.FullResourceQueryConsumer;
import com.legacy.health.fhir.meta.sql.queryengine.consumer.SQLQueryConsumer;
import com.legacy.health.fhir.meta.sql.queryengine.translator.ExpressionTranslator;
import com.legacy.health.fhir.util.Utils;

public class SQLQueryEngine implements QueryEngine {
	private static Log log = LogFactory.getLog(SQLQueryEngine.class);
	protected Properties connectionProperties;

	protected RelationSchemaController schemaControl;
	protected ObjectMapper mapper = new ObjectMapper();
	// protected Connection connection;
	protected boolean ownConnection = false;
	protected SQLQueryConsumer queryConsumer;

	@Override
	public List<Structure> execute(Query query, Context context) {

		return null;
	}

	public void setSchemaControllerImpl(RelationSchemaController control) {
		this.schemaControl = control;
	}

	/**
	 * This Query Consumer will overwrite Query Consumers for the detailed queries.
	 */
	public void setSQLQueryConsumer(SQLQueryConsumer consumer) {
		this.queryConsumer = consumer;
	}

	@Override
	public void executeAsync(Query query, StructureConsumer consumer, Context context) {
		// TODO Auto-generated method stub

	}

	SQLQueryBuilder qb = new SQLQueryBuilder();

	protected SQLExpression checkReferenceTableOnly(Query query, SQLExpression filter) {
		StructureDefinition fromDefinition = query.from().getStructureDefinition();
		List<TableContext> tables = this.sMap.getTableContextList(fromDefinition, null);
		int numJoins = query.joins().size();
		if (tables != null && tables.size() == 1 && numJoins == 0) {
			TableContext t = tables.get(0);
			if (t.getTable().getFullTableName().contains("FHIR_REFERENCE_TABLE")) {// now filter must be added
				SQLStringValue sv = new SQLStringValue().value(fromDefinition.getId());
				Column fromColumn = t.getTable().getColumnByName("\"FROM_TYPE\"");
				filter = qb.and(filter, qb.eq(qb.column(fromColumn, t.getAlias()), sv));
			}
		}
		return filter;
	}

	@Override
	public void execute(Query query, StructureConsumer consumer, Context ctx) throws Exception {
		SQLContext context = (SQLContext) ctx;
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
		buildJoins(query, sql, fromAlias);
		SQLExpression filter = this.getSQLExpression(query.filter());
		// check for only reference table;
		filter = checkReferenceTableOnly(query, filter);
		for (Sort sort : query.sortList()) {
			ResultElement resultElement = sort.by();
			DataElementStructureLink link = resultElement.getDataElementStructureLink();
			TableContext tc = sMap.getTableContext(link);
			Column column = getColumnForDataElement(link.getDataElement(), tc.getTable());
			SQLResultColumn rc = qb.column(column, tc.getAlias());
			SQLOrderBy by = qb.orderBy(rc, sort.isDescending());
			sql.orderBy(by);
			sql.column(rc);
		}

		if (isFullResourcesQuery(query)) {
			sql.filter(filter);
			if (consumer instanceof BundleStructureConsumer) {
				getBundleTotal(query, consumer, context, sql);
			}
			executeFullResourceQuery(query, consumer, sql, fromAlias, context);
		} else {
			if (query.limit() != null) {
				sql.limit(qb.limit(query.limit().limit(), query.limit().offset()));
			}
			executeDetailedQuery(query, consumer, sql, context, filter);
		}
	}

	public void getBundleTotal(Query query, StructureConsumer consumer, SQLContext context, SQLQuery sql)
			throws SQLException, FhirException {
		SQLUnaryFunction localCount = new SQLUnaryFunction().name("count")
				.parameter(new SQLConstantStringValue().value("*"));
		sql.column(localCount);
		// String totalQuery = "select count(*)total from ("+prequery+")";

		PreparedStatement stmt = sql.getStatement(context.getConnection());
		ResultSet rs = stmt.executeQuery();
		int total = 0;
		while (rs.next()) {
			total = rs.getInt(1);
		}
		rs.close();
		stmt.close();
		if (query.limit() != null) {
			sql.limit(qb.limit(query.limit().limit(), query.limit().offset()));
		}
		sql.columns.remove(localCount);
		((BundleStructureConsumer) consumer).setTotal(total);
	}

	private String buildFrom(Query query, SQLQuery sql) throws ExTableNotFoundException {
		StructureDefinition fromDefinition = query.from().getStructureDefinition();
		List<TableContext> tables = this.sMap.getTableContextList(fromDefinition, null);
		if (tables == null) {// the case when no filter or grouping is set and no table was identifier
								// through properties
			schemaControl.createSchema(fromDefinition);
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
			} else if (context != null) {
				Column ctxId = context.getTable().getStructureLinkColumn();
				Column joinId = t.getTable().getStructureLinkColumn();
				String ctxAlias = context.getAlias();
				String joinAlias = t.getAlias();
				SQLJoin join = qb.join(t.getTable(), joinAlias,
						qb.eq(qb.column(ctxId, ctxAlias),
								qb.column(joinId, joinAlias)));
				sql.join(join);
			}
		}

		return ret;
	}

	private void buildJoins(Query query, SQLQuery sql, String fromAlias) {
		List<String> alreadyJoined = new ArrayList<String>();
		for (Join join2 : query.joins()) {
			StructureDefinition def = join2.getStructureDefinition();
			StructureDefinition linkDef = join2.getLink().getStructureDefinition();
			DataElementStructureLink link = join2.getLink().getDataElementStructureLink();
			TableContext joinContext = sMap.getTableContext(link);
			Column fromColumn = sql.getFromTable().getStructureLinkColumn();
			if (def.getId().equals(linkDef.getId())) {
				Column joinColumn = this.getColumnForDataElement(link.getDataElement(), joinContext.getTable());
				String joinAlias = joinContext.getAlias();
				if (!alreadyJoined.contains(joinAlias)) {
					SQLJoin join = qb.join(joinContext.getTable(), joinAlias,
							qb.eq(qb.column(fromColumn, fromAlias),
									qb.column(joinColumn, joinAlias)));
					sql.join(join);
					alreadyJoined.add(joinAlias);
				}
				Column joinIdColumn = joinContext.getTable().getStructureLinkColumn();
				List<TableContext> tables = sMap.getTableContextList(def, join2.getScope());
				// Set<Table> jtables = map.getTables(def);
				for (TableContext t : tables) {
					if (t.equals(joinContext))
						continue;
					Column refColumn = t.getTable().getStructureLinkColumn();
					String refAlias = t.getAlias();
					if (alreadyJoined.contains(refAlias))
						continue;
					alreadyJoined.add(refAlias);
					SQLJoin join3 = qb.join(t.getTable(), refAlias,
							qb.eq(qb.column(joinIdColumn, joinAlias),
									qb.column(refColumn, refAlias)));
					sql.join(join3);
				}
			} else {
				Column joinColumn = this.getColumnForDataElement(link.getDataElement(), joinContext.getTable());
				Column pathColumn = joinContext.getTable().getColumnByName("\"LOGICAL_PATH\"");
				String joinAlias = joinContext.getAlias();
				// SQLJoin join = qb.join(joinContext.getTable(), joinAlias,
				// qb.eq( qb.column(fromColumn, fromAlias),
				// qb.column(joinIdColumn, joinAlias)));
				// sql.join(join);

				List<TableContext> tables = sMap.getTableContextList(def, join2.getScope());
				// Set<Table> jtables = map.getTables(def);
				for (TableContext t : tables) {
					if (t.equals(joinContext))
						continue;
					Column refColumn = t.getTable().getStructureLinkColumn();
					String refAlias = t.getAlias();
					String path = link.getPath();
					if (path.endsWith(".reference")) {// TODO: Check if not better the logical path has to be adapted
						path = path.substring(0, path.length() - ".reference".length());
					}
					SQLExpression pathExpression = qb.eq(qb.column(pathColumn, joinAlias),
							new SQLStringValue().value(path));
					SQLExpression idExpression = qb.eq(qb.column(joinColumn, joinAlias),
							qb.column(refColumn, refAlias));
					SQLJoin join3 = qb.join(t.getTable(), refAlias,
							qb.and(idExpression, pathExpression));
					sql.join(join3);
				}
			}
		}
	}

	private void executeFullResourceQuery(Query query, StructureConsumer consumer, SQLQuery sql, String fromAlias,
			SQLContext context)
			throws FhirException, SQLException, IOException, JsonProcessingException {
		// Table resourceTable = this.schemaControl.getResourceTable();
		Column fromId = sql.getFromTable().getStructureLinkColumn();
		sql.column(qb.column(fromId, fromAlias));
		sql.distinct();
		if (query.isLastN()) {
			SQLExpression expr = this.getSQLExpression(query.getResultElements().get(1));
			sql.column(expr);
		}
		SQLQueryConsumer innerConsumer = queryConsumer != null ? queryConsumer : new FullResourceQueryConsumer();
		if (innerConsumer instanceof ConnectionConsumer) {
			((ConnectionConsumer) innerConsumer).setConnection(context.getConnection());
		}
		try {
			innerConsumer.executeQuery(null, query, sql, new StructureConsumer() {

				@Override
				public void writeStructure(Structure structure, Context ctx) throws Exception {
					SQLContext context = (SQLContext) ctx;
					consumer.writeStructure(structure, context);
					if (query.returnEverything()) {
						Table refTable = schemaControl.getReferenceTable();
						Table resTable = schemaControl.getResourceTable();
						StructureDefinition sd = query.from().getStructureDefinition();
						SQLQuery outer = qb.query();
						SQLResultColumn resID = qb.column(resTable.getColumnByName("\"ID\""), "t0");
						SQLResultColumn resValid = qb.column(resTable.getColumnByName("\"VALID_TO\""), "t0");
						SQLResultColumn refID = qb.column(refTable.getColumnByName("\"PARENT_ID\""), "t1");
						SQLResultColumn targetID = qb.column(refTable.getColumnByName("\"REFERENCE\""), "t1");

						JSONValueElement ve = (JSONValueElement) structure.getElementByPath(sd.getId() + ".id");
						String helper = ve.getValue().toString();
						// String
						// uuidPattern="[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}";
						helper = Utils.checkUUID(helper);
						/*
						 * if(Pattern.matches(uuidPattern, helper) ){//TODO
						 * helper="urn:uuid:"+helper;
						 * }else{
						 * helper=sd.getId()+"/"+helper;
						 * }
						 */
						SQLStringValue value = new SQLStringValue().value(helper);

						outer.from(qb.from(resTable, "t0"))
								.column(resID)
								.join(qb.join(refTable, "t1", qb.eq(resID, refID)))
								.filter(qb.and(qb.eq(targetID, value), qb.isNull(resValid)));
						query.limit(new Limit().limit(50));
						SQLQueryConsumer everythingConsumer = queryConsumer != null ? queryConsumer
								: new FullResourceQueryConsumer();
						everythingConsumer.executeQuery(null, query, outer, consumer, schemaControl, context);
					}
					if (query.getIncludes().size() > 0) {
						List<ResultElement> includes = query.getIncludes();
						Table refTable = schemaControl.getReferenceTable();
						Table resTable = schemaControl.getResourceTable();
						StructureDefinition sd = query.from().getStructureDefinition();
						SQLQuery outer = qb.query();
						SQLResultColumn resID = qb.column(resTable.getColumnByName("\"ID\""), "t0");
						SQLResultColumn refID = qb.column(refTable.getColumnByName("\"PARENT_ID\""), "t1");
						SQLResultColumn targetID = qb.column(refTable.getColumnByName("\"REFERENCE\""), "t1");
						SQLResultColumn pathColumn = qb.column(refTable.getColumnByName("\"LOGICAL_PATH\""), "t1");

						JSONValueElement ve = (JSONValueElement) structure.getElementByPath(sd.getId() + ".id");
						String helper = ve.getValue().toString();
						String uuidPattern = "[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}";
						if (Pattern.matches(uuidPattern, helper)) {// TODO
							helper = "urn:uuid:" + helper;
						} else {
							// helper=sd.getId()+"/"+helper;
						}
						SQLStringValue value = new SQLStringValue().value(helper);
						SQLExpression filter = qb.eq(resID, value);
						SQLExpression includeExpression = null;
						for (ResultElement resultElement : includes) {
							String path = resultElement.getPath().toString();
							SQLExpression pathExpression = qb.eq(pathColumn, new SQLStringValue().value(path));
							includeExpression = includeExpression == null ? pathExpression
									: qb.or(includeExpression, pathExpression);
						}
						targetID.label("ID");
						filter = qb.and(filter, includeExpression);
						outer.from(qb.from(resTable, "t0"))
								.column(targetID)
								.join(qb.join(refTable, "t1", qb.eq(resID, refID)))
								.filter(filter);
						query.lastn(0);
						SQLQueryConsumer everythingConsumer = queryConsumer != null ? queryConsumer
								: new FullResourceQueryConsumer();
						everythingConsumer.executeQuery(null, query, outer, consumer, schemaControl, context);
					}
				}

			}, schemaControl, context);
		} catch (Exception e) {
			throw new FhirException("", e);
		}

	}

	private void executeDetailedQuery(Query query, StructureConsumer consumer, SQLQuery sql, SQLContext context,
			SQLExpression filter) throws FhirException, SQLException, Exception {
		StructureDefinition definition = new StructureDefinition(query.getName());
		List<Expression> re = query.getResultElements();
		for (Iterator<Expression> iterator = re.iterator(); iterator.hasNext();) {
			Expression e = iterator.next();
			if (e instanceof ResultElement) {
				ResultElement resultElement = (ResultElement) e;
				log.info(((ResultElement) e).getPath());
				DataElementStructureLink link = resultElement.getDataElementStructureLink();
				TableContext tc = sMap.getTableContext(link);
				definition.addDataElement(link.getDataElement());
				Column column = getColumnForDataElement(link.getDataElement(), tc.getTable());
				sql.column(qb.column(column, tc.getAlias()));
				Path p = resultElement.getPath();
				if (p != null && p.hasReferencePath()) {
					Column refColumn = tc.getTable().getColumnByName("\"REFERENCE_PATH\"");
					SQLExpression refFilter = qb.eq(qb.column(refColumn, tc.getAlias()),
							new SQLStringValue().value(p.getReferencePath()));
					filter = filter == null ? refFilter : qb.and(filter, refFilter);
				}
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
			TableContext tc = sMap.getTableContext(link);
			definition.addDataElement(link.getDataElement());
			Column column = getColumnForDataElement(link.getDataElement(), tc.getTable());
			sql.groupBy(qb.column(column, tc.getAlias()));
		}

		log.info(sql.getSQL(new PreparedStatementValues()));
		SQLQueryConsumer innerConsumer = queryConsumer != null ? queryConsumer : new DetailedQueryConsumer();
		if (innerConsumer instanceof ConnectionConsumer) {
			((ConnectionConsumer) innerConsumer).setConnection(context.getConnection());
		}
		innerConsumer.executeQuery(definition, query, sql, consumer, schemaControl, context);
	}

	protected SQLStructureMap sMap = new SQLStructureMap();

	private void collectInvolvedTables(List<DataElementStructureLink> elements) throws ExTableNotFoundException {

		// List<Table> tables = new ArrayList<Table>();
		for (Iterator<DataElementStructureLink> iterator = elements.iterator(); iterator.hasNext();) {
			DataElementStructureLink link = iterator.next();
			StructureDefinition def = link.getStructureDefinition();
			if (!this.schemaControl.hasDefinition(def.getId())) {
				this.schemaControl.createSchema(def);
			}
			Table table = this.schemaControl.getTableForDataElement(link);
			sMap.register(link, table);

			// tables.add(table);
		}

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

	public SQLExpression getSQLExpression(Expression expression) {
		return ExpressionTranslator.getSQLExpression(expression, sMap, schemaControl);
	}

	public Column getColumnForDataElement(DataElement element, Table table) {
		List<Column> columns = table.getColumns();
		for (Column column : columns) {
			if (column.getDataElement() == null)
				continue;
			if (column.getDataElement().equals(element))
				return column;
		}
		return null;
	}
}
