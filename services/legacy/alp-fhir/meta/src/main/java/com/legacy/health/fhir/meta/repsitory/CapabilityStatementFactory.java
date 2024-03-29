package com.legacy.health.fhir.meta.repsitory;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.StructureDefinition;

public class CapabilityStatementFactory {
	protected ObjectMapper mapper = new ObjectMapper();

	protected ObjectNode getJSONTemplate(String name) throws FhirException {
		InputStream is = null;
		try {
			is = CapabilityStatementFactory.class.getResourceAsStream(name);
			JsonNode ret = mapper.readTree(is);
			is.close();
			return (ObjectNode) ret;
		} catch (FileNotFoundException e) {
			throw new FhirException("'" + name + "' not found", e);
		} catch (JsonProcessingException e) {
			forceCloseInputStream(is);
			throw new FhirException("'" + name + "' JSON Processing Error", e);
		} catch (IOException e) {
			forceCloseInputStream(is);
			throw new FhirException("'" + name + "' JSON Processing Error", e);
		}
	}

	private void forceCloseInputStream(InputStream is) {
		if (is != null) {
			try {
				is.close();
			} catch (IOException e1) {
				e1.printStackTrace();
			}
		}
	}

	public JsonNode create(List<StructureDefinition> definitions) throws FhirException {
		ObjectNode cs = getJSONTemplate("capabilitystatement.json");
		ObjectNode rs = getJSONTemplate("resource.json");
		ObjectNode rest = (ObjectNode) cs.get("rest");
		ArrayNode resources = (ArrayNode) cs.get("resource");
		for (StructureDefinition sd : definitions) {
			ObjectNode entry = rs.deepCopy();
			resources.add(entry);
			entry.put("type", sd.getId());
			interactions(entry);
			entry.put("updateCreate", true);
			entry.put("conditionalCreate", true);
			entry.put("conditionalUpdare", true);
			entry.put("conditionalDelete", true);
			ArrayNode refPolicy = mapper.createArrayNode();
			entry.set("referencePolicy", refPolicy);
			refPolicy.add("logical");

		}

		return null;
	}

	public void interactions(ObjectNode entry) {
		ArrayNode i = (ArrayNode) entry.get("interaction");
		i.add(interaction("read"));
		i.add(interaction("update"));
		i.add(interaction("create"));
		i.add(interaction("delete"));
		i.add(interaction("search-type"));
	}

	protected ObjectNode interaction(String name) {
		ObjectNode node = mapper.createObjectNode();
		node.put("code", name);
		return node;
	}
}
