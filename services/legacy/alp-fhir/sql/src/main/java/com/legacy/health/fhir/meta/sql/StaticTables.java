package com.legacy.health.fhir.meta.sql;

import com.legacy.health.fhir.meta.FhirRuntimeException;
import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.DataElementStructureLink;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.repsitory.RepositoryBuilder;

public class StaticTables {

    protected static String getValueSetExpansionDDL(RelationSchemaController controller) {
        StructureDefinition sd = controller.getMetaRepository().getStructureDefinitionById("ValueSet");
        DataElementStructureLink vsLink = DataElementStructureLink.getDataElementStructureLinkByPath(sd, "ValueSet.id");
        DataElementStructureLink includeLink = DataElementStructureLink.getDataElementStructureLinkByPath(sd,
                "ValueSet.compose.include");
        DataElementStructureLink conceptLink = DataElementStructureLink.getDataElementStructureLinkByPath(sd,
                "ValueSet.compose.include.concept");

        try {
            Table vsTable = controller.getTableForDataElement(vsLink);
            Table includeTable = controller.getTableForDataElement(includeLink);
            Table conceptTable = controller.getTableForDataElement(conceptLink);
            String ret = "";
            ret += "CREATE VIEW " + '"' + controller.getSchema() + '"' + "." + '"' + "FHIR_VALUESET_EXPANSION"
                    + '"' + " AS \n";
            ret += "select vs.\"ID\",vci.\"SYSTEM\",vcc.\"CODE\" FROM " + vsTable.getFullTableName() + " vs \n";
            ret += "JOIN " + includeTable.getFullTableName() + " vci on vs.\"ID\" = vci.\"PARENT_ID\" \n";
            ret += "JOIN " + conceptTable.getFullTableName() + " vcc on  vs.\"ID\" = vcc.\"PARENT_ID\"  \n";
            ret += "and vcc.\"REFERENCE_PATH\" LIKE vci.\"REFERENCE_PATH\"||'%' \n";
            return ret;
        } catch (ExTableNotFoundException e) {
            throw new FhirRuntimeException("Inconsistent Metadata", e);
        }
    }

    protected static Table getResourceTable(SQLProviderFactory factory, String schema) {
        Table t = factory.createTable();
        t.schema = '"' + schema + '"';
        t.name = "\"FHIR_RESOURCE_TABLE\"";
        Column idColumn = new Column("\"ID\"", "VARCHAR(100)");
        t.addColumn(idColumn);
        t.setStructureLinkColumn(idColumn);
        t.addColumn(new Column("\"TYPE\"", "VARCHAR(100)"));
        t.addColumn(new Column("\"CANONICAL_ID\"", "VARCHAR(255)"));
        // t.addColumn(new
        // Column("\"RESOURCE\"",factory.createSQLTypeMapper().getDefaultType()));
        t.addColumn(new Column("\"RESOURCE_COMPRESSED\"", factory.createSQLTypeMapper().getBlobType()));
        t.addColumn(new Column("\"VID\"", "VARCHAR(100)"));
        t.addColumn(new Column("\"IS_DELETED\"", "BOOLEAN"));
        t.addColumn(new Column("\"VALID_FROM\"", "TIMESTAMP"));
        t.addColumn(new Column("\"VALID_TO\"", "TIMESTAMP"));
        return t;
    }

    protected static Table getMartTable(SQLProviderFactory factory, String schema) {

        Table t = factory.createTable();
        t.schema = '"' + schema + '"';
        t.name = "\"FHIR_MART_TABLE\"";
        t.addColumn(new Column("\"ID\"", "VARCHAR(100)"));
        t.addColumn(new Column("\"SCHEMA\"", "VARCHAR(100)"));
        t.addColumn(new Column("\"RESOURCE_COMPRESSED\"", factory.createSQLTypeMapper().getBlobType()));

        return t;
    }

    protected static String buildColumnName(String dataElementName, String rootName) {
        if (dataElementName.startsWith(rootName)) {
            int l = rootName.length();
            return '"' + dataElementName.substring(l + 1).toUpperCase() + '"';
        }
        String[] seg = dataElementName.split("\\.");
        return '"' + seg[seg.length - 1].toUpperCase() + '"';
    }

    protected static Table getReferenceTable(SQLProviderFactory factory, String schema) {
        StructureDefinition reference = RepositoryBuilder.getInstance().getStructureDefinitionById("Reference");
        Table t = factory.createTable();
        t.schema = '"' + schema + '"';
        t.name = "\"FHIR_REFERENCE_TABLE\"";
        Column idColumn = new Column("\"PARENT_ID\"", "VARCHAR(100)");
        t.addColumn(idColumn);
        t.setStructureLinkColumn(idColumn);
        t.addColumn(new Column("\"CANONICAL_ID\"", "VARCHAR(255)"));
        t.addColumn(new Column("\"DATAELEMENT_ID\"", "VARCHAR(100)"));
        t.addColumn(new Column("\"REFERENCE_PATH\"", "VARCHAR(100)"));
        t.addColumn(new Column("\"LOGICAL_PATH\"", "VARCHAR(100)"));
        t.addColumn(new Column("\"ID\"", "VARCHAR(500)"));
        t.addColumn(new Column("\"REFERENCE\"", "VARCHAR(100)"));
        t.addColumn(new Column("\"DISPLAY\"", "VARCHAR(100)"));
        t.addColumn(new Column("\"FROM_TYPE\"", "VARCHAR(100)"));
        t.addColumn(new Column("\"TO_TYPE\"", "VARCHAR(100)"));
        CategorizedElement categorizedElements = CategorizedElement.getCategorizedElements(reference);
        for (DataElement e : categorizedElements.singleCardNonComplexElements) {

            String columnName = buildColumnName(e.getId(), reference.getId());
            Column c = t.getColumnByName(columnName);
            if (c.getDataElement() == null) {
                c.setDataElement(e);
            }
        }
        return t;
    }

    protected static Table getValueSetExpansionTable(SQLProviderFactory factory, String schema) {
        Table t = factory.createTable();
        t.schema = '"' + schema + '"';
        t.name = "\"FHIR_VALUESET_EXPANSION\"";
        Column idColumn = new Column("\"ID\"", "VARCHAR(100)");
        t.addColumn(idColumn);
        t.setStructureLinkColumn(idColumn);
        t.addColumn(new Column("\"SYSTEM\"", "VARCHAR(500)"));
        t.addColumn(new Column("\"CODE\"", "VARCHAR(500)"));
        return t;
    }

}
