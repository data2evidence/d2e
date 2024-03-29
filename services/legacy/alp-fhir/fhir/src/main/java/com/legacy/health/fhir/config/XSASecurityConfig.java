package com.legacy.health.fhir.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("xsa")
@ImportResource({
		"classpath:spring-security-xsa.xml"
})
public class XSASecurityConfig {

}
