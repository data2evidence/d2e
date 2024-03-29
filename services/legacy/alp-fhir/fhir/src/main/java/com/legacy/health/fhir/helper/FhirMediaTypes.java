package com.legacy.health.fhir.helper;

import org.springframework.http.MediaType;

public class FhirMediaTypes {

    public static final MediaType FHIR_JSON = new MediaType("application", "fhir+json");
    public static final MediaType FHIR_XML = new MediaType("application", "fhir+xml");
    public static final String APPLICATION_FHIR_JSON = "application/fhir+json";
    public static final String APPLICATION_FHIR_XML = "application/fhir+xml";

}
