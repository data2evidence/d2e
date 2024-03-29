package com.legacy.health.fhir.meta.xml;

import java.io.File;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.junit.Before;
import org.junit.Test;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.RepositoryBuilder;
import com.legacy.health.fhir.meta.repsitory.ZipSpecificationProvider;

public class XMLWalkerTest {

	@Before
	public void setUp() throws Exception {
	}

	@Test
	public void test() throws Exception {
		DocumentBuilderFactory dbfac = DocumentBuilderFactory.newInstance();
		DocumentBuilder docBuilder = dbfac.newDocumentBuilder();
		File file = new File(this.getClass().getClassLoader().getResource("spec.zip").getFile());
		ZipSpecificationProvider provider = new ZipSpecificationProvider();
		provider.setZipFilePath(file);
		MetaRepository repo = RepositoryBuilder.createRepository(provider);
		File resourceFile = new File(this.getClass().getClassLoader().getResource("testbundle.xml").getFile());
		long start = System.currentTimeMillis();
		Document doc = docBuilder.parse(resourceFile);
		Element root = doc.getDocumentElement();
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
							System.out.println("Found Type:" + type);
							XMLWalker walker = new XMLWalker();
							Structure structure = walker.fromXML((Element) entryChildren.item(ec), sd);
							System.out.println(structure.getElements().size());
						}
					}
				}
			}
		}
		long stop = System.currentTimeMillis();
		System.out.println(stop - start);

	}

}
