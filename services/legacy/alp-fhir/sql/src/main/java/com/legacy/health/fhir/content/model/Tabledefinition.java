package com.legacy.health.fhir.content.model;

import com.fasterxml.jackson.databind.JsonNode;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.content.ContentRepository;
import com.legacy.health.fhir.content.TabledefinitionDeserializer;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.FhirRuntimeException;
import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.json.JSONStructure;
import com.legacy.health.fhir.meta.sql.Column;
import com.legacy.health.fhir.meta.sql.SQLDataType;
import com.legacy.health.fhir.meta.sql.SQLProviderFactory;
import com.legacy.health.fhir.meta.sql.Table;

public class Tabledefinition extends StructureDefinition implements ContentElement {

	private Table inner = null;

	private String schema;
	private String table;
	private ContentRepository repo;
	private SQLProviderFactory factory;
	private Boolean isView = false;
	private String viewDefinition = null;

	public Tabledefinition(String id) {
		super(id);
	}

	public String getType() {
		return "StructureDefinition";
	}

	public Tabledefinition() {
		super(null);
		inner = new Table();
	}

	public Tabledefinition setSchema(String schema) {
		this.schema = schema;
		inner.setSchema(escapedName(schema));
		return this;
	}

	public Tabledefinition setTable(String table) {
		this.table = table;
		inner.setName(escapedName(table));
		return this;
	}

	public String getSchema() {
		ensureResolved();
		return this.schema;
	}

	public String getTable() {
		ensureResolved();
		return this.table;
	}

	public Tabledefinition setIsView(Boolean isView) {
		this.isView = isView;
		this.inner.setIsView(isView);
		return this;
	}

	public Tabledefinition setViewDefinition(String viewDefinition) {
		this.viewDefinition = viewDefinition;
		this.inner.setViewDefinition(this.viewDefinition);
		return this;
	}

	public boolean isView() {
		ensureResolved();
		return this.isView;
	}

	public String getFullTableName() {
		ensureResolved();
		return '"' + schema + "\".\"" + table + "\"";
	}

	public void setProviderFactory(SQLProviderFactory factory) {
		this.factory = factory;
	}

	protected String escapedName(String name) {
		return '"' + name + '"';
	}

	public String getType(String type, Integer scale, Integer precission) {
		String mappedType = type;
		if (factory != null) {
			mappedType = factory.createSQLTypeMapper().mapGeneratorName(type);
		}
		if (scale != null) {
			return mappedType + "(" + scale + ")";
		} else {
			return mappedType;
		}
	}

	public Tabledefinition column(String column, String type, Integer scale, Integer precission, Boolean notNull,
			Boolean isPrimaryKey, String postfix, Boolean readOnly) {
		String pType = getType(type, scale, precission);
		if (pType != null) {
			Column innerColumn = new Column(escapedName(column), pType, notNull);
			inner.addColumn(innerColumn);
			if (isPrimaryKey != null && isPrimaryKey)
				innerColumn.setIsKey(true);
			if (postfix != null && postfix.length() > 0) {
				innerColumn.setPostfix(postfix);
			}
			if (readOnly != null && readOnly) {
				innerColumn.setReadOnly(true);
			}
		}
		DataElement de = new DataElement();
		de.setId(column);
		de.setOwner(this);
		if (notNull) {
			de.setMin(1);
		} else {
			de.setMin(0);
		}
		de.setMax(1);
		SQLDataType dtype = new SQLDataType(type);
		if (scale != null)
			dtype.scale(scale);
		if (precission != null)
			dtype.precission(precission);
		de.setType(dtype);
		this.addDataElement(de);
		return this;
	}

	@Override
	public void setContentRepository(ContentRepository repo) {
		this.repo = repo;

	}

	public Table getTableModel() {
		ensureResolved();
		return inner;
	}

	private boolean resolved = false;
	private boolean inResolving = false;

	protected void ensureResolved() {
		if (!resolved && !inResolving) {
			inResolving = true;
			try {
				String url = getUrl();
				String version = getVersion();
				Structure structure = null;
				if (url != null && version != null) {
					structure = repo.readContentFromCanonicalID(url, version, "StructureDefinition");
				} else {
					structure = repo.readContent(getId(), "StructureDefinition");
				}
				if (structure instanceof JSONStructure) {
					JsonNode node = ((JSONStructure) structure).getRoot();
					TabledefinitionDeserializer.deserializeDefinition(this, node);
				}
			} catch (FhirException | NullPointerException e) {
				throw new FhirRuntimeException("Error during deserialization of TableDefinition:" + getId()
						+ ":" + getUrl() + "|" + getVersion(), e);
			} finally {
				inResolving = false;
			}
		}
		resolved = true;
	}

	public void setResolved() {
		this.resolved = true;
	}

}
