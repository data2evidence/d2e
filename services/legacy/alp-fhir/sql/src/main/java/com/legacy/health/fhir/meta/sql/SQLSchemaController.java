package com.legacy.health.fhir.meta.sql;

import java.util.List;

import com.legacy.health.fhir.meta.entity.DataElementStructureLink;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.sql.queryengine.SQLStructureMap;

public interface SQLSchemaController {

	List<Table> getTablesForStructureDefinition(StructureDefinition sd);

	void ensureStructureDefinition(StructureDefinition definition);

	Table getTableForDataElement(DataElementStructureLink link) throws ExTableNotFoundException;

	SQLProviderFactory getProviderFactory();

	SQLStructureMap createSQLStructureMapInstance();
}
