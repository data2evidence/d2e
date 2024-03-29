package com.legacy.health.fhir.meta.postgresql;

import com.legacy.health.fhir.meta.sql.SQLProviderFactory;
import com.legacy.health.fhir.meta.sql.SQLTypeMapper;

public class PostgreSQLProviderFactory extends SQLProviderFactory {
    public static final String DB_TYPE = "POSTGRES";

    @Override
    public boolean supportDBType(String type) {
        return type.equals(DB_TYPE);
    }

    @Override
    public SQLTypeMapper createSQLTypeMapper() {
        return new PostgreSQLTypeMapper();
    }

}
