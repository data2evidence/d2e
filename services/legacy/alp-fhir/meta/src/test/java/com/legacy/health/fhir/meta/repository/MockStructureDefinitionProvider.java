package com.legacy.health.fhir.meta.repository;

import java.io.File;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.RepositoryBuilder;
import com.legacy.health.fhir.meta.repsitory.StructureDefinitionProviderExtension;

public class MockStructureDefinitionProvider implements StructureDefinitionProviderExtension {

	ObjectMapper mapper = new ObjectMapper();

	@Override
	public boolean hasStructureDefinitionById(String id) {
		return "MimicPatient".equals(id);
	}

	@Override
	public boolean hasStructureDefinitionByUrl(String url) {
		return "http://data4life.care/db/MIMIC/StructureDefinition/PATIENTS".equals(url) ||
				"http://data4life.care/StructureDefinition/MimicPatient".equals(url);
	}

	@Override
	public boolean provideStructureDefinitionById(MetaRepository repo, String id, Context context) {
		try {
			if ("MimicPatient".equals(id)) {
				File file = new File(this.getClass().getClassLoader().getResource("mimic_patient.json").getFile());
				JsonNode json = mapper.readTree(file);
				RepositoryBuilder.registerSingleStructureDefinition(repo, json);
			}
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
		return hasStructureDefinitionById(id);
	}

	@Override
	public void provideStructureDefinitionByUrl(MetaRepository repo, String url, Context context) {
		try {
			if ("http://data4life.care/db/MIMIC/StructureDefinition/PATIENTS".equals(url) ||
					"http://data4life.care/StructureDefinition/MimicPatient".equals(url)) {
				File file = new File(this.getClass().getClassLoader().getResource("mimic_patient.json").getFile());
				JsonNode json = mapper.readTree(file);
				RepositoryBuilder.registerSingleStructureDefinition(repo, json);
			}
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

}
