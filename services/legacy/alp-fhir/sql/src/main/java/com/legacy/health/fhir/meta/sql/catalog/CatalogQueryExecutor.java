package com.legacy.health.fhir.meta.sql.catalog;

import java.net.MalformedURLException;
import java.net.URI;
import java.sql.Connection;
import java.sql.Date;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.NullNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.content.ContentRepository;
import com.legacy.health.fhir.content.ContentRepositoryConsumer;
import com.legacy.health.fhir.content.ScenarioContext;
import com.legacy.health.fhir.content.model.CatalogDefinition;
import com.legacy.health.fhir.content.model.Scenario;
import com.legacy.health.fhir.content.model.ScenarioDefinition;
import com.legacy.health.fhir.extension.ExtensionMetadata;
import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.OperationOutcomeBuilder;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.Issue;
import com.legacy.health.fhir.meta.entity.OperationOutcome;
import com.legacy.health.fhir.meta.entity.RequestContext;
import com.legacy.health.fhir.meta.instance.Element;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.instance.ValueElement;
import com.legacy.health.fhir.meta.json.JSONStructure;
import com.legacy.health.fhir.meta.queryengine.Limit;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.queryengine.ResultElement;
import com.legacy.health.fhir.meta.queryengine.extension.QueryExecutorExtension;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.StructureConsumer;
import com.legacy.health.fhir.meta.sql.SQLContext;
import com.legacy.health.fhir.meta.sql.SQLExecutor;
import com.legacy.health.fhir.meta.sql.SQLProviderFactory;
import com.legacy.health.fhir.meta.sql.SQLSchemaController;
import com.legacy.health.fhir.meta.sql.util.FhirUtils;
import com.legacy.health.fhir.util.UUIDGenerator;
import com.legacy.health.fhir.util.UUIDGeneratorImpl;

public class CatalogQueryExecutor implements QueryExecutorExtension, ContentRepositoryConsumer {

	ContentRepository contentRepository;

	private Log log = LogFactory.getLog(CatalogQueryExecutor.class);

	@Override
	public ExtensionMetadata getMetaData() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String getRepositoryType() {
		// TODO Auto-generated method stub
		return "catalog";
	}

	@Override
	public Structure doQuery(Query query, RequestContext reqCtx, boolean bundle, Context context)
			throws SQLException, FhirException {
		return this.doQuery(query, reqCtx, bundle, context, true);
	}

	public Structure doQuery(Query query, RequestContext reqCtx, boolean bundle, Context context,
			boolean handleEverything)
			throws SQLException, FhirException {

		if (context instanceof ScenarioContext) {
			ScenarioContext scenarioContext = (ScenarioContext) context;
			boolean isSelfCreatedConnection = false;
			CatalogQueryEngine queryEngine = new CatalogQueryEngine();
			SQLExecutor sqlExecutor = getSQLExecutor(reqCtx);
			Connection connection = sqlExecutor.connect();
			SQLContext sqlContext = newSQLContext(reqCtx.getEndPoint(), connection,
					queryEngine.getSchemaController());
			sqlContext.setRepo(reqCtx.getMetaRepo());
			sqlContext.setSchema(sqlExecutor.getSchema());
			isSelfCreatedConnection = true;

			List<CatalogDefinition> definitions = new ArrayList<CatalogDefinition>();

			Scenario scenario = scenarioContext.getScenario();
			List<ScenarioDefinition.Deployment> deployments = scenario.getDefinition().getDeployment();
			for (ScenarioDefinition.Deployment deployment : deployments) {
				if (scenario.getScope().contains(deployment.getScope())) {
					definitions.addAll(deployment.getCatalog());
				}
			}
			SQLProviderFactory factory = SQLProviderFactory.createInstance(getDriver(reqCtx));
			queryEngine.setCatalogDefinitions(definitions);
			for (CatalogDefinition definition : definitions) {
				if (reqCtx.getActiveSpringProfileConfiguration() == null
						|| reqCtx.getActiveSpringProfileConfiguration().equals("xsa")) {
					// case for instance manager
					CatalogDefinitionModelBrowser.prepareTables(definition, factory, sqlContext.getSchema());
				} else {
					CatalogDefinitionModelBrowser.prepareTables(definition, factory,
							contentRepository.getParameterValue(scenario, "schema"));
				}

			}
			CatalogSchemaController controller = (CatalogSchemaController) queryEngine.getSchemaController();
			controller.setSQLProviderFactory(factory);
			ArrayList<Structure> ret = new ArrayList<Structure>();

			URI location = null;
			if (reqCtx.getRequest() != null) {
				location = ServletUriComponentsBuilder.fromContextPath(reqCtx.getRequest()).build().toUri();
			} else {
				try {
					location = ServletUriComponentsBuilder.fromCurrentRequest().build().toUri();
				} catch (IllegalStateException ise) {
					log.error(ise);
				}
			}

			ObjectMapper mapper = new ObjectMapper();
			UUIDGenerator uuidGenerator = new UUIDGeneratorImpl();
			ArrayNode links = mapper.createArrayNode();
			ObjectNode retObjectNode = mapper.createObjectNode();

			retObjectNode.put("resourceType", "Bundle");
			retObjectNode.put("id", uuidGenerator.generateId());
			retObjectNode.set("link", links);
			retObjectNode.put("type", "searchset");
			ArrayNode result = mapper.createArrayNode();

			try {

				if (query.returnEverything() && handleEverything) {
					CatalogEverythingQueryHandler handler = new CatalogEverythingQueryHandler();
					handler.handleEverythingQuery(query, reqCtx, scenarioContext, this, result, sqlContext.getSchema());
				} else {
					queryEngine.execute(query, new StructureConsumer() {
						@Override
						public void writeStructure(Structure structure, Context context) throws Exception {
							handleStructureWrite(structure, query, bundle, mapper, result);
						}

					}, sqlContext);
				}
			} catch (Exception e) {
				// TODO Auto-generated catch block
				Structure operationOutCome = getOperationOutcome(Issue.Severity.error, "exception",
						"Exception occured : < " + e.getClass().getName() + " : " + e.getLocalizedMessage() + " >",
						query.getQueryBuilder().getMetaRepository());
				handleStructureWrite(operationOutCome, query, bundle, mapper, result);
				e.printStackTrace();

				log.error(e);

			} finally {
				if (isSelfCreatedConnection) {
					((SQLContext) sqlContext).getConnection().close();
				}
			}

			try {
				ObjectNode self = mapper.createObjectNode();
				self.put("relation", "self");
				// self.put("url", location.toURL().toExternalForm());
				if (location != null) {
					self.put("url", location.toString());
				}
				links.add(self);
				Limit limit = query.limit();
				if (limit != null && result.size() == limit.limit()) {
					Integer count = limit.limit();
					Integer skip = limit.offset() != null ? limit.offset() : 0;
					if (skip > 0) {
						Integer previous = (skip - count) > 0 ? (skip - count) : 0;

						// URI previousURI =
						// reqCtx.getRequest().replaceQueryParam("_count",
						// limit.limit()).replaceQueryParam("_skip",
						// previous).build()
						// .toUri();

						URI previousURI = ServletUriComponentsBuilder.fromCurrentRequest()
								.replaceQueryParam("_count", limit.limit()).replaceQueryParam("_skip", previous).build()
								.toUri();
						ObjectNode previousNode = mapper.createObjectNode();
						previousNode.put("relation", "previous");
						previousNode.put("url", previousURI.toURL().toExternalForm());
						// previousNode.put("url", previousURI);
						links.add(previousNode);
						URI firstURI = ServletUriComponentsBuilder.fromCurrentRequest()
								.replaceQueryParam("_count", limit.limit()).replaceQueryParam("_skip").build().toUri();
						ObjectNode firstNode = mapper.createObjectNode();
						firstNode.put("relation", "first");
						firstNode.put("url", firstURI.toURL().toExternalForm());
						links.add(firstNode);
					}
					skip = skip + limit.limit();
					URI nextURI = ServletUriComponentsBuilder.fromCurrentRequest()
							.replaceQueryParam("_count", limit.limit()).replaceQueryParam("_skip", skip).build()
							.toUri();
					ObjectNode next = mapper.createObjectNode();
					next.put("relation", "next");
					next.put("url", nextURI.toURL().toExternalForm());
					links.add(next);
				} // add next link
			} catch (MalformedURLException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}

			retObjectNode.put("total", result.size());

			retObjectNode.set("entry", result);

			if (!bundle) {
				if (result.size() == 1) {
					return ret.get(0);
				}
			}
			return FhirUtils.toStructure(retObjectNode, reqCtx.getMetaRepo());
		}

		return null;

	}

	@Override
	public void setContentRepository(ContentRepository repo) {
		this.contentRepository = repo;

	}

	private SQLExecutor getSQLExecutor(RequestContext reqCtx) throws FhirException, SQLException {
		SQLExecutor sqlExecutor = new SQLExecutor();
		sqlExecutor.setSchema(reqCtx.getEndPoint());
		sqlExecutor.connect(reqCtx.getConnectionDetails(), reqCtx.getActiveSpringProfileConfiguration());
		return sqlExecutor;
	}

	private SQLContext newSQLContext(String schemaName, Connection connection, SQLSchemaController controller)
			throws SQLException {
		SQLContext context = new SQLContext();
		context.setConnection(connection);
		context.setController(controller);
		return context;
	}

	private String getDriver(RequestContext context) {
		return context.getConnectionDetails().getProperty("datasource.driver");
	}

	private void handleStructureWrite(Structure structure, Query query, boolean bundle, ObjectMapper mapper,
			ArrayNode result) {

		if (structure instanceof JSONStructure) {
			JSONStructure jsonStructure = (JSONStructure) structure;
			ObjectNode entry = (ObjectNode) jsonStructure.getRoot();
			List<ResultElement> elements = query.elements();
			if (elements.size() > 0) {
				List<Element> rElements = jsonStructure.getElements();
				for (Element rElement : rElements) {
					if (rElement.getDefinition().getShortName().equals("id")) {
						continue;
					}
					if (rElement.getDefinition().getMin() > 0) {// include
																// mandatory
																// elements
						continue;
					}
					boolean isIncluded = false;
					for (ResultElement element : elements) {// Loop
															// over
															// Elements
						String p = element.getPath().toString();
						String de = rElement.getDefinition().getId();
						if (p.equals(de)) {// found matching
											// data
											// element
							isIncluded = true;
						}
					}
					if (isIncluded) {
						continue;
					}
					entry.remove(rElement.getDefinition().getShortName());
				}
			}
			if (bundle) {
				ObjectNode wrapper = mapper.createObjectNode();
				wrapper.put("fullUrl", entry.get("id").asText());
				wrapper.set("resource", entry);
				result.add(wrapper);
			} else {
				result.add(entry);
			}
			return;
		}

		ObjectNode entry = mapper.createObjectNode();
		entry.put("resourceType", structure.getResourceType());
		for (Element e : structure.getElements()) {
			if (e instanceof ValueElement) {
				ValueElement ve = (ValueElement) e;
				if (ve.getValue() instanceof NullNode) {
					entry.set(e.getDefinition().getShortName(), (JsonNode) ve.getValue());
					continue;
				}
				String type = e.getDefinition().getType().getId();
				switch (type) {
					case "string":
					case "code":
					case "id":
						entry.put(e.getDefinition().getShortName(), (String) ve.getValue());
						break;
					case "date":
						Date date = (Date) ve.getValue();
						entry.put(e.getDefinition().getShortName(), date.toLocaleString());
						break;
					case "dateTime":
						Timestamp ts = (Timestamp) ve.getValue();
						entry.put(e.getDefinition().getShortName(), ts.toLocaleString());
						break;
					default:
						entry.put(e.getDefinition().getShortName(), (Double) ve.getValue());
				}

			}
		}
		if (bundle) {
			ObjectNode wrapper = mapper.createObjectNode();
			if (entry.get("id") != null) { // Detailed Query
											// Resource not yet
											// have
											// an retrievable
											// url
				wrapper.put("fullUrl", entry.get("id").asText());
			}
			wrapper.set("resource", entry);
			result.add(wrapper);
		} else {
			result.add(entry);
		}
	}

	public Structure getOperationOutcome(Issue.Severity severity, String severityType, String message,
			MetaRepository repo) {
		OperationOutcome outcome = new OperationOutcomeBuilder().withIDGenerator(new UUIDGeneratorImpl())
				.addIssue(severity, severityType).withDetails(message).issue().outcome();

		ObjectMapper objectMapper = new ObjectMapper();
		return FhirUtils.toStructure((JsonNode) objectMapper.valueToTree(outcome), repo);
	}

}
