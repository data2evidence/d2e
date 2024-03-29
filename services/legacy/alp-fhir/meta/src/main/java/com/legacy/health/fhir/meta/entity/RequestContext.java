package com.legacy.health.fhir.meta.entity;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import javax.servlet.http.HttpServletRequest;

import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;

public class RequestContext implements Context {

	private String endPoint;

	private String versionId;

	private String resourceType;

	private String location;

	private MetaRepository metaRepo;

	private HttpServletRequest request;

	private static String CONNECTION_KEY = "connection";

	private Map<String, Properties> connectionDetails = new HashMap<String, Properties>();

	private Map<String, Properties> immutableConnectionDetails;

	private String activeSpringProfileConfiguration;

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getResourceType() {
		return resourceType;
	}

	public HttpServletRequest getRequest() {
		return request;
	}

	public Properties getConnectionDetails() {
		return immutableConnectionDetails.get(CONNECTION_KEY);
	}

	public void setConnectionDetails(Properties properties) {
		connectionDetails.put(CONNECTION_KEY, properties);
		immutableConnectionDetails = Collections.unmodifiableMap(connectionDetails);
	}

	public void setRequest(HttpServletRequest request) {
		this.request = request;
	}

	public MetaRepository getMetaRepo() {
		return metaRepo;
	}

	public void setMetaRepo(MetaRepository metaRepo) {
		this.metaRepo = metaRepo;
	}

	public void setResourceType(String resourceType) {
		this.resourceType = resourceType;
	}

	public String getVersionId() {
		return versionId;
	}

	public void setVersionId(String versionId) {
		this.versionId = versionId;
	}

	public String getEndPoint() {
		return endPoint;
	}

	public void setEndPoint(String endPoint) {
		this.endPoint = endPoint;
	}

	public String getActiveSpringProfileConfiguration() {
		return activeSpringProfileConfiguration;
	}

	public void setActiveSpringProfileConfiguration(String activeSpringProfileConfiguration) {
		this.activeSpringProfileConfiguration = activeSpringProfileConfiguration;
	}
}
