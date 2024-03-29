package com.legacy.health.fhir.meta.sql;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.legacy.health.fhir.meta.entity.StructureDefinition;

public class Table {
	StructureDefinition definition;
	String schema;
	String name;
	Boolean isView = false;
	String viewDefinition;

	protected ArrayList<Column> columns = new ArrayList<Column>();

	public String getPrefix() {
		return "CREATE TABLE ";
	}

	public Table() {

	}

	public boolean isView() {
		return isView;
	}

	public Table(String schema, String name) {
		this();
		this.schema = schema;
		this.name = name;
	}

	public void setSchema(String schema) {
		this.schema = schema;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setIsView(Boolean isView) {
		this.isView = isView;
	}

	public void setViewDefinition(String viewDefinition) {
		this.viewDefinition = viewDefinition;
	}

	public String getViewDefinition() {
		return this.viewDefinition;
	}

	public String getDDL() {
		String ret = "";
		if (!isView) {
			ret = getPrefix() + getFullTableName() + "(\n  ";
			String sep = "";
			ArrayList<String> keys = new ArrayList<String>();
			for (Iterator<Column> iterator = columns.iterator(); iterator.hasNext();) {
				Column col = iterator.next();
				ret += sep + col.name + " " + col.type;
				boolean primaryKey = col.isKey();
				String postfix = col.getPostfix();
				if (col.notNull() && !primaryKey) {
					ret += " NOT NULL";
				}
				if (primaryKey && postfix == null) {
					keys.add(col.name);
				}
				if (postfix != null) {
					ret += " " + postfix;
				}
				sep = ",\n  ";
			}
			if (keys.size() > 0) {
				String innerSep = "";
				ret += sep + "primary key (";
				for (String key : keys) {
					ret += innerSep + " " + key + " ";
					innerSep = ",";
				}
				ret += ")";
			}
			ret += "\n)\n\n";
		} else {
			String def = viewDefinition.replaceAll("%%SCHEMA%%", schema);
			ret = "CREATE VIEW " + getFullTableName() + " AS (" + def + ")\n";
		}
		return ret;
	}

	public String getTableName() {
		return name;

	}

	public String getSchemaName() {
		return schema;
	}

	public String getFullTableName() {
		return schema + "." + name;
	}

	public void setDefinition(StructureDefinition definition) {
		this.definition = definition;
	}

	public StructureDefinition getDefinition() {
		return this.definition;
	}

	public void addColumn(Column column) {
		if (getColumnByName(column.getName()) != null) {
			return;
		}
		columns.add(column);
		column.setTable(this);
	}

	public Column getColumnByName(String name) {
		for (Iterator<Column> iterator = columns.iterator(); iterator.hasNext();) {
			Column column = (Column) iterator.next();
			if (column.getName().equals(name)) {
				return column;
			}
		}
		return null;
	}

	public List<Column> getColumns() {
		return columns;
	}

	protected Column structureLink;

	public void setStructureLinkColumn(Column column) {
		this.structureLink = column;
	}

	public Column getStructureLinkColumn() {
		return structureLink;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((schema == null) ? 0 : schema.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Table other = (Table) obj;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (schema == null) {
			if (other.schema != null)
				return false;
		} else if (!schema.equals(other.schema))
			return false;
		return true;
	}

}
