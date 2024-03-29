package legacy.health.genomics.vcf.parser.capability;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

public class AdditionalParametersDeserializer extends JsonDeserializer {

	private JsonNode getRequiredField(JsonNode node, String id, String parent) throws IOException {
		JsonNode jsonNode = node.get(id);
		if (jsonNode == null || jsonNode.isNull()) {
			throw new IOException("Field '" + id + "' is required for node " + parent);
		} else {
			return jsonNode;
		}
	}

	@Override
	public AdditionalParameters deserialize(JsonParser jsonParser, DeserializationContext deserializationContext)
			throws IOException {
		/*
		 * JsonNode configRootNode1 = jsonParser.getCodec().readTree(jsonParser); String
		 * jsonString = configRootNode1.asText(); ObjectMapper mapper = new
		 * ObjectMapper(); JsonNode configRootNode = mapper.readTree(jsonString);
		 */
		JsonNode configRootNode = jsonParser.getCodec().readTree(jsonParser);
		String targetType = "";

		Map<String, ImportConfiguration> importConfigurationMap = new HashMap<String, ImportConfiguration>();

		JsonNode documents = getRequiredField(configRootNode, "documents", "root");
		for (JsonNode document : documents) {
			ImportConfiguration config = new ImportConfiguration();
			config.setDwid(getRequiredField(configRootNode, "DWAuditID", "root").asInt());

			// filter mapping
			JsonNode filter = getRequiredField(document, "filterMapping", "documents");
			String documentURI = getRequiredField(document, "sourceURI", "documents").asText();
			Iterator<Entry<String, JsonNode>> fieldIterator = filter.fields();
			if (!fieldIterator.hasNext()) {
				throw new IOException("filter_by field expected array was " + filter.getNodeType().name());
			}
			while (fieldIterator.hasNext()) {
				config.addFilter(fieldIterator.next().getKey());
			}

			// attribute mapping
			JsonNode attributeMapping = getRequiredField(document, "attributeMapping", "documents");
			fieldIterator = attributeMapping.fields();
			if (!fieldIterator.hasNext()) {
				throw new IOException(
						"attributeMapping field expected array was " + attributeMapping.getNodeType().name());
			}

			// Variants
			while (fieldIterator.hasNext()) {
				Entry<String, JsonNode> attributeField = fieldIterator.next();
				if (attributeField.getKey().contentEquals("variant")) {
					targetType = "INFO";
					Iterator<JsonNode> variantIterator = attributeField.getValue().iterator();
					while (variantIterator.hasNext()) {
						JsonNode variantNode = variantIterator.next();
						String variant = getRequiredField(variantNode, "name", "variant").asText();
						config.addAttributeToImport(variant, variant, targetType.toLowerCase());
					}
				}

				// Genotypes
				else if (attributeField.getKey().contentEquals("genotype")) {
					targetType = "FORMAT";
					Iterator<JsonNode> genotypeIterator = attributeField.getValue().iterator();
					while (genotypeIterator.hasNext()) {
						JsonNode genotypeNode = genotypeIterator.next();
						String genotype = getRequiredField(genotypeNode, "name", "genotype").asText();
						config.addAttributeToImport(genotype, genotype, targetType.toLowerCase());
					}
				}
			}

			// sample mapping
			JsonNode sampleMapping = getRequiredField(document, "sampleMapping", "documents");
			Iterator<Entry<String, JsonNode>> sampleIterator = sampleMapping.fields();
			while (sampleIterator.hasNext()) {
				Entry<String, JsonNode> attributeField = sampleIterator.next();
				String sourceMap = attributeField.getKey();
				String targetMap = getRequiredField(attributeField.getValue(), "interaction", "document").asText();
				config.addSampleMapping(Integer.parseInt(sourceMap), Integer.parseInt(targetMap));
			}

			// to be changed later based on file size
			config.setParallelCount(ImportConfiguration.getDefaultParallelCount());
			config.setBatchSize(ImportConfiguration.getDefaultBatchSize());

			importConfigurationMap.put(documentURI, config);

		}

		AdditionalParameters ajp = new AdditionalParameters();
		ajp.setImportConfigurationMap(importConfigurationMap);
		return ajp;

	}
}
