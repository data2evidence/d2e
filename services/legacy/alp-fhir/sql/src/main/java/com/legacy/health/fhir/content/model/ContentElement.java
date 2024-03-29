package com.legacy.health.fhir.content.model;

import com.legacy.health.fhir.content.ContentRepository;

public interface ContentElement {

	public String getId();

	public String getUrl();

	public String getVersion();

	void setContentRepository(ContentRepository repo);

}
