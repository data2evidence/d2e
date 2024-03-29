package com.legacy.health.fhir.meta.sql;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

import com.legacy.health.fhir.meta.FhirException;

public class SQLConnector {
	public static Connection connect(Properties properties) throws FhirException {
		try {
			Class.forName(properties.getProperty("datasource.driver"));
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		String url = properties.getProperty("datasource.url");
		try {
			return DriverManager.getConnection(url, properties.getProperty("datasource.username"),
					properties.getProperty("datasource.password"));
		} catch (SQLException e) {
			throw new FhirException("Error while connecting to database", e);
		}

	}

	public static Connection connect(String host, int port, String database, String user, String password)
			throws FhirException {
		String url = "jdbc:postgresql://" + host + ":" + port + "/" + database;
		try {
			return DriverManager.getConnection(url, user, password);
		} catch (SQLException e) {
			throw new FhirException("Error while connecting to database", e);
		}
	}
}
