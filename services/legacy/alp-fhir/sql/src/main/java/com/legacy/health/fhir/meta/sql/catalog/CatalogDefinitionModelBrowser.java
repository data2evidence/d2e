package com.legacy.health.fhir.meta.sql.catalog;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.legacy.health.fhir.content.model.CatalogDefinition;
import com.legacy.health.fhir.content.model.Tabledefinition;
import com.legacy.health.fhir.meta.sql.Column;
import com.legacy.health.fhir.meta.sql.SQLProviderFactory;
import com.legacy.health.fhir.meta.sql.Table;

public class CatalogDefinitionModelBrowser {

	private static final Logger log = LoggerFactory.getLogger(CatalogDefinitionModelBrowser.class);

	public static boolean prepareTables(CatalogDefinition definition, SQLProviderFactory factory, String schema) {
		boolean ret = true;
		HashMap<String, Tabledefinition> tables = new HashMap<String, Tabledefinition>();
		List<CatalogDefinition.Mapping> mappings = getMappingsDeep(definition);
		for (CatalogDefinition.Mapping mapping : mappings) {
			if (mapping.getTableid() == null)
				continue;
			Tabledefinition td = tables.get(mapping.getTableid());
			if (td == null) {
				td = getTabledefinitionForMapping(definition, mapping.getTableid(), factory);
				if (td != null) {
					td.getTableModel().setSchema('"' + schema + '"');
					tables.put(mapping.getTableid(), td);
				}
			}
			if (td != null) {
				Column col = getColumn(td, mapping.getColumn());
				if (col != null) {
					col.addSupportedPath(mapping.getDataelement());
				} else {
					log.warn(mapping.getColumn() + ":" + td.getFullTableName());
				}
			}

		}
		return ret;
	}

	public static List<CatalogDefinition.Mapping> getMappingsDeep(CatalogDefinition definition) {
		ArrayList<CatalogDefinition.Mapping> ret = new ArrayList<CatalogDefinition.Mapping>();
		for (CatalogDefinition.Mapping mapping : definition.getMapping()) {
			if (ret.contains(mapping))
				continue;
			ret.add(mapping);
			ret.addAll(getMappingsDeep(mapping));
		}
		return ret;
	}

	protected static List<CatalogDefinition.Mapping> getMappingsDeep(CatalogDefinition.Mapping parent) {
		ArrayList<CatalogDefinition.Mapping> ret = new ArrayList<CatalogDefinition.Mapping>();
		for (CatalogDefinition.Mapping mapping : parent.getChildren()) {
			if (ret.contains(mapping))
				continue;
			ret.add(mapping);
			ret.addAll(getMappingsDeep(mapping));
		}
		return ret;
	}

	public static CatalogDefinition.Mapping getMappingForPath(CatalogDefinition definition, String path) {
		List<CatalogDefinition.Mapping> mappings = definition.getMapping();
		for (CatalogDefinition.Mapping mapping : mappings) {
			String de = mapping.getDataelement();
			if (path.equals(de)) {
				return mapping;
			} else {
				if (mapping.getType().equals("complex") && mapping.getChildren() != null
						&& mapping.getChildren().size() > 0) {
					CatalogDefinition.Mapping ret = getMappingForPathinChildren(mapping, path);
					if (ret != null) {
						return ret;
					}
				}
			}
		}
		return null;
	}

	private static CatalogDefinition.Mapping getMappingForPathinChildren(CatalogDefinition.Mapping mapping,
			String path) {
		for (int count = 0; count < mapping.getChildren().size(); count++) {
			CatalogDefinition.Mapping mappingElement = mapping.getChildren().get(count);
			if (mappingElement.getDataelement().equals(path)) {
				return mappingElement;
			}
		}
		return null;
	}

	protected static Column getColumn(Tabledefinition td, String columnName) {
		return td.getTableModel().getColumnByName('"' + columnName + '"');
	}

	public static Tabledefinition getTabledefinitionForMapping(CatalogDefinition definition, String tableid,
			SQLProviderFactory factory) {
		List<CatalogDefinition.Table> tables = definition.getTable();
		for (CatalogDefinition.Table table : tables) {
			if (tableid.equals(table.getId())) {
				Tabledefinition td = table.getDefinition();
				td.setProviderFactory(factory);
				Table t = td.getTableModel();
				String refColumnName = table.getReferenceColumn().getName();
				Column c = t.getColumnByName('"' + refColumnName + '"');
				t.setStructureLinkColumn(c);
				return td;
			}
			Tabledefinition ret = getTabledefinitionForMapping(table, tableid, factory);
			if (ret != null)
				return ret;
		}
		return null;
	}

	public static Tabledefinition getTabledefinitionForMapping(CatalogDefinition.Table parent, String tableid,
			SQLProviderFactory factory) {
		List<CatalogDefinition.Table> tables = parent.getTable();
		for (CatalogDefinition.Table table : tables) {
			if (tableid.equals(table.getId())) {
				Tabledefinition td = table.getDefinition();
				td.setProviderFactory(factory);
				Table t = td.getTableModel();
				String refColumnName = table.getReferenceColumn().getName();
				Column c = t.getColumnByName('"' + refColumnName + '"');
				t.setStructureLinkColumn(c);
				return td;
			}
			Tabledefinition ret = getTabledefinitionForMapping(table, tableid, factory);
			if (ret != null)
				return ret;
		}
		return null;
	}

}
