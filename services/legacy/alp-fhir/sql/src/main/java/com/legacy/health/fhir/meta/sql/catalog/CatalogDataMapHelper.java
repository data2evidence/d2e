package com.legacy.health.fhir.meta.sql.catalog;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.legacy.health.fhir.content.model.CatalogDefinition;

public class CatalogDataMapHelper {
	private static final Logger log = LoggerFactory.getLogger(CatalogDataMapHelper.class);

	public static HashMap<String, Object> handleResultSetRow(List<String> columns, ResultSet irs) throws SQLException {
		HashMap<String, Object> row = new HashMap<String, Object>();
		for (int i = 0; i < columns.size(); i++) {
			Object value = irs.getObject(i + 1);
			if (value != null) {
				String name = columns.get(i);
				name = name.replaceAll("\"", "");

				if (value.getClass().isArray() && value instanceof byte[]) {
					try {
						value = new String((byte[]) value, "UTF-8");
					} catch (UnsupportedEncodingException e) {
						log.error(" UnsupportedEncodingException " + e.getLocalizedMessage());
					}
				}
				if (value instanceof BigDecimal) {
					value = ((BigDecimal) value).doubleValue();
				}
				row.put(name, value);
			}
		}
		return row;
	}

	public static String getRowId(ResultSet irs, int linkIndex) throws SQLException {
		String rowId = null;
		Object obj = irs.getObject(linkIndex);
		if (obj.getClass().isArray() && obj instanceof byte[]) {
			try {
				rowId = new String((byte[]) obj, "UTF-8");
			} catch (UnsupportedEncodingException e) {
				log.error(" UnsupportedEncodingException " + e.getLocalizedMessage());
			}
		} else {
			rowId = (String) obj;
		}
		return rowId;
	}

	public static void insertRowInDataMap(HashMap<String, HashMap<String, Object>> allContext,
			CatalogDefinition.Table tableDef, String rowId, HashMap<String, Object> row,
			CatalogDefinition.Table parent) {
		if (parent == null) {
			HashMap<String, Object> idContext = allContext.get(rowId);
			if (idContext == null) {
				idContext = new HashMap<String, Object>();
				allContext.put(rowId, idContext);
			}
			add2ParentRow(tableDef, row, idContext);
		} else {
			String parentColumn = (String) row.get("parent_column");
			HashMap<String, Object> idContext = allContext.get(parentColumn);
			if (idContext == null) {
				log.error("Didn't find parent row in context, inconsistent data");
				return;
			}
			Object parentObj = idContext.get(parent.getId());
			if (parentObj instanceof HashMap) {
				HashMap<String, Object> parentRow = (HashMap<String, Object>) idContext.get(parent.getId());
				add2ParentRow(tableDef, row, parentRow);
			}
			if (parentObj instanceof List) {
				List<HashMap<String, Object>> parentRows = (List<HashMap<String, Object>>) idContext
						.get(parent.getId());
				for (HashMap<String, Object> parentRow : parentRows) {
					String parentKey = parent.getKeyColumn().getName();
					String parentCmp = (String) parentRow.get(parentKey);
					if (parentCmp.equals(rowId)) {
						add2ParentRow(tableDef, row, parentRow);
					}
				}
			}
			// HashMap<String, Object>parentRow = (HashMap<String, Object>)
			// idContext.get(parent.getId());

		}
	}

	private static void add2ParentRow(CatalogDefinition.Table tableDef, HashMap<String, Object> row,
			HashMap<String, Object> parentRow) {
		if (tableDef.getCardinality().equals("1")) {
			parentRow.put(tableDef.getId(), row);
		} else {
			List<HashMap<String, Object>> list = (List<HashMap<String, Object>>) parentRow
					.get(tableDef.getId());
			if (list == null) {
				list = new ArrayList<HashMap<String, Object>>();
				parentRow.put(tableDef.getId(), list);
			}
			list.add(row);
		}
	}
}
