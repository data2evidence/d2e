package com.legacy.health.fhir.meta.hana;

import java.io.File;
import java.io.FileInputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Properties;

import org.junit.BeforeClass;
import org.junit.Test;

import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.sql.Column;
import com.legacy.health.fhir.meta.sql.SQLConnector;
import com.legacy.health.fhir.meta.sql.SQLExecutor;
import com.legacy.health.fhir.meta.sql.Table;
import com.legacy.health.fhir.meta.sql.queryengine.SQLInExpression;
import com.legacy.health.fhir.meta.sql.queryengine.SQLListValue;
import com.legacy.health.fhir.meta.sql.queryengine.SQLQuery;
import com.legacy.health.fhir.meta.sql.queryengine.SQLQueryBuilder;

public class InStatementTest {

	protected SQLQueryBuilder qb = new SQLQueryBuilder();
	protected static Connection connection;

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		System.out.println("test");
		ClassLoader classLoader = InStatementTest.class.getClassLoader();
		File file = new File(classLoader.getResource("test.properties").getFile());
		FileInputStream fis = new FileInputStream(file);
		Properties testProperties = new Properties();
		testProperties.load(fis);
		connection = SQLConnector.connect(testProperties);

	}

	@Test
	public void test() throws FhirException, SQLException {
		String tableName = "\"TEST\"";
		String schema = "\"TEST_IN\"";
		Table table = new Table();
		table.setName("\"TEST\"");
		table.setSchema(schema);
		Column column = new Column("\"ID\"", "VARCHAR(100)");
		table.addColumn(column);
		SQLExecutor executor = new SQLExecutor();
		executor.connect(connection);
		executor.executeDDL("DROP SCHEMA " + schema + " CASCADE", true);
		executor.executeDDL("CREATE SCHEMA " + schema, false);
		executor.executeDDL(table.getDDL(), false);
		executor.executeDDL("INSERT INTO " + schema + "." + tableName + " VALUES('X')", false);
		SQLQuery iQuery = qb.query();
		iQuery.from(qb.from(table, "a1"));
		iQuery.column(qb.column(column, "a1"));
		ArrayList<String> list = new ArrayList<>();
		list.add("FUP");
		list.add("X");
		SQLListValue value = new SQLListValue();
		value.addList(list);
		SQLInExpression expr = new SQLInExpression();
		expr.left(qb.column(column, "a1"));
		expr.list(value);
		iQuery.filter(expr);
		PreparedStatement istmt = iQuery.getStatement(connection);
		ResultSet rs = istmt.executeQuery();
		while (rs.next()) {
			System.out.println("entry");
		}
	}

}
