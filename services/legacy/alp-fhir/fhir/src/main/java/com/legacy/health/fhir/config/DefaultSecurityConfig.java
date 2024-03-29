package com.legacy.health.fhir.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile({ "default", "dev" })
@ImportResource({
		"classpath:spring-security-default.xml"
})
public class DefaultSecurityConfig {

}
