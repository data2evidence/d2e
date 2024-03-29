package com.legacy.health.fhir.meta.sql.queryengine;

import java.net.MalformedURLException;
import java.net.URI;
import java.sql.Connection;
import java.sql.Date;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;
import org.apache.log4j.Logger;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.NullNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.extension.ExtensionMetadata;
import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.RequestContext;
import com.legacy.health.fhir.meta.instance.Element;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.instance.ValueElement;
import com.legacy.health.fhir.meta.json.JSONStructure;
import com.legacy.health.fhir.meta.queryengine.Limit;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.queryengine.ResultElement;
import com.legacy.health.fhir.meta.queryengine.extension.QueryExecutorExtension;
import com.legacy.health.fhir.meta.repsitory.BundleStructureConsumer;
import com.legacy.health.fhir.meta.sql.RelationSchemaController;
import com.legacy.health.fhir.meta.sql.SQLContext;
import com.legacy.health.fhir.meta.sql.SQLExecutor;
import com.legacy.health.fhir.meta.sql.util.FhirUtils;
import com.legacy.health.fhir.util.UUIDGenerator;
import com.legacy.health.fhir.util.UUIDGeneratorImpl;

public class GenericQueryExecutor implements QueryExecutorExtension {

	private UUIDGenerator uuidGenerator = new UUIDGeneratorImpl();

	private ObjectMapper mapper = new ObjectMapper();

	private RelationSchemaController controller = null;

	static Logger log = Logger.getLogger(GenericQueryExecutor.class.getName());

	@Override
	public ExtensionMetadata getMetaData() {
		// TODO Auto-generated method stub
		return null;
	}

	private RelationSchemaController getSchemaController(RequestContext reqCtx, SQLContext context)
			throws SQLException {
		if (controller == null) {
			controller = RelationSchemaController.createRelationSchemaController(context.getSchema(),
					reqCtx.getConnectionDetails().getProperty("datasource.driver"));
			controller.setMetaRepository(reqCtx.getMetaRepo());
		}
		controller.setSchema(context.getSchema());
		return controller;
	}

	@Override
	public Structure doQuery(Query query, RequestContext reqCtx, boolean bundle, Context context)
			throws SQLException, FhirException {

		boolean isSelfCreatedConnection = false;
		if (context == null) {
			SQLExecutor executor = getSQLExecutor(reqCtx);
			Connection connect = executor.connect();
			context = newSQLContext(executor.getSchema(), connect); // for instance manager executor.getSchema() is
																	// PysSchema, not endpoint
			isSelfCreatedConnection = true;
		}

		if (controller != null && !controller.getSchema().equals(((SQLContext) context).getSchema())) {
			controller = null;
		}

		RelationSchemaController controller = getSchemaController(reqCtx, (SQLContext) context);
		if (query.limit() == null) {
			query.limit(new Limit().limit(25));
		}
		SQLQueryEngine engine = new SQLQueryEngine();
		engine.setSchemaControllerImpl(controller);

		ObjectNode ret = mapper.createObjectNode();
		ArrayNode result = mapper.createArrayNode();
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

		ArrayNode links = mapper.createArrayNode();

		ret.put("resourceType", "Bundle");
		ret.put("id", uuidGenerator.generateId());
		ret.set("link", links);
		ret.put("type", "searchset");

		try {
			long before = System.currentTimeMillis();
			engine.execute(query, new BundleStructureConsumer() {
				public void writeStructure(Structure structure, Context context) throws SQLException {
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
									if (p.equals(de)) {// found matching data
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
						// result.add(jsonStructure.getJson());
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
														// Resource not yet have
														// an retrievable url
							wrapper.put("fullUrl", entry.get("id").asText());
						}
						wrapper.set("resource", entry);
						result.add(wrapper);
					} else {
						result.add(entry);
					}
				}

				@Override
				public void setTotal(int total) {
					ret.put("total", total);

				}
			}, context);
			long after = System.currentTimeMillis();
			log.info(after - before);
		} catch (Exception e) {

			throw (new FhirException(e.getMessage(), e));
		} finally {
			if (isSelfCreatedConnection) {
				((SQLContext) context).getConnection().close();
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

					// URI previousURI = reqCtx.getRequest().replaceQueryParam("_count",
					// limit.limit()).replaceQueryParam("_skip", previous).build()
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
						.replaceQueryParam("_count", limit.limit()).replaceQueryParam("_skip", skip).build().toUri();
				ObjectNode next = mapper.createObjectNode();
				next.put("relation", "next");
				next.put("url", nextURI.toURL().toExternalForm());
				links.add(next);
			} // add next link
		} catch (MalformedURLException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		if (!ret.has("total")) {
			ret.put("total", result.size());
		}
		// ret.put("total",1000);
		ret.set("entry", result);

		JsonNode finalResult = ret;

		if (!bundle) {
			if (result.size() == 1) {
				finalResult = result.get(0);
			} else {
				finalResult = result;
			}
		}

		// new FhirUtils(reqCtx.getMetaRepo(), uuidGenerator);
		return FhirUtils.toStructure(finalResult, reqCtx.getMetaRepo());
	}

	private SQLContext newSQLContext(String schemaName, Connection connection) throws SQLException {
		SQLContext context = new SQLContext();
		context.setConnection(connection);
		context.setController(controller);
		// so that the new schemaID corresponding to schema from instManager, or the
		// endPoint name can be stored and retrieved
		context.setSchema(schemaName);
		return context;
	}

	private SQLExecutor getSQLExecutor(RequestContext reqCtx) throws FhirException, SQLException {
		SQLExecutor sqlExecutor = new SQLExecutor();
		sqlExecutor.setSchema(reqCtx.getEndPoint());
		sqlExecutor.connect(reqCtx.getConnectionDetails(), true, reqCtx.getActiveSpringProfileConfiguration());
		return sqlExecutor;
	}

	@Override
	public String getRepositoryType() {
		return "generic";
	}
}
