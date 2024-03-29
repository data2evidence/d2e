package com.legacy.health.fhir.meta.entity;

import static org.junit.Assert.*;

import java.io.File;

import org.junit.Before;

import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.RepositoryBuilder;
import com.legacy.health.fhir.meta.repsitory.ZipNHSSpecificationProvider;

public class NHSMetaDataNavigatorTest {

	MetaRepository repo;

	@Before
	public void setUp() throws Exception {
		File file = new File(this.getClass().getClassLoader().getResource("specNHS.zip").getFile());
		ZipNHSSpecificationProvider provider = new ZipNHSSpecificationProvider();
		provider.setZipFilePath(file);

		repo = RepositoryBuilder.createRepository(provider);

	}

	// @Test
	public void test() {
		long start = System.currentTimeMillis();
		StructureDefinition def = repo.getStructureDefinitionById("NHSPractice");
		DataElementStructureLink link = DataElementStructureLink.getDataElementStructureLinkByPath(def,
				"NHSPractice.id");
		assertNotNull(link);
		assertEquals("NHSPractice.id", link.getDataElement().getId());
		long stop = System.currentTimeMillis();
		System.out.println(stop - start);
	}

}
