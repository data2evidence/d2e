package com.legacy.health.fhir.meta.postgresql;

import java.sql.Types;

import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.sql.SQLTypeMapper;

public class PostgreSQLTypeMapper extends SQLTypeMapper {
    @Override
    public String getSQLType(DataElement element) {
        String ret;
        switch (element.getType().getId()) {
            case "string":
            case "code":
            case "uri":
            case "oid":
                ret = "VARCHAR(500)";
                break;
            case "id":
                ret = "VARCHAR(60)";
                break;
            case "markdown":
                ret = "TEXT";
                break;
            case "boolean":
                ret = "BOOLEAN";
                break;
            case "unsingedInt":
            case "integer":
            case "positiveInt":
                ret = "INTEGER";
                break;
            case "decimal":
                ret = "NUMERIC(15,5)";
                break;
            case "date":
                ret = "DATE";
                break;
            case "dateTime":
            case "instant":
                ret = "TIMESTAMP";
                break;
            case "time":
                ret = "TIME";
                break;
            case "base64Binary":
                ret = "BYTEA";
                break;
            default:
                ret = getDefaultType();
        }
        return ret;
    }

    @Override
    protected String getDefaultType() {
        return "TEXT";
    }

    @Override
    protected String getBlobType() {
        return "BYTEA";
    }

    @Override
    public int getJDBCType(String sQLType) {
        String sQLTypeWithoutSizeParameters = stripSizeParamaters(sQLType);
        int jDBCType;
        switch (sQLTypeWithoutSizeParameters) {
            case "BOOLEAN":
                jDBCType = Types.BOOLEAN;
                break;
            case "INTEGER":
                jDBCType = Types.INTEGER;
                break;
            case "DATE":
                jDBCType = Types.DATE;
                break;
            case "TIMESTAMP":
                jDBCType = Types.TIMESTAMP;
                break;
            case "TIME":
                jDBCType = Types.TIME;
                break;
            case "BYTEA":
                jDBCType = Types.BINARY;
                break;
            case "VARCHAR":
                jDBCType = Types.VARCHAR;
                break;
            case "NUMERIC":
                jDBCType = Types.NUMERIC;
                break;
            case "CLOB":
                jDBCType = Types.LONGVARCHAR;
                break;
            default:
                jDBCType = getDefaultJDBCType();
        }
        return jDBCType;
    }
}
