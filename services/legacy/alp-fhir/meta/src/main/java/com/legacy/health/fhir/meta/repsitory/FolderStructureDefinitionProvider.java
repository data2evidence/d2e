package com.legacy.health.fhir.meta.repsitory;

import java.io.File;
import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legacy.health.fhir.meta.Context;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;

public class FolderStructureDefinitionProvider implements StructureDefinitionProvider {

	private static ObjectMapper mapper = new ObjectMapper();
	protected String folder;
	private static final Logger log = LoggerFactory.getLogger(FolderStructureDefinitionProvider.class);

	@SuppressFBWarnings(value = "PATH_TRAVERSAL_IN", justification = "This is called only via test classes")
	public void setFolder(String folder) {
		this.folder = folder;
	}

	private boolean checkProperty(JsonNode node, String property, String value) {
		if (node.get(property) == null)
			return false;
		return value.equals(node.get(property).asText());
	}

	@SuppressFBWarnings(value = "PATH_TRAVERSAL_IN", justification = "This is called only via test classes")
	public boolean hasStructureDefinitionById(String id) {
		return getStructureDefinition(id, true) != null;
	}

	@SuppressFBWarnings(value = "PATH_TRAVERSAL_IN", justification = "This is called only via test classes")
	private JsonNode getStructureDefinition(String cmp, boolean isId) {
		File dir = new File(folder);
		File[] files = dir.listFiles();
		JsonNode ret = null;

		if (files != null) {
			for (File file : files) {
				if (file.isDirectory())
					continue;
				if (file.getAbsolutePath().endsWith(".json")) {// found a
																// candidate
					JsonNode candidate = null;
					try {
						candidate = mapper.readTree(file);
					} catch (IOException e) {
						log.error("Error reading Structure Defintion", e);
						e.printStackTrace();
						continue;
					}
					if (candidate != null) {
						if (!checkProperty(candidate, "resourceType", "StructureDefinition"))
							continue;
						String prop = isId ? "id" : "url";
						if (checkProperty(candidate, prop, cmp)) {
							ret = candidate;
							break;
						}
					}
				}
			}
		}

		return ret;
	}

	public boolean hasStructureDefinitionByUrl(String url) {
		return getStructureDefinition(url, false) != null;
	}

	public boolean provideStructureDefinitionById(MetaRepository repo, String id, Context context) {
		JsonNode json = getStructureDefinition(id, true);
		if (json != null) {
			RepositoryBuilder.registerSingleStructureDefinition(repo, json);
		}
		return json != null;
	}

	public void provideStructureDefinitionByUrl(MetaRepository repo, String url, Context context) {
		JsonNode json = getStructureDefinition(url, false);
		if (json != null) {
			RepositoryBuilder.registerSingleStructureDefinition(repo, json);
		}
	}

}
