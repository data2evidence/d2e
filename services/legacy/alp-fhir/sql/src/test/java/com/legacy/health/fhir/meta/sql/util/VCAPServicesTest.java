package com.legacy.health.fhir.meta.sql.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;

import java.io.IOException;
import java.util.Map;

import static org.junit.Assert.*;

public class VCAPServicesTest {

    @Test
    public void getServiceCredentials() throws IOException {
        Map map = new ObjectMapper().readValue(exampleVCAPs, Map.class);
        VCAPServices vcapServices = new VCAPServices();
        VCAPServices.vcapMap = map;

        Map<String, String> hana = vcapServices.getServiceCredentials("hana", "chp-hdi");
        assertEquals(hana.size(), 9);
        assertEquals(hana.get("hdi_password"), "password");
        assertEquals(hana.get("password"), "password1");
        assertEquals(hana.get("hdi_user"), "user1");
        assertEquals(hana.get("user"), "user2");
        assertEquals(hana.get("url"), "jdbc:sap//<hostname>:<port>/?currentschema=<schemaname>");
        assertEquals(hana.get("port"), "30013");
        assertEquals(hana.get("host"), "wdfl33779746a");

        hana = vcapServices.getServiceCredentials("hana", "chp-hdi2");
        assertEquals(hana.size(), 0);
    }

    private static String exampleVCAPs = "{\n" +
            "\t\"auditlog\": [{\n" +
            "\t\t\"name\": \"fhir_auditlog\",\n" +
            "\t\t\"label\": \"auditlog\",\n" +
            "\t\t\"tags\": [\"auditlog\", \"audit log\", \"xsa\"],\n" +
            "\t\t\"plan\": \"free\",\n" +
            "\t\t\"credentials\": {\n" +
            "\t\t\t\"password\": \"Ye9O7V-60WYW--EQFZBIBHB.UHRLDw0k31Mlv_Cm\",\n" +
            "\t\t\t\"user\": \"SBSS_9283806658069955549198936715787201102443180\",\n" +
            "\t\t\t\"url\": \"https://<hostname:port>\"\n" +
            "\t\t}\n" +
            "\t}],\n" +
            "\t\"xsuaa\": [{\n" +
            "\t\t\"name\": \"fhir_uaa_default\",\n" +
            "\t\t\"label\": \"xsuaa\",\n" +
            "\t\t\"tags\": [\"xsuaa\"],\n" +
            "\t\t\"plan\": \"space\",\n" +
            "\t\t\"credentials\": {\n" +
            "\t\t\t\"tenantmode\": \"dedicated\",\n" +
            "\t\t\t\"clientid\": \"sb-fhirserver!i1\",\n" +
            "\t\t\t\"verificationkey\": \"-----BEGIN PUBLIC KEY-----+xhSWpYeD5EJfjJBGinDk60gE1ozgkLoQN0KTW977bBFg2L7sjuTz62XFq8gYkpPqLSO/sauPk4x5zQfsxu2MHeOLdnLWRZWFbQ1dVNf65mT/zgTzMuwYZDLO/2LT58ptwHDPQp5EI2sDEP66WTRY1rsni+GZPtwCRTs3Q+Nwwlpx7Drlmg1I3/HC6h5wV2GJoJLOULCzFzs8InhrIzmxxhYjahw3JjAFVy4pnFHf3raIgRSVau/h7t7tXgw/kiXLwo45e2yEZfQ/zhrlhT8PRyQwmR+AtJIPuJ9zU1SeSR+wemyoFOwIDAQAB-----END PUBLIC KEY-----\",\n"
            +
            "\t\t\t\"xsappname\": \"fhirserver!i1\",\n" +
            "\t\t\t\"identityzone\": \"uaa\",\n" +
            "\t\t\t\"identityzoneid\": \"uaa\",\n" +
            "\t\t\t\"clientsecret\": \"x\",\n" +
            "\t\t\t\"url\": \"https://<hostname:port>/uaa-security\"\n" +
            "\t\t}\n" +
            "\t}],\n" +
            "\t\"hana\": [{\n" +
            "\t\t\"name\": \"chp-hdi\",\n" +
            "\t\t\"label\": \"hana\",\n" +
            "\t\t\"tags\": [\"hana\", \"database\", \"relational\"],\n" +
            "\t\t\"plan\": \"hdi-shared\",\n" +
            "\t\t\"credentials\": {\n" +
            "\t\t\t\"schema\": \"<schemaname>\",\n" +
            "\t\t\t\"hdi_password\": \"password\",\n" +
            "\t\t\t\"password\": \"password1\",\n" +
            "\t\t\t\"driver\": \"com.sap.db.jdbc.Driver\",\n" +
            "\t\t\t\"port\": \"30013\",\n" +
            "\t\t\t\"host\": \"wdfl33779746a\",\n" +
            "\t\t\t\"db_hosts\": [{\n" +
            "\t\t\t\t\"port\": 30013,\n" +
            "\t\t\t\t\"host\": \"wdfl33779746a\"\n" +
            "\t\t\t}],\n" +
            "\t\t\t\"hdi_user\": \"user1\",\n" +
            "\t\t\t\"user\": \"user2\",\n" +
            "\t\t\t\"url\": \"jdbc:sap//<hostname>:<port>/?currentschema=<schemaname>\"\n" +
            "\t\t}\n" +
            "\t}],\n" +
            "\t\"managed-hana\": [{\n" +
            "\t\t\"name\": \"fhir-instancemanager\",\n" +
            "\t\t\"label\": \"managed-hana\",\n" +
            "\t\t\"tags\": [\"managed-hana\", \"managed-database\", \"managed-relational\", \"xsa-instancemanager\"],\n"
            +
            "\t\t\"plan\": \"schema\",\n" +
            "\t\t\"credentials\": {\n" +
            "\t\t\t\"delete_managed_instance_url\": \"https://<hostname:port>/instance-manager/managed/managed_instances/4f38ac4a-0-a263-f060bab3f67e/{tenant_id}\",\n"
            +
            "\t\t\t\"password\": \"_J478qQYcczORCW4JOdcMeMSTFdW5rHA\",\n" +
            "\t\t\t\"post_managed_instance_url\": \"https://<hostname:port>/instance-manager/managed/managed_instances/4f38ac4a-fa8-a263-f060bab3f67e/{tenant_id}\",\n"
            +
            "\t\t\t\"get_all_managed_instances_url\": \"https://<hostname:port>/instance-manager/managed/managed_instances/4f38ac4a87-4830-a263-f060bab3f67e\",\n"
            +
            "\t\t\t\"user\": \"k_78VnAG3DB01fOIAsPqgG0tj\",\n" +
            "\t\t\t\"get_managed_instance_url\": \"https://<hostname:port>/instance-manager/managed/managed_instances/4f38ac44830-a263-f060bab3f67e/{tenant_id}\"\n"
            +
            "\t\t}\n" +
            "\t}]\n" +
            "}";
}