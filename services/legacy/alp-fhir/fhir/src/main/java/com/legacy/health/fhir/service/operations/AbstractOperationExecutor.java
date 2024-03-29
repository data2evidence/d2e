package com.legacy.health.fhir.service.operations;

import com.legacy.health.fhir.content.ContentRepositoryFactory;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import javax.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import com.legacy.health.fhir.executor.SearchExecutor;
import com.legacy.health.fhir.extension.ExtensionProvider;
import com.legacy.health.fhir.extension.extensionpoints.ExtensionPoint;
import com.legacy.health.fhir.meta.entity.RequestContext;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.queryengine.InstanceAuthorizationHook;
import com.legacy.health.fhir.meta.queryengine.QueryBuilder;
import com.legacy.health.fhir.meta.queryengine.extension.QueryExecutorExtension;
import com.legacy.health.fhir.meta.queryengine.extension.annotation.QueryAnnotation;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;

public abstract class AbstractOperationExecutor implements OperationExecutor {

	@Autowired
	@NotNull
	protected MetaRepository repository;

	@Autowired
	@NotNull
	protected QueryBuilder queryBuilder;

	@Autowired
	protected ContentRepositoryFactory contentRepositoryFactory;

	@Autowired
	@NotNull
	protected SearchExecutor searchExecutor;

	@Autowired
	protected Properties connectionProperties;

	protected InstanceAuthorizationHook authorizationHook;

	@Autowired
	String activeProfile;

	@Override
	public Structure execute(Map<String, String[]> requestParameters, Map<String, String[]> headers, Structure input,
			String schemaName) throws Exception {
		throw new UnsupportedOperationException("This operation is not supported at system-level.");
	}

	@Override
	public Structure execute(Map<String, String[]> requestParameters, Map<String, String[]> headers, Structure input,
			String schemaName, String resourceType) throws Exception {
		throw new UnsupportedOperationException("This operation is not supported at type-level.");
	}

	@Override
	public Structure execute(Map<String, String[]> requestParameters, Map<String, String[]> headers, Structure input,
			String schemaName, String resourceType, String id) throws Exception {
		throw new UnsupportedOperationException("This operation is not supported at instance-level.");
	}

	public void setAuthorizationHook(InstanceAuthorizationHook authorizationHook) {
		this.authorizationHook = authorizationHook;
	}

	protected RequestContext initializeRequestContext(String schemaName) {
		RequestContext requestContext = new RequestContext();
		requestContext.setEndPoint(schemaName);
		requestContext.setMetaRepo(repository);
		requestContext.setConnectionDetails(connectionProperties);
		requestContext.setActiveSpringProfileConfiguration(activeProfile);
		return requestContext;
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

}
