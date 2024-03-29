package com.legacy.health.fhir.meta.sql.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.*;

public class VCAPServices {

    private static Logger log = LoggerFactory.getLogger(VCAPServices.class);
    static Map<String, Object> vcapMap;
    static {
        try {
            if (System.getenv("VCAP_SERVICES") == null) {
                log.error("Unable to read VCAP_SERVICES");
            } else {
                vcapMap = new ObjectMapper().readValue(System.getenv("VCAP_SERVICES"), Map.class);
            }
        } catch (IOException e) {
            log.error("Unable to read VCAP_SERVICES", e);
        }
    }

    public Map<String, String> getServiceCredentials(String serviceType, String serviceName) {
        Map<String, String> ret = new HashMap<>();
        Object service = null;
        if (vcapMap == null) {
            return ret;
        }
        if ((service = vcapMap.getOrDefault(serviceType, null)) == null) {
            return ret;
        }
        if (!(service instanceof List)) {
            return ret;
        }
        for (Map<String, Object> element : ((List<Map<String, Object>>) service)) {
            if (element.containsKey("credentials")) {
                Map<String, Object> credentials = (Map<String, Object>) element.get("credentials");
                if (!element.containsKey("name") || !element.get("name").equals(serviceName))
                    continue;
                for (Map.Entry<String, Object> entry : credentials.entrySet()) {
                    if (entry.getValue() instanceof String) {
                        ret.put(entry.getKey(), (String) (entry.getValue()));
                    }
                }
            }

        }
        return ret;

    }

}
