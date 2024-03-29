package com.legacy.health.fhir.service;

import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.content.ContentRepository;
import com.legacy.health.fhir.content.ContentRepositoryFactory;
import com.legacy.health.fhir.content.model.Scenario;
import com.legacy.health.fhir.exception.InvalidConditionException;
import com.legacy.health.fhir.exception.InvalidResourceException;
import com.legacy.health.fhir.exception.ResourceNotFoundException;
import com.legacy.health.fhir.extension.FHIRResourceRepository;
import com.legacy.health.fhir.extension.TransactionContext;
import com.legacy.health.fhir.extension.exceptions.FHIRResourceHandlingException;
import com.legacy.health.fhir.helper.FhirUtils;
import com.legacy.health.fhir.meta.ResourceTypeNotSupportedException;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.RequestContext;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.ArrayElement;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.instance.ValueElement;
import com.legacy.health.fhir.meta.queryengine.Expression;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.queryengine.ResultElement;
import com.legacy.health.fhir.meta.xml.XMLStructure;
import com.legacy.health.fhir.util.UUIDGenerator;
import com.legacy.health.fhir.util.Utils;

@Service
public class FHIRResourceService extends AbstractService {

	@Autowired
	private FHIRSearchService searchService;

	@Autowired
	@NotNull
	private UUIDGenerator uuidGenerator;

	@Autowired
	private FHIRResourceValidatorService validatorService;

	// Always creates new version
	@Transactional(rollbackFor = SQLException.class)
	public Structure create(String schemaName, String resourceType, Structure resource,
			TransactionContext transactionContext) throws SQLException, FhirException {

		FHIRResourceRepository resourceRepoExtension = getFHIRResourceRepoExtension();
		RequestContext requestContext = initializeRequestContext(schemaName);
		if (resource.getId() == null) {
			return checkedCreate(schemaName, resourceType, resource, transactionContext);
		}
		List<Structure> chk = new ArrayList<Structure>();
		chk.add(resource);
		Map<String, Boolean> ids = resourceRepoExtension.checkResourceIds(chk, requestContext, transactionContext);
		if (ids.get(resource.getId()) == false) {
			return checkedCreate(schemaName, resourceType, resource, transactionContext);
		} else {
			return update(schemaName, resourceType, resource.getId(), resource, transactionContext);
		}
	}

	private Structure checkedCreate(String schemaName, String resourceType, Structure resource,
			TransactionContext transactionContext)
			throws FhirException, SQLException, FHIRResourceHandlingException {

		HashMap<String, String> operation = new HashMap<String, String>();
		operation.put("operation", "create");

		FHIRResourceRepository resourceRepoExtension = getFHIRResourceRepoExtension();
		RequestContext requestContext = initializeRequestContext(schemaName);
		if (resource instanceof XMLStructure) {
			resource = FhirUtils.toStructure(FhirUtils.toJson(resource));
		}
		resourceRepoExtension.createResource(resource, requestContext, transactionContext);
		return resource;
	}

	@Transactional(rollbackFor = SQLException.class)
	public Structure create(String schemaName, String resourceType, Structure resource,
			Map<String, String[]> parameters, TransactionContext transactionContext)
			throws SQLException, FhirException {

		// validate capability for an endpoint
		validatorService.validateCapabilityAgainstEndpoint(schemaName, resourceType, "create", null,
				contentRepositoryFactory, searchExecutor, repository, connectionProperties);

		Structure result = searchService.search(schemaName, resourceType, parameters);
		int count = ((ArrayElement) result.getElementByPath(result.getResourceType() + ".entry")).getElements().size();
		switch (count) {
			case 0:
				return create(schemaName, resourceType, resource, transactionContext);
			case 1:
				if (resource instanceof XMLStructure) {
					resource = FhirUtils.toStructure(FhirUtils.toJson(resource));
				}
				return resource;
			default:
				throw new InvalidConditionException("Criteria not selective enough.", null);
		}
	}

	public TransactionContext startTransaction(String schemaName, boolean batch) throws FhirException {
		FHIRResourceRepository resourceRepoExtension = getFHIRResourceRepoExtension();
		RequestContext requestContext = initializeRequestContext(schemaName);
		return resourceRepoExtension.startTransaction(batch, requestContext);
	}

	public List<Structure> processResources(String schemaName, List<Structure> resources,
			TransactionContext transactionContext) throws FhirException, SQLException {

		// Map<String, Set<String>> resourceTypeIdMapping = new HashMap<>();
		List<Structure> chk = new ArrayList<Structure>();
		for (Structure resource : resources) {
			if (resource == null)
				continue;
			chk.add(resource);
		}

		FHIRResourceRepository resourceRepoExtension = getFHIRResourceRepoExtension();
		RequestContext requestContext = initializeRequestContext(schemaName);
		long start = System.currentTimeMillis();
		Map<String, Boolean> ids = resourceRepoExtension.checkResourceIds(chk, requestContext, transactionContext);
		long stop = System.currentTimeMillis();
		logger.info("Check IDs:" + (stop - start));

		start = System.currentTimeMillis();
		Map<String, Boolean> canonicalIds = resourceRepoExtension.checkCanonicalIds(chk, requestContext,
				transactionContext);
		stop = System.currentTimeMillis();
		logger.info("Check checkCanonicalIds:" + (stop - start));

		List<Structure> result = new ArrayList<>();

		for (Structure resource : resources) {
			if (resource == null)
				continue;
			String resourceType = resource.getResourceType();
			if (resource.getId() != null && ids.get(resource.getId()) == true) {
				if (!schemaName.equals(ContentRepositoryFactory.CONTENT_SCHEMA)) { // In case of "content" do not update
																					// even though entry is present
					result.add(update(schemaName, resourceType, resource.getId(), resource, transactionContext));
				} else {
					logger.info("Skipped updating for endpoint content : resource type <" + resourceType
							+ ">  with id  <" + resource.getId() + ">");
				}
			} else if (schemaName.equals(ContentRepositoryFactory.CONTENT_SCHEMA)) {

				String canonicalIDResource = resource.getCanonicalReference();

				if (canonicalIds != null && canonicalIDResource != null
						&& canonicalIds.get(canonicalIDResource) == false) { // if canonical is present with different
																				// id then do not create .
					result.add(checkedCreate(schemaName, resourceType, resource, transactionContext));
				} else {
					logger.info("Skipped processing resource type <" + resourceType + ">  with id  <" + resource.getId()
							+ ">  and canonical id  <" + canonicalIDResource + ">");
					continue;
				}
			} else {
				result.add(checkedCreate(schemaName, resourceType, resource, transactionContext));
			}
		}
		return result;
	}

	@Transactional(readOnly = true)
	public boolean exists(String schemaName, String resourceType, String id)
			throws SQLException, FhirException {
		// Is this 404 or capability not supported?
		if (repository.getStructureDefinitionById(resourceType) == null) {
			return false;
		}

		id = Utils.checkUUID(id);
		StructureDefinition structureDefinition = queryBuilder.sd(resourceType);
		ResultElement idAttribute = queryBuilder.out(structureDefinition, String.format("%s.id", resourceType));
		Query query = queryBuilder.query(resourceType).from(queryBuilder.from(structureDefinition))
				.filter(queryBuilder.eq(idAttribute, queryBuilder.string(id))).out(idAttribute);

		Structure resultNode = getQueryExecutorExtension().doQuery(query, initializeRequestContext(schemaName), false,
				null);

		if (resultNode == null || resultNode.getElements().isEmpty()) {
			return false;
		}

		return true;
	}

	private Expression buildORTree(ResultElement idAttribute, Set<String> resourceIds) {
		Queue<Expression> queue = new LinkedList<>();

		for (String resourceId : resourceIds) {
			queue.offer(queryBuilder.eq(idAttribute, queryBuilder.string(resourceId)));
		}

		while (queue.size() > 1) {
			Expression exp1 = queue.poll();
			Expression exp2 = queue.poll();

			queue.offer(queryBuilder.or(exp1, exp2));
		}

		return queue.poll();
	}

	public Map<String, Set<String>> existsAll(String schemaName, Map<String, Set<String>> resourceTypeIdMapping)
			throws SQLException, FhirException {
		Map<String, Set<String>> result = new HashMap<>();
		for (Map.Entry<String, Set<String>> entry : resourceTypeIdMapping.entrySet()) {
			String resourceType = entry.getKey();
			logger.debug("Resource Type [" + resourceType + "] : Check for IDs " + entry.getValue());
			StructureDefinition structureDefinition = queryBuilder.sd(resourceType);
			ResultElement idAttribute = queryBuilder.out(structureDefinition, String.format("%s.id", resourceType));
			Query query = queryBuilder.query(resourceType).from(queryBuilder.from(structureDefinition))
					.filter(buildORTree(idAttribute, entry.getValue())).out(idAttribute);

			Object resultNode = getQueryExecutorExtension()
					.doQuery(query, initializeRequestContext(schemaName), false, null).getRoot();

			Set<String> resultIds = new HashSet<>();
			if (resultNode instanceof ObjectNode) {
				resultIds.add(((ObjectNode) resultNode).get("id").asText());
			} else if (resultNode instanceof ArrayNode) {
				for (int i = 0; i < ((ArrayNode) resultNode).size(); i++) {
					resultIds.add(((ArrayNode) resultNode).get(i).get("id").asText());
				}
			}

			logger.debug("Resource Type [" + resourceType + "] : Existing IDs " + resultIds);

			if (!resultIds.isEmpty())
				result.put(resourceType, resultIds);

		}
		return result;
	}

	@Transactional(readOnly = true)
	public Structure read(String schemaName, String resourceType, String id, HttpServletRequest request)
			throws SQLException, FhirException {

		// validate capability for an endpoint
		validatorService.validateCapabilityAgainstEndpoint(schemaName, resourceType, "read", null,
				contentRepositoryFactory, searchExecutor, repository, connectionProperties);

		FHIRResourceRepository resourceRepoExtension = null;
		Structure resultNode = null;

		ContentRepository repo = this.contentRepositoryFactory.getContentRepository();
		Scenario scenario = repo.getScenarioForEndpoint(schemaName);

		if (scenario != null) {

			String category = scenario.getDefinition().getCategory();
			resourceRepoExtension = getFHIRResourceRepoExtension(category);

		} else {

			HashMap<String, String> operation = new HashMap<String, String>();
			operation.put("operation", "read");

			if (repository.getStructureDefinitionById(resourceType) == null) {
				throw new ResourceTypeNotSupportedException(
						String.format("Resource Type [%s] Not Supported", resourceType),
						null);
			}

			resourceRepoExtension = getFHIRResourceRepoExtension();
		}

		RequestContext requestContext = initializeRequestContext(schemaName);
		requestContext.setResourceType(resourceType);
		requestContext.setRequest(request);
		requestContext.setActiveSpringProfileConfiguration(activeProfile);

		Map<String, String[]> parameters = new HashMap<>();
		parameters.put("_id", new String[] { id });

		if (scenario != null) {
			resultNode = searchService.search(schemaName, resourceType, parameters);

			if (resultNode != null) {

				JsonNode bundleAsJson = FhirUtils.toJson(resultNode);

				JsonNode entries = bundleAsJson.get("entry");

				for (JsonNode entry : entries) {
					JsonNode resource = entry.get("resource");
					return FhirUtils.toStructure(resource);
				}

				if (entries.size() == 0) {
					throw new ResourceNotFoundException(
							String.format("Resource [%s] with id [%s] not found.", resourceType, id), null);

				}
			}
		} else {
			resultNode = resourceRepoExtension.readResource(id, repository.getStructureDefinitionById(resourceType),
					requestContext, null);
		}

		if (resultNode == null || resultNode.getElements().isEmpty()) {
			throw new ResourceNotFoundException(
					String.format("Resource [%s] with id [%s] not found.", resourceType, id), null);
		}

		return resultNode;
	}

	@Transactional(rollbackFor = SQLException.class)
	public Structure update(String schemaName, String resourceType, String id, Structure resource,
			TransactionContext transactionContext) throws FhirException, SQLException {

		// validate capability for an endpoint
		validatorService.validateCapabilityAgainstEndpoint(schemaName, resourceType, "update", null,
				contentRepositoryFactory, searchExecutor, repository, connectionProperties);

		// check resource security authorization
		// write for single record
		HashMap<String, String> operation = new HashMap<String, String>();
		operation.put("operation", "update");
		FHIRResourceRepository resourceRepoExtension = getFHIRResourceRepoExtension();
		RequestContext requestContext = initializeRequestContext(schemaName);
		return resourceRepoExtension.updateResource(resource, repository.getStructureDefinitionById(resourceType),
				requestContext, transactionContext);
	}

	@Transactional(rollbackFor = SQLException.class)
	public Structure update(String schemaName, String resourceType, Map<String, String[]> parameters,
			Structure resource, TransactionContext transactionContext) throws FhirException, SQLException {

		if (parameters == null || parameters.isEmpty()) {
			return create(schemaName, resourceType, resource, transactionContext);
		}

		Structure result = searchService.search(schemaName, resourceType, parameters);
		int count = ((ArrayElement) result.getElementByPath(result.getResourceType() + ".entry")).getElements().size();
		switch (count) {
			case 0:
				return create(schemaName, resourceType, resource, transactionContext);
			case 1:
				String id = ((ValueElement) result
						.getElementByPath(String.format("%s.entry[0].resource.id", result.getResourceType())))
						.getValue()
						.toString();
				resource.setId(id);
				return update(schemaName, resourceType, resource.getId(), resource, transactionContext);
			default:
				throw new InvalidConditionException("Criteria not selective enough.", null);
		}
	}

	@Transactional(rollbackFor = SQLException.class)
	public void delete(String schema, String resourceType, String id, boolean ownTransaction, boolean markAsDeleted,
			TransactionContext transactionContext) throws FhirException, SQLException {

		// validate capability for an endpoint
		validatorService.validateCapabilityAgainstEndpoint(schema, resourceType, "delete", null,
				contentRepositoryFactory, searchExecutor, repository, connectionProperties);

		// check resource security authorization
		// delete for single record
		HashMap<String, String> operation = new HashMap<String, String>();
		operation.put("operation", "delete");
		FHIRResourceRepository resourceRepoExtension = getFHIRResourceRepoExtension();
		RequestContext requestContext = initializeRequestContext(schema);
		resourceRepoExtension.deleteResource(id, repository.getStructureDefinitionById(resourceType), requestContext,
				transactionContext);
	}

	@Transactional(rollbackFor = SQLException.class)
	public Structure processStream(String schemaName, InputStream inputStream, boolean flushData)
			throws FhirException, SQLException {
		try {
			Structure resource = FhirUtils.toStructure(objectMapper.readTree(inputStream));
			return update(schemaName, resource.getResourceType(), resource.getId(), resource, null);
		} catch (ClassCastException | IOException ex) {
			throw new InvalidResourceException(String.format("Invalid or Non-Parseable Resource Content."), ex);
		}
	}

}
