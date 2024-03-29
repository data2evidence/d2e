package com.legacy.health.fhir.meta.sql.queryengine;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Vector;

import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.DataElementStructureLink;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.sql.Table;

public class SQLStructureMap {

	protected int aliasCount = 0;
	protected HashMap<String, TableContext> linkMap = new HashMap<String, TableContext>();
	protected HashMap<String, Vector<TableContext>> structureMap = new HashMap<String, Vector<TableContext>>();

	public TableContext register(DataElementStructureLink link, Table table) {
		String key = getTableContextKey(link);
		TableContext tc = linkMap.get(key);
		if (tc == null) {
			tc = new TableContext(table, key);
			tc.setScope(link.getScope());
			tc.setAlias("t" + aliasCount++);
			this.addTableContextForStructureDefinition(link.getStructureDefinition(), tc);
		}
		linkMap.put(key, tc);
		return tc;
	}

	public TableContext getTableContext(DataElementStructureLink link) {
		String key = getTableContextKey(link);
		return linkMap.get(key);
	}

	public List<TableContext> getTableContextList(StructureDefinition sd, String scope) {
		List<TableContext> ret = new ArrayList<TableContext>();
		List<TableContext> all = structureMap.get(sd.getId());
		if (scope != null) {
			for (TableContext tableContext : all) {
				if (tableContext.getScope() != null && tableContext.getScope().equals(scope)) {
					ret.add(tableContext);
				}
			}
		} else {
			ret = all;
		}
		return ret;
	}

	private void addTableContextForStructureDefinition(StructureDefinition sd, TableContext context) {
		Vector<TableContext> v = structureMap.get(sd.getId());
		if (v == null) {
			v = new Vector<TableContext>();
			structureMap.put(sd.getId(), v);
		}
		v.add(context);
	}

	protected String getTableContextKey(DataElementStructureLink link) {
		DataElement de = link.getDataElement();
		String scope = link.getScope() != null ? link.getScope() + "_" : "";
		if (de.getMax() == 1 && !de.getType().isComplex()) {// Elements belonging to a row of a complex type
			String full = link.getPath();
			int i = full.lastIndexOf(".");
			return scope + full.substring(0, i);
		}
		return scope + link.getPath();
	}
}
