package legacy.health.genomics.vcf.parser.datamodel;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.ObjectMapper;
import legacy.health.genomics.vcf.parser.capability.ImportConfiguration;
import legacy.health.genomics.vcf.parser.capability.ImportConfigurationDeserializer;

import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

class ImportConfigurationDeserializerTest {

    private ObjectMapper mapper;
    private ImportConfigurationDeserializer deserializer;

    @BeforeEach
    public void setup() {
        mapper = new ObjectMapper();
        deserializer = new ImportConfigurationDeserializer();
    }

    ImportConfiguration deserialize(String json) throws IOException {
        InputStream stream = new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8));
        JsonParser parser = mapper.getFactory().createParser(stream);
        DeserializationContext ctxt = mapper.getDeserializationContext();
        return deserializer.deserialize(parser, ctxt);
    }


    @Test
    void testValidJsonWithoutTechnicalConfiguration() throws IOException {
        String exampleJson = "{\n" +
                "\t\"dwid\": 231423,\n" +
                "\t\"hana_host\": \"localhost:30015\",\n" +
                "\t\"hana_user\": \"SYSTEM\",\n" +
                "\t\"hana_password\": \"Toor1234\",\n" +
                "\t\"hana_dt_user\": \"SYSTEM\",\n" +
                "\t\"hana_dt_password\": \"Toor1234\",\n" +
                "\t\"hana_schema\": \"SYSTEM\",\n" +
                "\t\"import_mapping\": {\n" +
                "\t\t\"filter_by\": [\"PASS\"],\n" +
                "\t\t\"import_attributes\": [{\n" +
                "\t\t\t\t\"type\": \"INFO\",\n" +
                "\t\t\t\t\"attributes\": [{\n" +
                "\t\t\t\t\t\"name\": \"AA\",\n" +
                "\t\t\t\t\t\"alias\": \"AA\"\n" +
                "\t\t\t\t}, {\n" +
                "\t\t\t\t\t\"name\": \"NS\",\n" +
                "\t\t\t\t\t\"alias\": \"NS\"\n" +
                "\t\t\t\t}, {\n" +
                "\t\t\t\t\t\"name\": \"DB\",\n" +
                "\t\t\t\t\t\"alias\": \"DB\"\n" +
                "\t\t\t\t}]\n" +
                "\t\t\t},\n" +
                "\t\t\t{\n" +
                "\t\t\t\t\"type\": \"FORMAT\",\n" +
                "\t\t\t\t\"attributes\": [{\n" +
                "\t\t\t\t\t\"name\": \"GT\",\n" +
                "\t\t\t\t\t\"alias\": \"GT\"\n" +
                "\t\t\t\t}]\n" +
                "\t\t\t}\n" +
                "\t\t],\n" +
                "\t\t\"sample_mapping\": [{\n" +
                "\t\t\t\"source_id\": 1,\n" +
                "\t\t\t\"target_id\": 2\n" +
                "\t\t}, {\n" +
                "\t\t\t\"source_id\": 2,\n" +
                "\t\t\t\"target_id\": 3\n" +
                "\t\t}]\n" +
                "\t}\n" +
                "}";
        ImportConfiguration config = deserialize(exampleJson);
        assertEquals(config.getDwid(),231423);
        assertEquals(config.getBatchSize(),ImportConfiguration.getDefaultBatchSize());
        assertEquals(config.getParallelCount(),ImportConfiguration.getDefaultParallelCount());
        assertEquals(config.getHost(),"localhost:30015");
        assertEquals(config.getPassword(),"Toor1234");
        assertEquals(config.getUser()  ,"SYSTEM");
        assertEquals(config.getAttrFilter(),new HashMap<String, Set<Pair<String,String>>>() {
            {
                put("info", new HashSet<Pair<String,String>> (Arrays.asList(new ImmutablePair<>("AA","AA"),
                        new ImmutablePair<>("NS","NS"),
                        new ImmutablePair<>("DB","DB"))));
                put("format", new HashSet<>(Arrays.asList(new ImmutablePair<>("GT","GT"))));
            }
        });
        assertEquals(config.getFilterExpr(), Collections.singletonList("PASS"));
        assertEquals(config.getSampleMapping(),new HashMap<Integer, Integer>() {
            {
                put(1,2);
                put(2,3);
            }
        });
    }


    @Test
    void testMissingMappingConfiguration () throws IOException {
        String exampleJson = "{\n" +
                "\t\"dwid\": 231423,\n" +
                "\t\"hana_host\": \"localhost:30015\",\n" +
                "\t\"hana_user\": \"SYSTEM\",\n" +
                "\t\"hana_password\": \"Toor1234\",\n" +
                "\t\"hana_dt_user\": \"SYSTEM\",\n" +
                "\t\"hana_dt_password\": \"Toor1234\",\n" +
                "\t\"hana_schema\": \"SYSTEM\"\n" +
                "}";
        Exception e = assertThrows(IOException.class,
                () -> deserialize(exampleJson));
        assertTrue(e.getMessage().contains("import_mapping"));
    }

    @Test
    void testValidJsonWithTechnicalConfiguration() throws IOException {
        String exampleJson = "{\n" +
                "\t\"dwid\": 231423,\n" +
                "\t\"hana_host\": \"localhost:30015\",\n" +
                "\t\"hana_user\": \"SYSTEM\",\n" +
                "\t\"hana_password\": \"Toor1234\",\n"+
                "\t\"hana_dt_user\": \"SYSTEM\",\n" +
                "\t\"hana_dt_password\": \"Toor1234\",\n" +
                "\t\"hana_schema\": \"SYSTEM\",\n" +
                "\t\"technical_config\": {\n" +
                "\t\t\"batchsize\": 5,\n" +
                "\t\t\"parallelCount\": 5\n" +
                "\t},\n" +
                "\t\"import_mapping\": {\n" +
                "\t\t\"filter_by\": [\"PASS\"],\n" +
                "\t\t\"import_attributes\": [{\n" +
                "\t\t\t\t\"type\": \"INFO\",\n" +
                "\t\t\t\t\"attributes\": [{\n" +
                "\t\t\t\t\t\"name\": \"AA\",\n" +
                "\t\t\t\t\t\"alias\": \"AA\"\n" +
                "\t\t\t\t}, {\n" +
                "\t\t\t\t\t\"name\": \"NS\",\n" +
                "\t\t\t\t\t\"alias\": \"NS\"\n" +
                "\t\t\t\t}, {\n" +
                "\t\t\t\t\t\"name\": \"DB\",\n" +
                "\t\t\t\t\t\"alias\": \"DB1\"\n" +
                "\t\t\t\t}]\n" +
                "\t\t\t},\n" +
                "\t\t\t{\n" +
                "\t\t\t\t\"type\": \"FORMAT\",\n" +
                "\t\t\t\t\"attributes\": [{\n" +
                "\t\t\t\t\t\"name\": \"GT\",\n" +
                "\t\t\t\t\t\"alias\": \"GT\"\n" +
                "\t\t\t\t}]\n" +
                "\t\t\t}\n" +
                "\t\t],\n" +
                "\t\t\"sample_mapping\": [{\n" +
                "\t\t\t\"source_id\": 1,\n" +
                "\t\t\t\"target_id\": 2\n" +
                "\t\t}, {\n" +
                "\t\t\t\"source_id\": 2,\n" +
                "\t\t\t\"target_id\": 3\n" +
                "\t\t}]\n" +
                "\t}\n" +
                "}";
        ImportConfiguration config = deserialize(exampleJson);
        assertEquals(config.getDwid(),231423);
        assertEquals(config.getBatchSize(),5);
        assertEquals(config.getParallelCount(),5);
        assertEquals(config.getHost(),"localhost:30015");
        assertEquals(config.getPassword(),"Toor1234");
        assertEquals(config.getUser()  ,"SYSTEM");
        assertEquals(config.getAttrFilter(),new HashMap<String, Set<Pair<String,String>>>() {
            {
                put("info", new HashSet<>(Arrays.asList(new ImmutablePair<>("AA","AA"),
                        new ImmutablePair<>("NS","NS"),
                        new ImmutablePair<>("DB","DB1"))));
                put("format", new HashSet<>(Arrays.asList(new ImmutablePair<>("GT","GT"))));
            }
        });
        assertEquals(config.getFilterExpr(), Collections.singletonList("PASS"));
        assertEquals(config.getSampleMapping(),new HashMap<Integer, Integer>() {
            {
                put(1,2);
                put(2,3);
            }
        });
    }
}
