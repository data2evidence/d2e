package com.legacy.health.fhir.meta.sql;

import java.sql.Types;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.legacy.health.fhir.meta.entity.DataElement;

/**
 * TODO: Replace with configurable Type Mapping
 */
public class SQLTypeMapper {

	public static Log log = LogFactory.getLog(SQLTypeMapper.class);

	public String mapGeneratorName(String type) {
		return type;
	}

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
				ret = "VARCHAR(100000)"; // TEXT in postgres
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
				ret = "BINARY LARGE OBJECT(1M)";
				break;
			default:
				ret = getDefaultType();
		}
		return ret;
	}

	protected String getDefaultType() {
		return "VARCHAR(100000)"; // TEXT in postgres
	}

	protected String getBlobType() {
		return "BINARY LARGE OBJECT(1M)";
	}

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
			case "BINARY LARGE OBJECT":
				jDBCType = Types.BINARY;
				break;
			case "VARCHAR":
				jDBCType = Types.VARCHAR;
				break;
			case "NUMERIC":
				jDBCType = Types.NUMERIC;
				break;
			default:
				jDBCType = getDefaultJDBCType();
		}
		return jDBCType;
	}

	public String stripSizeParamaters(String sQLType) {
		return sQLType.replaceAll("\\((.+?)\\)", "");
	}

	public int getDefaultJDBCType() {
		return Types.VARCHAR;
	}

}