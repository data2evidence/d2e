package com.legacy.health.fhir.meta.xml;

import javax.xml.transform.*;
import javax.xml.transform.dom.DOMResult;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.StringWriter;
import org.junit.Before;
import org.junit.Test;
import org.w3c.dom.Document;

public class TestXMLTransform {

	@Before
	public void setUp() throws Exception {
	}

	@Test
	public void test() throws Exception {
		File transform = new File(this.getClass().getClassLoader().getResource("transform.xslt").getFile());
		File source = new File(this.getClass().getClassLoader().getResource("1000102_prac3_data.xml").getFile());
		// File source = new
		// File(this.getClass().getClassLoader().getResource("33952_prac5_loc1_data.xml").getFile());

		TransformerFactory factory = TransformerFactory.newInstance();
		Source xslt = new StreamSource(transform);
		Transformer transformer = factory.newTransformer(xslt);
		Source text = new StreamSource(source);
		DOMResult result = new DOMResult();
		// transformer.transform(text, result);

		StringWriter writer = new StringWriter();
		long start = System.currentTimeMillis();
		transformer.transform(text, result);
		long stop = System.currentTimeMillis();
		Document resultDoc = (Document) result.getNode();
		printDocument(resultDoc, System.out);
		System.out.println(stop - start);
		// String output = writer.getBuffer().toString();
		// System.out.println(output);

	}

	public static void printDocument(Document doc, OutputStream out) throws IOException, TransformerException {
		TransformerFactory tf = TransformerFactory.newInstance();
		Transformer transformer = tf.newTransformer();
		transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "no");
		transformer.setOutputProperty(OutputKeys.METHOD, "xml");
		transformer.setOutputProperty(OutputKeys.INDENT, "yes");
		transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");
		transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "4");

		transformer.transform(new DOMSource(doc),
				new StreamResult(new OutputStreamWriter(out, "UTF-8")));
	}

}
