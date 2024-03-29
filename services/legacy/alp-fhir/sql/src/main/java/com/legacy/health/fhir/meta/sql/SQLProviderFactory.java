package com.legacy.health.fhir.meta.sql;

import java.sql.SQLException;
import java.util.ArrayList;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.sql.queryengine.SQLTimeBetweenExpression;

public class SQLProviderFactory {

	private static Log log = LogFactory.getLog(SQLProviderFactory.class);

	public static final String DB_TYPE = "HSQLDB";

	public boolean supportDBType(String type) {
		return type.equals(DB_TYPE);
	}

	public SQLTypeMapper createSQLTypeMapper() {
		return new SQLTypeMapper();
	}

	public boolean supportVersioning() {
		return false;
	}

	public boolean supportRoleCreation() {
		return false;
	}

	public boolean createVersioning(Table table, SQLExecutor executor) throws SQLException {
		throw new UnsupportedOperationException();
	}

	public boolean addColumnVersioning(Table table, Column column, SQLExecutor executor) throws SQLException {
		throw new UnsupportedOperationException();
	}

	public void deleteWithId(Table table, Column column, String id, SQLExecutor executor)
			throws SQLException, FhirException {
		throw new UnsupportedOperationException();
	}

	public ArrayList<ObjectNode> getWithId(Table table, Column column, String id, SQLExecutor executor)
			throws SQLException, FhirException {
		throw new UnsupportedOperationException();
	}

	public Table createTable() {
		return new Table();
	}

	public static SQLProviderFactory createInstance(String driverName) {
		try {
			String factoryName = "com.legacy.health.fhir.meta.sql.SQLProviderFactory";
			log.debug("Driver Name:" + driverName);
			if (driverName.equals("org.postgresql.Driver")) {
				factoryName = "com.legacy.health.fhir.meta.postgresql.PostgreSQLProviderFactory";
			}
			if (driverName.equals("com.sap.db.jdbc.Driver")) {
				factoryName = "com.legacy.health.fhir.meta.hana.HanaSQLProviderFactory";
			}
			log.debug("SQL Provider Factory: " + factoryName);
			Class<?> cls = Class.forName(factoryName);
			Object obj = cls.newInstance();
			return (SQLProviderFactory) obj;
		} catch (ClassNotFoundException e) {
			log.error(e);
		} catch (InstantiationException e) {
			log.error(e);
		} catch (IllegalAccessException e) {
			log.error(e);
		}
		return null;
	}

	// public static SQLProviderFactory createInstance(DataSource datasource){
	// try {
	// log.error("this should not get called");
	// return
	// createInstance(DriverManager.getDriver(datasource.getConnection().getMetaData().getURL()).getClass().getName());
	// } catch (SQLException e) {
	// log.error(e.getMessage());
	// e.printStackTrace();
	// }
	// return null;
	// }

	public SQLTimeBetweenExpression getTimeBetweenExpression() {
		return new SQLTimeBetweenExpression();
	}

}
