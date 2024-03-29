package com.legacy.health.fhir.helper;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.meta.entity.Issue;
import com.legacy.health.fhir.meta.entity.OperationOutcome;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.json.JSONWalker;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.xml.XMLWalker;
import com.legacy.health.fhir.util.UUIDGenerator;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.w3c.dom.Element;

@Component
public class FhirUtils {

    private static MetaRepository repository;
    private static UUIDGenerator uuidGenerator;

    @Autowired
    public FhirUtils(MetaRepository repository, UUIDGenerator uuidGenerator) {
        FhirUtils.repository = repository;
        FhirUtils.uuidGenerator = uuidGenerator;
    }

    public static Structure toBundle(String type, List<ObjectNode> resources) {
        ObjectNode bundle = JsonNodeFactory.instance.objectNode();
        bundle.put("resourceType", "Bundle");
        bundle.put("id", uuidGenerator.generateId());
        bundle.set("links", JsonNodeFactory.instance.arrayNode());
        bundle.put("type", type);
        bundle.set("entry", JsonNodeFactory.instance.arrayNode());
        for (ObjectNode resource : resources) {
            ((ArrayNode) bundle.get("entry")).add(resource);
        }
        bundle.put("total", resources.size());
        return FhirUtils.toStructure(bundle);
    }

    public static Structure toStructure(JsonNode json) {
        JSONWalker walker = new JSONWalker();
        walker.setMetaRepository(repository);
        return walker.fromJSON(json);
    }

    public static Structure toStructure(OperationOutcome outcome) {
        ObjectMapper objectMapper = new ObjectMapper();
        return FhirUtils.toStructure((JsonNode) objectMapper.valueToTree(outcome));
    }

    public static Structure toStructure(Element xml) {
        XMLWalker walker = new XMLWalker();
        walker.setMetaRepository(repository);
        return walker.fromXML(xml);
    }

    public static JsonNode toJson(Structure structure) {
        return new JSONWalker().toJSON(structure);
    }

    public static Element toXml(Structure structure) {
        return new XMLWalker().toXML(structure);
    }

    public static boolean operationOutcomeHasErrorCheck(OperationOutcome outcome) {
        List<Issue> issues = outcome.getIssue();
        boolean bFlag = false;
        for (int i = 0; i < issues.size(); i++) {
            Issue component = issues.get(i);
            if (component.getSeverity().equalsIgnoreCase("error")
                    || component.getSeverity().equalsIgnoreCase("fatal")) {
                bFlag = true;
            }
        }
        return bFlag;
    }

}
