package com.legacy.health.fhir.content;

import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legacy.health.fhir.content.model.Scenario;
import com.legacy.health.fhir.extension.FHIRResourceRepository;
import com.legacy.health.fhir.extension.TransactionContext;
import com.legacy.health.fhir.extension.exceptions.FHIRResourceHandlingException;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.RequestContext;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.json.JSONStructure;
import com.legacy.health.fhir.meta.json.JSONWalker;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.queryengine.QueryBuilder;
import com.legacy.health.fhir.meta.queryengine.extension.QueryExecutorExtension;

public class ContentRepository {

	protected static ObjectMapper mapper = new ObjectMapper();
	static Logger log = Logger.getLogger(ContentRepository.class.getName());

	protected FHIRResourceRepository inner;
	protected RequestContext context;
	protected QueryExecutorExtension queryExecutor;
	protected List<Scenario> scenarios = null;

	public void setInnerRepository(FHIRResourceRepository inner) {
		this.inner = inner;
	}

	public void setQueryExecutor(QueryExecutorExtension executor) {
		this.queryExecutor = executor;
	}

	public void setRequestContext(RequestContext context) {
		this.context = context;
	}

	public StructureDefinition getStructureDefinitionById(String id) {
		return context.getMetaRepo().getStructureDefinitionById(id);
	}

	public StructureDefinition getStructureDefinitionByUrl(String url) {
		return context.getMetaRepo().getStructureDefinitionByUrl(url, context);
	}

	public Structure readContentWithSDUrl(String id, String url) throws FhirException {
		StructureDefinition sd = context.getMetaRepo().getStructureDefinitionByUrl(url, context);
		return readContent(id, sd);
	}

	private Structure readContent(String id, StructureDefinition sd) throws FHIRResourceHandlingException {
		synchronized (inner) {
			TransactionContext tctx = inner.startTransaction(true, context);
			try {
				Structure structure = inner.readResource(id, sd, context, tctx);
				return structure;
			} finally {
				tctx.closeConnection();
			}
		}
	}

	private void deleteContent(String id, StructureDefinition sd) throws FHIRResourceHandlingException {
		synchronized (inner) {
			TransactionContext tctx = inner.startTransaction(true, context);
			try {
				inner.deleteResource(id, sd, context, tctx);
			} finally {
				tctx.closeConnection();
			}
		}
	}

	private Structure readContentFromCanonicalID(String url, String version, StructureDefinition sd)
			throws FHIRResourceHandlingException {
		TransactionContext tctx = inner.startTransaction(true, context);
		try {
			Structure structure = inner.readResourceByCanonicalID(url, version, sd, context, tctx);
			return structure;
		} finally {
			tctx.closeConnection();
		}

	}

	public void deleteContent(String id, String structureDefinition) throws FhirException {
		StructureDefinition sd = context.getMetaRepo().getStructureDefinitionById(structureDefinition);
		deleteContent(id, sd);
	}

	public Structure readContent(String id, String structureDefinition) throws FhirException {
		StructureDefinition sd = context.getMetaRepo().getStructureDefinitionById(structureDefinition);
		return readContent(id, sd);
	}

	public Structure readContentFromCanonicalID(String url, String version, String structureDefinition)
			throws FhirException {
		StructureDefinition sd = context.getMetaRepo().getStructureDefinitionById(structureDefinition);
		return readContentFromCanonicalID(url, version, sd);
	}

	public Structure grantRole(Object scenario, Object roleDefinition, String user, RequestContext reqCtx,
			TransactionContext tctx) throws FHIRResourceHandlingException {
		return this.inner.grantRole(scenario, roleDefinition, user, reqCtx, tctx);
	}

	public Structure revokeRole(Object scenario, Object roleDefinition, String user, RequestContext reqCtx,
			TransactionContext tctx) throws FHIRResourceHandlingException {
		return this.inner.revokeRole(scenario, roleDefinition, user, reqCtx, tctx);
	}

	public Structure initializeContentRepository() throws FhirException {
		try {
			Structure capabilities = prepareStructure("content/content_capabilitystatement.json");
			Structure structure = this.inner.doInit(capabilities, context);
			scenarios = null;
			return structure;
		} catch (IOException e) {

			throw new FhirException("Error during initialization of Content Repository", e);
		}
	}

	protected Structure prepareStructure(String jsonFileName) throws IOException {
		InputStream fis = null;
		try {
			fis = ContentRepository.class.getClassLoader().getResourceAsStream(jsonFileName);
			JsonNode resource = mapper.readTree(fis);
			String type = resource.get("resourceType").asText();
			StructureDefinition sd = context.getMetaRepo().getStructureDefinitionById(type);
			JSONWalker walker = new JSONWalker();
			return walker.fromJSON(resource, sd);
		} finally {
			if (fis != null) {
				fis.close();
			}

		}
	}

	public void createContent(Structure structure) throws FHIRResourceHandlingException {
		TransactionContext ctx = inner.startTransaction(true, context);
		try {
			inner.createResource(structure, context, ctx);
		} finally {
			ctx.closeConnection();
		}
	}

	public void updateContent(Structure structure) throws FHIRResourceHandlingException {
		TransactionContext ctx = inner.startTransaction(true, context);
		try {
			inner.updateResource(structure, structure.getDefinition(), context, ctx);
		} finally {
			ctx.closeConnection();
		}
	}

	public List<Scenario> getAllScenarios() throws SQLException, FhirException {
		return getAllScenarios(false);
	}

	public List<Scenario> getAllScenarios(boolean forcefulUpdateCache) throws SQLException, FhirException {

		if (!forcefulUpdateCache && (scenarios != null && !scenarios.isEmpty())) {
			return scenarios;
		}

		synchronized (this) {
			scenarios = new ArrayList<Scenario>();
			QueryBuilder qb = new QueryBuilder();
			qb.setMetaRepository(context.getMetaRepo());
			Query query = qb.query("allscenarios");
			query.from(qb.from("Scenario"));
			StructureDefinition typeSD = qb.sd("Scenario");
			qb.out(typeSD);
			Structure structure = queryExecutor.doQuery(query, context, true, null);
			JSONWalker walker = new JSONWalker();
			walker.setMetaRepository(context.getMetaRepo());
			context.getMetaRepo().getStructureDefinitionById("Scenario");
			if (structure instanceof JSONStructure) {
				JsonNode bundle = ((JSONStructure) structure).getRoot();
				JsonNode entries = bundle.path("entry");
				for (int i = 0; i < entries.size(); i++) {
					JsonNode entry = entries.get(i);
					JsonNode resource = entry.get("resource");
					Structure fhirScenario = walker.fromJSON(resource);
					Scenario scenario = new Scenario();
					scenario.setContentRepository(this);
					scenario.fromStructure(fhirScenario);
					scenario.setOld();
					scenarios.add(scenario);
				}
			}
		}

		return scenarios;
	}

	public Scenario getScenarioForEndpoint(String endpoint) {
		return getScenarioForEndpoint(endpoint, false);
	}

	public Scenario getScenarioForEndpoint(String endpoint, boolean forcefulUpdateCache) {
		if (scenarios == null) {
			try {
				getAllScenarios(forcefulUpdateCache);
			} catch (SQLException | FhirException e) {
				log.error("Error while resolving scenarios", e);
				return null;
			}
		}

		for (Scenario scenario : scenarios) {
			if (endpoint.equals(getEndpoint(scenario))) {
				return scenario;
			}
		}
		return null;
	}

	public static String getEndpoint(Scenario scenario) {
		List<Scenario.Parameter> list = scenario.getParameter();
		for (Scenario.Parameter parameter : list) {
			if ("endpoint".equals(parameter.getName())) {
				return parameter.getValueString();
			}
		}
		return null;
	}

	public String getParameterValue(Scenario scenario, String name) {
		List<Scenario.Parameter> list = scenario.getParameter();
		for (Scenario.Parameter parameter : list) {
			if (name.equals(parameter.getName())) {
				return parameter.getValueString();
			}
		}
		return null;
	}

	public String getTechnicalID(RequestContext ctx) {
		return inner.getTechnicalID(ctx);
	}
}
