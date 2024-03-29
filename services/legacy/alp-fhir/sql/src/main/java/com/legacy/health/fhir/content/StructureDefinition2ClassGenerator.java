package com.legacy.health.fhir.content;

import java.io.IOException;
import java.io.Writer;
import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.runtime.RuntimeConstants;
import org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader;

import com.legacy.health.fhir.meta.repsitory.MetaRepository;

public class StructureDefinition2ClassGenerator {
	VelocityEngine ve;
	// FhirContext ctx = FhirContext.forDstu3();
	StructureDefinitionLoader loader = new StructureDefinitionLoader();

	public void init() {
		ve = new VelocityEngine();
		ve.setProperty(RuntimeConstants.RESOURCE_LOADER, "classpath");
		ve.setProperty("classpath.resource.loader.class", ClasspathResourceLoader.class.getName());
		ve.init();
	}

	public void execute(String template, String path, Writer writer, MetaRepository repo) {
		VelocityContext context = new VelocityContext();
		// loader.setProperties(properties);
		TypeUtils utils = new TypeUtils();
		utils.setVelocityContext(context);
		context.put("loader", loader);
		context.put("types", utils);
		context.put("repo", repo);
		try {
			context.put("root", loader.get(path));
		} catch (IOException e) {
			e.printStackTrace();
		}
		// loader.setVelocityContext(context);
		Template t = ve.getTemplate(template);
		t.merge(context, writer);
	}
}
