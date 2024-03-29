package com.legacy.health.fhir.content.model;

import org.apache.log4j.Logger;

import com.fasterxml.jackson.databind.JsonNode;
import com.legacy.health.fhir.content.ContentRepository;
import com.legacy.health.fhir.extension.exceptions.FHIRResourceHandlingException;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.FhirRuntimeException;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.json.JSONStructure;

public abstract class BaseContentElement implements ContentElement {

	static Logger log = Logger.getLogger(BaseContentElement.class.getName());

	boolean resolved = false;
	protected ContentRepository repo;
	protected Structure structure;
	protected boolean isNew = true;

	protected StructureDefinition getStructureDefinitionById(String id) {
		return repo.getStructureDefinitionById(id);
	}

	protected StructureDefinition getStructureDefinitionByUrl(String url) {
		return repo.getStructureDefinitionByUrl(url);
	}

	public void setContentRepository(ContentRepository repo) {
		this.repo = repo;
	}

	protected Structure getStructureById(String id, String sdUrl) {
		try {
			return repo.readContentWithSDUrl(id, sdUrl);
		} catch (FhirException e) {
			throw new FhirRuntimeException("Error when reading Structure", e);
		}
	}

	protected boolean lock = false;

	public synchronized void ensureResolved() {
		try {
			if (!resolved && !lock) {
				lock = true;
				String url = getUrl();
				String version = getVersion();
				Structure structure = null;
				if (url != null && version != null) {
					structure = repo.readContentFromCanonicalID(url, version, this.getClass().getSimpleName());
				} else {
					structure = repo.readContent(getId(), this.getClass().getSimpleName());
				}
				if (structure instanceof JSONStructure) {
					isNew = false;
					JsonNode root = ((JSONStructure) structure).getRoot();
					if (root.isArray()) {
						if (root.size() == 0) {
							if (url != null && version != null) {
								log.error("No Content found for url:" + url + ":version:" + version + ":"
										+ this.getClass().getSimpleName());
								throw new FhirRuntimeException("No Content found for url:" + url + ":version:"
										+ version + ":" + this.getClass().getSimpleName(), null);
							} else {
								log.error("No Content found for id:" + getId() + ":" + this.getClass().getSimpleName());
								throw new FhirRuntimeException(
										"No Content found for id:" + getId() + ":" + this.getClass().getSimpleName(),
										null);
							}
						}
						fromJson(root.get(0));
					} else {
						fromJson(root);
					}
				}
				lock = false;
			}
			resolved = true;
		} catch (FhirException e) {
			throw new FhirRuntimeException("Error when resolving Content", e);
		}
	}

	public void setResolved() {
		this.resolved = true;
	}

	public void fromStructure(Structure structure) {
		this.structure = structure;
		if (structure instanceof JSONStructure) {
			JsonNode node = ((JSONStructure) structure).getRoot();
			this.fromJson(node);
		}
	}

	public void save() throws FHIRResourceHandlingException {
		if (structure != null) {
			if (isNew) {
				this.repo.createContent(structure);
			} else {
				this.repo.updateContent(structure);
			}
		}
	}

	public void setOld() {
		isNew = false;
	}

	protected abstract void fromJson(JsonNode node);

	protected abstract String getStructureDefinitionId();

}
