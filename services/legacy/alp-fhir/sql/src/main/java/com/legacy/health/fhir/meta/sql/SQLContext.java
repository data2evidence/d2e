package com.legacy.health.fhir.meta.sql;

import java.sql.Connection;

import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;

public class SQLContext implements Context {

	private Connection connection;
	private SQLSchemaController controller;
	private MetaRepository repo;
	private String schema;

	public void setConnection(Connection connection) {
		this.connection = connection;
	}

	public SQLContext connection(Connection connection) {
		this.connection = connection;
		return this;
	}

	public Connection getConnection() {
		return connection;
	}

	public SQLSchemaController getController() {
		return controller;
	}

	public void setController(SQLSchemaController controller) {
		this.controller = controller;
	}

	public MetaRepository getRepo() {
		return repo;
	}

	public void setRepo(MetaRepository repo) {
		this.repo = repo;
	}

	public String getSchema() {
		return schema;
	}

	public void setSchema(String schema) {
		this.schema = schema;
	}

}
