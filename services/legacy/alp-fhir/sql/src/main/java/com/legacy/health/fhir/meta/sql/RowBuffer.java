package com.legacy.health.fhir.meta.sql;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Time;
import java.sql.Timestamp;
import java.sql.Types;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
//import org.hsqldb.lib.StringInputStream;
import java.nio.charset.Charset;

import com.legacy.health.fhir.util.Utils;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;

public class RowBuffer {

	private Log log = LogFactory.getLog(RowBuffer.class);

	public static final String CHARSET_NAME = "UTF-8";

	Table table;
	PreparedStatement stmt;
	Connection connection;
	long count;
	long start = System.currentTimeMillis();
	List<Map<String, Object>> rows = new ArrayList<>();
	Map<String, Object> currentRow = new HashMap<>();
	SQLTypeMapper sqlTypeMapper;
	private String activeProfile = null;

	public RowBuffer(SQLTypeMapper sqlTypeMapper) {
		this.sqlTypeMapper = sqlTypeMapper;
	}

	public void setConnection(Connection connection) {
		this.connection = connection;
	}

	public void addRow(Map<String, Object> row) throws SQLException {
		rows.add(row);
		count++;
		if (rows.size() >= 10000) {
			flushBuffer();
			rows.clear();
		}

	}

	public void setTable(Table table) {
		this.table = table;
	}

	public void flushBuffer() throws SQLException {
		if (table == null) {
			rows.clear();
			return;
		}
		long stop = System.currentTimeMillis();
		log.info("Table flush:" + table.getFullTableName() + ":" + count + ":" + (stop - start));
		PreparedStatement stmt = prepareStatement(table);
		stmt.setPoolable(true);
		ArrayList<Column> filteredColumns = new ArrayList<Column>();
		for (Column c : table.getColumns()) {
			if (!c.isReadOnly()) {
				filteredColumns.add(c);
			}
		}
		for (int r = 0; r < rows.size(); r++) {
			Map<String, Object> row = rows.get(r);
			for (int c = 1; c < filteredColumns.size() + 1; c++) {
				Column col = filteredColumns.get(c - 1);
				// if(col.isReadOnly()){
				// continue;
				// }
				Object val = row.get(col.name);
				if (val == null) {
					stmt.setNull(c, sqlTypeMapper.getJDBCType(col.getType()));
				} else {
					int jDBCType = sqlTypeMapper.getJDBCType(col.getType());
					// log.info("COLUMN: " + col.name + " TYPE: " + col.type + " JDBCTYPE: " +
					// jDBCType + " VALUE: " + val.toString());
					if (jDBCType == Types.VARCHAR) {// type.startsWith("VARCHAR")){
						try {
							String s = null;
							s = "" + val;
							// TODO -> DONE:Fix Length in String fields
							int varcharTypeLength = col.getVarcharTypeLength();
							if (varcharTypeLength > 0) {
								s = s.length() > varcharTypeLength ? s.substring(0, varcharTypeLength) : s; // was 500,
																											// was 100
							}
							stmt.setString(c, s);
						} catch (SQLException e) {
							log.error(e);
						}
					}
					if (jDBCType == Types.LONGVARCHAR) {// type.equals("TEXT")){
						if (val instanceof Integer) {
							stmt.setString(c, "" + val);
						} else {
							stmt.setString(c, (String) val);
						}

					}
					if (jDBCType == Types.DECIMAL) {// type.equals("INTEGER")){
						stmt.setObject(c, val);
					}
					if (jDBCType == Types.INTEGER) {// type.equals("INTEGER")){

						stmt.setObject(c, val);
					}
					if (jDBCType == Types.NUMERIC) {// type.startsWith("NUMERIC")){
						if (val instanceof Integer) {
							stmt.setDouble(c, (Integer) val);
						}
						if (val instanceof Double) {
							stmt.setDouble(c, (Double) val);
						}

					}
					if (jDBCType == Types.BOOLEAN) {// type.equals("BOOLEAN")){
						if (val instanceof Boolean) {
							stmt.setBoolean(c, (Boolean) val);
						}
						if (val instanceof String) {
							// stmt.setBoolean(c, Boolean.getBoolean((String)val));
							stmt.setBoolean(c, Boolean.parseBoolean((String) val));
						}
					}
					if (jDBCType == Types.DATE) {// type.equals("DATE")){
						if (val instanceof java.sql.Date) {
							stmt.setDate(c, (Date) val);
						}
						if (val instanceof String) {
							Instant instant = Utils.convert2Target((String) val);
							if (instant != null) {
								Date date = new Date(instant.toEpochMilli());
								stmt.setDate(c, date);

							} else {
								throw new SQLException("No Format to represent Time: " + val + " found");
							}
						} else {
							throw new SQLException("Time Type not String:" + val.getClass().getName());
						}
					}
					if (jDBCType == Types.TIMESTAMP) {// type.equals("TIMESTAMP")){
						if (val instanceof Timestamp) {
							stmt.setTimestamp(c, (Timestamp) val);
						}
						if (val instanceof String) {
							// log.error("TIMESTAMP representation:" + val.toString());
							Instant instant = Utils.convert2Target((String) val);
							if (instant != null) {
								Timestamp ts = Timestamp.from(instant);
								stmt.setTimestamp(c, ts);

							} else {

								throw new SQLException("No Format to represent Time: " + table.getFullTableName() + ":"
										+ col.getDataElement().getId() + ":" + val + " found");
							}
						} else {
							throw new SQLException("Time Type not String:" + val.getClass().getName());
						}
					}
					if (jDBCType == Types.TIME) {// type.equals("TIME")){
						// stmt.setNull(c, java.sql.Types.TIME);
						if (val instanceof String) {
							Instant instant = Utils.convert2Target((String) val);
							if (instant != null) {
								Timestamp ts = Timestamp.from(instant);
								// stmt.setTimestamp(c, ts);
								stmt.setTime(c, new Time(ts.getTime()));

							} else {
								throw new SQLException("No Format to represent Time: " + val + " found");
							}
						} else {
							throw new SQLException("Time Type not String:" + val.getClass().getName());
						}
					}
					if (jDBCType == Types.BLOB) {// type.equals("BLOB")){
						// log.info(col.name + " " + col.type + " " + jDBCType);
						InputStream bias;
						if (val instanceof String) {
							// bias = new StringInputStream((String) val);
							bias = new ByteArrayInputStream(((String) val).getBytes(Charset.forName(CHARSET_NAME)));
							/*
							 * } else if () {
							 * bias = new ByteArrayInputStream((byte[])val);
							 * //bias = new ByteArrayInputStream(val.toString().getBytes());
							 */
						} else {
							// log.error("val: " + val.getClass() + " " + val.toString());
							bias = new ByteArrayInputStream((byte[]) val);
							// bias = new ByteArrayInputStream(val.toString().getBytes());
						}
						stmt.setBlob(c, bias);
					}
					if (jDBCType == Types.BINARY) {// type.equals("bytea")){
						// log.debug(col.name + " " + col.type + " " + jDBCType);
						InputStream bias;
						if (val instanceof String) {
							// bias = new ByteArrayInputStream(val.toString().getBytes());
							bias = new ByteArrayInputStream(((String) val).getBytes(Charset.forName(CHARSET_NAME)));
						} else {
							bias = new ByteArrayInputStream((byte[]) val);
							// bias = new ByteArrayInputStream(val.toString().getBytes());
						}
						stmt.setBinaryStream(c, bias);
					}
				}
			}
			stmt.addBatch();
		}
		stmt.executeBatch();
		stmt.close();
		long stop2 = System.currentTimeMillis();
		log.info("Table flush took:" + table.getFullTableName() + ":" + count + ":" + (stop2 - stop));
		// connection.commit();
	}

	@SuppressFBWarnings("SQL_PREPARED_STATEMENT_GENERATED_FROM_NONCONSTANT_STRING, SQL_INJECTION_JDBC")
	protected PreparedStatement prepareStatement(Table table) throws SQLException {
		PreparedStatement ret = null;
		String sql = "INSERT INTO " + table.getFullTableName() + "( ";
		String prefix = "";
		String columns = "";
		String values = "";
		for (int c = 0; c < table.getColumns().size(); c++) {
			if (table.getColumns().get(c).isReadOnly())
				continue;
			columns += prefix + table.getColumns().get(c).getName();
			values += prefix + "?";
			prefix = ", ";
		}
		sql += columns + " ) VALUES (" + values + ")";
		log.trace(sql);
		ret = connection.prepareStatement(sql);
		return ret;
	}

	public Map<String, Object> getCurrentRow() {
		return this.currentRow;
	}

	public void addCurrentRow() throws SQLException {
		this.addRow(this.currentRow);
		this.currentRow = new HashMap<>();
	}

	public String getActiveProfile() {
		return activeProfile;
	}

	public void setActiveProfile(String activeProfile) {
		this.activeProfile = activeProfile;
	}
}
