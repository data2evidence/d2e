package com.legacy.health.fhir.meta.sql.catalog;

import java.io.IOException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legacy.health.fhir.content.model.CatalogDefinition;
import com.legacy.health.fhir.content.model.CatalogDefinition.Mapping;
import com.legacy.health.fhir.meta.OperationOutcomeBuilder;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.FhirRuntimeException;
import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.DataElementStructureLink;
import com.legacy.health.fhir.meta.entity.Issue;
import com.legacy.health.fhir.meta.entity.OperationOutcome;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.queryengine.Join;
import com.legacy.health.fhir.meta.queryengine.Parameter;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.queryengine.ResultElement;
import com.legacy.health.fhir.meta.queryengine.StringExpression;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.StructureConsumer;
import com.legacy.health.fhir.meta.sql.Column;
import com.legacy.health.fhir.meta.sql.SQLContext;
import com.legacy.health.fhir.meta.sql.SQLSchemaController;
import com.legacy.health.fhir.meta.sql.Table;
import com.legacy.health.fhir.meta.sql.queryengine.BaseSQLQueryEngine;
import com.legacy.health.fhir.meta.sql.queryengine.PreparedStatementValues;
import com.legacy.health.fhir.meta.sql.queryengine.SQLBinaryExpression;
import com.legacy.health.fhir.meta.sql.queryengine.SQLExpression;
import com.legacy.health.fhir.meta.sql.queryengine.SQLFrom;
import com.legacy.health.fhir.meta.sql.queryengine.SQLInExpression;
import com.legacy.health.fhir.meta.sql.queryengine.SQLInnerQuery;
import com.legacy.health.fhir.meta.sql.queryengine.SQLIntegerValue;
import com.legacy.health.fhir.meta.sql.queryengine.SQLJoin;
import com.legacy.health.fhir.meta.sql.queryengine.SQLLimit;
import com.legacy.health.fhir.meta.sql.queryengine.SQLListValue;
import com.legacy.health.fhir.meta.sql.queryengine.SQLQuery;
import com.legacy.health.fhir.meta.sql.queryengine.SQLResultColumn;
import com.legacy.health.fhir.meta.sql.queryengine.TableContext;
import com.legacy.health.fhir.meta.sql.util.FhirUtils;
import com.legacy.health.fhir.util.UUIDGeneratorImpl;

public class CatalogQueryEngine extends BaseSQLQueryEngine {
	static ObjectMapper mapper = new ObjectMapper();
	private List<CatalogDefinition> definitions = new ArrayList<CatalogDefinition>();
	private CatalogSchemaController controller = new CatalogSchemaController(definitions);

	private static final Logger log = LoggerFactory.getLogger(CatalogQueryEngine.class);

	public void setCatalogDefinitions(List<CatalogDefinition> definitions) {
		this.definitions.addAll(definitions);
	}

	@Override
	protected SQLSchemaController getSchemaController() {
		// TODO Auto-generated method stub
		return controller;
	}

	@Override
	protected void join2TablesOfSameResource(SQLQuery query, TableContext t1, TableContext t2) {
		Column ctxId = t1.getTable().getStructureLinkColumn();
		Column joinId = t2.getTable().getStructureLinkColumn();
		String ctxAlias = t1.getAlias();
		String joinAlias = t2.getAlias();
		SQLJoin join = qb.join(t2.getTable(), joinAlias,
				qb.eq(qb.column(ctxId, ctxAlias), qb.column(joinId, joinAlias)));
		query.join(join);
	}

	@Override
	protected void join2Resources(SQLQuery sql, Join join, String fromAlias, List<String> alreadyJoined,
			SQLContext context) {

		StructureDefinition def = join.getStructureDefinition();
		StructureDefinition linkDef = join.getLink().getStructureDefinition();
		TableContext remoteContext = null;
		String remoteAlias = "";
		if (!def.getId().equals(linkDef.getId())) {
			DataElementStructureLink link = join.getLink().getDataElementStructureLink();
			if (link == null) {
				ResultElement element = join.getLink();
				String msg = element != null ? ("No DataElement Structure Link found for '" + element.getPath() + "'")
						: ("Error in Query Definition(missing DataElementStructureLink)");
				log.error(msg);
				throw new FhirRuntimeException(msg, null);
			}
			TableContext joinContext = getSQLStructureMap().getTableContext(link);
			if (joinContext.getAlias().equals(fromAlias)) {
				DataElementStructureLink remoteLink = context.getRepo().getElementByPath(def, "Patient.id");
				remoteContext = getSQLStructureMap().getTableContext(remoteLink);
				Column joinColumn = this.getColumnForDataElement(link, joinContext.getTable());
				Column remoteColumn = this.getColumnForDataElement(remoteLink, remoteContext.getTable());
				String alias = remoteContext.getAlias();
				if (!alreadyJoined.contains(alias)) {
					SQLJoin sqljoin = qb.join(remoteContext.getTable(), alias,
							qb.eq(qb.column(joinColumn, fromAlias), qb.column(remoteColumn, alias)));
					sql.join(sqljoin);
					alreadyJoined.add(alias);
				}
				remoteAlias = alias;
			}
		} else {
			DataElementStructureLink link = join.getLink().getDataElementStructureLink();
			if (link == null) {
				ResultElement element = join.getLink();
				String msg = element != null ? ("No DataElement Structure Link found for '" + element.getPath() + "'")
						: ("Error in Query Definition(missing DataElementStructureLink)");
				log.error(msg);
				throw new FhirRuntimeException(msg, null);
			}
			TableContext joinContext = getSQLStructureMap().getTableContext(link);
			Column fromColumn = sql.getFromTable().getStructureLinkColumn();
			Column joinColumn = this.getColumnForDataElement(link, joinContext.getTable());
			String joinAlias = joinContext.getAlias();
			if (!alreadyJoined.contains(joinAlias)) {
				SQLJoin sqljoin = qb.join(joinContext.getTable(), joinAlias,
						qb.eq(qb.column(fromColumn, fromAlias), qb.column(joinColumn, joinAlias)));
				sql.join(sqljoin);
				alreadyJoined.add(joinAlias);
			}
			remoteContext = joinContext;
			remoteAlias = joinAlias;
		}

		Column joinIdColumn = null;
		if (remoteContext != null) {
			joinIdColumn = remoteContext.getTable().getStructureLinkColumn();
		}
		List<TableContext> tables = getSQLStructureMap().getTableContextList(def, join.getScope());
		// Set<Table> jtables = map.getTables(def);
		for (TableContext t : tables) {
			if (t.equals(remoteContext))
				continue;
			Column refColumn = t.getTable().getStructureLinkColumn();
			String refAlias = t.getAlias();
			if (alreadyJoined.contains(refAlias))
				continue;
			alreadyJoined.add(refAlias);
			SQLJoin join3 = qb.join(t.getTable(), refAlias,
					qb.eq(qb.column(joinIdColumn, remoteAlias), qb.column(refColumn, refAlias)));
			sql.join(join3);
		}

	}

	@Override
	protected void executeFullResourceQuery(Query query, StructureConsumer consumer, SQLQuery sql, String fromAlias,
			SQLContext context) throws FhirException, SQLException, IOException, JsonProcessingException {

		StructureDefinition sd = query.from().getStructureDefinition();
		CatalogDefinition def = this.getDefinitionByStructureDefinition(sd);

		if (def != null && !validateCategories(def, query, consumer, context)) {
			return;
		}

		Column fromId = sql.getFromTable().getStructureLinkColumn();
		SQLResultColumn rc = qb.column(fromId, fromAlias);
		sql.column(rc);

		if (query.isLastN()) {
			SQLExpression expr = this.getSQLExpression(query.getResultElements().get(1));
			sql.column(expr);
			SQLQuery outer = qb.query();
			SQLInnerQuery inner = new SQLInnerQuery().query(sql);
			outer.from(new SQLFrom().table(inner));
			rc = qb.column(fromId, null);
			outer.column(qb.column(fromId, null));
			outer.column(qb.column(new Column("rownum", null), null));
			outer.filter(
					new SQLBinaryExpression().left(new SQLResultColumn().column(new Column("rownum", null)))
							.op("<=")
							.right(new SQLIntegerValue().value(query.getLastNMax())));
			sql = outer;
		}

		if (query.limit() != null) {
			SQLLimit limit = new SQLLimit().limit(query.limit().limit());
			if (query.limit().offset() != null) {
				limit.offset(query.limit().offset());
			}
			if (query.sortList().size() == 0) {
				sql.orderBy(qb.orderBy(rc, false));
			}
			sql.limit(limit);
		}

		log.info(sql.getSQL(new PreparedStatementValues()));
		PreparedStatement stmt = sql.getStatement(context.getConnection());
		ResultSet rs = stmt.executeQuery();
		List<String> resourceIds = new ArrayList<String>();
		while (rs.next()) {
			resourceIds.add(rs.getString(1));
		}

		if (resourceIds.size() == 0) {
			return;
		}

		HashMap<String, HashMap<String, Object>> allContext = null;

		if (def != null) {
			allContext = populateInBundle(context, resourceIds, def, consumer, null);
		}

		if (query.getIncludes() != null && query.getIncludes().size() > 0) {

			for (ResultElement element : query.getIncludes()) {
				List<DataElement> listDE = query.from().getStructureDefinition().getDataElements();
				ListIterator<DataElement> listDEIterator = listDE.listIterator();

				while (listDEIterator.hasNext()) {
					DataElement fromDe = listDEIterator.next();
					String tempID = fromDe.getId();
					if (tempID.equals(element.getPath().toString())) {

						String searchStr = "";
						if (fromDe.getType().getId().toLowerCase(Locale.ENGLISH).equalsIgnoreCase("reference")) {
							searchStr = element.getPath().toString() + ".reference";
						}

						// if (def == null) {
						// return;
						// }
						String column = null;

						if (def != null && searchStr != null) {
							column = getColumnName(searchStr, def);
						}

						if (column == null) {
							continue;
						}

						List<String> values = getValuesFromContext(column, allContext);

						if (values.size() == 0) {
							continue;
						}
						for (String profile : fromDe.getTargetProfiles()) {
							StructureDefinition tagetSD = query.getQueryBuilder().getMetaRepository()
									.getStructureDefinitionByUrl(profile, null);
							CatalogDefinition targetCatalogDefinition = this
									.getDefinitionByStructureDefinition(tagetSD);
							if (targetCatalogDefinition == null) {
								continue;
							}

							populateInBundle(context, values, targetCatalogDefinition, consumer, null);

						}
					}
				}

			}
		}

		if (query.getRevIncludes() != null && query.getRevIncludes().size() > 0) {

			for (ResultElement element : query.getRevIncludes()) {
				String column = null;
				String searchStr = query.from().getStructureDefinition().getId() + ".id";

				if (def != null && searchStr != null) {
					column = getColumnName(searchStr, def);
				}
				if (column == null) {
					continue;
				}
				List<String> values = getValuesFromContext(column, allContext);

				if (values.size() == 0) {
					continue;
				}
				CatalogDefinition targetCatalogDefinition = this
						.getDefinitionByStructureDefinition(element.getStructureDefinition());

				searchStr = element.getPath() + ".reference";

				if (targetCatalogDefinition != null & searchStr != null) {
					column = getColumnName(searchStr, targetCatalogDefinition);
				}
				if (column == null) {
					continue;
				}
				populateInBundle(context, values, targetCatalogDefinition, consumer, column);

			}
		}

	}

	private boolean validateCategories(CatalogDefinition def, Query query, StructureConsumer consumer,
			SQLContext context) {

		List<Parameter> listParam = query.getParameters();
		List<Mapping> listMapping = def.getMapping();

		ListIterator<Parameter> listIterator = listParam.listIterator();

		while (listIterator.hasNext()) {

			Parameter parameter = listIterator.next();

			if (parameter.getName().equals("category")) {
				String stringValue = ((StringExpression) parameter.getValue()).getValue();
				int index = stringValue.indexOf("|");
				String system = null;
				String code = null;

				if (index > 0) {
					system = stringValue.substring(0, index);
					code = stringValue.substring(index + 1);
				} else {
					code = stringValue;
				}

				if (code != null) {

					boolean isCodeMatched = false, isSystemMatched = false;

					for (int i = 0; i < listMapping.size(); i++) {
						Mapping mapping = listMapping.get(i);
						List<Mapping> childMapping = mapping.getChildren();
						isCodeMatched = isSystemMatched = false;

						for (int innerIndex = 0; innerIndex < childMapping.size(); innerIndex++) {
							if (code == null || (childMapping.get(innerIndex).getValue() != null
									&& childMapping.get(innerIndex).getValue().equals(code))) {
								isCodeMatched = true;
							} else if (system == null || (childMapping.get(innerIndex).getValue() != null
									&& childMapping.get(innerIndex).getValue().equals(system))) {
								isSystemMatched = true;
							}
							if (isCodeMatched && isSystemMatched) {
								return true;
							}
						}
					}
					return false;
				}
			}
		}

		return true;
	}

	private HashMap<String, HashMap<String, Object>> buildResultDataStructureNew(SQLContext context,
			List<String> resourceIds, CatalogDefinition def, String targetColumn)
			throws FhirException, SQLException {
		HashMap<String, HashMap<String, Object>> allContext = new HashMap<String, HashMap<String, Object>>();
		List<CatalogDefinition.Table> tables = def.getTable();
		for (CatalogDefinition.Table tableDef : tables) {
			handleTable(context, resourceIds, targetColumn, allContext, tableDef, null);
		}
		return allContext;
	}

	private void handleTable(SQLContext context, List<String> resourceIds, String targetColumn,
			HashMap<String, HashMap<String, Object>> allContext, CatalogDefinition.Table tableDef,
			CatalogDefinition.Table parent)
			throws FhirException, SQLException {
		Table table = tableDef.getDefinition().getTableModel();
		SQLListValue idList = new SQLListValue();
		idList.addList(resourceIds);
		SQLQuery iQuery = qb.query();
		iQuery.from(qb.from(table, "a1"));
		List<Column> columns = table.getColumns();
		List<String> allColumns = new ArrayList<String>();
		for (Column column : columns) {
			iQuery.column(qb.column(column, "a1"));
			allColumns.add(column.getName());
		}
		if (parent == null) {
			SQLInExpression inExpression = new SQLInExpression();
			if (targetColumn != null) {
				iQuery.filter(inExpression.left(qb.column(new Column(targetColumn, null), "a1")).list(idList));
			} else {
				iQuery.filter(inExpression.left(qb.column(table.getStructureLinkColumn(), "a1")).list(idList));
			}
		} else {
			String keyColumnName = parent.getKeyColumn().getName();
			Table parentTable = parent.getDefinition().getTableModel();
			Column keyColumn = parentTable.getColumnByName("\"" + keyColumnName + "\"");
			allColumns.add("parent_column");
			iQuery.column(qb.column(parentTable.getStructureLinkColumn(), "j1").label("parent_column"));
			SQLInExpression inExpression = new SQLInExpression();
			inExpression.left(qb.column(parentTable.getStructureLinkColumn(), "j1")).list(idList);
			SQLJoin j1 = qb.join(parentTable, "j1",
					qb.eq(qb.column(keyColumn, "j1"), qb.column(table.getStructureLinkColumn(), "a1")));
			iQuery.join(j1).filter(inExpression);
		}

		PreparedStatement istmt = iQuery.getStatement(context.getConnection());
		ResultSet irs = istmt.executeQuery();
		ResultSetMetaData md = irs.getMetaData();
		int linkIndex = 1;
		String linkColumnName = null;
		if (targetColumn != null) {
			linkColumnName = targetColumn;
		} else {
			linkColumnName = table.getStructureLinkColumn().getName();
		}
		for (int i = 1; i <= md.getColumnCount(); i++) {
			String label = md.getColumnLabel(i);
			if (linkColumnName.equals("\"" + label + "\"")) {
				linkIndex = i;
			}
		}
		while (irs.next()) {
			HashMap<String, Object> row = CatalogDataMapHelper.handleResultSetRow(allColumns, irs);
			String rowId = CatalogDataMapHelper.getRowId(irs, linkIndex);
			CatalogDataMapHelper.insertRowInDataMap(allContext, tableDef, rowId, row, parent);
		}
		if (tableDef.getTable().size() > 0) {
			for (CatalogDefinition.Table childTable : tableDef.getTable()) {
				handleTable(context, resourceIds, targetColumn, allContext, childTable, tableDef);
			}
		}
	}

	private HashMap<String, HashMap<String, Object>> buildResultDataStructure(SQLContext context,
			List<String> resourceIds, CatalogDefinition def, String targetColumn)
			throws FhirException, SQLException {
		return this.buildResultDataStructureNew(context, resourceIds, def, targetColumn);
	}

	private CatalogDefinition getDefinitionByStructureDefinition(StructureDefinition sd) {
		for (CatalogDefinition definition : definitions) {
			if (definition.getTarget().getId().equals(sd.getId())) {
				return definition;
			}
		}
		return null;
	}

	private HashMap<String, HashMap<String, Object>> populateInBundle(SQLContext context, List<String> resourceIds,
			CatalogDefinition def, StructureConsumer consumer, String targetColumn)
			throws FhirException, SQLException {
		HashMap<String, HashMap<String, Object>> allContext = buildResultDataStructure(context, resourceIds, def,
				targetColumn);
		long start = System.currentTimeMillis();
		StructureBuilder.getStructureBuilder(def).build(consumer, context, def, allContext);
		long stop = System.currentTimeMillis();
		log.info(" Time " + (stop - start));
		return allContext;
	}

	public Structure getOperationOutcome(Issue.Severity severity, String severityType, String message,
			MetaRepository repo) {
		OperationOutcome outcome = new OperationOutcomeBuilder().withIDGenerator(new UUIDGeneratorImpl())
				.addIssue(severity, severityType).withDetails(message).issue().outcome();

		ObjectMapper objectMapper = new ObjectMapper();
		return FhirUtils.toStructure((JsonNode) objectMapper.valueToTree(outcome), repo);
	}

	private String getColumnName(String searchStr, CatalogDefinition def) {
		for (Mapping map : def.getMapping()) {
			if (map.getDataelement().equals(searchStr)) {
				return map.getColumn();
			}
		}
		return null;
	}

	private List<String> getValuesFromContext(String column, HashMap<String, HashMap<String, Object>> allContext) {
		List<String> values = new ArrayList<>();
		Iterator<String> iterator = allContext.keySet().iterator();
		while (iterator.hasNext()) {
			HashMap<String, Object> value = allContext.get(iterator.next());
			Iterator<String> innerIterator = value.keySet().iterator();
			while (innerIterator.hasNext()) {
				Object innerValue = value.get(innerIterator.next());
				if (innerValue instanceof List) { // What are
													// the other
													// option ?
					ListIterator<HashMap<String, String>> listIterator = ((List) innerValue).listIterator();
					while (listIterator.hasNext()) {
						HashMap<String, String> dataMap = (HashMap<String, String>) listIterator.next();
						if (dataMap.get(column) != null) {
							values.add(dataMap.get(column));
						}
					}
				} else if (innerValue instanceof HashMap<?, ?>) {
					HashMap<String, String> mapValues = (HashMap<String, String>) innerValue;
					if (mapValues.get(column) != null) {
						values.add(mapValues.get(column));
					}
				}
			}
		}

		return values;
	}
}