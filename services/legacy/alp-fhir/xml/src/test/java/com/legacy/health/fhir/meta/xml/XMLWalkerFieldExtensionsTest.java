package com.legacy.health.fhir.meta.xml;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.io.File;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.junit.Before;
import org.junit.Test;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

import com.legacy.health.fhir.meta.instance.ArrayElement;
import com.legacy.health.fhir.meta.instance.ComplexElement;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.instance.ValueElement;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.RepositoryBuilder;
import com.legacy.health.fhir.meta.repsitory.ZipSpecificationProvider;

public class XMLWalkerFieldExtensionsTest {

	private XMLWalker walker;
	private Structure<?> structure;

	@Before
	public void setUp() throws Exception {
		DocumentBuilderFactory dbfac = DocumentBuilderFactory.newInstance();
		DocumentBuilder docBuilder = dbfac.newDocumentBuilder();
		File file = new File(this.getClass().getClassLoader().getResource("spec.zip").getFile());
		ZipSpecificationProvider provider = new ZipSpecificationProvider();
		provider.setZipFilePath(file);
		MetaRepository repo = RepositoryBuilder.createRepository(provider);
		File resourceFile = new File(
				this.getClass().getClassLoader().getResource("nl-core-patient.example-1.xml").getFile());
		long start = System.currentTimeMillis();
		walker = new XMLWalker();
		walker.setMetaRepository(repo);
		Document doc = docBuilder.parse(resourceFile);
		Element root = doc.getDocumentElement();
		structure = walker.fromXML(root);
		long stop = System.currentTimeMillis();
		System.out.println(stop - start);
	}

	@Test
	public void testDeserialization() throws Exception {
		assertNotNull(structure.getElementByPath("Patient.birthDate")); // testpatient.json has a birthDate
		assertTrue(structure.getElementByPath("Patient.birthDate") instanceof ValueElement); // birthDate is a
																								// ValueElement
		assertNotNull(((ValueElement<?>) structure.getElementByPath("Patient.birthDate")).getValueExtension()); // and
																												// it
																												// has a
																												// fieldextension
																												// assigned

		assertNotNull(structure.getElementByPath("Patient.address")); // testpatient.json has an address
		assertTrue(structure.getElementByPath("Patient.address") instanceof ArrayElement); // address is an array
		assertTrue(((ArrayElement<?>) structure.getElementByPath("Patient.address")).getElements().size() == 1); // and
																													// it
																													// has
																													// a
																													// single
																													// address
		com.legacy.health.fhir.meta.instance.Element<?> address = structure.getElementByPath("Patient.address[0]");
		assertTrue(address != null && address instanceof ComplexElement); // address entry is a record
		com.legacy.health.fhir.meta.instance.Element<?> lines = structure.getElementByPath("Patient.address[0].line");
		assertTrue(lines != null && lines instanceof ArrayElement); // address line array was found
		com.legacy.health.fhir.meta.instance.Element<?> line0 = structure
				.getElementByPath("Patient.address[0].line[0]");
		assertTrue(line0 != null && line0 instanceof ValueElement); // address line #2 was found
		assertNotNull(((ValueElement<?>) line0).getValueExtension()); // and it has a fieldextension assigned
	}

	@Test
	public void testSerialization() throws Exception {
		Element xml = walker.toXML(structure);
		assertNotNull(xml);
		Element birthdate = getChild(xml, "birthDate");
		assertNotNull(birthdate);
		Element birthdateextension = getChild(birthdate, "extension");
		assertNotNull(birthdateextension);
		Element birthtimeextension = getChild(birthdateextension, "valueDateTime");
		assertNotNull(birthtimeextension);
		String birthtime = birthtimeextension.getAttribute("value");
		assertNotNull(birthtime);
		Element address0 = getChild(xml, "address");
		assertNotNull(address0);
		Node line0 = getChild(address0, "line");
		assertNotNull(line0);
		Node extension0 = getChild(line0, "extension");
		assertNotNull(extension0);
		Node extension0url = extension0.getAttributes().getNamedItem("url");
		assertNotNull(extension0url);
		Node extension0value = getChild(extension0, "valueString");
		assertNotNull(extension0value);
		assertNotNull(extension0url.getNodeValue());
		assertNotNull(extension0value.getAttributes().getNamedItem("value"));

	}

	private static Element getChild(Element current, String tagname) {
		for (Node child = current.getFirstChild(); child != null; child = child.getNextSibling()) {
			if (child instanceof Element && tagname.equals(child.getNodeName())) {
				return (Element) child;
			}
		}
		return null;
	}

	private static Node getChild(Node current, String tagname) {
		for (Node child = current.getFirstChild(); child != null; child = child.getNextSibling()) {
			if (tagname.equals(child.getNodeName())) {
				return child;
			}
		}
		return null;
	}

}
