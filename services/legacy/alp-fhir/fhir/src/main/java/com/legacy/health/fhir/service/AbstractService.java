package com.legacy.health.fhir.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.legacy.health.fhir.content.ContentRepositoryFactory;
import com.legacy.health.fhir.executor.SearchExecutor;
import com.legacy.health.fhir.extension.ExtensionProvider;
import com.legacy.health.fhir.extension.FHIRResourceRepository;
import com.legacy.health.fhir.extension.extensionpoints.ExtensionPoint;
import com.legacy.health.fhir.extension.extensionpoints.annotations.FHIRResourceAnnotation;
import com.legacy.health.fhir.meta.AuthorizationException;
import com.legacy.health.fhir.meta.ResourceTypeNotSupportedException;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.RequestContext;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.queryengine.Expression;
import com.legacy.health.fhir.meta.queryengine.InstanceAuthorizationHook;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.queryengine.QueryBuilder;
import com.legacy.health.fhir.meta.queryengine.extension.MartControllerExtension;
import com.legacy.health.fhir.meta.queryengine.extension.QueryExecutorExtension;
import com.legacy.health.fhir.meta.queryengine.extension.annotation.MartControllerAnnotation;
import com.legacy.health.fhir.meta.queryengine.extension.annotation.QueryAnnotation;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;

import java.sql.SQLException;
import java.util.List;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;

public abstract class AbstractService implements InstanceAuthorizationHook {

	protected final Logger logger;

	@Autowired
	public AbstractService() {
		this.logger = LoggerFactory.getLogger(getClass());
	}

	@Autowired
	Environment environment;

	@Autowired
	protected BeanFactory factory;

	@Autowired
	protected MetaRepository repository;

	@Autowired
	protected QueryBuilder queryBuilder;

	@Autowired
	protected ContentRepositoryFactory contentRepositoryFactory;

	@Autowired
	protected SearchExecutor searchExecutor;

	@Autowired
	protected ObjectMapper objectMapper;

	@Autowired
	protected Properties connectionProperties;

	@Autowired
	protected String activeProfile;

	protected List<MartControllerExtension> getMartExtension() {
		ExtensionPoint<MartControllerAnnotation, MartControllerExtension> martExtension = new ExtensionPoint<>(
				MartControllerAnnotation.class, MartControllerExtension.class);
		return ExtensionProvider.getExtensionsForExtensionPoint(martExtension);

	}

	protected FHIRResourceRepository getFHIRResourceRepoExtension() {
		String type = "generic";
		return this.getFHIRResourceRepoExtension(type);
	}

	protected FHIRResourceRepository getFHIRResourceRepoExtension(String type) {
		ExtensionPoint<FHIRResourceAnnotation, FHIRResourceRepository> sqlExtension = new ExtensionPoint<>(
				FHIRResourceAnnotation.class, FHIRResourceRepository.class);
		List<FHIRResourceRepository> extensionsForExtensionPoint = ExtensionProvider
				.getExtensionsForExtensionPoint(sqlExtension);
		for (FHIRResourceRepository repo : extensionsForExtensionPoint) {
			if (type.equals(repo.getRepositoryType())) {
				return repo;
			}
		}
		return null;
	}

	protected QueryExecutorExtension getQueryExecutorExtension() {
		String type = "generic";
		return this.getQueryExecutorExtension(type);
	}

	protected QueryExecutorExtension getQueryExecutorExtension(String type) {
		ExtensionPoint<QueryAnnotation, QueryExecutorExtension> queryExecutorExtension = new ExtensionPoint<>(
				QueryAnnotation.class, QueryExecutorExtension.class);
		List<QueryExecutorExtension> extensionsForExtensionPoint = ExtensionProvider
				.getExtensionsForExtensionPoint(queryExecutorExtension);
		for (QueryExecutorExtension exec : extensionsForExtensionPoint) {
			if (type.equals(exec.getRepositoryType())) {
				return exec;
			}
		}
		return null;
	}

	protected RequestContext initializeRequestContext(String schemaName) {
		RequestContext requestContext = new RequestContext();
		requestContext.setEndPoint(schemaName);
		requestContext.setMetaRepo(repository);
		requestContext.setActiveSpringProfileConfiguration(activeProfile);
		requestContext.setConnectionDetails(connectionProperties);
		return requestContext;
	}

	public void injectInstanceAuthorization(String schema, String resourceType, Query query)
			throws SQLException, FhirException, ResourceTypeNotSupportedException, AuthorizationException {
		/**
		 * Utilize the Security Parameters from the Security Check
		 * Filter out only the data relevent for the user
		 * filter to be applied on the main query out of Security parameters
		 */
		assert environment.getActiveProfiles().length == 1;
		// retrieve the instance based auth attribute elements < fluentPath,
		// attributeValue corresponding to $attr.attributeName >
		// guard the data with what user is able to see
		// if grant present for groupID use the elementMap to filter data
		// if no grant is defined for groupID ( no authorization required, proceed with
		// URL parameters )
		//// ( SECOND Security Check For Data accessibility, Utilizing grants from
		// Permission
		activeProfile = environment.getActiveProfiles()[0];
		if (activeProfile.equalsIgnoreCase("xsa") && !schema.equalsIgnoreCase("content")) {
			boolean skipInstanceAuthCheck = false;
			if (!skipInstanceAuthCheck) {
				Expression filterExpression = query.filter();
				QueryBuilder qb = new QueryBuilder();
				qb.setMetaRepository(repository);
				StructureDefinition typeSD = qb.sd(resourceType);
				query.filter(filterExpression);
			}

		}
	}
}
