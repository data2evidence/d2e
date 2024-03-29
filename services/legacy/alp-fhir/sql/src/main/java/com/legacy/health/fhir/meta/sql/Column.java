package com.legacy.health.fhir.meta.sql;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.legacy.health.fhir.meta.entity.DataElement;

public class Column {

	private static Log log = LogFactory.getLog(Column.class);

	public Column() {

	}

	public Column(String name, String type) {
		this();
		this.name = name;
		this.type = type;

	}

	public Column(String name, String type, DataElement element) {
		this(name, type);
		this.dataElement = element;
	}

	public Column(String name, String type, Boolean notNull) {
		this();
		this.name = name;
		this.type = type;
		this.notNull = notNull;
	}

	Table table;
	DataElement dataElement;
	String name;
	String type;
	Boolean notNull = false;
	Boolean isKey = false;
	String postfix;
	Boolean readOnly = false;
	List<String> suppportedPath = new ArrayList<String>();

	public void setDataElement(DataElement element) {
		this.dataElement = element;
	}

	public String getType() {
		return this.type;
	}

	public Boolean notNull() {
		return this.notNull;
	}

	public void addSupportedPath(String path) {
		this.suppportedPath.add(path);
	}

	public List<String> getSupportedPathList() {
		return Collections.unmodifiableList(suppportedPath);
	}

	public int getVarcharTypeLength() {
		int varcharTypeLength;
		/*
		 * String typeWithoutSizeParamaters =
		 * SQLTypeMapper.stripSizeParamaters(this.type);
		 * switch (typeWithoutSizeParamaters) {
		 * case "VARCHAR" :
		 * case "LONGVARCHAR" :
		 * varcharTypeLength = extractNumber(this.type);
		 * break;
		 * default :
		 * varcharTypeLength = 0;
		 * }
		 */
		varcharTypeLength = extractNumber(this.type);
		return varcharTypeLength;
		// sQLType.replaceAll("\\((.+?)\\)", "")

	}

	public DataElement getDataElement() {
		return dataElement;
	}

	public String getName() {
		return name;
	}

	public void setTable(Table table) {
		this.table = table;
	}

	public Table getTable() {
		return this.table;
	}

	public Boolean isReadOnly() {
		return readOnly;
	}

	public void setReadOnly(Boolean isReadOnly) {
		this.readOnly = isReadOnly;
	}

	public Boolean isKey() {
		return isKey;
	}

	public void setIsKey(Boolean isKey) {
		this.isKey = isKey;
	}

	public String getPostfix() {
		return postfix;
	}

	public void setPostfix(String postfix) {
		this.postfix = postfix;
	}

	public static int extractNumber(String type) {
		try {
			String extractedNumber = type.replaceAll("^[A-Z ]*\\(", ""); // (^[A-Z]*)
			extractedNumber = extractedNumber.replaceAll("\\)", "");
			return Integer.parseInt(extractedNumber);
		} catch (NumberFormatException nfe) {
			log.trace("cannot extract Number from Type: " + type + " - " + nfe.getMessage());
			return 0;
		}
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((dataElement == null) ? 0 : dataElement.hashCode());
		result = prime * result + ((isKey == null) ? 0 : isKey.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((notNull == null) ? 0 : notNull.hashCode());
		result = prime * result + ((postfix == null) ? 0 : postfix.hashCode());
		result = prime * result + ((readOnly == null) ? 0 : readOnly.hashCode());
		result = prime * result + ((table == null) ? 0 : table.hashCode());
		result = prime * result + ((type == null) ? 0 : type.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Column other = (Column) obj;
		if (dataElement == null) {
			if (other.dataElement != null)
				return false;
		} else if (!dataElement.equals(other.dataElement))
			return false;
		if (isKey == null) {
			if (other.isKey != null)
				return false;
		} else if (!isKey.equals(other.isKey))
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (notNull == null) {
			if (other.notNull != null)
				return false;
		} else if (!notNull.equals(other.notNull))
			return false;
		if (postfix == null) {
			if (other.postfix != null)
				return false;
		} else if (!postfix.equals(other.postfix))
			return false;
		if (readOnly == null) {
			if (other.readOnly != null)
				return false;
		} else if (!readOnly.equals(other.readOnly))
			return false;
		if (table == null) {
			if (other.table != null)
				return false;
		} else if (!table.equals(other.table))
			return false;
		if (type == null) {
			if (other.type != null)
				return false;
		} else if (!type.equals(other.type))
			return false;
		return true;
	}

}