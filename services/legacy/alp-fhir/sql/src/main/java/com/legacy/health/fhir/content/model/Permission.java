package com.legacy.health.fhir.content.model;

import java.util.List;
import java.util.Collections;
import java.util.ArrayList;
import com.legacy.health.fhir.meta.entity.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.legacy.health.fhir.content.ContentRepository;

public class Permission extends BaseContentElement {

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

	private String group;

	public void setGroup(String group) {
		this.group = group;
	}

	public String getGroup() {
		ensureResolved();
		return group;
	}

	private List<String> requiredAttributes = new ArrayList<String>();

	public void setRequiredAttributes(List<String> requiredAttributes) {
		this.requiredAttributes.addAll(requiredAttributes);
	}

	public List<String> getRequiredAttributes() {
		ensureResolved();
		return Collections.unmodifiableList(this.requiredAttributes);
	}

	private List<RestPermission> restPermission = new ArrayList<RestPermission>();

	public void setRestPermission(List<RestPermission> restPermission) {
		this.restPermission.addAll(restPermission);
	}

	public List<RestPermission> getRestPermission() {
		ensureResolved();
		return Collections.unmodifiableList(this.restPermission);
	}

	private List<InstancePermission> instancePermission = new ArrayList<InstancePermission>();

	public void setInstancePermission(List<InstancePermission> instancePermission) {
		this.instancePermission.addAll(instancePermission);
	}

	public List<InstancePermission> getInstancePermission() {
		ensureResolved();
		return Collections.unmodifiableList(this.instancePermission);
	}

	public String getStructureDefinitionId() {
		return "Permission";
	}

	public void fromJson(JsonNode node) {
		if (node.get("resourceType") == null || !"Permission".equals(node.get("resourceType").asText())) {
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
		elementNode = node.get("group");
		if (elementNode != null) {
			String value = elementNode.asText();
			setGroup(value);
		}
		elementNode = node.get("requiredAttributes");
		if (elementNode != null) {
			requiredAttributes.clear();
			for (int i = 0; i < elementNode.size(); i++) {

				String value = elementNode.get(i).asText();
				requiredAttributes.add(value);
			}
		}
		elementNode = node.get("restPermission");
		if (elementNode != null) {
			restPermission.clear();
			for (int i = 0; i < elementNode.size(); i++) {
				RestPermission listElement = new RestPermission();
				listElement.setContentRepository(this.repo);
				listElement.fromJson(elementNode.get(i));

				restPermission.add(listElement);

			}
		}
		elementNode = node.get("instancePermission");
		if (elementNode != null) {
			instancePermission.clear();
			for (int i = 0; i < elementNode.size(); i++) {
				InstancePermission listElement = new InstancePermission();
				listElement.setContentRepository(this.repo);
				listElement.fromJson(elementNode.get(i));

				instancePermission.add(listElement);

			}
		}
	}

	public class RestPermission {
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

		private StructureDefinition definition;

		public void setDefinition(StructureDefinition definition) {
			this.definition = definition;
		}

		public StructureDefinition getDefinition() {
			ensureResolved();
			return definition;
		}

		private String endpoint;

		public void setEndpoint(String endpoint) {
			this.endpoint = endpoint;
		}

		public String getEndpoint() {
			ensureResolved();
			return endpoint;
		}

		private List<String> grant = new ArrayList<String>();

		public void setGrant(List<String> grant) {
			this.grant.addAll(grant);
		}

		public List<String> getGrant() {
			ensureResolved();
			return Collections.unmodifiableList(this.grant);
		}

		private List<String> operation = new ArrayList<String>();

		public void setOperation(List<String> operation) {
			this.operation.addAll(operation);
		}

		public List<String> getOperation() {
			ensureResolved();
			return Collections.unmodifiableList(this.operation);
		}

		public void fromJson(JsonNode node) {
			JsonNode elementNode = null;

			elementNode = node.get("type");
			if (elementNode != null) {
				String value = elementNode.asText();
				setType(value);
			}
			elementNode = node.get("definition");
			if (elementNode != null) {
				JsonNode reference = elementNode.get("reference");
				if (reference != null) {
					String value = reference.asText();
					setDefinition(getStructureDefinitionByUrl(value));
				}
			}
			elementNode = node.get("endpoint");
			if (elementNode != null) {
				String value = elementNode.asText();
				setEndpoint(value);
			}
			elementNode = node.get("grant");
			if (elementNode != null) {
				grant.clear();
				for (int i = 0; i < elementNode.size(); i++) {

					String value = elementNode.get(i).asText();
					grant.add(value);
				}
			}
			elementNode = node.get("operation");
			if (elementNode != null) {
				operation.clear();
				for (int i = 0; i < elementNode.size(); i++) {

					String value = elementNode.get(i).asText();
					operation.add(value);
				}
			}
		}

	}

	public class InstancePermission {
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

		private StructureDefinition definition;

		public void setDefinition(StructureDefinition definition) {
			this.definition = definition;
		}

		public StructureDefinition getDefinition() {
			ensureResolved();
			return definition;
		}

		private List<String> grant = new ArrayList<String>();

		public void setGrant(List<String> grant) {
			this.grant.addAll(grant);
		}

		public List<String> getGrant() {
			ensureResolved();
			return Collections.unmodifiableList(this.grant);
		}

		private String constraintType;

		public void setConstraintType(String constraintType) {
			this.constraintType = constraintType;
		}

		public String getConstraintType() {
			ensureResolved();
			return constraintType;
		}

		private String element;

		public void setElement(String element) {
			this.element = element;
		}

		public String getElement() {
			ensureResolved();
			return element;
		}

		private String value;

		public void setValue(String value) {
			this.value = value;
		}

		public String getValue() {
			ensureResolved();
			return value;
		}

		private String expression;

		public void setExpression(String expression) {
			this.expression = expression;
		}

		public String getExpression() {
			ensureResolved();
			return expression;
		}

		private String endpoint;

		public void setEndpoint(String endpoint) {
			this.endpoint = endpoint;
		}

		public String getEndpoint() {
			ensureResolved();
			return endpoint;
		}

		public void fromJson(JsonNode node) {
			JsonNode elementNode = null;

			elementNode = node.get("type");
			if (elementNode != null) {
				String value = elementNode.asText();
				setType(value);
			}
			elementNode = node.get("definition");
			if (elementNode != null) {
				JsonNode reference = elementNode.get("reference");
				if (reference != null) {
					String value = reference.asText();
					setDefinition(getStructureDefinitionByUrl(value));
				}
			}
			elementNode = node.get("grant");
			if (elementNode != null) {
				grant.clear();
				for (int i = 0; i < elementNode.size(); i++) {

					String value = elementNode.get(i).asText();
					grant.add(value);
				}
			}
			elementNode = node.get("constraintType");
			if (elementNode != null) {
				String value = elementNode.asText();
				setConstraintType(value);
			}
			elementNode = node.get("element");
			if (elementNode != null) {
				String value = elementNode.asText();
				setElement(value);
			}
			elementNode = node.get("value");
			if (elementNode != null) {
				String value = elementNode.asText();
				setValue(value);
			}
			elementNode = node.get("expression");
			if (elementNode != null) {
				String value = elementNode.asText();
				setExpression(value);
			}
			elementNode = node.get("endpoint");
			if (elementNode != null) {
				String value = elementNode.asText();
				setEndpoint(value);
			}
		}

	}
}