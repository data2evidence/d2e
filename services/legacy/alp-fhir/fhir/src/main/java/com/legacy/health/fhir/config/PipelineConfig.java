package com.legacy.health.fhir.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PipelineConfig {

	@Value("${spring.datasource.pipeline.api-class:}")
	public String apiclassname;

	@Value("${spring.datasource.pipeline.tenant:}")
	public String tenant;

	@Value("${spring.datasource.pipeline.topic-prefix:}")
	public String topicprefix;

}
