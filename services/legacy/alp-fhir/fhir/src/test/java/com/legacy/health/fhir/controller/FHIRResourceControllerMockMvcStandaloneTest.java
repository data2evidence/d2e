package com.legacy.health.fhir.controller;

import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.json.JSONStructure;
import com.legacy.health.fhir.meta.json.JSONWalker;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.RepositoryBuilder;
import com.legacy.health.fhir.meta.repsitory.ZipSpecificationProvider;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Matchers;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.node.TextNode;
import com.legacy.health.fhir.converter.FHIRJsonConverter;
import com.legacy.health.fhir.service.FHIRResourceService;

import java.io.File;

import javax.servlet.http.HttpServletRequest;

import static com.legacy.health.fhir.helper.FhirMediaTypes.APPLICATION_FHIR_JSON;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@RunWith(MockitoJUnitRunner.class)
public class FHIRResourceControllerMockMvcStandaloneTest {

        private static final Logger log = LoggerFactory.getLogger(FHIRResourceControllerMockMvcStandaloneTest.class);

        private MockMvc mvc;

        @Mock
        private FHIRResourceService fhirResourceService;

        @InjectMocks
        private FHIRResourceController fHIRResourceController;

        private Structure struct = new JSONStructure(new TextNode("123Patient"));

        @Before
        public void setup() {
                // MockMvc standalone approach
                mvc = MockMvcBuilders.standaloneSetup(fHIRResourceController)
                                .setMessageConverters(new FHIRJsonConverter())
                                // .setControllerAdvice(new FHIRExceptionHandler())
                                // .addFilters(new FHIRFilter())
                                .build();
        }

        @Test
        public void canGetByIdWhenExists() throws Exception {
                // given
                JSONWalker walker = new JSONWalker();
                File file = new File(this.getClass().getClassLoader().getResource("spec.zip").getFile());
                ZipSpecificationProvider provider = new ZipSpecificationProvider();
                provider.setZipFilePath(file);
                MetaRepository repo = RepositoryBuilder.createRepository(provider);
                // struct = walker.fromJSON(new
                // TextNode("123Patient"),repo.getStructureDefinitionById("Patient"));
                walker.setMetaRepository(repo);
                struct = walker.fromJSON(
                                JsonNodeFactory.instance.objectNode().put("resourceType", "Patient").put("id", "123"));
                // MockHttpServletRequest mockRequest = new MockHttpServletRequest();
                // given(fhirResourceService.read("smart", "Patient", "123", mockRequest))
                // .willReturn(struct);

                given(fhirResourceService.read(eq("smart"), eq("Patient"), eq("123"),
                                Matchers.<HttpServletRequest>any()))
                                .willReturn(struct);

                // when
                MockHttpServletResponse response = mvc.perform(
                                get("/smart/fhir/Patient/123")
                                                .accept(APPLICATION_FHIR_JSON))
                                .andReturn().getResponse();

                log.debug(response.getContentAsString());

                // then
                assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
                assertThat(response.getContentAsString()).isEqualTo(
                                struct.getRoot().toString());
        }

}
