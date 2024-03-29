package com.legacy.health.fhir.meta.sql.queryengine;

import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.util.Utils;

import java.io.ByteArrayInputStream;
import java.sql.*;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PreparedStatementValues {

    Map<String, ValueInformation> preparedStmtValues = new HashMap<>();

    static class ValueInformation {
        Object value;
        int index;
        JDBCType type;

        public ValueInformation(Object val, JDBCType type) {
            this.value = val;
            this.type = type;
            this.index = -1;
        }

        public void setIndex(int index) {
            this.index = index;
        }

    }

    public void setIndex(String key, int i) throws FhirException {
        if (!preparedStmtValues.containsKey(key)) {
            throw new FhirException("Unknown key in Prepare Statment '" + key + "'", null);
        }
        preparedStmtValues.get(key).setIndex(i);
    }

    public int getIndex(String key) throws FhirException {
        if (!preparedStmtValues.containsKey(key)) {
            throw new FhirException("Unknown key in Prepare Statment '" + key + "'", null);
        }
        return preparedStmtValues.get(key).index;
    }

    public void fillValues(PreparedStatement stmt) throws SQLException, FhirException {
        for (Map.Entry<String, ValueInformation> entry : preparedStmtValues.entrySet()) {
            switch (entry.getValue().type) {
                case TINYINT:
                case SMALLINT:
                case INTEGER:
                case BIGINT:
                    stmt.setInt(entry.getValue().index, (Integer) entry.getValue().value);
                    break;
                case FLOAT:
                case REAL:
                case DOUBLE:
                case NUMERIC:
                case DECIMAL:
                    stmt.setDouble(entry.getValue().index, (Double) entry.getValue().value);
                    break;
                case CHAR:
                case VARCHAR:
                case LONGVARCHAR:
                case NCHAR:
                case NVARCHAR:
                case LONGNVARCHAR:
                case NCLOB:
                    stmt.setString(entry.getValue().index, entry.getValue().value.toString());
                    break;
                case DATE:
                    if (entry.getValue().value instanceof java.sql.Date) {
                        stmt.setDate(entry.getValue().index, (Date) entry.getValue().value);
                    }
                    if (entry.getValue().value instanceof String) {
                        Instant instant = Utils.convert2Target((String) entry.getValue().value);
                        if (instant != null) {
                            Date date = new Date(instant.toEpochMilli());
                            stmt.setDate(entry.getValue().index, date);

                        } else {
                            throw new FhirException(
                                    "No Format to represent Time: " + entry.getValue().value + " found", null);
                        }
                    } else {
                        throw new FhirException(
                                "Time Type not String:" + entry.getValue().value.getClass().getName(), null);
                    }
                    break;
                case TIME:
                case TIMESTAMP:
                    if (entry.getValue().value instanceof Timestamp) {
                        stmt.setTimestamp(entry.getValue().index, (Timestamp) entry.getValue().value);
                    }
                    if (entry.getValue().value instanceof String) {
                        Instant instant = Utils.convert2Target((String) entry.getValue().value);
                        if (instant != null) {
                            Timestamp ts = Timestamp.from(instant);
                            stmt.setTimestamp(entry.getValue().index, ts);

                        } else {

                            throw new SQLException("No Format to represent Time: " + entry.getValue().value + " found");
                        }
                    } else {
                        throw new SQLException("Time Type not String:" + entry.getValue().value.getClass().getName());
                    }
                    break;
                case BLOB:
                    ByteArrayInputStream bias = new ByteArrayInputStream((byte[]) entry.getValue().value);
                    stmt.setBlob(entry.getValue().index, bias);
                    break;
                case BOOLEAN:
                    stmt.setBoolean(entry.getValue().index, (Boolean) entry.getValue().value);
                    break;
                default:
                    stmt.setObject(entry.getValue().index, entry.getValue().value); // Just fallback to do the matching
                                                                                    // at JDBC level
            }
        }
    }

    int variableCount = 10000001;

    public String getNameForValue(String val) {
        String key = "jdbc_template_var" + variableCount++;
        preparedStmtValues.put(key, new ValueInformation(val, JDBCType.NVARCHAR));
        return key;
    }

    public String getNameForValue(List val) {
        String key = "jdbc_template_var" + variableCount++;
        preparedStmtValues.put(key, new ValueInformation(val, JDBCType.ARRAY));
        return key;
    }

    public String getNameForValue(Object val, JDBCType type) {
        String key = "jdbc_template_var" + variableCount++;
        preparedStmtValues.put(key, new ValueInformation(val, type));
        return key;
    }

    // TODO remove:
    public Map<String, String> get() {
        Map<String, String> ret = new HashMap<>();
        preparedStmtValues.forEach((v, k) -> {
            ret.put(v, k.value.toString());
        });
        return ret;
    }
}
