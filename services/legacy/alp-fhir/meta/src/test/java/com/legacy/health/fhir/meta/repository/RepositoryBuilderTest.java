package com.legacy.health.fhir.meta.repository;

import static org.junit.Assert.assertNotNull;

import java.io.File;

import org.junit.Before;
import org.junit.Test;

import com.legacy.health.fhir.meta.entity.StructureDefinition;

import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.RepositoryBuilder;
import com.legacy.health.fhir.meta.repsitory.ZipNHSSpecificationProvider;
import com.legacy.health.fhir.meta.repsitory.ZipSpecificationProvider;

public class RepositoryBuilderTest {

	@Before
	public void setUp() {
	}

	@Test
	public void test() throws Exception {

		File file = new File(this.getClass().getClassLoader().getResource("spec.zip").getFile());
		ZipSpecificationProvider provider = new ZipSpecificationProvider();
		provider.setZipFilePath(file);
		MetaRepository repo = RepositoryBuilder.createRepository(provider);
		StructureDefinition sd1 = repo.getStructureDefinitionById("Patient");
		assertNotNull(sd1);

		DataElement extension = repo.getElementById("Extension");
		System.out.println("Repo contains " + repo.getAllStructureDefinitions().size() + " resources");
	}

	// @Test
	public void testNHS() throws Exception {

		File file = new File(this.getClass().getClassLoader().getResource("specNHS.zip").getFile());
		ZipNHSSpecificationProvider provider = new ZipNHSSpecificationProvider();
		provider.setZipFilePath(file);
		MetaRepository repo = RepositoryBuilder.createRepository(provider);

	}

}
