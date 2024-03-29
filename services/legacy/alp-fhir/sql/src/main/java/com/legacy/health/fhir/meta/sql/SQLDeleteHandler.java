package com.legacy.health.fhir.meta.sql;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.repsitory.DeleteHandler;
import com.legacy.health.fhir.meta.sql.queryengine.SQLUtils;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;

public class SQLDeleteHandler implements DeleteHandler {
	private static Log log = LogFactory.getLog(SQLDeleteHandler.class);
	protected RelationSchemaController controller;
	protected Connection connection;

	public void setConnection(Connection con) {
		connection = con;
	}

	public void setController(RelationSchemaController controller) {
		this.controller = controller;
	}

	@SuppressFBWarnings("SQL_INJECTION_JDBC")
	@Override
	public void delete(String schema, StructureDefinition sd, String id, boolean ownTransaction, boolean markAsDeleted)
			throws FhirException {
		List<Table> targets = controller.getTablesForStructureDefinition(sd);
		try {

			boolean isAutoCommit = connection.getAutoCommit();
			if (ownTransaction && isAutoCommit) {
				connection.setAutoCommit(false);
			}
			// ALL Tables
			for (Table table : targets) {
				String name = table.getFullTableName();
				String idColumn = table.getStructureLinkColumn().getName();
				name = SQLUtils.ensureQuoting(SQLUtils.assertValidSQLIdentifier(name), '"');
				idColumn = SQLUtils.ensureQuoting(SQLUtils.assertValidSQLIdentifier(idColumn), '"');

				String sql = "DELETE FROM" + name + " where " + idColumn + "= ?";

				log.debug(sql + ":" + id);
				PreparedStatement stmt = connection.prepareStatement(sql);
				stmt.setString(1, id);
				stmt.execute();
				stmt.close();
			}
			// Reference Table
			handleReferenceTable(id);
			// Resource Table
			if (markAsDeleted) {
				markResourceAsDeleted(id);
			}
			if (ownTransaction) {
				connection.commit();
				if (isAutoCommit) {
					connection.setAutoCommit(true);
				}
			}
		} catch (SQLException e) {
			throw new FhirException("Error during deletetion of Resource:", e);
		}

	}

	@SuppressFBWarnings("SQL_INJECTION_JDBC")
	public void markResourceAsDeleted(String id) throws SQLException, FhirException {
		Table resTable = controller.getResourceTable();
		String name = resTable.getFullTableName();
		String idColumn = resTable.getStructureLinkColumn().getName();

		name = SQLUtils.ensureQuoting(SQLUtils.assertValidSQLIdentifier(name), '"');
		idColumn = SQLUtils.ensureQuoting(SQLUtils.assertValidSQLIdentifier(idColumn), '"');
		String sql = "UPDATE " + name + " SET \"IS_DELETED\"=true WHERE " + idColumn + "= ?";

		PreparedStatement stmt = connection.prepareStatement(sql);
		stmt.setString(1, id);
		stmt.execute();
		stmt.close();
	}

	@SuppressFBWarnings("SQL_INJECTION_JDBC")
	public void handleReferenceTable(String id) throws SQLException, FhirException {
		Table refTable = controller.getReferenceTable();
		String name = refTable.getFullTableName();
		String idColumn = refTable.getStructureLinkColumn().getName();

		name = SQLUtils.ensureQuoting(SQLUtils.assertValidSQLIdentifier(name), '"');
		idColumn = SQLUtils.ensureQuoting(SQLUtils.assertValidSQLIdentifier(idColumn), '"');

		String sql = "DELETE FROM " + name + " where " + idColumn + "= ?";

		PreparedStatement stmt = connection.prepareStatement(sql);
		stmt.setString(1, id);
		stmt.execute();
		stmt.close();

	}

}
