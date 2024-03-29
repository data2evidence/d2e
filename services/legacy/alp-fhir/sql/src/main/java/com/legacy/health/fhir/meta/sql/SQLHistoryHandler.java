package com.legacy.health.fhir.meta.sql;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.nio.charset.Charset;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.GZIPInputStream;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.json.JSONWalker;
import com.legacy.health.fhir.meta.repsitory.HistoryHandler;
import com.legacy.health.fhir.meta.sql.queryengine.SQLUtils;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;

public class SQLHistoryHandler implements HistoryHandler {
	private static Log log = LogFactory.getLog(SQLHistoryHandler.class);
	private static ObjectMapper mapper = new ObjectMapper();
	protected RelationSchemaController controller;

	public void setController(RelationSchemaController controller) {
		this.controller = controller;
	}

	@SuppressFBWarnings("SQL_INJECTION_JDBC")
	@Override
	public List<Structure> getHistory(String schema, StructureDefinition sd, String id, Context ctx) {
		SQLContext context = (SQLContext) ctx;
		Table resTable = controller.getResourceTable();
		String name = resTable.getFullTableName();
		String idColumn = resTable.getStructureLinkColumn().getName();
		String sql = "SELECT \"RESOURCE_COMPRESSED\" FROM " + name + " WHERE " + idColumn
				+ "= ? order by \"VALID_FROM\" DESC";
		ArrayList<Structure> ret = new ArrayList<Structure>();

		try (PreparedStatement stmt = context.getConnection().prepareStatement(sql);) {
			stmt.setString(1, id);
			ResultSet rs = stmt.executeQuery();
			while (rs.next()) {
				try (InputStream bis = rs.getBinaryStream(1);
						GZIPInputStream is = new GZIPInputStream(bis);
						InputStreamReader reader = new InputStreamReader(is,
								Charset.forName(RowBuffer.CHARSET_NAME));) {
					StringWriter writer = new StringWriter();
					char[] buffer = new char[5000];
					for (int length = 0; (length = reader.read(buffer)) > 0;) {
						writer.write(buffer, 0, length);
					}
					String resourceString = writer.toString();
					JsonNode resource = mapper.readTree(resourceString);
					JSONWalker jwalker = new JSONWalker();
					Structure structure = jwalker.fromJSON(resource, sd);
					ret.add(structure);
				}
			}
			return ret;
		} catch (SQLException e) {
			log.error(e);
		} catch (IOException e) {
			log.error(e);
		}
		return null;
	}

	@Override
	@SuppressFBWarnings("SQL_INJECTION_JDBC")
	public Structure getVersion(String schema, StructureDefinition sd, String id, String versionId, Context ctx) {
		SQLContext context = (SQLContext) ctx;
		Table resTable = controller.getResourceTable();
		String name = resTable.getFullTableName();
		String idColumn = resTable.getStructureLinkColumn().getName();

		try {
			name = SQLUtils.ensureQuoting(SQLUtils.assertValidSQLIdentifier(name), '"');
			idColumn = SQLUtils.ensureQuoting(SQLUtils.assertValidSQLIdentifier(idColumn), '"');
		} catch (FhirException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
			log.error(" Exception " + e1.getLocalizedMessage());
			return null;
		}

		String sql = "SELECT \"RESOURCE_COMPRESSED\" FROM " + name + " WHERE " + idColumn + "= ? and \"VID\"=? ";
		ArrayList<Structure> ret = new ArrayList<Structure>();

		try (PreparedStatement stmt = context.getConnection().prepareStatement(sql);) {
			stmt.setString(1, id);
			stmt.setString(2, versionId);
			ResultSet rs = stmt.executeQuery();
			while (rs.next()) {
				try (InputStream bis = rs.getBinaryStream(1);
						GZIPInputStream is = new GZIPInputStream(bis);
						InputStreamReader reader = new InputStreamReader(is,
								Charset.forName(RowBuffer.CHARSET_NAME));) {
					StringWriter writer = new StringWriter();
					char[] buffer = new char[5000];
					for (int length = 0; (length = reader.read(buffer)) > 0;) {
						writer.write(buffer, 0, length);
					}
					String resourceString = writer.toString();
					JsonNode resource = mapper.readTree(resourceString);

					JSONWalker jwalker = new JSONWalker();

					Structure structure = jwalker.fromJSON(resource, sd);
					ret.add(structure);
				}
			}
			return ret.get(0);
		} catch (SQLException e) {
			log.error(e);
		} catch (IOException e) {
			log.error(e);
		}
		return null;
	}

}
