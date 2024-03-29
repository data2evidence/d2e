package com.legacy.health.fhir.meta.sql;

import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.RequestContext;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;

import java.sql.Connection;
import java.util.List;
import java.util.Properties;

public interface RelationSchemaController extends SQLSchemaController {

    static RelationSchemaController createRelationSchemaController(String schema, String driver) {
        return new SchemaControllerImpl(schema, driver);
        // return new TableSetControllerImpl(schema);
    }

    void initializeDatabase(Connection con) throws FhirException;

    // TO-DO - decide on this function ( there are other overloaded methods too )
    void initializeDatabaseForProfile(Connection con, RequestContext reqCtx) throws FhirException;

    MetaRepository getMetaRepository();

    void setMetaRepository(MetaRepository repo);

    String getSchema();

    void setSchema(String schema);

    void initializeDatabase(Properties properties) throws FhirException;

    SQLProviderFactory getProviderFactory();

    Table getResourceTable();

    Table getValueSetExpansionTable();

    Table getMartTable();

    Table getReferenceTable();

    boolean createSchema(StructureDefinition definition);

    boolean hasDefinition(String definition);

    void setSQLProviderFactory(SQLProviderFactory factory);

    String getDDL(Table table);

    List<Table> getTables();

}
