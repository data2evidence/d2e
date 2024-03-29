package com.legacy.health.fhir.converter;

import com.legacy.health.fhir.helper.FhirMediaTypes;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.xml.XMLWalker;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import javax.xml.transform.Result;
import javax.xml.transform.Source;
import javax.xml.transform.TransformerException;
import javax.xml.transform.dom.DOMResult;
import javax.xml.transform.dom.DOMSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.converter.xml.AbstractJaxb2HttpMessageConverter;
import org.w3c.dom.Element;

/**
 *
 * @author I320740
 */
public class FHIRXmlConverter extends AbstractJaxb2HttpMessageConverter<Structure> {

    @Autowired
    private MetaRepository repository;

    @Override
    public List<MediaType> getSupportedMediaTypes() {
        return Arrays.asList(FhirMediaTypes.FHIR_XML, MediaType.APPLICATION_XML);
    }

    @Override
    protected Structure readFromSource(Class<? extends Structure> clazz, HttpHeaders headers, Source source)
            throws IOException {
        try {
            DOMResult result = new DOMResult();
            super.transform(source, result);
            Element resourceNode = (Element) result.getNode().getFirstChild();
            StructureDefinition structureDefinition = repository.getStructureDefinitionById(resourceNode.getTagName());
            return new XMLWalker().fromXML(resourceNode, structureDefinition);
        } catch (TransformerException ex) {
            throw new IOException(ex);
        }
    }

    @Override
    protected void writeToResult(Structure structure, HttpHeaders headers, Result result) throws IOException {
        try {
            super.transform(new DOMSource(new XMLWalker().toXML(structure)), result);
        } catch (TransformerException ex) {
            throw new IOException(ex);
        }
    }

    @Override
    protected boolean supports(Class<?> clazz) {
        return Structure.class.isAssignableFrom(clazz);
    }

}
