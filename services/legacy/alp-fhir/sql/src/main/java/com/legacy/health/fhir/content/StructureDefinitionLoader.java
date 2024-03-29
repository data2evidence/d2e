package com.legacy.health.fhir.content;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import org.apache.velocity.VelocityContext;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class StructureDefinitionLoader {
	private VelocityContext vContext;
	private static ObjectMapper mapper = new ObjectMapper();

	public void setVelocityContext(VelocityContext vContext) {
		this.vContext = vContext;
	}

	public ContextHelper get(String path) throws IOException {

		FileInputStream fis = null;
		try {
			ClassLoader classLoader = this.getClass().getClassLoader();
			File file = new File(classLoader.getResource(path).getFile());

			fis = new FileInputStream(file);
			JsonNode element = mapper.readTree(fis);
			ContextHelper helper = new ContextHelper();
			helper.setVelocityContext(vContext);
			helper.setElement(element);
			return helper;
		} finally {
			if (fis != null) {
				fis.close();
			}
		}

	}
}
