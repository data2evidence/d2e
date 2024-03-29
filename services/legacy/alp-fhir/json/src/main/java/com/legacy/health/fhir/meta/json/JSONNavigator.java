package com.legacy.health.fhir.meta.json;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.meta.entity.DataElementStructureLink;
import com.legacy.health.fhir.meta.instance.Path;

public class JSONNavigator {

    public static JsonNode getNodeByDataElementStructureLink(ObjectNode structure, DataElementStructureLink link) {
        JsonNode ret = null;

        return ret;
    }

    public static JsonNode getNodeByPath(ObjectNode structure, Path path) {
        String pathTxt = path.toString();
        pathTxt = pathTxt.substring(pathTxt.indexOf('.') + 1);
        return getNodeByPath(structure, pathTxt);
    }

    private static JsonNode getNodeByPath(JsonNode object, String path) {
        if (path.indexOf('.') == -1) {
            return object.get(path);
        }

        JsonNode next = object.get(path.substring(0, path.indexOf('.')));
        if (next == null) {
            return null;
        }
        return getNodeByPath(next, path.substring(path.indexOf('.') + 1));

    }
}
