package com.legacy.health.fhir.meta.queryengine.extension;

import java.sql.SQLException;

import com.legacy.health.fhir.extension.Extension;
import com.legacy.health.fhir.extension.extensionpoints.ExtensionPoint;
import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.RequestContext;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.queryengine.extension.annotation.QueryAnnotation;

@com.legacy.health.fhir.meta.queryengine.extension.annotation.QueryAnnotation
public interface QueryExecutorExtension extends Extension {

	public String getRepositoryType();

	public Structure doQuery(Query query, RequestContext reqCtx, boolean bundle, Context context)
			throws SQLException, FhirException;

	public static ExtensionPoint<QueryAnnotation, QueryExecutorExtension> QueryExecutor() {
		return new ExtensionPoint<>(QueryAnnotation.class, QueryExecutorExtension.class);
	}

}
