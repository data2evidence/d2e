package com.legacy.health.fhir.meta.json;

import java.util.Iterator;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.BooleanNode;
import com.fasterxml.jackson.databind.node.DoubleNode;
import com.fasterxml.jackson.databind.node.IntNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.NullNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;
import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.DataType;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.ArrayElement;
import com.legacy.health.fhir.meta.instance.ComplexElement;
import com.legacy.health.fhir.meta.instance.Element;
import com.legacy.health.fhir.meta.instance.ElementContainer;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.instance.ValueElement;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import java.util.List;

public class JSONWalker {

    private boolean allowAlias = false;
    private JsonNode map;
    private MetaRepository repository;

    public void allowAlias(boolean allowAlias) {
        this.allowAlias = allowAlias;
    }

    public void setElementMap(JsonNode map) {
        this.map = map;
    }

    public void setMetaRepository(MetaRepository repository) {
        this.repository = repository;
    }

    public Structure<?> fromJSON(JsonNode json) {
        if (json instanceof ArrayNode) {
            JSONStructure result = new JSONStructure(json);
            // for(JsonNode node : json) {
            // result.addElement(fromJSON(json,
            // repository.getStructureDefinitionById(node.get("resourceType").asText()), "",
            // result, result));
            // }
            return result;
        } else {
            return fromJSON(json, repository.getStructureDefinitionById(json.get("resourceType").asText()));
        }
    }

    public Structure<?> fromJSON(JsonNode json, StructureDefinition definition) {
        JSONStructure structure = new JSONStructure(json);
        structure.setDefinition(definition);
        for (Iterator<String> iterator = json.fieldNames(); iterator.hasNext();) {
            String name = iterator.next();
            if (name.equals("resourceType")) {
                continue;
            }
            DataElement de = definition.getDataElementByName(name);

            if (de == null) {
                if (allowAlias) {
                    de = definition.getDataElementByAlias(name);
                }
                if (de == null && map != null) {
                    JsonNode mapping = map.get(definition.getId() + "." + name);
                    if (mapping != null) {
                        de = definition.getDataElementByName(mapping.get("name").asText());
                    }
                }
                if (de == null) {
                    // System.out.println("Missed:"+definition.getId()+":"+name);
                    continue;
                }
            }
            Element<?> element = fromJSON(json.get(name), de, name, structure, structure, json, false);
            structure.addElement(element);
        }
        return structure;
    }

    private void setFieldExtension(JsonNode json, Structure<?> structure, ElementContainer container,
            Element<?> extensionowner) {
        if (json != null) { // for some illegal combinations the container-json is set to null to exit
                            // early, e.g. an array of records cannot have and _<arrayname> field
            String fieldextensionname = "_" + extensionowner.getDefinition().getShortName();
            JsonNode extensionnode = json.get(fieldextensionname);
            if (extensionnode != null) { // very often a field will not have an extension, hence the matching e.g.
                                         // bithDate --> _birthDate Json element will not be found
                /*
                 * What is the best way to get an Extension datatype? Simplest option was to
                 * take the resource's Extension and
                 * take its DataType to create the field extension element
                 */
                DataElement extension = structure.getDefinition()
                        .getDataElement(structure.getDefinition().getId() + ".extension");
                DataType extensiondatatype = extension.getType();
                // field extensions are allowed in two places only, for a ValueElement (=field
                // of primitive) or an array of primitives
                if (extensionowner instanceof ValueElement) {
                    /*
                     * In case of a ValueElement, there is a sibling Json Object.
                     * Example:
                     * "birthDate": "1986-08-06",
                     * "_birthDate": {
                     * "extension": [
                     * {
                     * "url": "http://hl7.org/fhir/StructureDefinition/patient-birthTime",
                     * "valueDateTime": "1986-08-06T14:25:22-05:00"
                     * }
                     * ]
                     * }
                     */
                    DataElement extensionelement = new DataElement(
                            extensionowner.getDefinition().getId() + ".extension", extensiondatatype, 0, 1);
                    ComplexElement<?> element = (ComplexElement<?>) fromJSON(extensionnode, extensionelement,
                            extensionowner.getPath(), structure, container, null, true);
                    setFieldExtensionAndId((ValueElement<?>) extensionowner, element);
                } else if (extensionowner instanceof ArrayElement) {
                    /*
                     * "line": [
                     * "36950 Martina Summit",
                     * "Suite 178"
                     * ],
                     * "_line": [
                     * null,
                     * {
                     * "id": "0815",
                     * "extension": [
                     * {
                     * "url":
                     * "http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-buildingNumberSuffix",
                     * "valueString": "Suite 178"
                     * }
                     * ]
                     * }
                     * ]
                     */
                    DataElement extensionarray = new DataElement(
                            extensionowner.getDefinition().getId() + ".extension",
                            extensiondatatype,
                            0, Integer.MAX_VALUE);
                    ArrayElement<?> element = (ArrayElement<?>) fromJSON(extensionnode, extensionarray,
                            extensionowner.getPath(), structure, container, null, true);
                    if (element != null) { // failsafe, cannot happen actually
                        for (int i = 0; i < element.getElements().size(); i++) { // driver is the second array to handle
                                                                                 // the cases where the primary array
                                                                                 // has n elements but only <n
                                                                                 // extensions
                            ComplexElement<?> v = (ComplexElement<?>) element.getElements().get(i);
                            // An array might have a null entry in case this array item does not have a
                            // field extension. This is perfectly valid.
                            // A NULL JsonNode is rendered as a ComplexElement with getElements().size() ==
                            // 0
                            if (v.getElements() != null && v.getElements().size() != 0) {
                                if (extensionowner instanceof ArrayElement) {
                                    ArrayElement<?> a = (ArrayElement<?>) extensionowner;
                                    if (i < a.getElements().size()) { // The second array has to have the same amount of
                                                                      // elements. But better check...
                                        ValueElement<?> extensionowneritem = (ValueElement<?>) a.getElements().get(i);
                                        setFieldExtensionAndId(extensionowneritem, v);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * The provided ComplexElement can have an id and an extension field, both
     * optional.
     * 
     * @param extensionowner
     * @param element
     */
    private void setFieldExtensionAndId(ValueElement<?> extensionowner, ComplexElement<?> element) {
        for (Element<?> e : element.getElements()) {
            if (e.getDefinition().getShortName().equals("id") && e instanceof ValueElement) {
                extensionowner.setFieldExtensionId((ValueElement<?>) e);
            } else if (e.getDefinition().getShortName().equals("extension") && e instanceof ArrayElement) {
                extensionowner.setFieldExtension((ArrayElement<?>) e);
            }
        }
    }

    protected void initializeElement(Element<?> element, DataElement dataElement, String path, Structure<?> structure,
            ElementContainer container) {
        element.setDefinition(dataElement);
        element.setPath(path);
        element.setContainer(container);
        element.setStructure(structure);
    }

    protected Element<?> fromJSON(JsonNode json, DataElement element, String path, Structure<?> structure,
            ElementContainer container, JsonNode containerjson, boolean addextension) {

        if (!json.isArray() && element.getType() != null && !element.getType().isComplex()) { // Value Object
            JSONValueElement valueElement = new JSONValueElement();
            initializeElement(valueElement, element, path, structure, container);
            valueElement.setValue(json);
            setFieldExtension(containerjson, structure, container, valueElement);
            return valueElement;
        }

        if (!json.isArray() && element.getType() != null && element.getType().isComplex()) {
            JSONComplexElement complexElement = new JSONComplexElement();
            initializeElement(complexElement, element, path, structure, container);
            complexElement.setComplexElement(json);
            for (Iterator<String> iterator = json.fieldNames(); iterator.hasNext();) {
                String name = iterator.next();
                DataElement de = element.getType().getDataElementByName(name);

                // handling for Dynamic resources as data Type
                if (repository != null && name.equalsIgnoreCase("resource") && de.getType() == null) {

                    String resourceType = json.get("resource").get("resourceType").asText();
                    StructureDefinition resourceStructureDef = repository.getStructureDefinitionById(resourceType);

                    if (resourceStructureDef == null) {
                        continue;
                    }

                    // identify dynamic a resource node ( Example: resource is a data within Bundle
                    // )
                    JSONComplexElement complexElementResource = new JSONComplexElement();
                    initializeElement(complexElementResource, de, path, structure, container);
                    complexElementResource.setComplexElement(json.get("resource"));

                    // adapt the correct path with Dynamic resourceType
                    String childpathInner = path + "." + name + "." + resourceType;
                    if (addextension) {
                        childpathInner += ".extension";
                    }

                    JSONStructure structureInnerResource = new JSONStructure(json.get("resource"));
                    structureInnerResource.setDefinition(resourceStructureDef);

                    for (Iterator<String> iteratorInner = json.get("resource").fieldNames(); iteratorInner.hasNext();) {
                        String nameInner = iteratorInner.next();
                        if (nameInner.equals("resourceType")) {
                            continue;
                        }
                        DataElement deInner = resourceStructureDef.getDataElement(resourceType + "." + nameInner);
                        if (deInner != null) {
                            String childpathResourceInner = childpathInner + "." + nameInner;
                            Element<?> elementInner = fromJSON(json.get("resource").get(nameInner), deInner,
                                    childpathResourceInner, structureInnerResource, complexElementResource,
                                    json.get("resource"), false);
                            if (elementInner != null)
                                complexElementResource.addElement(elementInner);
                        }
                    }

                    complexElement.addElement(complexElementResource);
                }

                if (de == null) {
                    // System.out.println("missed:"+element.getId()+"."+name);
                    continue;
                }

                String childpath = path + "." + name;
                if (addextension) {
                    childpath += ".extension";
                }
                Element<?> fieldelement = fromJSON(json.get(name), de, childpath, structure, complexElement, json,
                        false);
                complexElement.addElement(fieldelement);
            }
            return complexElement;
        }

        if (json.isArray() && json.size() == 1 && element.getMax() == 1) {// TODO maybe to optimistic:-)
            // here the data can be value or complex
            if (json.isValueNode()) {
                JSONValueElement valueElement = new JSONValueElement();
                initializeElement(valueElement, element, path, structure, container);
                ((JSONValueElement) valueElement).setValue(json.get(0));
                return (valueElement);
            } else {
                JSONComplexElement complexElement = new JSONComplexElement();
                initializeElement(complexElement, element, path, structure, container);
                ((JSONComplexElement) complexElement).setComplexElement(json.get(0));

                Element<?> fieldelement = fromJSON(json.get(0), element, path, structure, complexElement, json, false);
                complexElement.addElement(fieldelement);

                return complexElement;
            }
        }

        if (json.isArray() && element.getMax() > 1) {
            JSONArrayElement arrayElement = new JSONArrayElement();
            initializeElement(arrayElement, element, path, structure, container);
            arrayElement.setArrayElement((ArrayNode) json);
            for (int i = 0; i < json.size(); i++) {
                String childpath = path + "[" + i + "]";
                if (addextension) {
                    childpath += ".extension";
                }
                arrayElement
                        .addElement(fromJSON(json.get(i), element, childpath, structure, arrayElement, null, false));
            }
            // For array of records above fromJson handles the field extensions but for
            // array of primitives that would be one
            // level too deep. An array address.line has fieldextensions in the array
            // address._line
            setFieldExtension(containerjson, structure, container, arrayElement);
            return arrayElement;
        }

        return null;
    }

    public JsonNode toJSON(Structure<?> structure) {
        if (structure instanceof JSONStructure) {
            return ((JSONStructure) structure).getRoot();
        }

        ObjectNode result = JsonNodeFactory.instance.objectNode();
        result.put("resourceType", structure.getResourceType());

        List<Element> elements = structure.getElements();
        for (Element<?> element : elements) {
            result.set(element.getDefinition().getShortName(), toJSON(element));
            JsonNode fieldextension = null;
            if (element instanceof ValueElement) {
                fieldextension = toJSONFieldExtension((ValueElement<?>) element);
            } else if (element instanceof ArrayElement) {
                fieldextension = toJSONFieldArrayExtension((ArrayElement<?>) element);
            }
            if (fieldextension != null) {
                result.set("_" + element.getDefinition().getShortName(), fieldextension);
            }
        }

        return result;
    }

    private JsonNode toJSONFieldArrayExtension(ArrayElement<?> element) {
        ArrayNode array = JsonNodeFactory.instance.arrayNode();
        boolean found = false;
        /*
         * Need to go through every single element and check if it has a field
         * extension. If yes, return the entire array
         * else return null. It might be that none of the array elements have an
         * extension except one and still we need to return
         * the full array then.
         */
        for (Element<?> e : element.getElements()) {
            if (e instanceof ValueElement) {
                JsonNode n = toJSONFieldExtension((ValueElement<?>) e);
                if (n != null) {
                    found = true;
                    array.add(n);
                } else {
                    array.add(NullNode.instance);
                }
            } else {
                // Only arrays of primitives can have a field extension
                return null;
            }
        }
        if (found) {
            return array;
        } else {
            return null;
        }
    }

    private JsonNode toJSONFieldExtension(ValueElement<?> element) {
        if (element.getFieldExtensionId() != null || element.getValueExtension() != null) {
            ObjectNode n = JsonNodeFactory.instance.objectNode();
            if (element.getFieldExtensionId() != null) {
                JsonNode id = toJSON(element.getFieldExtensionId());
                n.set("id", id);
            }
            if (element.getValueExtension() != null) {
                JsonNode id = toJSON(element.getValueExtension());
                n.set("extension", id);
            }
            return n;
        } else {
            return null;
        }
    }

    protected JsonNode toJSON(Element<?> element) {
        if (element instanceof ValueElement) {
            Object value = ((ValueElement<?>) element).getValue();

            String type = element.getDefinition().getType().getId();
            switch (type) {
                case "decimal":
                    if (value instanceof Integer) {
                        return new IntNode((Integer) value);
                    } else {
                        return new DoubleNode((Double) value);
                    }
                default:
                    break;
            }

            if (value == null) {
                return NullNode.instance;
            }

            if (value instanceof Boolean) {
                return BooleanNode.valueOf((Boolean) value);
            } else if (value instanceof Integer) {
                return new IntNode((Integer) value);
            } else if (value instanceof Double) {
                return new DoubleNode((Double) value);
            } else {
                return new TextNode(value.toString());
            }
        } else if (element instanceof ArrayElement) {
            ArrayNode array = JsonNodeFactory.instance.arrayNode();
            for (Element<?> e : ((ComplexElement<?>) element).getElements()) {
                JsonNode node = toJSON(e);
                if (!isNullOrEmpty(node))
                    array.add(node);
            }
            return array;
        } else if (element instanceof ComplexElement) {
            ObjectNode complex = JsonNodeFactory.instance.objectNode();
            for (Element<?> e : ((ComplexElement<?>) element).getElements()) {
                complex.set(e.getDefinition().getShortName(), toJSON(e));
                JsonNode fieldextension = null;
                if (!e.getDefinition().getType().isComplex()) {
                    if (e instanceof ValueElement) {
                        fieldextension = toJSONFieldExtension((ValueElement<?>) e);
                    } else if (e instanceof ArrayElement) {
                        fieldextension = toJSONFieldArrayExtension((ArrayElement<?>) e);
                    }
                    if (fieldextension != null) {
                        complex.set("_" + e.getDefinition().getShortName(), fieldextension);
                    }
                }
            }
            return complex;
        }
        return NullNode.instance;
    }

    private boolean isNullOrEmpty(JsonNode node) {
        if (node == null || node.isNull())
            return true;

        if (node instanceof ObjectNode) {
            return node.size() == 0;
        } else if (node instanceof ArrayNode) {
            for (int i = 0; i < node.size(); i++) {
                if (!isNullOrEmpty(node.get(i)))
                    return false;
            }
            return true;
        }

        return false;
    }

}
