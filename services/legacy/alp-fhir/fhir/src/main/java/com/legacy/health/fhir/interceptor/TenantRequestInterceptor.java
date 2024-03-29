package com.legacy.health.fhir.interceptor;

import com.legacy.health.fhir.content.ContentRepositoryFactory;
import com.legacy.health.fhir.content.model.Scenario;
import com.legacy.health.fhir.exception.TenantNotInitializedException;
import com.legacy.health.fhir.meta.sql.SQLExecutor;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Properties;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

public class TenantRequestInterceptor extends HandlerInterceptorAdapter {

	@Autowired
	private BeanFactory beanFactory;

	@Autowired
	private ContentRepositoryFactory factory;

	@Autowired
	Environment environment;

	@Autowired
	String activeProfile;

	@SuppressWarnings("unused")
	private static Logger log = LoggerFactory.getLogger(TenantRequestInterceptor.class);

	@Autowired
	protected Properties connectionProperties;

	@SuppressWarnings("unchecked")
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		LinkedHashMap<String, String> templateVariables = (LinkedHashMap) request
				.getAttribute("org.springframework.web.servlet.HandlerMapping.uriTemplateVariables");
		if (templateVariables == null || templateVariables.isEmpty()) {
			// Something is wrong. 'schema' (tenantId) is mandatory.
			return false;
		}
		String endpointName = templateVariables.get("schema");
		String schemaName = endpointName.toUpperCase(Locale.ENGLISH);

		SQLExecutor executor = new SQLExecutor();// this.beanFactory.getBean(SQLExecutor.class);
		try {
			executor.setSchema(endpointName);

			// executor.connect(this.beanFactory.getBean(Connection.class));
			// executor.connect(this.beanFactory.getBean(DataSource.class));

			assert environment.getActiveProfiles().length == 1;

			executor.connect(connectionProperties, environment.getActiveProfiles()[0]);
			// templateVariables.put("schema", schemaName); // Uncomment this line to set
			// the schema name to uppercase globally

			if (environment.getActiveProfiles()[0].equals("xsa")) {
				// dealing with case when schema is generated through endpoint as tenent using
				// instance manager
				if (!executor.schemaExists(executor.getSchema())) {
					throw new TenantNotInitializedException(
							String.format("Endpoint [%s] does not exist.", endpointName), null);
				}
			} else {
				// dealing with cases when endpoint has a seperate schema assigned
				if (!executor.schemaExists(executor.getSchema())) {
					if (executor.schemaExists(ContentRepositoryFactory.CONTENT_SCHEMA)) {
						List<Scenario> scenarios = factory.getContentRepository().getAllScenarios();
						for (Scenario scenario : scenarios) {
							String endpoint = getEndpoint(scenario);
							if (endpointName.equals(endpoint)) {
								return true;
							}
						}
					}
					throw new TenantNotInitializedException(String.format("Endpoint [%s] does not exist.", schemaName),
							null);
				}
			}
		} finally {
			executor.closeConnection();
		}

		return true;
	}

	protected String getEndpoint(Scenario scenario) {
		List<Scenario.Parameter> list = scenario.getParameter();
		for (Scenario.Parameter parameter : list) {
			if ("endpoint".equals(parameter.getName())) {
				return parameter.getValueString();
			}
		}
		return null;
	}

}
