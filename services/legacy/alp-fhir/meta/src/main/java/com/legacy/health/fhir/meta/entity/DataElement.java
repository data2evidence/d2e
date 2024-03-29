package com.legacy.health.fhir.meta.entity;

import java.util.ArrayList;
import java.util.List;

public class DataElement implements MetaData {
	String id;
	DataType type;
	StructureDefinition owner;
	int min = 0, max = 1;
	ArrayList<String> targetProfiles = new ArrayList<>();
	List<String> representation;
	List<String> aliases = new ArrayList<>();
	boolean group = false;

	public DataElement() {

	}

	public DataElement(String id, DataType type, int min, int max) {
		this(id, type, min, max, false);
	}

	public DataElement(String id, DataType type, int min, int max, boolean isGroup) {
		this();
		this.id = id;
		this.type = type;
		this.min = min;
		this.max = max;
		this.group = isGroup;
	}

	/**
	 * For cases where the field is defined like birthDate[x], this method returns
	 * true.
	 * This is important in the min handling. In FHIR there might be a field defined
	 * as min=1, meaning it is mandatory.
	 * The structure definition on the other hand has two fields. Then min=1 means
	 * one of the two has to have a value but not both.
	 * 
	 * @return true if it is a ....[x] field
	 */
	public boolean isGroup() {
		return group;
	}

	public void setGroup(boolean group) {
		this.group = group;
	}

	public void addTargetProfile(String uri) {
		this.targetProfiles.add(uri);
	}

	public List<String> getTargetProfiles() {
		return this.targetProfiles;
	}

	public void addAlias(String alias) {
		this.aliases.add(alias.toLowerCase());
	}

	public void setAliasesList(List<String> aliases) {
		this.aliases = aliases;
	}

	public List<String> getAliases() {
		return this.aliases;
	}

	public String getId() {
		return this.id;
	}

	public String getShortName() {
		int pos = this.id.lastIndexOf('.');
		if (pos > -1) {
			return this.id.substring(pos + 1);
		} else {
			return id;
		}
	}

	public DataType getType() {
		return type;
	}

	public void setType(DataType type) {
		this.type = type;
	}

	public int getMin() {
		return min;
	}

	public void setMin(int min) {
		this.min = min;
	}

	public int getMax() {
		return max;
	}

	public void setMax(int max) {
		this.max = max;
	}

	public void setId(String id) {
		this.id = id;
	}

	public void setOwner(StructureDefinition owner) {
		this.owner = owner;
	}

	public StructureDefinition getOwner() {
		return owner;
	}

	public void setRepresentation(List<String> representation) {
		this.representation = representation;
	}

	public boolean hasRepresentation(String representationType) {
		return this.representation != null && this.representation.contains(representationType);
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((owner == null) ? 0 : owner.hashCode());
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
		DataElement other = (DataElement) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (owner == null) {
			return other.owner == null;
		} else
			return owner.equals(other.owner);
	}

	@Override
	public String toString() {
		if (id != null) {
			return id;
		} else {
			return "NULL";
		}
	}

}
