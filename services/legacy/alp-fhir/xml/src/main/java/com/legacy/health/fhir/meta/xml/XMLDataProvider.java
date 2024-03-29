package com.legacy.health.fhir.meta.xml;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMResult;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamSource;
import javax.xml.XMLConstants;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import com.fasterxml.jackson.databind.JsonNode;
import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.StructureConsumer;
import com.legacy.health.fhir.meta.repsitory.StructureProvider;

public class XMLDataProvider implements StructureProvider {

    private Log log = LogFactory.getLog(XMLDataProvider.class);
    protected String resourcePath;
    protected StructureConsumer consumer;
    protected MetaRepository repo;
    protected String preprocessor = null;
    protected boolean allowAliases = false;
    protected JsonNode mapping = null;
    protected DocumentBuilder docBuilder;
    protected XMLWalker walker = new XMLWalker();
    protected Transformer transformer = null;

    public XMLDataProvider() {
    }

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

    public void provideStructures(Element root, boolean newVersion, Context context) throws Exception {
        if (preprocessor != null) {
            DOMSource text = new DOMSource(root);
            DOMResult result = new DOMResult();
            transformer.transform(text, result);
            Document resultDoc = (Document) result.getNode();
            root = resultDoc.getDocumentElement();

        }
        if (root.getTagName().equals("Bundle")) {
            NodeList entries = root.getElementsByTagName("entry");
            for (int i = 0; i < entries.getLength(); i++) {
                Element entry = (Element) entries.item(i);
                NodeList entryChildren = entry.getChildNodes();
                for (int ec = 0; ec < entryChildren.getLength(); ec++) {
                    if (entryChildren.item(ec) instanceof Element) {
                        String type = ((Element) entryChildren.item(ec)).getTagName();
                        StructureDefinition sd = repo.getStructureDefinitionById(type);
                        if (sd != null) {
                            XMLWalker walker = new XMLWalker();
                            Structure structure = walker.fromXML((Element) entryChildren.item(ec), sd);
                            consumer.writeStructure(structure, context);
                        }
                    }
                }
            }
        }
    }

    public void provideStructures(InputStream is, boolean newVersion, Context context) throws Exception {
        walker.allowAlias(allowAliases);
        walker.setElementMap(mapping);

        if (docBuilder == null) {
            DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
            dbf.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
            dbf.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
            docBuilder = dbf.newDocumentBuilder();
        }
        Document doc = docBuilder.parse(is);
        Element root = doc.getDocumentElement();
        provideStructures(root, newVersion, context);
    }

    public void provideStructures(Context context) throws Exception {
        InputStream is = null;
        try {
            is = new FileInputStream(resourcePath);
            provideStructures(is, false, context);
        } finally {
            if (is != null) {
                try {
                    is.close();
                } catch (Exception e) {
                    log.error("Error closing stream", e);
                }
            }
        }
    }

    @Override
    public void setPreprocessor(String preprocessor) throws Exception {
        this.preprocessor = preprocessor;
        File transform = new File(preprocessor);
        TransformerFactory factory = TransformerFactory.newInstance();
        factory.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
        factory.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, "");
        factory.setAttribute(XMLConstants.ACCESS_EXTERNAL_STYLESHEET, "");
        Source xslt = new StreamSource(transform);
        transformer = factory.newTransformer(xslt);

    }

}
