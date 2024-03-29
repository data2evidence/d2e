package com.legacy.health.fhir.meta.hana;

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
		return "MimicPatient".equals(id) || "MIMIC_PATIENTS".equals(id) || "MimicAdmission".equals(id)
				|| "MIMIC_ADMISSIONS".equals(id) || "MimicLabevent".equals(id) || "MIMIC_LABEVENTS".equals(id);
	}

	@Override
	public boolean hasStructureDefinitionByUrl(String url) {
		boolean ret = "http://data4life.care/StructureDefinition/MimicPatient".equals(url)
				|| "http://data4life.care/health/fhir/StructureDefinition/MIMIC_PATIENTS".equals(url)
				|| "http://data4life.care/StructureDefinition/MimicAdmission".equals(url)
				|| "http://data4life.care/health/fhir/StructureDefinition/MIMIC_ADMISSIONS".equals(url)
				|| "http://data4life.care/StructureDefinition/MimicLabevent".equals(url)
				|| "http://data4life.care/health/fhir/StructureDefinition/MIMIC_LABEVENTS".equals(url);
		return ret;
	}

	@Override
	public boolean provideStructureDefinitionById(MetaRepository repo, String id, Context context) {

		try {
			if ("MimicPatient".equals(id)) {
				File file = new File(this.getClass().getClassLoader().getResource("mimic_patient.json").getFile());
				JsonNode json = mapper.readTree(file);
				RepositoryBuilder.registerSingleStructureDefinition(repo, json);
			}
			if ("MimicAdmission".equals(id)) {
				File file = new File(this.getClass().getClassLoader().getResource("mimic_admission.json").getFile());
				JsonNode json = mapper.readTree(file);
				RepositoryBuilder.registerSingleStructureDefinition(repo, json);
			}
			if ("MIMIC_ADMISSIONS".equals(id)) {
				File file = new File(this.getClass().getClassLoader().getResource("MIMIC_ADMISSIONS.json").getFile());
				JsonNode json = mapper.readTree(file);
				RepositoryBuilder.registerSingleStructureDefinition(repo, json);
			}
			if ("MimicLabevent".equals(id)) {
				File file = new File(this.getClass().getClassLoader().getResource("mimic_labevent.json").getFile());
				JsonNode json = mapper.readTree(file);
				RepositoryBuilder.registerSingleStructureDefinition(repo, json);
			}
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
		return true;
	}

	@Override
	public void provideStructureDefinitionByUrl(MetaRepository repo, String url, Context context) {
		try {
			if ("http://data4life.care/StructureDefinition/MimicPatient".equals(url)) {
				File file = new File(this.getClass().getClassLoader().getResource("mimic_patient.json").getFile());
				JsonNode json = mapper.readTree(file);
				RepositoryBuilder.registerSingleStructureDefinition(repo, json);
			}
			if ("http://data4life.care/StructureDefinition/MimicAdmission".equals(url)) {
				File file = new File(this.getClass().getClassLoader().getResource("mimic_admission.json").getFile());
				JsonNode json = mapper.readTree(file);
				RepositoryBuilder.registerSingleStructureDefinition(repo, json);
			}
			if ("http://data4life.care/StructureDefinition/MimicLabevent".equals(url)) {
				File file = new File(this.getClass().getClassLoader().getResource("mimic_labevent.json").getFile());
				JsonNode json = mapper.readTree(file);
				RepositoryBuilder.registerSingleStructureDefinition(repo, json);
			}
			if ("http://data4life.care/health/fhir/StructureDefinition/MIMIC_PATIENTS".equals(url)) {
				File file = new File(this.getClass().getClassLoader().getResource("MIMIC_PATIENTS.json").getFile());
				JsonNode json = mapper.readTree(file);
				RepositoryBuilder.registerSingleStructureDefinition(repo, json);
			}
			if ("http://data4life.care/health/fhir/StructureDefinition/MIMIC_ADMISSIONS".equals(url)) {
				File file = new File(this.getClass().getClassLoader().getResource("MIMIC_ADMISSIONS.json").getFile());
				JsonNode json = mapper.readTree(file);
				RepositoryBuilder.registerSingleStructureDefinition(repo, json);
			}
			if ("http://data4life.care/health/fhir/StructureDefinition/MIMIC_LABEVENTS".equals(url)) {
				File file = new File(this.getClass().getClassLoader().getResource("MIMIC_LABEVENTS.json").getFile());
				JsonNode json = mapper.readTree(file);
				RepositoryBuilder.registerSingleStructureDefinition(repo, json);
			}

		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

}
