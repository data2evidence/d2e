package legacy.health.genomics.vcf.parser.capability;

import legacy.health.genomics.vcf.environment.EnvironmentDetails;
import legacy.health.genomics.vcf.parser.capability.BatchCountingStatement;
import legacy.health.genomics.vcf.parser.datamodel.*;
import legacy.health.genomics.vcf.parser.exceptions.EnvironmentException;
import legacy.health.genomics.vcf.parser.utils.SQLUtils;

import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

/**
 * Created by D058991 on 24.02.2018.
 */
public abstract class TableBase<T extends TypedField & IdentifiableField> {
	private static final Logger LOGGER = LoggerFactory.getLogger(TableBase.class);
	private final String tableName;
	private final PreparedStatement preparedStatement;
	private PreparedStatement insertStmt;
	private final List<List<T>> fields;
	private List<String> prefixes = Collections.singletonList("Attr.");
	private final Map<EPrimitiveType, Pair<String, String>> primTypeToSqlAndCDSType;
	private final Map<EPrimitiveType, Pair<String, String>> primTypeToCDSExtAndCDSType;
	private final Connection connection;
	private ImportConfiguration config;

	public TableBase(String tableName, Connection conn, ImportConfiguration config) throws SQLException, EnvironmentException {
		fields = new LinkedList<>();
		this.tableName = tableName;
		Map<EPrimitiveType, Pair<String, String>> aMap = new HashMap<>();
		Map<EPrimitiveType, Pair<String, String>> aMapCDSType = new HashMap<>();
		aMap.put(EPrimitiveType.Integer, new ImmutablePair<>("INTEGER", "Attribute.Type.\"IntegerValue\""));
		aMap.put(EPrimitiveType.Float, new ImmutablePair<>("REAL", "Attribute.Type.\"FloatValue\""));
		aMap.put(EPrimitiveType.Flag, new ImmutablePair<>("TINYINT", "Attribute.Type.\"FlagValue\""));
		aMap.put(EPrimitiveType.Character, new ImmutablePair<>("NVARCHAR", "Attribute.Type.\"CharacterValue\""));
		aMap.put(EPrimitiveType.String, new ImmutablePair<>("NVARCHAR", "Attribute.Type.\"StringValue\""));
		primTypeToSqlAndCDSType = Collections.unmodifiableMap(aMap);
		
		aMapCDSType.put(EPrimitiveType.Integer, new ImmutablePair<>("Integer", "Attribute.Type.\"IntegerValue\""));
		aMapCDSType.put(EPrimitiveType.Float, new ImmutablePair<>("Double", "Attribute.Type.\"FloatValue\""));
		aMapCDSType.put(EPrimitiveType.Flag, new ImmutablePair<>("Integer", "Attribute.Type.\"FlagValue\""));
		aMapCDSType.put(EPrimitiveType.Character, new ImmutablePair<>("String(256)", "Attribute.Type.\"CharacterValue\""));
		aMapCDSType.put(EPrimitiveType.String, new ImmutablePair<>("String(256)", "Attribute.Type.\"StringValue\""));
		primTypeToCDSExtAndCDSType = Collections.unmodifiableMap(aMapCDSType);
		
		this.connection = conn;
		this.setConfig(config);
		/*String selectSQL = "Select * from SYS.TABLE_COLUMNS where table_name=? and schema_name='" + this.getSchemaName()
				+ "' and column_name = ? and data_Type_name = ?";*/
		String selectSQL = "Select * from SYS.TABLE_COLUMNS where table_name=? and schema_name='" + this.getSchemaName()
		+ "' and column_name = ?";
		preparedStatement = this.getConnection().prepareStatement(selectSQL);
		
	}

	private boolean existsColumn(String table, String col, String type) throws SQLException {

		preparedStatement.setString(1, table);
		preparedStatement.setString(2, col);
		//preparedStatement.setString(3, type);
		boolean exists;
		try (ResultSet resultSet = preparedStatement.executeQuery()) {
			if (resultSet == null) {
				exists = false;
			}
			else {
				exists = resultSet.next();
				
			}
			
		}
		LOGGER.debug(
				"Check existence of column " + table + "." + col + " with type " + type + " resulted in " + exists);
		return exists;
	}
	
	private void addToMissingFields(String table, String col, String cdsType, Map<String, List<String>> missing) {
		LOGGER.debug("Add missing column " + table + "." + col + " whith type " + cdsType);
		missing.computeIfAbsent(table, k -> new LinkedList<>());
		//missing.get(table).add("\"" + col + "\" : " + cdsType + ";");
		missing.get(table).add("\"" + col + "\" : " + cdsType);
	}

	protected PreparedStatement createPreparedInsertStmt(String schema, String tableName, List<String> staticColumns)
			throws SQLException {
		StringBuilder sqlBuilder = new StringBuilder();
		StringJoiner columnNameJoiner = new StringJoiner(",");
		StringJoiner questionMarkJoiner = new StringJoiner(",");

		staticColumns.forEach(column -> {
			columnNameJoiner.add("\"" + column + "\"");
			questionMarkJoiner.add("?");
		});
		for (int fieldIdx = 0; fieldIdx < getFields().size(); ++fieldIdx) {
			for (T t : getFields().get(fieldIdx)) {
				columnNameJoiner.add("\"" + getPrefixes().get(fieldIdx) + t.getAlias() + "\"");
				//columnNameJoiner.add("\"" +  t.getAlias() + "\"");
				questionMarkJoiner.add("?");
			}

		}
		sqlBuilder.append("INSERT INTO \"").append(schema).append("\".\"").append(tableName).append("\"(")
				.append(columnNameJoiner.toString()).append(") VALUES (").append(questionMarkJoiner.toString())
				.append(")");

		
		return CountingPreparedStmtHandler.enableCountBatches(getConnection().prepareStatement(sqlBuilder.toString()));
	}

	
	public void checkHeaderAgainstDatabase(Map<String, List<String>> tableToMissingFieldsMap) throws SQLException {
		for (int fieldIdx = 0; fieldIdx < getFields().size(); ++fieldIdx) {
			for (T t : getFields().get(fieldIdx)) {
				String sqlcolName = getPrefixes().get(fieldIdx) + t.getId();
				String sqlType = primTypeToSqlAndCDSType.get(t.getType()).getKey();
				String hdiExtensionType = primTypeToCDSExtAndCDSType.get(t.getType()).getKey();
				if (!existsColumn(getTableName(), sqlcolName, sqlType)) {
					addToMissingFields(getTableName() + "-" + getPrefixes().get(fieldIdx), t.getId(), hdiExtensionType,
							tableToMissingFieldsMap);
				}
			}
		}
	}

	public abstract void consumeDataRow(Dataline line) throws Exception;

	public void close() throws SQLException {
		getInsertStmt().executeBatch();
		getConnection().commit();
	}

	protected abstract int getStaticFieldSize();

	public void rollback(int variantIndex, int dwId) throws SQLException, EnvironmentException {
		if (((BatchCountingStatement) getInsertStmt()).getBatchCount() > 0) {
			int index = getStaticFieldSize() + 1;
			for (List<T> lT : getFields()) {
				for (T t : lT) {
					SQLUtils.addValueWithCorrectType(getInsertStmt(), index, null, t.getType());

					++index;
				}
			}
			getInsertStmt().executeBatch();
			getConnection().commit();
		}
//        try (PreparedStatement statement = getConnection().prepareStatement("Delete from \"SAP_HPH\".\"" + getTableName() + "\" WHERE \"VariantIndex\"=? and \"DWAuditID\" =? ")) {
		try (PreparedStatement statement = getConnection().prepareStatement("Delete from \"" + getSchemaName() + "\".\""
				+ getTableName() + "\" WHERE \"VariantIndex\"=? and \"DWAuditID\" =? ")) {
			statement.setInt(1, variantIndex);
			statement.setInt(2, dwId);
			statement.execute();
			getConnection().commit();
		}
	}

	public abstract void init() throws SQLException, EnvironmentException;

	public List<List<T>> getFields() {
		return fields;
	}

	public String getTableName() {
		return tableName;
	}

	public PreparedStatement getInsertStmt() {
		return insertStmt;
	}

	public void setInsertStmt(PreparedStatement insertStmt) {
		this.insertStmt = insertStmt;
	}

	public ImportConfiguration getConfig() {
		return config;
	}

	public void setConfig(ImportConfiguration config) {
		this.config = config;
	}

	public Connection getConnection() {
		return connection;
	}

	public String getSchemaName() throws SQLException, EnvironmentException {
		EnvironmentDetails env = new EnvironmentDetails(getConfig());
		String schemaName = env.getSchemaName();
		
		/*if (schemaName == null) {
			schemaName = this.getConnection().getMetaData().getUserName();
		}*/
		
		return schemaName;
	}
	public List<String> getPrefixes() {
		return prefixes;
	}

	public void setPrefixes(List<String> prefixes) {
		this.prefixes = prefixes;
	}
}
