package legacy.health.genomics.vcf.parser.capability;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;

import java.io.IOException;

public class ImportConfigurationDeserializer extends JsonDeserializer {

    private JsonNode getRequiredField(JsonNode node, String id, String parent) throws IOException {
        JsonNode jsonNode = node.get(id);
        if(jsonNode == null || jsonNode.isNull()){
            throw new IOException("Field '" + id +"' is required for node " + parent);
        } else {
            return jsonNode;
        }
    }

    @Override
    public ImportConfiguration deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException {
        JsonNode configRootNode = jsonParser.getCodec().readTree(jsonParser);
        ImportConfiguration config = new ImportConfiguration();

        config.setDwid(getRequiredField(configRootNode,"dwid","root").asInt());
        config.setHost(getRequiredField(configRootNode,"hana_host","root").asText());
        config.setPassword(getRequiredField(configRootNode,"hana_password","root").asText());
        config.setUser(getRequiredField(configRootNode,"hana_user","root").asText());
        config.setSchema(getRequiredField(configRootNode,"hana_schema","root").asText());
        config.setDtUser(getRequiredField(configRootNode,"hana_dt_user","root").asText());
        config.setDtPassword(getRequiredField(configRootNode,"hana_dt_password","root").asText());

        JsonNode configTechnicalRootNode = configRootNode.get("technical_config");
        if(configTechnicalRootNode == null || configTechnicalRootNode.isNull()) {
            config.setBatchSize(ImportConfiguration.getDefaultBatchSize());
            config.setParallelCount(config.getDefaultParallelCount());
        } else {
            if(configTechnicalRootNode.get("batchsize") == null || configTechnicalRootNode.get("batchsize").isNull()){
                config.setBatchSize(config.getDefaultBatchSize());
            } else {
                config.setBatchSize(configTechnicalRootNode.get("batchsize").asInt());
            }
            if(configTechnicalRootNode.get("parallelCount") == null || configTechnicalRootNode.get("parallelCount").isNull()){
                config.setParallelCount(config.getDefaultParallelCount());
            } else {
                config.setParallelCount(configTechnicalRootNode.get("parallelCount").asInt());
            }
        }


        JsonNode importMappingRootNode = getRequiredField(configRootNode,"import_mapping","root");
        JsonNode filter_by = getRequiredField(importMappingRootNode,"filter_by","import_mapping");
        if(!filter_by.isArray()) {
            throw new IOException("filter_by field expected array was " +filter_by.getNodeType().name() );
        }
        filter_by.forEach( node -> config.addFilter(node.asText()));

        JsonNode import_attributes = getRequiredField(importMappingRootNode,"import_attributes","import_mapping");
        if(!import_attributes.isArray()) {
            throw new IOException("import_attributes field expected array was " +import_attributes.getNodeType().name() );
        }
        for (JsonNode tableNode : import_attributes) {
            if(!tableNode.isObject())
            {
                throw new IOException("childs of import_attributes field expected object but was " +tableNode.getNodeType().name() );
            }
            String type = getRequiredField(tableNode, "type", "import_attributes").asText();
            if(!tableNode.get("attributes").isArray()) {
                throw new IOException("attributes in an import_attribute sub field field expected array was " +tableNode.get("attributes").getNodeType().name() );
            }
            for (JsonNode attribute : tableNode.get("attributes")) {
                if (!attribute.isObject()) {
                    throw new IOException("attributes in an import_attribute sub field field expected object was " + tableNode.get("attributes").getNodeType().name());
                }

                config.addAttributeToImport(
                        getRequiredField(attribute, "name", "import_attributes->attributes").asText(),
                        getRequiredField(attribute, "alias", "import_attributes->attributes").asText(),
                        type.toLowerCase());
            }
        }

        JsonNode sample_mapping = getRequiredField(importMappingRootNode,"sample_mapping","import_mapping");
        if(!sample_mapping.isArray()) {
            throw new IOException("sample_mapping field expected array was " +sample_mapping.getNodeType().name() );
        }
        for (JsonNode mappingNode : sample_mapping) {
            if(!mappingNode.isObject())
            {
                throw new IOException("childs of sample_mapping field expected object but was " +mappingNode.getNodeType().name() );
            }
            config.addSampleMapping(
                    getRequiredField(mappingNode, "source_id", "sample_mapping").asInt(),
                    getRequiredField(mappingNode, "target_id", "sample_mapping").asInt());
        }

        return config;

    }
}
