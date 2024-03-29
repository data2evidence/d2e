package com.legacy.health.fhir.meta.fluentpath;

import static org.junit.Assert.*;

import java.io.File;

import org.junit.Before;
import org.junit.Test;

import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.RepositoryBuilder;
import com.legacy.health.fhir.meta.repsitory.ZipSpecificationProvider;

public class NavigationTest {

	MetaRepository repo;

	@Before
	public void setUp() throws Exception {
		File zipfile = new File(this.getClass().getClassLoader().getResource("spec.zip").getFile());
		ZipSpecificationProvider provider = new ZipSpecificationProvider();
		provider.setZipFilePath(zipfile);

		repo = RepositoryBuilder.createRepository(provider);
	}

	@Test
	public void testCheckStructureDefinitionUnion() {
		StructureDefinition def = repo.getStructureDefinitionById("Patient");
		FluentPathController cntrl = new FluentPathController();
		PathCheckResult data = cntrl.checkStructureDefinition(def, "Practitioner.name.given | Patient.name.given");
		assertNotNull(data);
		assertEquals("Patient.name.given", data.path);
	}

	@Test
	public void testCheckStructureDefinitionMultipleUnion() {
		StructureDefinition def = repo.getStructureDefinitionById("Patient");
		FluentPathController cntrl = new FluentPathController();
		PathCheckResult data = cntrl.checkStructureDefinition(def,
				"RelatedPerson.address.city | Practitioner.address.city | Person.address.city | Patient.address.city");
		assertNotNull(data);
		assertEquals("Patient.address.city", data.path);
	}

}
