package com.legacy.health.fhir.content.model;

import java.util.List;
import java.util.Collections;
import java.util.ArrayList;
import com.fasterxml.jackson.databind.JsonNode;
import com.legacy.health.fhir.content.ContentRepository;

public class TableContent extends BaseContentElement {

	private String id;

	public void setId(String id) {
		this.id = id;
	}

	public String getId() {
		ensureResolved();
		return id;
	}

	private String url;

	public void setUrl(String url) {
		this.url = url;
	}

	public String getUrl() {
		ensureResolved();
		return url;
	}

	private String version;

	public void setVersion(String version) {
		this.version = version;
	}

	public String getVersion() {
		ensureResolved();
		return version;
	}

	private Tabledefinition definition;

	public void setDefinition(Tabledefinition definition) {
		this.definition = definition;
	}

	public Tabledefinition getDefinition() {
		ensureResolved();
		return definition;
	}

	private List<Row> row = new ArrayList<Row>();

	public void setRow(List<Row> row) {
		this.row.addAll(row);
	}

	public List<Row> getRow() {
		ensureResolved();
		return Collections.unmodifiableList(this.row);
	}

	public String getStructureDefinitionId() {
		return "TableContent";
	}

	public void fromJson(JsonNode node) {
		if (node.get("resourceType") == null || !"TableContent".equals(node.get("resourceType").asText())) {
			return;
		}
		JsonNode elementNode = null;

		elementNode = node.get("id");
		if (elementNode != null) {
			String value = elementNode.asText();
			setId(value);
		}
		elementNode = node.get("url");
		if (elementNode != null) {
			String value = elementNode.asText();
			setUrl(value);
		}
		elementNode = node.get("version");
		if (elementNode != null) {
			String value = elementNode.asText();
			setVersion(value);
		}
		elementNode = node.get("definition");
		if (elementNode != null) {
			JsonNode reference = elementNode.get("reference");
			if (reference != null) {
				String value = reference.asText();
				definition = new Tabledefinition();
				definition.setContentRepository(this.repo);
				if (value.startsWith("http") && value.split("\\|").length == 2) {
					String[] segments = value.split("\\|");
					definition.setUrl(segments[0]);
					definition.setVersion(segments[1]);
				} else {
					definition.setId(value);
				}
			}
		}
		elementNode = node.get("row");
		if (elementNode != null) {
			row.clear();
			for (int i = 0; i < elementNode.size(); i++) {
				Row listElement = new Row();
				listElement.setContentRepository(this.repo);
				listElement.fromJson(elementNode.get(i));

				row.add(listElement);

			}
		}
	}

	public class Row {
		protected ContentRepository repo;

		void setContentRepository(ContentRepository repo) {
			this.repo = repo;
		}

		private List<Column> column = new ArrayList<Column>();

		public void setColumn(List<Column> column) {
			this.column.addAll(column);
		}

		public List<Column> getColumn() {
			ensureResolved();
			return Collections.unmodifiableList(this.column);
		}

		public void fromJson(JsonNode node) {
			JsonNode elementNode = null;

			elementNode = node.get("column");
			if (elementNode != null) {
				column.clear();
				for (int i = 0; i < elementNode.size(); i++) {
					Column listElement = new Column();
					listElement.setContentRepository(this.repo);
					listElement.fromJson(elementNode.get(i));

					column.add(listElement);

				}
			}
		}

	}

	public class Column {
		protected ContentRepository repo;

		void setContentRepository(ContentRepository repo) {
			this.repo = repo;
		}

		private String name;

		public void setName(String name) {
			this.name = name;
		}

		public String getName() {
			ensureResolved();
			return name;
		}

		private String valueString;

		public void setValueString(String valueString) {
			this.valueString = valueString;
		}

		public String getValueString() {
			ensureResolved();
			return valueString;
		}

		public void fromJson(JsonNode node) {
			JsonNode elementNode = null;

			elementNode = node.get("name");
			if (elementNode != null) {
				String value = elementNode.asText();
				setName(value);
			}
			elementNode = node.get("valueString");
			if (elementNode != null) {
				String value = elementNode.asText();
				setValueString(value);
			}
		}

	}
}