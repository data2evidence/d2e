package com.legacy.health.fhir.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

public class RequestProcessingTimeInterceptor extends HandlerInterceptorAdapter {

    private static Logger log = LoggerFactory.getLogger(RequestProcessingTimeInterceptor.class);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        long startTime = System.currentTimeMillis();
        // log.info("Request URL::" + request.getRequestURL().toString() + ":: Start
        // Time=" + startTime);
        request.setAttribute("startTime", startTime);
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
            ModelAndView modelAndView) throws Exception {
        long startTime = (Long) request.getAttribute("startTime");
        // log.info("Request URL::" + request.getRequestURL().toString() + ":: End
        // Time=" + System.currentTimeMillis());
        log.info(String.format("Request URL :: %s :: Time Taken=%.3f seconds", request.getRequestURL().toString(),
                ((System.currentTimeMillis() - startTime) / 1000d)));
    }

}
