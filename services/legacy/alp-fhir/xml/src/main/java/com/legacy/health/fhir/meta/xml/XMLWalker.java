package com.legacy.health.fhir.meta.xml;

import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import com.fasterxml.jackson.databind.JsonNode;
import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.ArrayElement;
import com.legacy.health.fhir.meta.instance.ComplexElement;
import com.legacy.health.fhir.meta.instance.ElementContainer;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.instance.ValueElement;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;

import java.util.List;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Attr;
import org.w3c.dom.Document;

public class XMLWalker {

    private boolean allowAlias = false;
    private MetaRepository repository;

    public void allowAlias(boolean allowAlias) {
        this.allowAlias = allowAlias;
    }

    public void setElementMap(JsonNode map) {
        // TO-DO:
    }

    public void setMetaRepository(MetaRepository repository) {
        this.repository = repository;
    }

    private Document newDocument() {
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder docBuilder = factory.newDocumentBuilder();
            return docBuilder.newDocument();
        } catch (ParserConfigurationException ex) {
            return null;
        }
    }

    public Structure<?> fromXML(Element xmlResource) {
        return fromXML(xmlResource, repository.getStructureDefinitionById(xmlResource.getTagName()));
    }

    public Structure<?> fromXML(Element xmlResource, StructureDefinition definition) {
        XMLStructure structure = new XMLStructure(xmlResource);
        structure.setDefinition(definition);
        NodeList children = xmlResource.getChildNodes();
        for (int c = 0; c < children.getLength(); c++) {
            Node node = children.item(c);
            if (node instanceof Element) {
                Element child = (Element) node;
                String name = child.getNodeName();
                DataElement de = definition.getDataElementByName(name);

                if (de == null) {
                    if (allowAlias) {
                        de = definition.getDataElementByAlias(name);
                    }
                    if (de == null) {
                        continue;
                    }
                }

                com.legacy.health.fhir.meta.instance.Element<?> element = fromXML(child, de, name, structure, structure,
                        false);
                structure.addElement(element);
            }
        }
        return structure;

    }

    protected void initializeElement(com.legacy.health.fhir.meta.instance.Element<?> element, DataElement dataElement,
            String path, Structure<?> structure, ElementContainer container) {
        element.setDefinition(dataElement);
        element.setPath(path);
        element.setContainer(container);
        element.setStructure(structure);
    }

    protected com.legacy.health.fhir.meta.instance.Element<?> fromXML(Element xmlResource, DataElement element,
            String path, Structure<?> structure, ElementContainer container, boolean ignoreCardinality) {
        boolean handleSingleton = element.getMax() == 1 || ignoreCardinality;

        if (element.getType() != null && !element.getType().isComplex() && handleSingleton) { // Value Object, No Array
            XMLValueElement valueElement = new XMLValueElement();
            initializeElement(valueElement, element, path, structure, container);
            valueElement.setValue(xmlResource);
            if (structure.getDefinition().getDataElementByName("extension") != null) {
                DataElement fieldextension = new DataElement("extension",
                        structure.getDefinition().getDataElementByName("extension").getType(), 0, Integer.MAX_VALUE);
                com.legacy.health.fhir.meta.instance.Element<?> child = fromXML(xmlResource, fieldextension,
                        path + ".extension", structure, container, true);
                setFieldExtensionAndId(valueElement, child);
            }
            return valueElement;
        }

        if (element.getType() != null && element.getType().isComplex() && handleSingleton) { // Complex Object, No Array
            XMLComplexElement complexElement = new XMLComplexElement();
            initializeElement(complexElement, element, path, structure, container);
            complexElement.setComplexElement(xmlResource);

            NodeList children = xmlResource.getChildNodes();
            for (int c = 0; c < children.getLength(); c++) {
                Node node = children.item(c);
                if (node instanceof Element) {
                    Element child = (Element) node;
                    String name = child.getNodeName();
                    DataElement de = element.getType().getDataElementByName(name);
                    if (de == null) {
                        // System.out.println(name+":Data Element not found");
                        continue;
                    }

                    com.legacy.health.fhir.meta.instance.Element<?> xmlElement = fromXML(child, de, path + "." + name,
                            structure, complexElement, false);
                    if (xmlElement != null) {
                        complexElement.addElement((com.legacy.health.fhir.meta.instance.Element<?>) xmlElement);
                    }
                }
            }

            // TODO handling of xmlAttr represenation in other areas - refactoring?
            NamedNodeMap attributes = xmlResource.getAttributes();
            for (int a = 0; a < attributes.getLength(); a++) {
                Node node = attributes.item(a);
                if (node instanceof Attr) {
                    Attr child = (Attr) node;
                    String name = child.getNodeName();
                    DataElement de = element.getType().getDataElementByName(name);
                    if (de == null || !de.hasRepresentation("xmlAttr")) {
                        // System.out.println(name+":Data Element not found");
                        continue;
                    }

                    XMLAttributeValueElement valueElement = new XMLAttributeValueElement();
                    initializeElement(valueElement, de, path + "." + name, structure, container);
                    valueElement.setValue(child);

                    complexElement.addElement(valueElement);
                }
            }
            return complexElement;
        }

        if (element.getMax() > 1) {
            XMLArrayElement arrayElement = (XMLArrayElement) structure
                    .getElementByPath(structure.getDefinition().getId() + "." + path);
            if (arrayElement == null) {
                arrayElement = new XMLArrayElement();
                initializeElement(arrayElement, element, path, structure, container);
                arrayElement.setArrayElement(xmlResource);
            }

            com.legacy.health.fhir.meta.instance.Element<?> child = fromXML(xmlResource, element,
                    path + "[" + arrayElement.currentIndex() + "]", structure, arrayElement, true);
            arrayElement.addElement((com.legacy.health.fhir.meta.instance.Element<?>) child);
            return arrayElement;
        }

        return null;
    }

    private void setFieldExtensionAndId(XMLValueElement valueElement,
            com.legacy.health.fhir.meta.instance.Element<?> child) {
        if (child instanceof ComplexElement) {
            ComplexElement<?> c = (ComplexElement<?>) child;
            if (c.getElements() != null && c.getElements().size() != 0) {
                for (com.legacy.health.fhir.meta.instance.Element<?> e : c.getElements()) {
                    if (e.getDefinition().getShortName().equals("id") && e instanceof ValueElement) {
                        valueElement.setFieldExtensionId((ValueElement<?>) e);
                    } else if (e.getDefinition().getShortName().equals("extension") && e instanceof ArrayElement) {
                        valueElement.setFieldExtension((ArrayElement<?>) e);
                    }
                }
            }
        }
    }

    public Element toXML(Structure<?> structure) {
        if (structure instanceof XMLStructure) {
            return ((XMLStructure) structure).getRoot();
        }
        Document doc = newDocument();
        Element rootElement = (doc != null)
                ? doc.createElementNS("http://hl7.org/fhir", structure.getDefinition().getId())
                : null;
        List<com.legacy.health.fhir.meta.instance.Element> elements = structure.getElements();
        for (com.legacy.health.fhir.meta.instance.Element<?> ele : elements) {
            toXML(rootElement, ele, doc);
        }

        return rootElement;
    }

    protected void toXML(Element rootElement, com.legacy.health.fhir.meta.instance.Element<?> element, Document doc) {
        if (element instanceof ValueElement) {
            ValueElement<?> valueelement = (ValueElement<?>) element;
            if (element.getDefinition().hasRepresentation("xmlAttr")) {
                String name = element.getDefinition().getShortName();
                rootElement.setAttribute(name, valueelement.getValue().toString());
            } else {
                Element xmlElement = doc.createElement(element.getDefinition().getShortName());
                xmlElement.setAttribute("value", valueelement.getValue().toString());
                rootElement.appendChild(xmlElement);
                if (valueelement.getFieldExtensionId() != null) {
                    Element idElement = doc.createElement("id");
                    idElement.setAttribute("value", valueelement.getFieldExtensionId().getValue().toString());
                }
                if (valueelement.getValueExtension() != null) {
                    toXML(xmlElement, valueelement.getValueExtension(), doc);
                }
            }
        } else if (element instanceof ArrayElement) {
            for (com.legacy.health.fhir.meta.instance.Element<?> e : ((ArrayElement<?>) element).getElements()) {
                toXML(rootElement, e, doc);
            }

        } else if (element instanceof ComplexElement) {
            Element xmlElement = doc.createElement(element.getDefinition().getShortName());
            if (element.getDefinition().getShortName().equals("resource")) {
                xmlElement = doc.createElement(((JsonNode) element.getElementNode()).get("resourceType").asText());
            }
            for (com.legacy.health.fhir.meta.instance.Element<?> e : ((ComplexElement<?>) element).getElements()) {
                toXML(xmlElement, e, doc);
            }
            rootElement.appendChild(xmlElement);

        }

    }

}
