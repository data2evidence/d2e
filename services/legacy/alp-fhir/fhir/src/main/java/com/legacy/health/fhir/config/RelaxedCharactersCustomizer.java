package com.legacy.health.fhir.config;

import org.springframework.boot.context.embedded.ConfigurableEmbeddedServletContainer;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;
import org.springframework.boot.context.embedded.tomcat.TomcatConnectorCustomizer;
import org.springframework.boot.context.embedded.tomcat.TomcatEmbeddedServletContainerFactory;
import org.springframework.stereotype.Component;

@Component
public class RelaxedCharactersCustomizer implements EmbeddedServletContainerCustomizer {

    @Override
    public void customize(ConfigurableEmbeddedServletContainer factory) {
        if (factory instanceof TomcatEmbeddedServletContainerFactory) {
            customizeTomcat((TomcatEmbeddedServletContainerFactory) factory);
        }
    }

    void customizeTomcat(TomcatEmbeddedServletContainerFactory factory) {
        factory.addConnectorCustomizers((TomcatConnectorCustomizer) connector -> {
            connector.setAttribute("relaxedPathChars", "|");
            connector.setAttribute("relaxedQueryChars", "|");
        });
    }
}
