package com.legacy.health.fhir.content.model;

import java.util.List;
import java.util.Collections;
import java.util.ArrayList;
import com.fasterxml.jackson.databind.JsonNode;
import com.legacy.health.fhir.content.ContentRepository;

public class Role extends BaseContentElement {

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

	private List<ObjectPrivileges> objectPrivileges = new ArrayList<ObjectPrivileges>();

	public void setObjectPrivileges(List<ObjectPrivileges> objectPrivileges) {
		this.objectPrivileges.addAll(objectPrivileges);
	}

	public List<ObjectPrivileges> getObjectPrivileges() {
		ensureResolved();
		return Collections.unmodifiableList(this.objectPrivileges);
	}

	private List<String> schemaPrivileges = new ArrayList<String>();

	public void setSchemaPrivileges(List<String> schemaPrivileges) {
		this.schemaPrivileges.addAll(schemaPrivileges);
	}

	public List<String> getSchemaPrivileges() {
		ensureResolved();
		return Collections.unmodifiableList(this.schemaPrivileges);
	}

	public String getStructureDefinitionId() {
		return "Role";
	}

	public void fromJson(JsonNode node) {
		if (node.get("resourceType") == null || !"Role".equals(node.get("resourceType").asText())) {
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
		elementNode = node.get("objectPrivileges");
		if (elementNode != null) {
			objectPrivileges.clear();
			for (int i = 0; i < elementNode.size(); i++) {
				ObjectPrivileges listElement = new ObjectPrivileges();
				listElement.setContentRepository(this.repo);
				listElement.fromJson(elementNode.get(i));

				objectPrivileges.add(listElement);

			}
		}
		elementNode = node.get("schemaPrivileges");
		if (elementNode != null) {
			schemaPrivileges.clear();
			for (int i = 0; i < elementNode.size(); i++) {

				String value = elementNode.get(i).asText();
				schemaPrivileges.add(value);
			}
		}
	}

	public class ObjectPrivileges {
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

		private String objectName;

		public void setObjectName(String objectName) {
			this.objectName = objectName;
		}

		public String getObjectName() {
			ensureResolved();
			return objectName;
		}

		private List<Grants> grants = new ArrayList<Grants>();

		public void setGrants(List<Grants> grants) {
			this.grants.addAll(grants);
		}

		public List<Grants> getGrants() {
			ensureResolved();
			return Collections.unmodifiableList(this.grants);
		}

		public void fromJson(JsonNode node) {
			JsonNode elementNode = null;

			elementNode = node.get("type");
			if (elementNode != null) {
				String value = elementNode.asText();
				setType(value);
			}
			elementNode = node.get("objectName");
			if (elementNode != null) {
				String value = elementNode.asText();
				setObjectName(value);
			}
			elementNode = node.get("grants");
			if (elementNode != null) {
				grants.clear();
				for (int i = 0; i < elementNode.size(); i++) {
					Grants listElement = new Grants();
					listElement.setContentRepository(this.repo);
					listElement.fromJson(elementNode.get(i));

					grants.add(listElement);

				}
			}
		}

	}

	public class Grants {
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

		private Boolean grant;

		public void setGrant(Boolean grant) {
			this.grant = grant;
		}

		public Boolean getGrant() {
			ensureResolved();
			return grant;
		}

		public void fromJson(JsonNode node) {
			JsonNode elementNode = null;

			elementNode = node.get("type");
			if (elementNode != null) {
				String value = elementNode.asText();
				setType(value);
			}
			elementNode = node.get("grant");
			if (elementNode != null) {
				Boolean value = elementNode.asBoolean();
				setGrant(value);
			}
		}

	}
}