package com.legacy.health.fhir.meta.entity;

import com.legacy.health.fhir.meta.utils.PathBuilder;

/**
 * This class links StructureDefinition with DataElements,
 * Based on this DataElements can be related within a context of a
 * StructureDefinition, even when it is a deep
 * navigation
 * 
 * @author D042355
 *
 */
public class DataElementStructureLink implements ScopeProvider {

	protected StructureDefinition definition;
	protected DataElement element;
	protected String path;
	protected String scope;
	protected ScopeContext scopeContext;
	protected String label;

	public static DataElementStructureLink getDataElementStructureLinkByPath(StructureDefinition definition,
			PathBuilder path) {
		return getDataElementStructureLinkByPath(definition, path.getPath());
	}

	public static DataElementStructureLink getDataElementStructureLinkByPath(StructureDefinition definition,
			String path) {
		String[] segments = path.split("\\.");
		DataElement currentElement = null;
		// Type must match
		if (definition == null) {
			throw new RuntimeException("Definition must not be null:" + path);
		}
		if (!definition.getId().equals(segments[0]))
			return null;
		StructureDefinition current = definition;
		for (int i = 1; i < segments.length; i++) {
			String segment = segments[i];
			currentElement = current.getDataElementByName(segment);
			if (currentElement == null) {
				return null;
			}
			if (currentElement.getType().isComplex()) {
				current = currentElement.getType();
			} else {
				if (i < segments.length - 1) {
					if ("extension".equals(segments[i + 1])) {// deal with extension on primitive type
						current = currentElement.getType();
						currentElement = current.getDataElementByName("extension");
						System.out.println("Found primitive extension");
					} else {
						return null;
					}
				}
			}
		}
		DataElementStructureLink ret = new DataElementStructureLink();
		ret.setDataELement(currentElement);
		ret.setStructureDefinition(definition);
		ret.setPath(path);
		return ret;
	}

	public void setStructureDefinition(StructureDefinition definition) {
		this.definition = definition;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public String getLabel() {
		return this.label;
	}

	public StructureDefinition getStructureDefinition() {
		return definition;
	}

	public void setScope(String scope) {
		this.scope = scope;
	}

	public String getScope() {
		return scope;
	}

	public void setScopeContext(ScopeContext scopeContext) {
		this.scopeContext = scopeContext;
	}

	public ScopeContext getScopeContext() {
		return this.scopeContext;
	}

	public void setDataELement(DataElement element) {
		this.element = element;
	}

	public DataElement getDataElement() {
		return element;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getPath() {
		return path;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (!(o instanceof DataElementStructureLink))
			return false;

		DataElementStructureLink that = (DataElementStructureLink) o;

		if (definition != null ? !definition.equals(that.definition) : that.definition != null)
			return false;
		if (element != null ? !element.equals(that.element) : that.element != null)
			return false;
		if (getPath() != null ? !getPath().equals(that.getPath()) : that.getPath() != null)
			return false;
		if (getScope() != null ? !getScope().equals(that.getScope()) : that.getScope() != null)
			return false;
		return getLabel() != null ? getLabel().equals(that.getLabel()) : that.getLabel() == null;
	}

	@Override
	public int hashCode() {
		int result = definition != null ? definition.hashCode() : 0;
		result = 31 * result + (element != null ? element.hashCode() : 0);
		result = 31 * result + (getPath() != null ? getPath().hashCode() : 0);
		result = 31 * result + (getScope() != null ? getScope().hashCode() : 0);
		result = 31 * result + (getLabel() != null ? getLabel().hashCode() : 0);
		return result;
	}

	@Override
	public String getLogicalId() {
		return definition.getId();
	}

}
