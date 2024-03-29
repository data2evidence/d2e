package com.legacy.health.fhir.meta.sql;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.RepositoryBuilder;
import com.legacy.health.fhir.meta.repsitory.ZipSpecificationProvider;
import org.junit.Test;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.sql.SQLException;
import java.util.Properties;
import java.util.Scanner;

public class TableSetTest {

    @Test
    public void registerTable() throws FhirException, SQLException, IOException {

        File zipFile = new File(SchemaControllerTest.class.getClassLoader().getResource("spec.zip").getFile());
        ZipSpecificationProvider provider = new ZipSpecificationProvider();
        provider.setZipFilePath(zipFile);
        MetaRepository repo = RepositoryBuilder.createRepository(provider);
        TableSet set = new TableSet('"' + "TEST_xxxxx_PARTIAL3" + '"', new SQLProviderFactory(),
                new RelationalCatalog());
        SQLExecutor sql = new SQLExecutor();
        Properties testProperties = new Properties();
        ClassLoader classLoader = SchemaControllerTest.class.getClassLoader();
        File file = new File(classLoader.getResource("test.properties").getFile());
        FileInputStream fis = new FileInputStream(file);
        testProperties.load(fis);

        sql.connect(testProperties);
        // set.generateTablesFor(repo.getStructureDefinitionById("Patient"));
        set.generateTablesFor(repo.getStructureDefinitionById("Dosage"));
        for (Table t : set.tableDefinitions) {
            System.out.println(t.getDDL());
            // sql.executeDDL(t.getDDL(),false);
        }

    }

    @Test
    public void registerTableByCap() throws FhirException, SQLException, IOException {

        File zipFile = new File(SchemaControllerTest.class.getClassLoader().getResource("spec.zip").getFile());
        ZipSpecificationProvider provider = new ZipSpecificationProvider();
        provider.setZipFilePath(zipFile);
        MetaRepository repo = RepositoryBuilder.createRepository(provider);
        TableSet set = new TableSet('"' + "TEST_xxxxx_PARTIAL4" + '"', new SQLProviderFactory(),
                new RelationalCatalog());
        SQLExecutor sql = new SQLExecutor();
        Properties testProperties = new Properties();
        ClassLoader classLoader = SchemaControllerTest.class.getClassLoader();
        File file = new File(classLoader.getResource("test.properties").getFile());
        File cap = new File(classLoader.getResource("cap.json").getFile());
        FileInputStream fis = new FileInputStream(file);
        testProperties.load(fis);

        sql.connect(testProperties);

        ObjectMapper mapper = new ObjectMapper();
        String content = new Scanner(cap).useDelimiter("\\Z").next();
        JsonNode actualObj = mapper.readTree(content).get("rest");
        for (JsonNode m1 : actualObj) {
            ObjectNode mode = (ObjectNode) m1;
            ArrayNode resource = (ArrayNode) mode.get("resource");
            for (JsonNode jsonNode : resource) {// loop over entries
                ObjectNode type = (ObjectNode) jsonNode;
                String name = type.get("type").asText();

                if (name.equals("CapabilityStatement"))
                    continue;// ValueSet is already created during
                StructureDefinition sd = repo.getStructureDefinitionById(name);

                set.generateTablesFor(sd);

            }
        }

        for (Table t : set.tableDefinitions) {
            System.out.println(t.getDDL());
            // sql.executeDDL(t.getDDL(),false);
        }

    }

}