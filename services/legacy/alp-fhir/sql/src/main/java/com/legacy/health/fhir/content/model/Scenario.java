package com.legacy.health.fhir.content.model;

import java.util.List;
import java.util.Collections;
import java.util.ArrayList;
import com.fasterxml.jackson.databind.JsonNode;
import com.legacy.health.fhir.content.ContentRepository;

public class Scenario extends BaseContentElement {

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

	private List<String> scope = new ArrayList<String>();

	public void setScope(List<String> scope) {
		this.scope.addAll(scope);
	}

	public List<String> getScope() {
		ensureResolved();
		return Collections.unmodifiableList(this.scope);
	}

	private List<Permission> permission = new ArrayList<Permission>();

	public void setPermission(List<Permission> permission) {
		this.permission.addAll(permission);
	}

	public List<Permission> getPermission() {
		ensureResolved();
		return Collections.unmodifiableList(this.permission);
	}

	private ScenarioDefinition definition;

	public void setDefinition(ScenarioDefinition definition) {
		this.definition = definition;
	}

	public ScenarioDefinition getDefinition() {
		ensureResolved();
		return definition;
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
		return "Scenario";
	}

	public void fromJson(JsonNode node) {
		if (node.get("resourceType") == null || !"Scenario".equals(node.get("resourceType").asText())) {
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
		elementNode = node.get("scope");
		if (elementNode != null) {
			scope.clear();
			for (int i = 0; i < elementNode.size(); i++) {

				String value = elementNode.get(i).asText();
				scope.add(value);
			}
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
		elementNode = node.get("definition");
		if (elementNode != null) {
			JsonNode reference = elementNode.get("reference");
			if (reference != null) {
				String value = reference.asText();
				definition = new ScenarioDefinition();
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