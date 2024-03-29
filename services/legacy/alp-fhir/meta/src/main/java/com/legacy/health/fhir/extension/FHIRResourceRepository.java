package com.legacy.health.fhir.extension;

import java.util.List;
import java.util.Map;

import com.legacy.health.fhir.extension.exceptions.FHIRResourceHandlingException;
import com.legacy.health.fhir.extension.extensionpoints.ExtensionPoint;
import com.legacy.health.fhir.extension.extensionpoints.annotations.FHIRResourceAnnotation;
import com.legacy.health.fhir.meta.entity.RequestContext;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.Structure;

@com.legacy.health.fhir.extension.extensionpoints.annotations.FHIRResourceAnnotation
public interface FHIRResourceRepository extends Extension {

	public String getRepositoryType();

	public Structure doInit(Structure resource, RequestContext reqCtx) throws FHIRResourceHandlingException;

	public TransactionContext startTransaction(boolean autocommit, RequestContext reqCtx)
			throws FHIRResourceHandlingException;

	public Structure createResource(Structure resource, RequestContext reqCtx, TransactionContext ctx)
			throws FHIRResourceHandlingException;

	public Structure updateResource(Structure resource, StructureDefinition sd, RequestContext reqCtx,
			TransactionContext ctx) throws FHIRResourceHandlingException;

	public default Structure grantRole(Object scenario, Object roleDefinition, String user, RequestContext reqCtx,
			TransactionContext ctx) throws FHIRResourceHandlingException {
		throw new UnsupportedOperationException();
	}

	public default Structure revokeRole(Object scenario, Object roleDefinition, String user, RequestContext reqCtx,
			TransactionContext ctx) throws FHIRResourceHandlingException {
		throw new UnsupportedOperationException();
	}

	public default Structure fullDeletePatient(String id, RequestContext reqCtx, TransactionContext ctx)
			throws FHIRResourceHandlingException {
		throw new UnsupportedOperationException();
	}

	public default Structure fullGetPatient(String id, RequestContext reqCtx, TransactionContext ctx)
			throws FHIRResourceHandlingException {
		throw new UnsupportedOperationException();
	}

	public void deleteResource(String resourceId, StructureDefinition sd, RequestContext reqCtx, TransactionContext ctx)
			throws FHIRResourceHandlingException;

	public Structure readResource(String resourceId, StructureDefinition sd, RequestContext reqCtx,
			TransactionContext ctx) throws FHIRResourceHandlingException;

	public Structure readResourceByCanonicalID(String url, String version, StructureDefinition sd,
			RequestContext reqCtx, TransactionContext ctx) throws FHIRResourceHandlingException;

	public Structure readResourceByVersion(String resourceId, StructureDefinition sd, RequestContext reqCtx,
			TransactionContext ctx) throws FHIRResourceHandlingException;

	public List<Structure> readResourceHistory(String resourceId, StructureDefinition sd, RequestContext reqCtx,
			TransactionContext ctx) throws FHIRResourceHandlingException;

	public default Map<String, Boolean> checkResourceIds(List<Structure> structures, RequestContext reqCtx,
			TransactionContext ctx) throws FHIRResourceHandlingException {
		throw new UnsupportedOperationException();
	}

	public default Map<String, Boolean> checkCanonicalIds(List<Structure> structures, RequestContext reqCtx,
			TransactionContext ctx) throws FHIRResourceHandlingException {
		throw new UnsupportedOperationException();
	}

	public static FHIRResourceRepository getFHIRResourceRepoExtension() {
		String type = "generic";
		return getFHIRResourceRepoExtension(type);
	}

	public static FHIRResourceRepository getFHIRResourceRepoExtension(String type) {
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

	public default String getTechnicalID(RequestContext reqCtx) {
		return "";
	}
}
