package com.legacy.health.fhir.content.model;

import java.util.List;
import java.util.Collections;
import java.util.ArrayList;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.entity.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.legacy.health.fhir.content.ContentRepository;

public class CatalogDefinition extends BaseContentElement {

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

	private StructureDefinition target;

	public void setTarget(StructureDefinition target) {
		this.target = target;
	}

	public StructureDefinition getTarget() {
		ensureResolved();
		return target;
	}

	private List<Table> table = new ArrayList<Table>();

	public void setTable(List<Table> table) {
		this.table.addAll(table);
	}

	public List<Table> getTable() {
		ensureResolved();
		return Collections.unmodifiableList(this.table);
	}

	private String templatepath;

	public void setTemplatepath(String templatepath) {
		this.templatepath = templatepath;
	}

	public String getTemplatepath() {
		ensureResolved();
		return templatepath;
	}

	private List<Mapping> mapping = new ArrayList<Mapping>();

	public void setMapping(List<Mapping> mapping) {
		this.mapping.addAll(mapping);
	}

	public List<Mapping> getMapping() {
		ensureResolved();
		return Collections.unmodifiableList(this.mapping);
	}

	public String getStructureDefinitionId() {
		return "CatalogDefinition";
	}

	public void fromJson(JsonNode node) {
		if (node.get("resourceType") == null || !"CatalogDefinition".equals(node.get("resourceType").asText())) {
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
		elementNode = node.get("target");
		if (elementNode != null) {
			JsonNode reference = elementNode.get("reference");
			if (reference != null) {
				String value = reference.asText();
				setTarget(getStructureDefinitionByUrl(value));
			}
		}
		elementNode = node.get("table");
		if (elementNode != null) {
			for (int i = 0; i < elementNode.size(); i++) {
				Table listElement = new Table();
				listElement.setContentRepository(this.repo);
				listElement.fromJson(elementNode.get(i));
				table.add(listElement);

			}
		}
		elementNode = node.get("templatepath");
		if (elementNode != null) {
			String value = elementNode.asText();
			setTemplatepath(value);
		}
		elementNode = node.get("mapping");
		if (elementNode != null) {
			for (int i = 0; i < elementNode.size(); i++) {
				Mapping listElement = new Mapping();
				listElement.setContentRepository(this.repo);
				listElement.fromJson(elementNode.get(i));
				mapping.add(listElement);

			}
		}
	}

	public class Table {
		protected ContentRepository repo;

		void setContentRepository(ContentRepository repo) {
			this.repo = repo;
		}

		private String id;

		public void setId(String id) {
			this.id = id;
		}

		public String getId() {
			ensureResolved();
			return id;
		}

		private String cardinality;

		public void setCardinality(String cardinality) {
			this.cardinality = cardinality;
		}

		public String getCardinality() {
			ensureResolved();
			return cardinality;
		}

		private Tabledefinition definition;

		public void setDefinition(Tabledefinition definition) {
			this.definition = definition;
		}

		public Tabledefinition getDefinition() {
			ensureResolved();
			return definition;
		}

		private ReferenceColumn referenceColumn;

		public void setReferenceColumn(ReferenceColumn referenceColumn) {
			this.referenceColumn = referenceColumn;
		}

		public ReferenceColumn getReferenceColumn() {
			ensureResolved();
			return referenceColumn;
		}

		private KeyColumn keyColumn;

		public void setKeyColumn(KeyColumn keyColumn) {
			this.keyColumn = keyColumn;
		}

		public KeyColumn getKeyColumn() {
			ensureResolved();
			return keyColumn;
		}

		private List<Table> table = new ArrayList<Table>();

		public void setTable(List<Table> table) {
			this.table.addAll(table);
		}

		public List<Table> getTable() {
			ensureResolved();
			return Collections.unmodifiableList(this.table);
		}

		public void fromJson(JsonNode node) {
			JsonNode elementNode = null;

			elementNode = node.get("id");
			if (elementNode != null) {
				String value = elementNode.asText();
				setId(value);
			}
			elementNode = node.get("cardinality");
			if (elementNode != null) {
				String value = elementNode.asText();
				setCardinality(value);
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
			elementNode = node.get("referenceColumn");
			if (elementNode != null) {
				referenceColumn = new ReferenceColumn();
				referenceColumn.setContentRepository(this.repo);
				referenceColumn.fromJson(elementNode);
			}
			elementNode = node.get("keyColumn");
			if (elementNode != null) {
				keyColumn = new KeyColumn();
				keyColumn.setContentRepository(this.repo);
				keyColumn.fromJson(elementNode);
			}
			elementNode = node.get("table");
			if (elementNode != null) {
				for (int i = 0; i < elementNode.size(); i++) {
					Table listElement = new Table();
					listElement.setContentRepository(this.repo);
					listElement.fromJson(elementNode.get(i));
					table.add(listElement);

				}
			}
		}

	}

	public class ReferenceColumn {
		protected ContentRepository repo;

		void setContentRepository(ContentRepository repo) {
			this.repo = repo;
		}

		private String type;

		public void setType(String type) {
			this.type = type;
		}

		public String getType() {
			ensureResolved();
			return type;
		}

		private String name;

		public void setName(String name) {
			this.name = name;
		}

		public String getName() {
			ensureResolved();
			return name;
		}

		public void fromJson(JsonNode node) {
			JsonNode elementNode = null;

			elementNode = node.get("type");
			if (elementNode != null) {
				String value = elementNode.asText();
				setType(value);
			}
			elementNode = node.get("name");
			if (elementNode != null) {
				String value = elementNode.asText();
				setName(value);
			}
		}

	}

	public class KeyColumn {
		protected ContentRepository repo;

		void setContentRepository(ContentRepository repo) {
			this.repo = repo;
		}

		private String type;

		public void setType(String type) {
			this.type = type;
		}

		public String getType() {
			ensureResolved();
			return type;
		}

		private String name;

		public void setName(String name) {
			this.name = name;
		}

		public String getName() {
			ensureResolved();
			return name;
		}

		public void fromJson(JsonNode node) {
			JsonNode elementNode = null;

			elementNode = node.get("type");
			if (elementNode != null) {
				String value = elementNode.asText();
				setType(value);
			}
			elementNode = node.get("name");
			if (elementNode != null) {
				String value = elementNode.asText();
				setName(value);
			}
		}

	}

	public class Mapping {
		protected ContentRepository repo;

		void setContentRepository(ContentRepository repo) {
			this.repo = repo;
		}

		private String dataelement;

		public void setDataelement(String dataelement) {
			this.dataelement = dataelement;
		}

		public String getDataelement() {
			ensureResolved();
			return dataelement;
		}

		private String tableid;

		public void setTableid(String tableid) {
			this.tableid = tableid;
		}

		public String getTableid() {
			ensureResolved();
			return tableid;
		}

		private Boolean searchable;

		public void setSearchable(Boolean searchable) {
			this.searchable = searchable;
		}

		public Boolean getSearchable() {
			ensureResolved();
			return searchable;
		}

		private String type;

		public void setType(String type) {
			this.type = type;
		}

		public String getType() {
			ensureResolved();
			return type;
		}

		private String column;

		public void setColumn(String column) {
			this.column = column;
		}

		public String getColumn() {
			ensureResolved();
			return column;
		}

		private String value;

		public void setValue(String value) {
			this.value = value;
		}

		public String getValue() {
			ensureResolved();
			return value;
		}

		private String targetReference;

		public void setTargetReference(String targetReference) {
			this.targetReference = targetReference;
		}

		public String getTargetReference() {
			ensureResolved();
			return targetReference;
		}

		private String expression;

		public void setExpression(String expression) {
			this.expression = expression;
		}

		public String getExpression() {
			ensureResolved();
			return expression;
		}

		private String condition;

		public void setCondition(String condition) {
			this.condition = condition;
		}

		public String getCondition() {
			ensureResolved();
			return condition;
		}

		private Structure conceptmap;

		public void setConceptmap(Structure conceptmap) {
			this.conceptmap = conceptmap;
		}

		public Structure getConceptmap() {
			ensureResolved();
			return conceptmap;
		}

		private List<Mapping> children = new ArrayList<Mapping>();

		public void setChildren(List<Mapping> children) {
			this.children.addAll(children);
		}

		public List<Mapping> getChildren() {
			ensureResolved();
			return Collections.unmodifiableList(this.children);
		}

		public void fromJson(JsonNode node) {
			JsonNode elementNode = null;

			elementNode = node.get("dataelement");
			if (elementNode != null) {
				String value = elementNode.asText();
				setDataelement(value);
			}
			elementNode = node.get("tableid");
			if (elementNode != null) {
				String value = elementNode.asText();
				setTableid(value);
			}
			elementNode = node.get("searchable");
			if (elementNode != null) {
				Boolean value = elementNode.asBoolean();
				setSearchable(value);
			}
			elementNode = node.get("type");
			if (elementNode != null) {
				String value = elementNode.asText();
				setType(value);
			}
			elementNode = node.get("column");
			if (elementNode != null) {
				String value = elementNode.asText();
				setColumn(value);
			}
			elementNode = node.get("value");
			if (elementNode != null) {
				String value = elementNode.asText();
				setValue(value);
			}
			elementNode = node.get("targetReference");
			if (elementNode != null) {
				String value = elementNode.asText();
				setTargetReference(value);
			}
			elementNode = node.get("expression");
			if (elementNode != null) {
				String value = elementNode.asText();
				setExpression(value);
			}
			elementNode = node.get("condition");
			if (elementNode != null) {
				String value = elementNode.asText();
				setCondition(value);
			}
			elementNode = node.get("conceptmap");
			if (elementNode != null) {
				JsonNode reference = elementNode.get("reference");
				if (reference != null) {
					String value = reference.asText();
					setConceptmap(getStructureById(value, "http://hl7.org/fhir/StructureDefinition/ConceptMap"));
				}
			}
			elementNode = node.get("children");
			if (elementNode != null) {
				for (int i = 0; i < elementNode.size(); i++) {
					Mapping listElement = new Mapping();
					listElement.setContentRepository(this.repo);
					listElement.fromJson(elementNode.get(i));
					children.add(listElement);
				}
			}
		}

	}
}