package com.legacy.health.fhir.meta.sql.queryengine;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.regex.Pattern;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.DataElementStructureLink;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.json.JSONValueElement;
import com.legacy.health.fhir.meta.queryengine.Join;
import com.legacy.health.fhir.meta.queryengine.Limit;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.queryengine.ResultElement;
import com.legacy.health.fhir.meta.repsitory.StructureConsumer;
import com.legacy.health.fhir.meta.sql.Column;
import com.legacy.health.fhir.meta.sql.RelationSchemaController;
import com.legacy.health.fhir.meta.sql.SQLContext;
import com.legacy.health.fhir.meta.sql.SQLSchemaController;
import com.legacy.health.fhir.meta.sql.Table;
import com.legacy.health.fhir.meta.sql.queryengine.consumer.ConnectionConsumer;
import com.legacy.health.fhir.meta.sql.queryengine.consumer.FullResourceQueryConsumer;
import com.legacy.health.fhir.meta.sql.queryengine.consumer.SQLQueryConsumer;
import com.legacy.health.fhir.meta.sql.queryengine.translator.ExpressionTranslator;
import com.legacy.health.fhir.util.Utils;

public class DefaultSQLQueryEngine extends BaseSQLQueryEngine {
	private static Log log = LogFactory.getLog(DefaultSQLQueryEngine.class);
	private RelationSchemaController controller;
	protected SQLQueryConsumer sqlQueryConsumer;

	public void setSchemaController(RelationSchemaController controller) {
		this.controller = controller;
	}

	@Override
	protected SQLSchemaController getSchemaController() {
		// TODO Auto-generated method stub
		return this.controller;
	}

	@Override
	protected void join2TablesOfSameResource(SQLQuery query, TableContext t1, TableContext t2) {
		Column ctxId = t1.getTable().getStructureLinkColumn();
		Column joinId = t2.getTable().getStructureLinkColumn();
		String ctxAlias = t1.getAlias();
		String joinAlias = t2.getAlias();
		SQLJoin join = qb.join(t2.getTable(), joinAlias,
				qb.eq(qb.column(ctxId, ctxAlias),
						qb.column(joinId, joinAlias)));
		query.join(join);
	}

	@Override
	protected void join2Resources(SQLQuery sql, Join join, String fromAlias, List<String> alreadyJoined,
			SQLContext context) {
		StructureDefinition def = join.getStructureDefinition();
		StructureDefinition linkDef = join.getLink().getStructureDefinition();
		DataElementStructureLink link = join.getLink().getDataElementStructureLink();
		TableContext joinContext = getSQLStructureMap().getTableContext(link);

		if (def.getId().equals(linkDef.getId())) {
			Column fromColumn = sql.getFromTable().getStructureLinkColumn();
			Column joinColumn = this.getColumnForDataElement(link, joinContext.getTable());
			String joinAlias = joinContext.getAlias();
			if (!alreadyJoined.contains(joinAlias)) {
				SQLJoin sqljoin = qb.join(joinContext.getTable(), joinAlias,
						qb.eq(qb.column(fromColumn, fromAlias),
								qb.column(joinColumn, joinAlias)));
				sql.join(sqljoin);
				alreadyJoined.add(joinAlias);
			}
			Column joinIdColumn = joinContext.getTable().getStructureLinkColumn();
			List<TableContext> tables = getSQLStructureMap().getTableContextList(def, join.getScope());
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
			Column joinColumn = this.getColumnForDataElement(link, joinContext.getTable());
			Column pathColumn = joinContext.getTable().getColumnByName("\"LOGICAL_PATH\"");
			String joinAlias = joinContext.getAlias();
			List<TableContext> tables = getSQLStructureMap().getTableContextList(def, join.getScope());
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
				SQLExpression idExpression = qb.eq(qb.column(joinColumn, joinAlias), qb.column(refColumn, refAlias));
				SQLJoin join3 = qb.join(t.getTable(), refAlias,
						qb.and(idExpression, pathExpression));
				sql.join(join3);
			}
		}

	}

	public SQLExpression getSQLExpression(Query query) {
		SQLExpression filter = ExpressionTranslator.getSQLExpression(query.filter(), getSQLStructureMap(),
				getSchemaController());
		filter = checkReferenceTableOnly(query, filter);

		return filter;
	}

	protected SQLExpression checkReferenceTableOnly(Query query, SQLExpression filter) {
		StructureDefinition fromDefinition = query.from().getStructureDefinition();
		List<TableContext> tables = this.getSQLStructureMap().getTableContextList(fromDefinition, null);
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

	protected void executeFullResourceQuery(Query query, StructureConsumer consumer, SQLQuery sql, String fromAlias,
			SQLContext context)
			throws FhirException, SQLException, IOException, JsonProcessingException {
		// Table resourceTable = this.schemaControl.getResourceTable();
		RelationSchemaController schemaControl = controller;
		Column fromId = sql.getFromTable().getStructureLinkColumn();
		sql.column(qb.column(fromId, fromAlias));
		sql.distinct();
		if (query.isLastN()) {
			SQLExpression expr = this.getSQLExpression(query.getResultElements().get(1));
			sql.column(expr);
		}
		SQLQueryConsumer innerConsumer = sqlQueryConsumer != null ? sqlQueryConsumer : new FullResourceQueryConsumer();
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
						SQLQueryConsumer everythingConsumer = sqlQueryConsumer != null ? sqlQueryConsumer
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
						SQLQueryConsumer everythingConsumer = sqlQueryConsumer != null ? sqlQueryConsumer
								: new FullResourceQueryConsumer();
						everythingConsumer.executeQuery(null, query, outer, consumer, schemaControl, context);
					}
				}

			}, schemaControl, context);
		} catch (Exception e) {
			log.error("Exception " + e.getLocalizedMessage());
			throw new FhirException("", e);
		}

	}

}
