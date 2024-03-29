package com.legacy.health.fhir.meta.sql.catalog;

import java.util.List;

import com.legacy.health.fhir.content.model.CatalogDefinition;
import com.legacy.health.fhir.content.model.Tabledefinition;
import com.legacy.health.fhir.meta.entity.DataElementStructureLink;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.sql.ExTableNotFoundException;
import com.legacy.health.fhir.meta.sql.SQLProviderFactory;
import com.legacy.health.fhir.meta.sql.SQLSchemaController;
import com.legacy.health.fhir.meta.sql.Table;
import com.legacy.health.fhir.meta.sql.queryengine.SQLStructureMap;

public class CatalogSchemaController implements SQLSchemaController {

	private List<CatalogDefinition> definitions;
	private SQLProviderFactory factory;

	protected CatalogSchemaController(List<CatalogDefinition> definitions) {
		this.definitions = definitions;
	}

	@Override
	public List<Table> getTablesForStructureDefinition(StructureDefinition sd) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void ensureStructureDefinition(StructureDefinition definition) {
		// TODO Auto-generated method stub

	}

	@Override
	public Table getTableForDataElement(DataElementStructureLink link) throws ExTableNotFoundException {

		String path = link.getPath();
		for (CatalogDefinition definition : definitions) {
			CatalogDefinition.Mapping mapping = CatalogDefinitionModelBrowser.getMappingForPath(definition, path);
			if (mapping != null) {
				Tabledefinition td = CatalogDefinitionModelBrowser.getTabledefinitionForMapping(definition,
						mapping.getTableid(), factory);
				return td.getTableModel();

			}
		}
		return null;
	}

	@Override
	public SQLProviderFactory getProviderFactory() {
		// TODO Auto-generated method stub
		return this.factory;
	}

	public void setSQLProviderFactory(SQLProviderFactory factory) {
		this.factory = factory;

	}

	@Override
	public SQLStructureMap createSQLStructureMapInstance() {
		CatalogStructureMap ret = new CatalogStructureMap();
		ret.setDefinitions(definitions);
		return ret;
	}

}
