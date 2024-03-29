package com.legacy.health.fhir.meta.hana;

import java.sql.SQLException;
import java.util.ArrayList;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.sql.Column;
import com.legacy.health.fhir.meta.sql.SQLExecutor;
import com.legacy.health.fhir.meta.sql.SQLProviderFactory;
import com.legacy.health.fhir.meta.sql.SQLTypeMapper;
import com.legacy.health.fhir.meta.sql.Table;
import com.legacy.health.fhir.meta.sql.queryengine.SQLTimeBetweenExpression;

public class HanaSQLProviderFactory extends SQLProviderFactory {

	public static final String DB_TYPE = "HDB";

	protected HanaSystemVersioning versioning = new HanaSystemVersioning();

	@Override
	public boolean supportDBType(String type) {
		return type.equals(DB_TYPE);
	}

	@Override
	public SQLTypeMapper createSQLTypeMapper() {
		return new HanaSQLTypeMapper();
	}

	@Override
	public Table createTable() {
		return new HanaColumnTable();
	}

	@Override
	public SQLTimeBetweenExpression getTimeBetweenExpression() {
		return new HanaSQLTimeBetweenExpression();
	}

	@Override
	public boolean supportVersioning() {
		return true;
	}

	@Override
	public boolean addColumnVersioning(Table table, Column column, SQLExecutor executor) throws SQLException {
		return this.versioning.addColumnVersioning(table, column, executor);
	}

	@Override
	public boolean createVersioning(Table table, SQLExecutor executor) throws SQLException {
		return this.versioning.createVersioned(table, executor);
	}

	@Override
	public void deleteWithId(Table table, Column column, String id, SQLExecutor executor)
			throws SQLException, FhirException {
		this.versioning.deleteWithId(table, column, id, executor);
	}

	@Override
	public ArrayList<ObjectNode> getWithId(Table table, Column column, String id, SQLExecutor executor)
			throws SQLException, FhirException {
		return this.versioning.getWithId(table, column, id, executor);
	}
}
