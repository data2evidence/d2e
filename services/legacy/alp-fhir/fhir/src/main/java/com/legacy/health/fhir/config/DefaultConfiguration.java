package com.legacy.health.fhir.config;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Locale;
import java.util.Properties;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.AsyncRestTemplate;
import org.springframework.web.client.DefaultResponseErrorHandler;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legacy.health.fhir.content.ContentRepositoryFactory;
import com.legacy.health.fhir.exception.UnsupportedFormatException;
import com.legacy.health.fhir.executor.SearchExecutor;
import com.legacy.health.fhir.helper.FhirMediaTypes;
import com.legacy.health.fhir.meta.AuthorizationException;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.queryengine.QueryBuilder;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.RepositoryBuilder;
import com.legacy.health.fhir.meta.repsitory.ZipSpecificationProvider;
import com.legacy.health.fhir.util.UUIDGenerator;
import com.legacy.health.fhir.util.UUIDGeneratorImpl;

@Configuration
@Lazy
@EnableAutoConfiguration(exclude = { DataSourceAutoConfiguration.class })
public class DefaultConfiguration {

    @Value("${sap.sql.path}")
    private String zipFile;

    @Value("${spring.datasource.url}")
    private String url;

    @Value("${spring.datasource.username:dummyUser}")
    private String username;

    @Value("${spring.datasource.password:dummyPassword}")
    private String password;

    @Value("${spring.datasource.driver-class-name}")
    private String driver;

    @Value("${spring.datasource.hikari.maximum-pool-size}")
    private String maxPoolSize;

    @Value("${spring.datasource.hikari.leak-detection-threshold}")
    private String leakDetectionTrashold;

    @Value("${query.result.limit:300}")
    private String resultLimit;

    @Autowired
    Environment environment;

    protected final Logger logger = LoggerFactory.getLogger(getClass());

    private MetaRepository repo = null;

    private InputStream cloneInputStream(final ZipInputStream input) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        IOUtils.copy(input, outputStream);
        return new ByteArrayInputStream(outputStream.toByteArray());
    }

    @Bean
    public Integer queryResultLimit() {
        if (resultLimit != null) {
            return Integer.parseInt(resultLimit);
        }
        return 300; // Default value if null specidfied
    }

    @Bean
    public String activeProfile() {
        String activeProfile = null;
        for (String profile : environment.getActiveProfiles()) {
            switch (profile.toLowerCase(Locale.ENGLISH)) {
                case "xsa":
                case "default":
                case "dev":
                case "test":
                    activeProfile = profile;
                    break;
                default:
                    activeProfile = null;
                    break;
            }
        }
        return activeProfile;
    }

    @Bean
    public MetaRepository metaRepository() throws IOException, FhirException {
        if (repo == null) {
            if (!zipFile.substring(zipFile.lastIndexOf(".")).equalsIgnoreCase(".zip")) {
                throw new UnsupportedFormatException("Unknown format of fhir specification. Expecting zip file.", null);
            }
            try (InputStream inStream = DefaultConfiguration.class.getResourceAsStream(String.format("/%s", zipFile));
                    ZipInputStream inputStream = new ZipInputStream(inStream);) {
                ZipSpecificationProvider provider = new ZipSpecificationProvider();
                provider.processZipInputStream(inputStream);
                repo = RepositoryBuilder.createRepository(provider);

                try (ZipInputStream zis = new ZipInputStream(ContentRepositoryFactory.class
                        .getResourceAsStream(String.format("/%s", "content/content_definition.zip")))) {
                    // ZipFile zipFile = new
                    // ZipFile(DefaultConfiguration.class.getResource(String.format("/%s",
                    // "content_definition.zip")).getFile());
                    ZipEntry entry = null;
                    // Enumeration<? extends ZipEntry> entries = zipFile.entries();
                    while ((entry = zis.getNextEntry()) != null) {
                        // ZipEntry entry = (ZipEntry) entries.nextElement();
                        if (!entry.isDirectory() && entry.getName().endsWith(".json")) {
                            InputStream is = cloneInputStream(zis);
                            JsonNode node = objectMapper().readTree(is);
                            RepositoryBuilder.registerSingleStructureDefinition(repo, node);
                        }
                    }
                }

                return repo;
            } catch (IOException ex) {
                logger.error("Unable to load MetaRepository: " + ex.getMessage());
                throw ex;
            }
        }
        return repo;
    }

    @Bean
    public QueryBuilder queryBuilder() throws IOException, FhirException {
        QueryBuilder queryBuilder = new QueryBuilder();
        queryBuilder.setMetaRepository(metaRepository());
        return queryBuilder;
    }

    @Bean
    public ContentRepositoryFactory contentRepositoryFactory() throws IOException, FhirException {
        ContentRepositoryFactory ret = new ContentRepositoryFactory();
        ret.setConntectionProperties(getConnectionProperties());
        ret.setMetaRepository(metaRepository());
        String activeProfile = null;
        for (String profile : environment.getActiveProfiles()) {
            switch (profile.toLowerCase(Locale.ENGLISH)) {
                case "xsa":
                case "default":
                case "test":
                case "dev":
                    activeProfile = profile;
                    break;
                default:
                    throw new AuthorizationException("FHIR Authorization, Not a valid Profile run: " + profile, null);
            }
        }
        ret.setActiveProfile(activeProfile);
        return ret;
    }

    // @Bean
    // public SQLProviderFactory sqlProvider() {
    // return SQLProviderFactory.createInstance(dataSource);
    // }

    private ObjectMapper mapper;

    @Bean
    public ObjectMapper objectMapper() {
        if (mapper == null) {
            mapper = new ObjectMapper();
        }
        return mapper;
    }

    // @Bean
    // public QueryExecutor elmQueryExecutor() {
    // QueryExecutor executor = new QueryExecutor();
    // executor.init();
    // return executor;
    // }

    @Bean
    public SearchExecutor searchExecutor() {
        return new SearchExecutor();
    }

    @Bean
    public UUIDGenerator uuidGenerator() {
        return new UUIDGeneratorImpl();
    }

    @Bean
    public RestTemplate restTemplate() {
        RestTemplate rest = new RestTemplate();

        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        converter.setSupportedMediaTypes(Arrays.asList(new MediaType[] { FhirMediaTypes.FHIR_JSON,
                MediaType.APPLICATION_JSON, MediaType.APPLICATION_OCTET_STREAM }));
        rest.setMessageConverters(Arrays.asList(converter));

        rest.setErrorHandler(new DefaultResponseErrorHandler() {
            @Override
            protected boolean hasError(HttpStatus statusCode) {
                return false;
            }

        });
        return rest;
    }

    @Bean
    public AsyncRestTemplate asyncRestTemplate() {
        AsyncRestTemplate rest = new AsyncRestTemplate();

        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        converter.setSupportedMediaTypes(Arrays.asList(new MediaType[] { FhirMediaTypes.FHIR_JSON,
                MediaType.APPLICATION_JSON, MediaType.APPLICATION_OCTET_STREAM }));
        rest.setMessageConverters(Arrays.asList(converter));

        rest.setErrorHandler(new DefaultResponseErrorHandler() {
            @Override
            protected boolean hasError(HttpStatus statusCode) {
                return false;
            }

        });
        return rest;
    }

    @Bean
    @Primary
    public Properties getConnectionProperties() {
        Properties prop = new Properties();
        prop.setProperty("datasource.driver", driver);
        prop.setProperty("datasource.url", url);
        prop.setProperty("datasource.username", username);
        prop.setProperty("datasource.password", password);
        prop.setProperty("datasource.pool.maxSize", maxPoolSize);
        prop.setProperty("datasource.pool.leakTrashold", leakDetectionTrashold);
        return prop;
    }

}
