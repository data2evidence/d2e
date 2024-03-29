package com.legacy.health.fhir.meta.sql.util;

import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.sql.SQLExecutor;
import com.legacy.health.fhir.meta.sql.catalog.CatalogFHIRResourceRepository;
import com.legacy.health.fhir.meta.sql.queryengine.SQLUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;
import java.util.Properties;

public class CHPAccessHelper {

    SQLExecutor exec = null;
    String chp_schema;
    private static Logger log = LoggerFactory.getLogger(CatalogFHIRResourceRepository.class);

    public CHPAccessHelper() {
        Map<String, String> monolithHana = new VCAPServices().getServiceCredentials("hana", "chp-hdi");
        Properties prop = new Properties();
        if (monolithHana.containsKey("url")) {
            prop.setProperty("datasource.url", monolithHana.get("url"));
        } else {
            log.error("No valid binding to CHP Monolith found, url missing");
            return;
        }
        if (monolithHana.containsKey("user")) {
            prop.setProperty("datasource.username", monolithHana.get("user"));
        } else {
            log.error("No valid binding to CHP Monolith found, username missing");
            return;
        }
        if (monolithHana.containsKey("password")) {
            prop.setProperty("datasource.password", monolithHana.get("password"));
        } else {
            log.error("No valid binding to CHP Monolith found, password missing");
            return;
        }
        if (monolithHana.containsKey("driver")) {
            prop.setProperty("datasource.driver", monolithHana.get("driver"));
        } else {
            log.error("No valid binding to CHP Monolith found, driver missing");
            return;
        }
        if (monolithHana.containsKey("schema")) {
            chp_schema = monolithHana.get("schema");
        } else {
            log.error("No valid binding to CHP Monolith found, driver missing");
            return;
        }
        SQLExecutor sqlExecutor = new SQLExecutor();
        try {
            sqlExecutor.connect(prop);
        } catch (FhirException e) {
            log.error("Unable to connect to monolith", e);
            return;
        }
        exec = sqlExecutor;
    }

    public CHPAccessHelper grantConsumptionToUser(String user) throws FhirException {
        if (exec != null) {
            Connection con = exec.connect();
            try {
                try (CallableStatement cs = con.prepareCall("{call \"legacy.fhir.api::GrantAccess\"(?)}")) {
                    cs.setString(1, user);
                    cs.execute();
                }
            } catch (SQLException e) {
                throw new FhirException("Unable to grant CHP privileges", e);
            } finally {
                try {
                    exec.closeConnection();
                } catch (SQLException e) {
                    log.error(" Error while closing connection " + e.getLocalizedMessage(), e);
                }
            }
        } else {
            log.warn("No CHP-Binding available, cannot grant Consumption Views");
        }
        return this;

    }

    public CHPAccessHelper createSynonymForOtsViews(SQLExecutor executorofInstanceManagerschema)
            throws FhirException, SQLException {
        if (exec != null) {
            executorofInstanceManagerschema.executeDDL("CREATE SYNONYM \"legacy.ots::Views.ConceptTerms\" FOR "
                    + SQLUtils.ensureQuoting(SQLUtils.assertValidSQLIdentifier(chp_schema), '"')
                    + ".\"legacy.ots::Views.ConceptTerms\"", false);
            executorofInstanceManagerschema
                    .executeDDL("CREATE SYNONYM \"legacy.cdw.db.models::DWViews.AllowedOrgIDs\" FOR "
                            + SQLUtils.ensureQuoting(SQLUtils.assertValidSQLIdentifier(chp_schema), '"')
                            + ".\"legacy.cdw.db.models::DWViews.AllowedOrgIDs\"", false);
        } else {
            executorofInstanceManagerschema.executeDDL(
                    "CREATE COLUMN TABLE \"legacy.ots::Views.ConceptTerms\" (\"ConceptVocabularyID\" NVARCHAR(100) NOT NULL ,\n"
                            +
                            "\t \"ConceptCode\" NVARCHAR(100) NOT NULL ,\n" +
                            "\t \"ConceptTypeVocabularyID\" NVARCHAR(100),\n" +
                            "\t \"ConceptTypeCode\" NVARCHAR(100),\n" +
                            "\t \"TermContext\" NVARCHAR(100) NOT NULL ,\n" +
                            "\t \"TermLanguage\" NVARCHAR(2) NOT NULL ,\n" +
                            "\t \"TermText\" NVARCHAR(5000) NOT NULL ,\n" +
                            "\t \"TermType\" NVARCHAR(100),\n" +
                            "\t \"TermIsPreferred\" BOOLEAN CS_INT NOT NULL )",
                    false);
            executorofInstanceManagerschema.executeDDL(
                    "CREATE COLUMN TABLE \"legacy.cdw.db.models::DWViews.AllowedOrgIDs\" (\"AncestorOrgID\" NVARCHAR(100) NOT NULL ,\n"
                            +
                            "\t \"OrgID\" NVARCHAR(100) NOT NULL )",
                    false);
        }
        return this;
    }

}
