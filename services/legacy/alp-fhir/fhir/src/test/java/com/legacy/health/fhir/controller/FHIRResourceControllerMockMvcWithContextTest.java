package com.legacy.health.fhir.controller;

import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.json.JSONStructure;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Matchers;
import org.mockito.Mockito;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.node.TextNode;
import com.legacy.health.fhir.config.DefaultConfiguration;
import com.legacy.health.fhir.config.ScopedBeansConfiguration;
import com.legacy.health.fhir.helper.FhirMediaTypes;
import com.legacy.health.fhir.meta.json.JSONWalker;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.sql.SQLExecutor;
import com.legacy.health.fhir.service.FHIRResourceService;
import com.legacy.health.fhir.service.FHIRResourceValidatorService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.eq;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import javax.servlet.http.HttpServletRequest;

import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

@RunWith(SpringRunner.class)
@AutoConfigureDataJpa
@WebMvcTest({ DefaultConfiguration.class, ScopedBeansConfiguration.class, FHIRResourceController.class,
                FHIRResourceValidatorService.class })
public class FHIRResourceControllerMockMvcWithContextTest {

        private static final Logger log = LoggerFactory.getLogger(FHIRResourceControllerMockMvcWithContextTest.class);

        private MockMvc mvc;

        @Autowired
        private WebApplicationContext context;

        @MockBean
        // @Autowired //for Autowiring, you need a FHIRResourceService bean in your
        // Configuration
        private FHIRResourceService fhirResourceService;

        // @MockBean
        // TenantRequestInterceptor tenantRequestInterceptor;
        @MockBean
        SQLExecutor sQLExecutor;

        @Autowired
        private MetaRepository repository;

        private Structure struct = new JSONStructure(new TextNode("123Patient"));

        @Before
        public void setup() {
                // Initializes something
                mvc = MockMvcBuilders
                                .webAppContextSetup(context)
                                .build();
        }

        @Test
        public void dummyTest() {

        }

        // @Test TODO:Fix mocking
        public void canRetrieveByIdWhenExists() throws Exception {
                JSONWalker walker = new JSONWalker();
                walker.setMetaRepository(repository);
                JSONStructure struct = (JSONStructure) walker.fromJSON(
                                JsonNodeFactory.instance.objectNode().put("resourceType", "Patient").put("id", "123"));

                // given
                MockHttpServletRequest mockRequest = new MockHttpServletRequest();
                // given(fhirResourceService.read("smart", "Patient", "123", mockRequest))
                // .willReturn(struct);

                given(fhirResourceService.read(eq("smart"), eq("Patient"), eq("123"),
                                Matchers.<HttpServletRequest>any()))
                                .willReturn(struct);

                // given(tenantRequestInterceptor.preHandle(Mockito.any(HttpServletRequest.class),
                // Mockito.any(HttpServletResponse.class), Mockito.any(Object.class)))
                // .willReturn(true);

                given(sQLExecutor.schemaExists(Mockito.any(String.class)))
                                .willReturn(true);

                // when
                MockHttpServletResponse response = mvc.perform(
                                get("/smart/fhir/Patient/123")
                                                .accept(FhirMediaTypes.APPLICATION_FHIR_JSON))
                                .andReturn().getResponse();

                // then
                assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
                log.trace("responseAsString: " + response.getContentAsString());
                log.trace("structAsString: " + struct.getRoot().toString());
                assertThat(response.getContentAsString()).isEqualTo(
                                struct.getRoot().toString());
        }

}