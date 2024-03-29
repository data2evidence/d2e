package com.legacy.health.fhir.helper;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorsFilter implements Filter {

    private final Log log = LogFactory.getLog(CorsFilter.class);

    public CorsFilter() {
        log.info("Filter created");
    }

    @Value("${cors.allow_origin:}")
    private String cors_allow_origin;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) res;
        HttpServletRequest request = (HttpServletRequest) req;
        if (!cors_allow_origin.equalsIgnoreCase("")) {
            response.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, cors_allow_origin);
        }

        chain.doFilter(req, res);
    }

    @Override
    public void destroy() {

    }

}
