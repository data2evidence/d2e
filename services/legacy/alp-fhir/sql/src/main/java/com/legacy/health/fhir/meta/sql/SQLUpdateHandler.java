package com.legacy.health.fhir.meta.sql;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.instance.ValueElement;
import com.legacy.health.fhir.meta.repsitory.UpdateHandler;
import com.legacy.health.fhir.util.Utils;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;

public class SQLUpdateHandler implements UpdateHandler {
	private static Log log = LogFactory.getLog(SQLUpdateHandler.class);

	protected RelationSchemaController controller;

	@SuppressFBWarnings("SQL_INJECTION_JDBC")
	@Override
	public void update(String schema, Structure resource, boolean ownTransaction, Context ctx)
			throws FhirException {
		PreparedStatement stmt = null;
		try {
			SQLContext context = (SQLContext) ctx;
			Connection connection = context.getConnection();
			boolean isAutoCommit = connection.getAutoCommit();
			if (ownTransaction && isAutoCommit) {
				connection.setAutoCommit(false);
			}
			String type = resource.getResourceType();
			ValueElement element = (ValueElement) resource.getElementByPath(type + ".id");
			String id = (String) element.getValue();
			id = Utils.checkUUID(id);
			if (ownTransaction) {
				connection.commit();
				if (isAutoCommit) {
					connection.setAutoCommit(true);
				}
			}
			Table resTable = controller.getResourceTable();
			String name = resTable.getFullTableName();
			String idColumn = resTable.getStructureLinkColumn().getName();
			String sql = "UPDATE " + name + " SET \"VALID_TO\"=? WHERE " + idColumn + "= ? and \"VALID_TO\" IS NULL";
			stmt = connection.prepareStatement(sql);
			/*
			 * ValueElement eLastUpdated = (ValueElement)
			 * resource.getElementByPath(type+".meta.lastUpdated");
			 * 
			 * // TODO: LastUpdated could be null in a bundle/resource... Throw an exception
			 * or null or handle differently?
			 * String lastUpdated = eLastUpdated == null ? null :
			 * (String)eLastUpdated.getValue();
			 * Instant instant = eLastUpdated == null ? null :
			 * Utils.convert2Target(lastUpdated);
			 */
			Instant instant = Instant.now();
			if (instant != null) {
				Timestamp ts = Timestamp.from(instant);
				stmt.setTimestamp(1, ts);
			} else {
				throw new FhirException("No timeformat found for:  found", null);
			}

			stmt.setString(2, id);
			stmt.execute();
			if (ownTransaction) {
				connection.commit();
				if (isAutoCommit) {
					connection.setAutoCommit(true);
				}
			}
		} catch (SQLException e) {
			throw new FhirException("Error during update of Resource Table:", e);
		} finally {
			if (stmt != null) {
				try {
					stmt.close();
				} catch (SQLException e) {
					log.error("Error when closing statement", e);
				}
			}
		}

	}

	public void setController(RelationSchemaController controller) {
		this.controller = controller;

	}

}
