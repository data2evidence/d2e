package com.legacy.health.fhir.meta.sql.catalog;

import com.legacy.health.fhir.content.model.Role;
import com.legacy.health.fhir.content.model.Scenario;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.sql.queryengine.SQLUtils;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

public class RoleCreator {

    public static Role getDefaultSupportRole() {
        Role ret = new Role();
        ret.setId("SUPPORT_ROLE");
        ret.setSchemaPrivileges(Collections.singletonList("SELECT"));
        ret.setResolved();
        ret.setVersion("0");
        return ret;
    }

    public static Role getSuperSupportRole() {
        Role ret = new Role();
        ret.setId("SUPER_SUPPORT_ROLE");
        ret.setSchemaPrivileges(Collections.singletonList("ALL PRIVILEGES"));
        ret.setResolved();
        ret.setVersion("0");
        return ret;
    }

    public static List<String> createGrantStatementsDDLs(String user, String schema, Role r)
            throws FhirException {
        return createGrantsGeneric(user, schema, r, false);
    }

    public static List<String> createRevokeStatementsDDLs(String user, String schema, Role r)
            throws FhirException {
        return createGrantsGeneric(user, schema, r, true);
    }

    public static List<String> createDDLs(String schema, Scenario scenario, Role r)
            throws FhirException {
        String version = r.getVersion();
        version = version != null ? version : scenario.getDefinition().getVersion();
        version = version != null ? version : scenario.getVersion();
        String namePrefix = scenario.getId();
        return createRoleGeneric(schema, r, version, namePrefix);
    }

    public static List<String> createGrantsGeneric(String user, String schema, Role r, boolean revoke)
            throws FhirException {
        List<String> ddls = new LinkedList<>();
        for (Role.ObjectPrivileges oP : r.getObjectPrivileges()) {
            for (Role.Grants g : oP.getGrants()) {
                ddls.add((revoke ? "REVOKE " : "GRANT ") + SQLUtils.assertValidSQLIdentifier(g.getType()) + " ON "
                        + SQLUtils.ensureQuoting(SQLUtils.assertValidSQLIdentifier(oP.getObjectName()), '"')
                        + (revoke ? " FROM " : " TO ")
                        + SQLUtils.ensureQuoting(SQLUtils.assertValidSQLIdentifier(user), '"')
                        + ((g.getGrant() && !revoke) ? " WITH GRANT OPTION" : ""));
            }
        }
        for (String s : r.getSchemaPrivileges()) {
            ddls.add((revoke ? "REVOKE " : "GRANT ") + SQLUtils.assertValidSQLIdentifier(s) + " ON SCHEMA " + schema +
                    (revoke ? " FROM " : " TO ")
                    + SQLUtils.ensureQuoting(SQLUtils.assertValidSQLIdentifier(user), '"'));
        }
        return ddls;
    }

    public static List<String> createRoleGeneric(String schema, Role r, String version, String namePrefix)
            throws FhirException {
        List<String> ddls = new LinkedList<>();
        if (version != null) {
            version = "_" + SQLUtils.assertValidSQLIdentifier(version);
        } else {
            version = "_" + SQLUtils.assertValidSQLIdentifier("0");
        }
        String roleName = schema + "."
                + SQLUtils.ensureQuoting("FHIR_" + SQLUtils.assertValidSQLIdentifier(namePrefix) + "_" + version
                        + "_" + SQLUtils.assertValidSQLIdentifier(r.getId()), '"');
        ddls.add("CREATE ROLE " + roleName);

        for (Role.ObjectPrivileges oP : r.getObjectPrivileges()) {
            for (Role.Grants g : oP.getGrants()) {
                ddls.add("GRANT " + SQLUtils.assertValidSQLIdentifier(g.getType()) + " ON "
                        + SQLUtils.ensureQuoting(SQLUtils.assertValidSQLIdentifier(oP.getObjectName()), '"') + " TO "
                        + roleName + (g.getGrant() ? " WITH GRANT OPTION" : ""));
            }
        }
        for (String s : r.getSchemaPrivileges()) {
            ddls.add("GRANT " + SQLUtils.assertValidSQLIdentifier(s) + " ON SCHEMA " + schema + " TO " + roleName);
        }
        return ddls;
    }
}
