package com.legacy.health.fhir.content;

import java.util.Properties;

import com.legacy.health.fhir.meta.entity.RequestContext;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.sql.GenericFHIRResoureRepository;
import com.legacy.health.fhir.meta.sql.queryengine.GenericQueryExecutor;

public class ContentRepositoryFactory {
	protected ContentRepository repo;
	protected MetaRepository metaRepository;
	public static final String CONTENT_SCHEMA = "content";
	protected Properties connectionProperties;
	private String activeProfile;

	public ContentRepository getContentRepository() {
		if (repo == null) {
			RequestContext ctx = new RequestContext();
			ctx.setEndPoint(CONTENT_SCHEMA);
			ctx.setConnectionDetails(connectionProperties);
			ctx.setMetaRepo(metaRepository);
			ctx.setActiveSpringProfileConfiguration(activeProfile);
			GenericFHIRResoureRepository resourceRepo = new GenericFHIRResoureRepository();
			GenericQueryExecutor queryExecutor = new GenericQueryExecutor();
			repo = new ContentRepository();
			repo.setInnerRepository(resourceRepo);
			repo.setQueryExecutor(queryExecutor);
			repo.setRequestContext(ctx);
		}

		return repo;
	}

	public void setMetaRepository(MetaRepository repo) {
		this.metaRepository = repo;
	}

	public void setConntectionProperties(Properties prop) {
		this.connectionProperties = prop;
	}

	public void setActiveProfile(String profile) {
		this.activeProfile = profile;
	}
}
