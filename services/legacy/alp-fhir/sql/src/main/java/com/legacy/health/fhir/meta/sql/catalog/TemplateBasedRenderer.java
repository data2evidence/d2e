package com.legacy.health.fhir.meta.sql.catalog;

import java.io.IOException;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Set;

import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.runtime.RuntimeConstants;
import org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legacy.health.fhir.content.model.CatalogDefinition;
import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.RequestContext;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.json.JSONWalker;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.StructureConsumer;
import com.legacy.health.fhir.meta.sql.SQLContext;

public class TemplateBasedRenderer implements StructureBuilder {

	static ObjectMapper mapper = new ObjectMapper();

	VelocityEngine ve;

	private void init() {
		ve = new VelocityEngine();
		ve.setProperty(RuntimeConstants.RESOURCE_LOADER, "classpath");
		ve.setProperty("classpath.resource.loader.class", ClasspathResourceLoader.class.getName());
		ve.init();
	}

	protected MetaRepository getRepo(Context context) {
		if (context instanceof SQLContext) {
			return ((SQLContext) context).getRepo();
		}
		if (context instanceof RequestContext) {
			return ((RequestContext) context).getMetaRepo();
		}
		return null;
	}

	public void build(StructureConsumer consumer, Context context, CatalogDefinition def,
			HashMap<String, HashMap<String, Object>> allContext) throws FhirException {
		Set<String> keys = allContext.keySet();
		if (ve == null) {
			init();
		}
		JSONWalker walker = new JSONWalker();
		walker.setMetaRepository(getRepo(context));
		for (String key : keys) {
			HashMap<String, Object> oContext = allContext.get(key);
			VelocityContext vContext = new VelocityContext();
			for (String tableid : oContext.keySet()) {
				vContext.put(tableid, oContext.get(tableid));
			}
			String template = def.getTemplatepath();
			Template t = ve.getTemplate(template);
			StringWriter writer = new StringWriter();
			;
			t.merge(vContext, writer);
			String json = writer.toString();
			JsonNode resource = null;

			try {
				resource = mapper.readTree(json);
			} catch (IOException e1) {
				throw new FhirException("Error parsing generated JSON from template", e1);
			}
			System.out.println(resource);
			Structure structure = walker.fromJSON(resource);
			try {
				consumer.writeStructure(structure, context);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	private static TemplateBasedRenderer instance;

	public static StructureBuilder getInstance() {
		if (instance == null) {
			instance = new TemplateBasedRenderer();
		}
		return instance;
	}

}
