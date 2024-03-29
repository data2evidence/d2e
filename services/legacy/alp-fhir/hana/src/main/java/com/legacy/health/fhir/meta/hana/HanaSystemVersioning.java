package com.legacy.health.fhir.meta.hana;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.sap.db.jdbc.exceptions.JDBCDriverException;
import com.legacy.health.fhir.meta.FhirException;

import com.legacy.health.fhir.meta.sql.Column;
import com.legacy.health.fhir.meta.sql.SQLExecutor;
import com.legacy.health.fhir.meta.sql.Table;
import com.legacy.health.fhir.meta.sql.queryengine.SQLUtils;
import com.legacy.health.fhir.meta.sql.util.FhirUtils;

public class HanaSystemVersioning {

	private static final Log log = LogFactory.getLog(HanaSystemVersioning.class);

	public boolean createVersioned(Table table, SQLExecutor executor) throws SQLException {
		log.info("Table:" + table.getFullTableName() + " Checking for versioning");
		if (!checkVersionEnabled(table)) {
			log.info("Table:" + table.getFullTableName() + " is not system versioning enabled");
			String ddl = table.getDDL();
			executor.executeDDL(ddl, false);
			return false;
		}
		String versionTableDDL = this.getVersionedDDL(table);
		String tableDDL = this.getDDL(table);
		log.info("DDL: " + tableDDL);
		try {
			executor.executeDDL(versionTableDDL, false);
			executor.executeDDL(tableDDL, false);
		} catch (SQLException sqle) {
			log.error("Versioned Table Definition:" + versionTableDDL);
			log.error("Versioned Table Definition:" + tableDDL);
			log.error("Error during versioned Table Creation", sqle);
			throw sqle;
		}
		return true;
	}

	private boolean isRowEndColumn(Column column) {
		String postfix = column.getPostfix();
		return postfix != null && postfix.indexOf("GENERATED ALWAYS AS ROW END") > -1;
	}

	private boolean isRowStartColumn(Column column) {
		String postfix = column.getPostfix();
		return postfix != null && postfix.indexOf("GENERATED ALWAYS AS ROW START") > -1;
	}

	protected boolean checkVersionEnabled(Table t) {
		boolean hasRowStartColumn = false;
		boolean hasRowEndColumn = false;
		for (Column column : t.getColumns()) {
			if (this.isRowStartColumn(column)) {
				hasRowStartColumn = true;
			}
			if (this.isRowEndColumn(column)) {
				hasRowEndColumn = true;
			}
		}
		return hasRowStartColumn && hasRowEndColumn;
	}

	protected String getHistoryTableName(Table table) {
		String ret = table.getFullTableName();
		if (ret.endsWith("\"")) {
			ret = ret.substring(0, ret.length() - 1);
			ret += "_HISTORY\"";
		} else {
			ret += "_HISTORY";
		}
		return ret;
	}

	private String getHistoryTableDisplayName(Table table) {
		String ret = table.getTableName();
		if (ret.endsWith("\"")) {
			ret = ret.substring(0, ret.length() - 1);
			ret += "_HISTORY\"";
		} else {
			ret += "_HISTORY";
		}
		return ret;
	}

	public String getDDL(Table table) {
		String ret = "";
		if (!table.isView()) {
			ret = table.getPrefix() + table.getFullTableName() + "(\n  ";
			String sep = "";
			ArrayList<String> keys = new ArrayList<String>();
			String rowStartColumn = null;
			String rowEndColumn = null;
			for (Iterator<Column> iterator = table.getColumns().iterator(); iterator.hasNext();) {
				Column col = iterator.next();
				ret += sep + col.getName() + " " + col.getType();
				boolean primaryKey = col.isKey();
				String postfix = col.getPostfix();
				if (col.notNull() && !primaryKey) {
					ret += " NOT NULL";
				}
				if (primaryKey && postfix == null) {
					keys.add(col.getName());
				}
				if (postfix != null) {
					if (this.isRowEndColumn(col)) {
						rowEndColumn = col.getName();
					}
					if (this.isRowStartColumn(col)) {
						rowStartColumn = col.getName();
					}
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
			ret += ", period for system_time (" + rowStartColumn + "," + rowEndColumn + ")";
			ret += "\n)\n";
			ret += "with system versioning history table " + this.getHistoryTableName(table);
		} else {
			String def = table.getViewDefinition().replaceAll("%%SCHEMA%%", table.getSchemaName());
			ret = "CREATE VIEW " + table.getFullTableName() + " AS (" + def + ")\n";
		}
		return ret;
	}

	public String getVersionedDDL(Table table) {
		String ret = "";
		ret = table.getPrefix() + this.getHistoryTableName(table) + "(\n  ";
		String sep = "";
		for (Iterator<Column> iterator = table.getColumns().iterator(); iterator.hasNext();) {
			Column col = iterator.next();
			ret += sep + col.getName() + " " + col.getType();

			sep = ",\n  ";
		}
		ret += "\n)\n\n";
		return ret;
	}

	public boolean addColumnVersioning(Table table, Column column, SQLExecutor executor) throws SQLException {
		if (this.checkVersionEnabled(table)) { // workaround for missing add column in System Versioning tables
			// 1. Remove System Versioning
			String ddl = "ALTER TABLE " + table.getFullTableName() + "DROP SYSTEM VERSIONING";
			executor.executeDDL(ddl, false);
			// 2. Alter Actual Table
			ddl = "ALTER TABLE " + table.getFullTableName() + " ADD(";
			ddl += column.getName() + " " + column.getType() + " " + column.getPostfix();
			ddl += ")";
			executor.executeDDL(ddl, false);
			// 3. Alter History Table
			ddl = "ALTER TABLE " + this.getHistoryTableName(table) + " ADD(";
			ddl += column.getName() + " " + column.getType() + " " + column.getPostfix();
			ddl += ")";
			executor.executeDDL(ddl, false);
			// 4. Reconnect tables
			ddl = "ALTER TABLE " + table.getFullTableName() + "ADD SYSTEM VERSIONING HISTORY TABLE "
					+ this.getHistoryTableName(table) + " NOT VALIDATED";
			executor.executeDDL(ddl, false);
		} else {
			String ddl = "ALTER TABLE " + table.getFullTableName() + " ADD(";
			ddl += column.getName() + " " + column.getType() + " " + column.getPostfix();
			ddl += ")";
			executor.executeDDL(ddl, false);
		}
		return true;

	}

	public void deleteWithId(Table table, Column column, String id, SQLExecutor executor)
			throws SQLException, FhirException {
		String columnName = column.getName();
		deleteWithId(table.getFullTableName(), columnName, id, executor);
		if (checkVersionEnabled(table)) {
			deleteWithId(this.getHistoryTableName(table), columnName, id, executor);
		}
	}

	private boolean deleteWithId(String tableName, String columnName, String id, SQLExecutor executor)
			throws SQLException, FhirException {
		String sql = "DELETE FROM " + tableName + " where " + SQLUtils.ensureQuoting(columnName, '"') + "=?";
		PreparedStatement stmt = executor.connect().prepareStatement(sql);
		try {
			stmt.setString(1, id);
			stmt.execute();
		} finally {
			stmt.close();
		}
		return true;
	}

	public ArrayList<ObjectNode> getWithId(Table table, Column column, String id, SQLExecutor executor)
			throws SQLException, FhirException {
		ArrayList<ObjectNode> tableContent = new ArrayList<ObjectNode>();

		String columnName = column.getName();

		tableContent.add(getWithId(table.getFullTableName(), columnName, id, executor,
				(table.getDefinition() != null ? table.getDefinition().getUrl() : null), table.getTableName()));
		ObjectNode historyContent = getWithId(this.getHistoryTableName(table), columnName, id, executor,
				(table.getDefinition() != null ? table.getDefinition().getUrl() : null),
				this.getHistoryTableDisplayName(table));

		if (historyContent != null) {
			tableContent.add(historyContent);
		}
		return tableContent;
	}

	private ObjectNode getWithId(String fullTableName, String columnName, String id, SQLExecutor executor, String url,
			String tableName) throws SQLException, FhirException {
		// TODO Auto-generated method stub
		String sql = "SELECT * FROM " + fullTableName + " where " + columnName + "=?";
		try (PreparedStatement stmt = executor.connect().prepareStatement(sql);) {
			stmt.setString(1, id);
			ResultSet result = stmt.executeQuery();
			return FhirUtils.getTableContentResource(result, url, tableName);
		} catch (JDBCDriverException e) {
			log.warn("Unable to find HISTORY TABLE ", e);
		}
		return null;
	}
}
