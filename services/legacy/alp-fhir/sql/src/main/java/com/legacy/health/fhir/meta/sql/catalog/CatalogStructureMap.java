package com.legacy.health.fhir.meta.sql.catalog;

import java.util.List;

import com.legacy.health.fhir.content.model.CatalogDefinition;
import com.legacy.health.fhir.meta.entity.DataElementStructureLink;
import com.legacy.health.fhir.meta.sql.queryengine.SQLStructureMap;

public class CatalogStructureMap extends SQLStructureMap {
	List<CatalogDefinition> definitions;

	public void setDefinitions(List<CatalogDefinition> definitions) {
		this.definitions = definitions;
	}

	protected String getTableContextKey(DataElementStructureLink link) {
		for (CatalogDefinition mappingDefinition : definitions) {
			CatalogDefinition.Mapping mapping = CatalogDefinitionModelBrowser.getMappingForPath(mappingDefinition,
					link.getPath());
			if (mapping != null) {
				String scope = link.getScope() != null ? link.getScope() + "_" : "";
				String id = mapping.getTableid();
				return scope + id;
			}
		}
		return null;
	}

}
