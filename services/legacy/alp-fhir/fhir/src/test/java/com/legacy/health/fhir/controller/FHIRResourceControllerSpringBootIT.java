package com.legacy.health.fhir.controller;

import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Matchers;
import org.mockito.Mockito;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.context.junit4.SpringRunner;

import com.legacy.health.fhir.meta.json.JSONStructure;
import com.legacy.health.fhir.meta.json.JSONWalker;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.sql.SQLExecutor;
import com.legacy.health.fhir.service.FHIRResourceService;

import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.eq;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment;

import javax.servlet.http.HttpServletRequest;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public class FHIRResourceControllerSpringBootIT {

        private static final Logger log = LoggerFactory.getLogger(FHIRResourceControllerSpringBootIT.class);

        @MockBean
        private FHIRResourceService fhirResourceService;

        @MockBean
        SQLExecutor sQLExecutor;

        @Autowired
        private TestRestTemplate restTemplate;

        @Autowired
        private MetaRepository repository;

        @Test
        public void dummyTest() {

        }

        // @Test
        public void canRetrieveByIdWhenExists() throws Exception {
                JSONWalker walker = new JSONWalker();
                walker.setMetaRepository(repository);
                JSONStructure struct = (JSONStructure) walker
                                .fromJSON(JsonNodeFactory.instance.objectNode().put("resourceType", "Patient").put("id",
                                                "123"));

                // given
                MockHttpServletRequest mockRequest = new MockHttpServletRequest();
                // given(fhirResourceService.read("smart", "Patient", "123", mockRequest))
                // .willReturn(struct);
                given(fhirResourceService.read(eq("smart"), eq("Patient"), eq("123"),
                                Matchers.<HttpServletRequest>any()))
                                .willReturn(struct);

                given(sQLExecutor.schemaExists(Mockito.any(String.class)))
                                .willReturn(true);

                // when
                ResponseEntity<ObjectNode> patientResourceResponse = restTemplate.getForEntity(
                                "/smart/fhir/Patient/123",
                                ObjectNode.class);

                // then
                log.trace("structAsString: " + struct.getRoot().toString());
                assertThat(patientResourceResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
                log.trace("responseAsString: " + patientResourceResponse.getBody().asText());
                assertThat(patientResourceResponse.getBody()).isEqualTo(struct.getRoot());
        }

}
