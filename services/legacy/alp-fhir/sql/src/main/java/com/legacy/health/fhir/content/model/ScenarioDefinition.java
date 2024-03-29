package com.legacy.health.fhir.content.model;

import java.util.List;
import java.util.Collections;
import java.util.ArrayList;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.entity.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.legacy.health.fhir.content.ContentRepository;

public class ScenarioDefinition extends BaseContentElement {

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

	private String category;

	public void setCategory(String category) {
		this.category = category;
	}

	public String getCategory() {
		ensureResolved();
		return category;
	}

	private Structure capabilities;

	public void setCapabilities(Structure capabilities) {
		this.capabilities = capabilities;
	}

	public Structure getCapabilities() {
		ensureResolved();
		return capabilities;
	}

	private List<PatientEverything> patientEverything = new ArrayList<PatientEverything>();

	public void setPatientEverything(List<PatientEverything> patientEverything) {
		this.patientEverything.addAll(patientEverything);
	}

	public List<PatientEverything> getPatientEverything() {
		ensureResolved();
		return Collections.unmodifiableList(this.patientEverything);
	}

	private List<Deployment> deployment = new ArrayList<Deployment>();

	public void setDeployment(List<Deployment> deployment) {
		this.deployment.addAll(deployment);
	}

	public List<Deployment> getDeployment() {
		ensureResolved();
		return Collections.unmodifiableList(this.deployment);
	}

	private List<Parameter> parameter = new ArrayList<Parameter>();

	public void setParameter(List<Parameter> parameter) {
		this.parameter.addAll(parameter);
	}

	public List<Parameter> getParameter() {
		ensureResolved();
		return Collections.unmodifiableList(this.parameter);
	}

	public String getStructureDefinitionId() {
		return "ScenarioDefinition";
	}

	public void fromJson(JsonNode node) {
		if (node.get("resourceType") == null || !"ScenarioDefinition".equals(node.get("resourceType").asText())) {
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
		elementNode = node.get("category");
		if (elementNode != null) {
			String value = elementNode.asText();
			setCategory(value);
		}
		elementNode = node.get("capabilities");
		if (elementNode != null) {
			JsonNode reference = elementNode.get("reference");
			if (reference != null) {
				String value = reference.asText();
				setCapabilities(getStructureById(value, "http://hl7.org/fhir/StructureDefinition/CapabilityStatement"));
			}
		}
		elementNode = node.get("patientEverything");
		if (elementNode != null) {
			patientEverything.clear();
			for (int i = 0; i < elementNode.size(); i++) {
				PatientEverything listElement = new PatientEverything();
				listElement.setContentRepository(this.repo);
				listElement.fromJson(elementNode.get(i));

				patientEverything.add(listElement);

			}
		}
		elementNode = node.get("deployment");
		if (elementNode != null) {
			deployment.clear();
			for (int i = 0; i < elementNode.size(); i++) {
				Deployment listElement = new Deployment();
				listElement.setContentRepository(this.repo);
				listElement.fromJson(elementNode.get(i));

				deployment.add(listElement);

			}
		}
		elementNode = node.get("parameter");
		if (elementNode != null) {
			parameter.clear();
			for (int i = 0; i < elementNode.size(); i++) {
				Parameter listElement = new Parameter();
				listElement.setContentRepository(this.repo);
				listElement.fromJson(elementNode.get(i));

				parameter.add(listElement);

			}
		}
	}

	public class PatientEverything {
		protected ContentRepository repo;

		void setContentRepository(ContentRepository repo) {
			this.repo = repo;
		}

		private StructureDefinition definition;

		public void setDefinition(StructureDefinition definition) {
			this.definition = definition;
		}

		public StructureDefinition getDefinition() {
			ensureResolved();
			return definition;
		}

		private String element;

		public void setElement(String element) {
			this.element = element;
		}

		public String getElement() {
			ensureResolved();
			return element;
		}

		private String dateElement;

		public void setDateElement(String dateElement) {
			this.dateElement = dateElement;
		}

		public String getDateElement() {
			ensureResolved();
			return dateElement;
		}

		private List<Deep> deep = new ArrayList<Deep>();

		public void setDeep(List<Deep> deep) {
			this.deep.addAll(deep);
		}

		public List<Deep> getDeep() {
			ensureResolved();
			return Collections.unmodifiableList(this.deep);
		}

		public void fromJson(JsonNode node) {
			JsonNode elementNode = null;

			elementNode = node.get("definition");
			if (elementNode != null) {
				JsonNode reference = elementNode.get("reference");
				if (reference != null) {
					String value = reference.asText();
					setDefinition(getStructureDefinitionByUrl(value));
				}
			}
			elementNode = node.get("element");
			if (elementNode != null) {
				String value = elementNode.asText();
				setElement(value);
			}
			elementNode = node.get("dateElement");
			if (elementNode != null) {
				String value = elementNode.asText();
				setDateElement(value);
			}
			elementNode = node.get("deep");
			if (elementNode != null) {
				deep.clear();
				for (int i = 0; i < elementNode.size(); i++) {
					Deep listElement = new Deep();
					listElement.setContentRepository(this.repo);
					listElement.fromJson(elementNode.get(i));

					deep.add(listElement);

				}
			}
		}

	}

	public class Deep {
		protected ContentRepository repo;

		void setContentRepository(ContentRepository repo) {
			this.repo = repo;
		}

		private StructureDefinition definition;

		public void setDefinition(StructureDefinition definition) {
			this.definition = definition;
		}

		public StructureDefinition getDefinition() {
			ensureResolved();
			return definition;
		}

		private String element;

		public void setElement(String element) {
			this.element = element;
		}

		public String getElement() {
			ensureResolved();
			return element;
		}

		private String dateElement;

		public void setDateElement(String dateElement) {
			this.dateElement = dateElement;
		}

		public String getDateElement() {
			ensureResolved();
			return dateElement;
		}

		public void fromJson(JsonNode node) {
			JsonNode elementNode = null;

			elementNode = node.get("definition");
			if (elementNode != null) {
				JsonNode reference = elementNode.get("reference");
				if (reference != null) {
					String value = reference.asText();
					setDefinition(getStructureDefinitionByUrl(value));
				}
			}
			elementNode = node.get("element");
			if (elementNode != null) {
				String value = elementNode.asText();
				setElement(value);
			}
			elementNode = node.get("dateElement");
			if (elementNode != null) {
				String value = elementNode.asText();
				setDateElement(value);
			}
		}

	}

	public class Deployment {
		protected ContentRepository repo;

		void setContentRepository(ContentRepository repo) {
			this.repo = repo;
		}

		private String scope;

		public void setScope(String scope) {
			this.scope = scope;
		}

		public String getScope() {
			ensureResolved();
			return scope;
		}

		private List<Permission> permission = new ArrayList<Permission>();

		public void setPermission(List<Permission> permission) {
			this.permission.addAll(permission);
		}

		public List<Permission> getPermission() {
			ensureResolved();
			return Collections.unmodifiableList(this.permission);
		}

		private List<Role> role = new ArrayList<Role>();

		public void setRole(List<Role> role) {
			this.role.addAll(role);
		}

		public List<Role> getRole() {
			ensureResolved();
			return Collections.unmodifiableList(this.role);
		}

		private List<TableContent> data = new ArrayList<TableContent>();

		public void setData(List<TableContent> data) {
			this.data.addAll(data);
		}

		public List<TableContent> getData() {
			ensureResolved();
			return Collections.unmodifiableList(this.data);
		}

		private List<Persistency> persistency = new ArrayList<Persistency>();

		public void setPersistency(List<Persistency> persistency) {
			this.persistency.addAll(persistency);
		}

		public List<Persistency> getPersistency() {
			ensureResolved();
			return Collections.unmodifiableList(this.persistency);
		}

		private List<CatalogDefinition> catalog = new ArrayList<CatalogDefinition>();

		public void setCatalog(List<CatalogDefinition> catalog) {
			this.catalog.addAll(catalog);
		}

		public List<CatalogDefinition> getCatalog() {
			ensureResolved();
			return Collections.unmodifiableList(this.catalog);
		}

		public void fromJson(JsonNode node) {
			JsonNode elementNode = null;

			elementNode = node.get("scope");
			if (elementNode != null) {
				String value = elementNode.asText();
				setScope(value);
			}
			elementNode = node.get("permission");
			if (elementNode != null) {
				permission.clear();
				for (int i = 0; i < elementNode.size(); i++) {

					JsonNode reference = elementNode.get(i).get("reference");
					if (reference != null) {
						String value = reference.asText();
						Permission listElement = new Permission();
						listElement.setContentRepository(this.repo);
						if (value.startsWith("http") && value.split("\\|").length == 2) {
							String[] segments = value.split("\\|");
							listElement.setUrl(segments[0]);
							listElement.setVersion(segments[1]);
						} else {
							listElement.setId(value);
						}
						permission.add(listElement);
					}
				}
			}
			elementNode = node.get("role");
			if (elementNode != null) {
				role.clear();
				for (int i = 0; i < elementNode.size(); i++) {

					JsonNode reference = elementNode.get(i).get("reference");
					if (reference != null) {
						String value = reference.asText();
						Role listElement = new Role();
						listElement.setContentRepository(this.repo);
						if (value.startsWith("http") && value.split("\\|").length == 2) {
							String[] segments = value.split("\\|");
							listElement.setUrl(segments[0]);
							listElement.setVersion(segments[1]);
						} else {
							listElement.setId(value);
						}
						role.add(listElement);
					}
				}
			}
			elementNode = node.get("data");
			if (elementNode != null) {
				data.clear();
				for (int i = 0; i < elementNode.size(); i++) {

					JsonNode reference = elementNode.get(i).get("reference");
					if (reference != null) {
						String value = reference.asText();
						TableContent listElement = new TableContent();
						listElement.setContentRepository(this.repo);
						if (value.startsWith("http") && value.split("\\|").length == 2) {
							String[] segments = value.split("\\|");
							listElement.setUrl(segments[0]);
							listElement.setVersion(segments[1]);
						} else {
							listElement.setId(value);
						}
						data.add(listElement);
					}
				}
			}
			elementNode = node.get("persistency");
			if (elementNode != null) {
				persistency.clear();
				for (int i = 0; i < elementNode.size(); i++) {
					Persistency listElement = new Persistency();
					listElement.setContentRepository(this.repo);
					listElement.fromJson(elementNode.get(i));

					persistency.add(listElement);

				}
			}
			elementNode = node.get("catalog");
			if (elementNode != null) {
				catalog.clear();
				for (int i = 0; i < elementNode.size(); i++) {

					JsonNode reference = elementNode.get(i).get("reference");
					if (reference != null) {
						String value = reference.asText();
						CatalogDefinition listElement = new CatalogDefinition();
						listElement.setContentRepository(this.repo);
						if (value.startsWith("http") && value.split("\\|").length == 2) {
							String[] segments = value.split("\\|");
							listElement.setUrl(segments[0]);
							listElement.setVersion(segments[1]);
						} else {
							listElement.setId(value);
						}
						catalog.add(listElement);
					}
				}
			}
		}

	}

	public class Persistency {
		protected ContentRepository repo;

		void setContentRepository(ContentRepository repo) {
			this.repo = repo;
		}

		private Tabledefinition definition;

		public void setDefinition(Tabledefinition definition) {
			this.definition = definition;
		}

		public Tabledefinition getDefinition() {
			ensureResolved();
			return definition;
		}

		private List<String> configuration = new ArrayList<String>();

		public void setConfiguration(List<String> configuration) {
			this.configuration.addAll(configuration);
		}

		public List<String> getConfiguration() {
			ensureResolved();
			return Collections.unmodifiableList(this.configuration);
		}

		private String patientColumn;

		public void setPatientColumn(String patientColumn) {
			this.patientColumn = patientColumn;
		}

		public String getPatientColumn() {
			ensureResolved();
			return patientColumn;
		}

		public void fromJson(JsonNode node) {
			JsonNode elementNode = null;

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
			elementNode = node.get("configuration");
			if (elementNode != null) {
				configuration.clear();
				for (int i = 0; i < elementNode.size(); i++) {

					String value = elementNode.get(i).asText();
					configuration.add(value);
				}
			}
			elementNode = node.get("patientColumn");
			if (elementNode != null) {
				String value = elementNode.asText();
				setPatientColumn(value);
			}
		}

	}

	public class Parameter {
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

		private String type;

		public void setType(String type) {
			this.type = type;
		}

		public String getType() {
			ensureResolved();
			return type;
		}

		private Boolean optional;

		public void setOptional(Boolean optional) {
			this.optional = optional;
		}

		public Boolean getOptional() {
			ensureResolved();
			return optional;
		}

		private String defValueString;

		public void setDefValueString(String defValueString) {
			this.defValueString = defValueString;
		}

		public String getDefValueString() {
			ensureResolved();
			return defValueString;
		}

		public void fromJson(JsonNode node) {
			JsonNode elementNode = null;

			elementNode = node.get("name");
			if (elementNode != null) {
				String value = elementNode.asText();
				setName(value);
			}
			elementNode = node.get("type");
			if (elementNode != null) {
				String value = elementNode.asText();
				setType(value);
			}
			elementNode = node.get("optional");
			if (elementNode != null) {
				Boolean value = elementNode.asBoolean();
				setOptional(value);
			}
			elementNode = node.get("defValueString");
			if (elementNode != null) {
				String value = elementNode.asText();
				setDefValueString(value);
			}
		}

	}
}