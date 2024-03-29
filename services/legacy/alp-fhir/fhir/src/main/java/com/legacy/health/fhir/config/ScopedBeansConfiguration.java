package com.legacy.health.fhir.config;

import javax.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Scope;
import org.springframework.web.context.WebApplicationContext;

import com.legacy.health.fhir.meta.json.JSONDataProvider;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;

@Lazy
@Configuration
public class ScopedBeansConfiguration {

    @Value("${spring.datasource.driver-class-name}")
    public String dataSourceDriverClassName;

    @Value("${spring.datasource.url}")
    private String dataSourceURL;

    @Value("${spring.datasource.username}")
    private String dataSourceUsername;

    @Value("${spring.datasource.password}")
    private String dataSourcePassword;

    @Autowired
    @NotNull
    private MetaRepository repository;

    @Bean
    @Scope(scopeName = WebApplicationContext.SCOPE_REQUEST)
    public JSONDataProvider jsonDataProvider() {
        JSONDataProvider provider = new JSONDataProvider();
        provider.allowAliases(true);
        provider.setMetaRepository(repository);
        return provider;
    }

}
