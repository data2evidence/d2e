package com.legacy.health.fhir.content;

//import static org.junit.Assert.*;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.Writer;

import org.junit.BeforeClass;
import org.junit.Test;

import com.legacy.health.fhir.meta.repsitory.FolderStructureDefinitionProvider;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.RepositoryBuilder;
import com.legacy.health.fhir.meta.repsitory.ZipSpecificationProvider;
//import com.legacy.health.fhir.meta.sql.SQLQueryEngineTest;

/**
 * This class is used also for generation from StructureDefinition to java
 * classes Default is write the generated code to sysout, when goal is to
 * actually generate code please set static variables 'generateCode' and
 * 'targetDirectory' accordingl
 * 
 * @author D042355
 *
 */
public class ClassGeneratorTest {

	static MetaRepository repo;
	static boolean generateCode = true;
	static String targetDirectory = System.getProperty("user.dir")
			+ "/src/main/java/com/legacy/health/fhir/content/model/";

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		ClassLoader classLoader = ClassGeneratorTest.class.getClassLoader();
		File zipfile = new File(classLoader.getResource("spec.zip").getFile());
		ZipSpecificationProvider provider = new ZipSpecificationProvider();
		provider.setZipFilePath(zipfile);
		String fileCtx = classLoader.getResource("content/content_capabilitystatement.json").getFile();
		File f = new File(fileCtx);
		String contentRoot = f.getParent();
		repo = RepositoryBuilder.createRepository(provider);
		FolderStructureDefinitionProvider sdprovider = new FolderStructureDefinitionProvider();
		sdprovider.setFolder(contentRoot);
		repo.addStructureDefinitionProvider(sdprovider);
	}

	@Test
	public void testScenarioDefinition() throws IOException {
		StructureDefinition2ClassGenerator gen = new StructureDefinition2ClassGenerator();
		gen.init();
		StringWriter writer = new StringWriter();
		gen.execute("templates/sd2class.vm", "content/ScenarioDefinition.json", writer, repo);
		System.out.println(writer.toString());
		writer.flush();
		writer.close();

		String resourceName = "ScenarioDefinition";
		generate(gen, resourceName);

	}

	@Test
	public void generateModel() throws IOException {
		StructureDefinition2ClassGenerator gen = new StructureDefinition2ClassGenerator();
		gen.init();
		generate(gen, "ScenarioDefinition");
		// Generator need some fixes for recursive types
		// generate(gen, "CatalogDefinition");
		generate(gen, "Scenario");
		generate(gen, "TableContent");
		generate(gen, "Permission");
		generate(gen, "Role");
	}

	private void generate(StructureDefinition2ClassGenerator gen, String resourceName) throws IOException {
		Writer writer = this.getWriter(targetDirectory + resourceName + ".java");
		gen.execute("templates/sd2class.vm", "content/" + resourceName + ".json", writer, repo);
		writer.flush();
		writer.close();
	}

	private Writer getWriter(String fileName) throws IOException {
		if (generateCode) {
			return new FileWriter(fileName);
		} else {
			PrintWriter writer = new PrintWriter(System.out);
			writer.println("Would Generate into file:" + fileName + "\n\n");
			return writer;
		}
	}

	@Test
	public void testCatalogDefinition() throws IOException {
		StructureDefinition2ClassGenerator gen = new StructureDefinition2ClassGenerator();
		gen.init();
		StringWriter writer = new StringWriter();
		gen.execute("templates/sd2class.vm", "content/CatalogDefinition.json", writer, repo);
		System.out.println(writer.toString());
		writer.flush();
		writer.close();
	}

}
