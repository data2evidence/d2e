package com.legacy.health.fhir.meta.entity;

import static org.junit.Assert.*;

import java.io.File;

import org.junit.Before;
import org.junit.Test;

import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.RepositoryBuilder;
import com.legacy.health.fhir.meta.repsitory.ZipSpecificationProvider;

public class MetaDataNavigatorTest {

	MetaRepository repo;

	@Before
	public void setUp() throws Exception {
		File zipfile = new File(this.getClass().getClassLoader().getResource("spec.zip").getFile());
		ZipSpecificationProvider provider = new ZipSpecificationProvider();
		provider.setZipFilePath(zipfile);

		repo = RepositoryBuilder.createRepository(provider);
	}

	@Test
	public void test() {
		long start = System.currentTimeMillis();
		StructureDefinition def = repo.getStructureDefinitionById("Observation");
		DataElementStructureLink link = DataElementStructureLink.getDataElementStructureLinkByPath(def,
				"Observation.status");
		assertNotNull(link);
		assertEquals("Observation.status", link.getDataElement().getId());
		link = DataElementStructureLink.getDataElementStructureLinkByPath(def, "Observation.valueQuantity.value");
		assertNotNull(link);
		assertEquals("Quantity.value", link.getDataElement().getId());
		long stop = System.currentTimeMillis();
		System.out.println(stop - start);
	}

}
