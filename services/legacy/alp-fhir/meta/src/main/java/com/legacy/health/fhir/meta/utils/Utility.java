package com.legacy.health.fhir.meta.utils;

import java.io.File;
import java.io.IOException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;

public class Utility {

	/**
	 * Check if the resource is part of standard definition,
	 * later it will come from LDM service
	 * 
	 * @param resourceType
	 * @return
	 * @throws JsonProcessingException
	 * @throws IOException
	 */
	public static boolean isStandardResourceType(String resourceType) throws JsonProcessingException, IOException {

		ClassLoader classLoader = Utility.class.getClassLoader();
		File fileResourceTypes = new File(classLoader.getResource("codesystem-resource-types.json").getFile());

		ObjectMapper mapper = new ObjectMapper();
		JsonNode resorceTypeRoot = mapper.readTree(fileResourceTypes);

		ArrayNode nodes = (ArrayNode) resorceTypeRoot.get("concept");

		for (JsonNode objNode : nodes) {
			if (objNode.get("code").asText().equalsIgnoreCase(resourceType)) {
				return true;
			}
		}

		return false;
	}

}
