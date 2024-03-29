package com.legacy.health.fhir.meta.json;

import java.io.FileInputStream;
import java.io.InputStream;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.UUID;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.StructureConsumer;
import com.legacy.health.fhir.meta.repsitory.StructureProvider;
import com.legacy.health.fhir.util.Utils;

public class JSONDataProvider implements StructureProvider {

    protected static ObjectMapper mapper = new ObjectMapper();
    protected String resourcePath;
    protected StructureConsumer consumer;
    protected MetaRepository repo;
    protected boolean allowAliases = false;
    protected JsonNode mapping = null;
    protected JSONWalker walker = new JSONWalker();

    public void setPath(String resourcePath) {
        this.resourcePath = resourcePath;
    }

    public void allowAliases(boolean allowAliases) {
        this.allowAliases = allowAliases;
    }

    public void setMapping(JsonNode mapping) {
        this.mapping = mapping;
    }

    public void setMetaRepository(MetaRepository repo) {
        this.repo = repo;
    }

    public void setStructureConsumer(StructureConsumer consumer) {
        this.consumer = consumer;
    }

    public void provideStructures(InputStream is, boolean newVersion, Context context) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode bundle = mapper.readTree(is);
        provideStructure(bundle, newVersion, context);
    }

    public void provideStructures(Context context) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        try (FileInputStream is = new FileInputStream(resourcePath)) {
            JsonNode bundle = mapper.readTree(is);
            provideStructure(bundle, true, context);
        }
    }

    public void provideStructure(JsonNode input, boolean newVersion, Context context) throws Exception {
        String inputType = input.get("resourceType").asText();
        if (inputType.equals("Bundle")) {
            JsonNode entries = input.get("entry");
            if (entries == null) {
                return;
            }
            walker.allowAlias(allowAliases);
            walker.setElementMap(mapping);
            for (int e = 0; e < entries.size(); e++) {
                JsonNode entry = entries.get(e);
                JsonNode resource = entry.get("resource");
                if (!resource.has("id") && resource instanceof ObjectNode) {
                    ((ObjectNode) resource).put("id", UUID.randomUUID().toString());
                }
                provideSingleResource(resource, newVersion, context);
            }
        } else {
            if (!input.has("id") && input instanceof ObjectNode) {
                ((ObjectNode) input).put("id", UUID.randomUUID().toString());
            }
            provideSingleResource(input, newVersion, context);
        }
    }

    public void provideSingleResource(JsonNode resource, boolean newVersion, Context context) throws Exception {
        String type = resource.get("resourceType").asText();
        if (newVersion) {
            setLastUpdated(resource);
            setVersion(resource);
        }
        StructureDefinition sd = repo.getStructureDefinitionById(type);
        Structure structure = walker.fromJSON(resource, sd);
        consumer.writeStructure(structure, context);
    }

    protected void setLastUpdated(JsonNode in) {
        ObjectNode resource = (ObjectNode) in;
        ObjectNode meta = ensureObject(resource, "meta");

        String timestamp = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss")
                .format(new Timestamp(System.currentTimeMillis()));
        meta.put("lastUpdated", timestamp);
    }

    protected void setVersion(JsonNode in) {
        ObjectNode resource = (ObjectNode) in;
        ObjectNode meta = ensureObject(resource, "meta");
        meta.put("versionId", Utils.checkUUID(UUID.randomUUID().toString()));
    }

    protected ObjectNode ensureObject(ObjectNode parent, String name) {
        if (parent.has(name)) {
            return (ObjectNode) parent.get(name);
        }
        ObjectNode ret = mapper.createObjectNode();
        parent.set(name, ret);
        return ret;
    }

    @Override
    public void setPreprocessor(String preprocessor) {
        // TODO Auto-generated method stub

    }
}
