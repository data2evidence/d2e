package com.legacy.health.fhir.meta.entity;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class StructureDefinition implements MetaData {

	private Log log = LogFactory.getLog(StructureDefinition.class);

	private String id;
	private String url;
	private String version;
	private List<DataElement> elements;
	private HashMap<String, DataElement> namedElements = new HashMap<>();
	private HashMap<String, DataElement> aliasElements = new HashMap<>();
	private String kind;
	private String type;

	private String baseDefinition;
	private List<String> profile = new ArrayList<String>();

	public StructureDefinition(String id) {
		this(id, new ArrayList<>());
	}

	public StructureDefinition(String id, List<DataElement> elements) {
		this.id = id;
		this.elements = elements;
		for (int i = 0; i < elements.size(); i++) {
			elements.get(i).setOwner(this);
			if (elements.get(i).getShortName().contains(".")) {
				log.trace("check");
			}
			namedElements.put(elements.get(i).getShortName(), elements.get(i));
			for (int a = 0; a < elements.get(i).getAliases().size(); a++) {
				aliasElements.put(elements.get(i).getAliases().get(a), elements.get(i));
			}
		}
	}

	public void addDataElement(DataElement element) {
		this.elements.add(element);
		element.setOwner(this);
		if (element.getShortName().contains(".")) {
			System.out.println(element.getId() + ":" + element.getShortName());
		}
		namedElements.put(element.getShortName(), element);
		for (int a = 0; a < element.getAliases().size(); a++) {
			aliasElements.put(element.getAliases().get(a), element);
		}
	}

	public DataElement getDataElement(String id) {
		for (Iterator<DataElement> iterator = elements.iterator(); iterator.hasNext();) {
			DataElement dataElement = iterator.next();
			if (dataElement.getId().equals(id))
				return dataElement;
		}
		return null;
	}

	public DataElement getDataElementByName(String name) {
		return namedElements.get(name);
	}

	public DataElement getDataElementByAlias(String name) {
		return aliasElements.get(name);
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getId() {
		return this.id;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getUrl() {
		return this.url;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public List<DataElement> getDataElements() {
		return elements;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
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
		StructureDefinition other = (StructureDefinition) obj;
		if (id == null) {
			return other.id == null;
		} else
			return id.equals(other.id);
	}

	@Override
	public String toString() {
		if (id != null) {
			return id;
		} else {
			return "NULL";
		}
	}

	public String getKind() {
		return kind;
	}

	public void setKind(String kind) {
		this.kind = kind;
	}

	public String getBaseDefinition() {
		return baseDefinition;
	}

	public void setBaseDefinition(String baseDefinition) {
		this.baseDefinition = baseDefinition;
	}

	public void addProfile(String profile) {
		this.profile.add(profile);
	}

	public List<String> getProfiles() {
		return Collections.unmodifiableList(profile);
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

}
