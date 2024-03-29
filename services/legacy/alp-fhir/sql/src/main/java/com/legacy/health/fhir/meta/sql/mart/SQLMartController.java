package com.legacy.health.fhir.meta.sql.mart;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.Charset;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.zip.GZIPOutputStream;

import com.legacy.health.fhir.meta.sql.queryengine.SQLUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.extension.ExtensionMetadata;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.RequestContext;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.queryengine.QueryBuilder;
import com.legacy.health.fhir.meta.queryengine.extension.MartControllerExtension;
import com.legacy.health.fhir.meta.sql.RelationSchemaController;
import com.legacy.health.fhir.meta.sql.RowBuffer;
import com.legacy.health.fhir.meta.sql.SQLContext;
import com.legacy.health.fhir.meta.sql.SQLExecutor;
import com.legacy.health.fhir.meta.sql.Table;
import com.legacy.health.fhir.meta.sql.queryengine.SQLQueryEngine;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;

public class SQLMartController implements MartControllerExtension {

	private Log log = LogFactory.getLog(SQLMartController.class);

	private static String NAME = "sql";

	private RelationSchemaController controller = null;

	SQLExecutor sqlExecutor = null;

	@Override
	public void createDataMart(String id, ObjectNode definition, RequestContext reqCtx) throws FhirException {
		log.info("Create data mart with id:" + id);
		try {
			SQLContext context = newSQLContext(reqCtx.getEndPoint(), getSQLExecutor(reqCtx).connect());

			RelationSchemaController controller = getSchemaController(reqCtx, (SQLContext) context);
			// Connection connection = context.getConnection();
			Table martTable = controller.getMartTable();
			ObjectNode martTypeNode = (ObjectNode) definition.get("type");
			String sqlSchema = martTypeNode.get("schema").asText();
			RowBuffer buffer = new RowBuffer(controller.getProviderFactory().createSQLTypeMapper());// new
																									// RowBuffer();
			buffer.setActiveProfile(reqCtx.getActiveSpringProfileConfiguration());
			buffer.setConnection(sqlExecutor.connect());
			buffer.setTable(martTable);
			HashMap<String, Object> row = new HashMap<String, Object>();
			row.put("\"ID\"", id);
			row.put("\"SCHEMA\"", sqlSchema);
			String resource = definition.toString();
			try {
				byte[] b = resource.getBytes(Charset.forName(RowBuffer.CHARSET_NAME));
				ByteArrayOutputStream baos = new ByteArrayOutputStream();

				GZIPOutputStream gzip = new GZIPOutputStream(baos);
				gzip.write(b);
				gzip.close();
				byte[] c = baos.toByteArray();
				row.put("\"RESOURCE_COMPRESSED\"", c);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				log.error(e);
				e.printStackTrace();
			}

			buffer.addRow(row);
			buffer.flushBuffer();
			// Create Schema
			// SQLExecutor sql = new SQLExecutor();
			// sql.connect(connection);
			sqlExecutor.executeDDL("DROP SCHEMA \"" + sqlSchema + "\" CASCADE", true);
			sqlExecutor.executeDDL("CREATE SCHEMA \"" + sqlSchema + "\"", false);
			ArrayNode views = (ArrayNode) definition.get("views");
			QueryBuilder qb = new QueryBuilder();
			qb.setMetaRepository(reqCtx.getMetaRepo());
			SQLQueryEngine engine = new SQLQueryEngine();
			engine.setSchemaControllerImpl(controller);
			SQLMartQueryConsumer consumer = new SQLMartQueryConsumer();
			engine.setSQLQueryConsumer(consumer);
			for (JsonNode jsonNode : views) {
				ObjectNode view = (ObjectNode) jsonNode;
				ObjectNode q = (ObjectNode) view.get("query");
				String name = q.get("name").asText();
				Query query = (Query) qb.fromJson(q);
				engine.execute(query, null, null);
				String innerSQL = consumer.toSQL();
				String outerSQL = "CREATE VIEW \"" + sqlSchema + "\".\"" + name + "\" as " + innerSQL;
				sqlExecutor.executeDDL(outerSQL, false);
			}
		} catch (Exception e) {
			e.printStackTrace();
			log.error("Error during creation of datamart with id " + id);
			throw new FhirException("Error during creation of datamart with id :" + id, e);
		} finally {
			try {
				sqlExecutor.closeConnection();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				log.error("Error during closing connection " + e);
				e.printStackTrace();
			}
		}

	}

	@SuppressFBWarnings("SQL_INJECTION_JDBC")
	@Override
	public void deleteDataMart(String id, RequestContext reqCtx) throws FhirException {
		PreparedStatement stmt = null;
		try {
			log.info("Delete data mart with id:" + id);
			SQLContext context = newSQLContext(reqCtx.getEndPoint(), getSQLExecutor(reqCtx).connect());
			RelationSchemaController controller = getSchemaController(reqCtx, (SQLContext) context);

			String tableName = controller.getMartTable().getFullTableName();
			String sql = "SELECT SCHEMA FROM " + tableName + " WHERE ID=?";
			stmt = context.getConnection().prepareStatement(sql);
			stmt.setString(1, id);
			ResultSet rs = stmt.executeQuery();
			// sqlexecutor.connect(context.getConnection());
			while (rs.next()) {
				String sqlSchema = rs.getString(1);
				sqlExecutor.executeDDL("DROP SCHEMA "
						+ SQLUtils.ensureQuoting(SQLUtils.assertValidSQLIdentifier(sqlSchema), '"') + " CASCADE", true);
			}
			deleteEntry(id, context, tableName);
			log.info("Datamart with id '" + id + "' deleted.");
		} catch (SQLException e) {
			e.printStackTrace();
			log.error("Error during deletion of datamart with id " + id);
			throw new FhirException("Errod during deletion of Datamart with id:" + id, e);
		} finally {
			try {
				if (stmt != null) {
					stmt.close();
				}
				sqlExecutor.closeConnection();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				log.error("Error during closing connection " + e);
				e.printStackTrace();
			}
		}
	}

	@SuppressFBWarnings("SQL_INJECTION_JDBC")
	private void deleteEntry(String id, SQLContext context, String tableName) throws SQLException {
		String sql = "DELETE from " + tableName + " WHERE ID=?";
		PreparedStatement stmt = context.getConnection().prepareStatement(sql);
		stmt.setString(1, id);
		stmt.execute();
		stmt.close();
	}

	@Override
	public ExtensionMetadata getMetaData() {
		// TODO Auto-generated method stub
		return new ExtensionMetadata(NAME, null, NAME);
	}

	private RelationSchemaController getSchemaController(RequestContext reqCtx, SQLContext context)
			throws SQLException {
		if (controller == null) {
			controller = RelationSchemaController.createRelationSchemaController(reqCtx.getEndPoint(),
					reqCtx.getConnectionDetails().getProperty("datasource.driver"));
			controller.setMetaRepository(reqCtx.getMetaRepo());
		}
		return controller;
	}

	private SQLContext newSQLContext(String schemaName, Connection connection) throws SQLException {
		SQLContext context = new SQLContext();
		context.setConnection(connection);
		context.setController(controller);
		return context;
	}

	private SQLExecutor getSQLExecutor(RequestContext reqCtx) throws FhirException, SQLException {
		sqlExecutor = new SQLExecutor();
		sqlExecutor.setSchema(reqCtx.getEndPoint());
		sqlExecutor.connect(reqCtx.getConnectionDetails(), reqCtx.getActiveSpringProfileConfiguration());
		return sqlExecutor;
	}

}
