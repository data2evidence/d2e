package com.legacy.health.fhir.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.exception.InvalidResourceException;
import com.legacy.health.fhir.exception.handler.FHIRExceptionHandler;
import com.legacy.health.fhir.extension.FHIRResourceRepository;
import com.legacy.health.fhir.extension.TransactionContext;
import com.legacy.health.fhir.helper.FhirMediaTypes;
import com.legacy.health.fhir.helper.FhirUtils;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.RequestContext;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.instance.ValueElement;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Queue;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.AsyncRestTemplate;
import org.springframework.web.client.RestClientException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriUtils;

@Service
public class FHIRBundleService extends AbstractService {

    @Autowired
    FHIRExceptionHandler fhirExceptionHandler;

    @Autowired
    private AsyncRestTemplate restClient;

    @Autowired
    private FHIRResourceService resourceService;

    private enum ServiceMethods {
        DELETE,
        POST,
        PUT,
        GET;
    }

    public Structure checkResourceAuthorizationForBundle(String schemaName, String string, Structure bundleInput) {

        JsonNode bundleAsJson = FhirUtils.toJson(bundleInput);
        JsonNode entries = bundleAsJson.get("entry");
        List<ObjectNode> resources = new ArrayList<>();

        for (JsonNode entry : entries) {
            JsonNode request = entry.get("request");
            String resourceType = null;
            ServiceMethods method = ServiceMethods.GET;
            ObjectNode resourceInstance = JsonNodeFactory.instance.objectNode();

            if (request != null && request.isObject()) {
                UriComponents uriComponents = ServletUriComponentsBuilder.fromUriString(request.get("url").asText())
                        .build();
                List<String> pathSegments = uriComponents.getPathSegments();

                resourceType = pathSegments.size() > 0 ? pathSegments.get(0) : null;

                resourceInstance.set("request", request);

                method = ServiceMethods.valueOf(request.get("method").asText().toUpperCase(Locale.ENGLISH));
            }

            if (entry.has("resource")) {
                JsonNode resourceNode = entry.get("resource");
                if (resourceType == null) {
                    resourceType = resourceNode.get("resourceType").asText();
                }
                resourceInstance.set("resource", resourceNode);
            }

            HashMap<String, String> operation = new HashMap<String, String>();

            try {
                switch (method) {
                    case GET:
                        operation.put("operation", "read");

                        break;
                    case POST:
                        operation.put("operation", "create");

                        break;
                    case PUT:
                        operation.put("operation", "update");

                        break;
                    case DELETE:
                        operation.put("operation", "delete");

                        break;
                    default:
                        throw new Exception();
                }
            } catch (Exception e) {
                // TODO
            }
            resources.add(resourceInstance);

        }

        Structure bundle = FhirUtils.toBundle("search-set", resources);

        return bundle;
    }

    @SuppressWarnings("rawtypes")
    @Transactional(rollbackFor = SQLException.class)
    public Structure processBundle(String schemaName, Structure bundleInput, HttpServletRequest request)
            throws FhirException {
        if (!"Bundle".equals(bundleInput.getResourceType())) {
            throw new InvalidResourceException("Invalid Bundle. 'resourceType' should be 'Bundle'.", null);
        }

        String bundleType = ((ValueElement) bundleInput
                .getElementByPath(String.format("%s.type", bundleInput.getResourceType()))).getValue().toString();
        FHIRResourceRepository resourceRepoExtension = getFHIRResourceRepoExtension();
        RequestContext requestContext = initializeRequestContext(schemaName);

        // Check for authorization and get authorized requests and resources

        Structure bundle = checkResourceAuthorizationForBundle(schemaName, "Bundle", bundleInput);
        TransactionContext transactionContext = null;
        switch (bundleType) {
            case "batch":
                try {
                    try {
                        return processBatchOrTransaction(schemaName, bundle, bundleType, null, request);
                    } catch (SQLException | FhirException e) {
                        fhirExceptionHandler.toOperationOutcome((FhirException) e);
                        e.printStackTrace();
                    }
                } catch (RestClientException | UnsupportedEncodingException | URISyntaxException | InterruptedException
                        | ExecutionException e1) {
                    e1.printStackTrace();
                    throw (new FhirException("", e1));
                }
                break;

            case "batch-response":
            case "searchset":
            case "collection":
                transactionContext = resourceRepoExtension.startTransaction(false, requestContext);
                try {
                    processCollection(schemaName, bundle, bundleType, transactionContext, false);
                } catch (SQLException e) {
                    e.printStackTrace();
                    throw new FhirException("", e);
                } finally {
                    transactionContext.commit();
                    transactionContext.closeConnection();
                }
                return bundle;

            case "transaction":
                transactionContext = resourceRepoExtension.startTransaction(false, requestContext);
                try {
                    try {
                        return processBatchOrTransaction(schemaName, bundle, bundleType, transactionContext, request);
                    } catch (SQLException | FhirException e) {
                        transactionContext.rollback();
                        e.printStackTrace();
                        fhirExceptionHandler.toOperationOutcome((FhirException) e);
                    }
                } catch (RestClientException | UnsupportedEncodingException | URISyntaxException | InterruptedException
                        | ExecutionException e) {
                    transactionContext.rollback();
                    e.printStackTrace();
                    throw new FhirException("", e);
                } finally {
                    transactionContext.commit();
                    transactionContext.closeConnection();
                }
                return bundle;

            case "transaction-response":
                transactionContext = resourceRepoExtension.startTransaction(false, requestContext);
                try {
                    processCollection(schemaName, bundle, bundleType, transactionContext, false);
                } catch (SQLException e) {
                    throw new FhirException("", e);
                } finally {
                    transactionContext.commit();
                    transactionContext.closeConnection();
                }
                return bundle;

            case "history":
            case "message":
            case "document":
                // TO-DO - handle the cases
                break;

            default:
                // TO-DO- handle default case if required
        }

        throw new FhirException(String.format("Unsupported bundleType [%s]", bundleType), null);
    }

    // TODO: Handle Atomic Transactions with/without REST (without REST preferrably)
    @SuppressWarnings("rawtypes")
    private Structure processBatchOrTransaction(String schemaName, Structure bundle, String bundleType,
            TransactionContext transactionContext, HttpServletRequest httpRequest)
            throws SQLException, FhirException, RestClientException, UnsupportedEncodingException,
            URISyntaxException, InterruptedException, ExecutionException {
        JsonNode bundleAsJson = FhirUtils.toJson(bundle);

        JsonNode entries = bundleAsJson.get("entry");

        List<ObjectNode> resources = new ArrayList<>();

        Queue<FhirRequest> queue = new PriorityQueue<>();

        Map<String, Set<String>> resourceTypeIdMapping = new HashMap<>();

        for (JsonNode entry : entries) {
            JsonNode request = entry.get("request");
            JsonNode resourceObj = entry.get("resource");

            if (request != null && request.isObject()) {
                FhirRequest fhirRequest = new FhirRequest(schemaName, (ObjectNode) request,
                        (ObjectNode) entry.get("resource"), httpRequest);
                if (resourceObj != null && resourceObj.get("resourceType") != null
                        && resourceObj.get("resourceType").asText().equals("OperationOutcome")) {
                    ObjectNode childObject = JsonNodeFactory.instance.objectNode();
                    childObject.set("request", request);
                    childObject.set("resource", resourceObj);
                    resources.add(childObject);

                    // skip and continue to the next resource.
                    // current resource is operation outcome
                    continue;
                }
                if (fhirRequest.method == FhirRequest.FhirRequestMethod.PUT && fhirRequest.resourceId != null) {
                    if (!resourceTypeIdMapping.containsKey(fhirRequest.resourceType)) {
                        resourceTypeIdMapping.put(fhirRequest.resourceType, new HashSet<>());
                    }
                    resourceTypeIdMapping.get(fhirRequest.resourceType).add(fhirRequest.resourceId);
                }
                queue.offer(fhirRequest);
            }
        }

        resourceTypeIdMapping = resourceService.existsAll(schemaName, resourceTypeIdMapping);

        Map<Future<ResponseEntity<ObjectNode>>, ObjectNode> futures = new HashMap<>();
        while (!queue.isEmpty()) {
            FhirRequest request = queue.poll();
            if (request == null) {
                continue;
            }

            ObjectNode child = JsonNodeFactory.instance.objectNode();
            child.set("request", request.request);

            logger.info("Processing [" + request.method + "] request: " + request.request.get("url").asText());

            boolean processed = false;

            if (request.resourceType != null) {

                if (request.method == FhirRequest.FhirRequestMethod.PUT) {
                    if (!resourceTypeIdMapping.containsKey(request.resourceType)
                            || !resourceTypeIdMapping.get(request.resourceType).contains(request.resourceId)) {
                        request.method = FhirRequest.FhirRequestMethod.POST;
                    }
                }

                Structure response;
                switch (request.method) {
                    case DELETE:
                        resourceService.delete(schemaName, request.resourceType, request.resourceId, false, true,
                                transactionContext);
                        processed = true;
                        break;
                    case POST:
                        if (request.request.get("url").asText().contains("_search")) {
                            break;
                        }
                        if (request.parameters == null || request.parameters.isEmpty()) {
                            response = resourceService.create(schemaName, request.resourceType,
                                    FhirUtils.toStructure(request.resource), transactionContext);
                        } else {
                            response = resourceService.create(schemaName, request.resourceType,
                                    FhirUtils.toStructure(request.resource), request.parameters, transactionContext);
                        }
                        child.set("resource", FhirUtils.toJson(response));
                        processed = true;
                        break;
                    case PUT:
                        if (request.parameters == null || request.parameters.isEmpty()) {
                            response = resourceService.update(schemaName, request.resourceType, request.resourceId,
                                    FhirUtils.toStructure(request.resource), transactionContext);
                        } else {
                            response = resourceService.update(schemaName, request.resourceType, request.parameters,
                                    FhirUtils.toStructure(request.resource), transactionContext);
                        }
                        child.set("resource", FhirUtils.toJson(response));
                        processed = true;
                        break;
                    default:
                        break;
                }
            }

            if (!processed) {
                futures.put(restClient.exchange(request.toURI(schemaName), HttpMethod.valueOf(request.method.name()),
                        request.getEntity(httpRequest), ObjectNode.class), child);
            }

            resources.add(child);
        }

        for (Future<ResponseEntity<ObjectNode>> future : futures.keySet()) {
            ResponseEntity<ObjectNode> response = future.get();
            if (response.getStatusCode().is2xxSuccessful()) {
                futures.get(future).set("resource", response.getBody());
            }
        }

        futures.clear();

        return FhirUtils.toBundle(bundleType + "-response", resources);
    }

    @SuppressWarnings("rawtypes")
    public Structure processCollection(String schemaName, Structure bundle, String bundleType,
            TransactionContext transactionContext, boolean returnResult) throws FhirException, SQLException {
        JsonNode bundleAsJson = FhirUtils.toJson(bundle);
        List<Structure> resources = new ArrayList<>();
        JsonNode entries = bundleAsJson.get("entry");
        for (JsonNode entry : entries) {
            JsonNode resource = entry.get("resource");
            // skip operation outcome
            if (resource.get("resourceType") != null
                    && resource.get("resourceType").asText().equals("OperationOutcome")) {
                continue;
            }
            resources.add(FhirUtils.toStructure(resource));
        }
        List<Structure> structuteList = resourceService.processResources(schemaName, resources, transactionContext);

        if (returnResult) {
            List<ObjectNode> jsonNode = new ArrayList<ObjectNode>();

            for (Structure structure : structuteList) {
                jsonNode.add((ObjectNode) FhirUtils.toJson(structure));
            }
            return FhirUtils.toBundle("search-set", jsonNode);
        }

        return null;
    }

    private static class FhirRequest implements Comparable<FhirRequest> {

        private enum FhirRequestMethod {
            DELETE(1),
            POST(2),
            PUT(3),
            GET(4);

            private final int priority;

            private FhirRequestMethod(int priority) {
                this.priority = priority;
            }
        }

        private final ObjectNode request;
        private final ObjectNode resource;
        private final String resourceType;
        private final String resourceId;
        private final Map<String, String[]> parameters;
        private FhirRequestMethod method;

        public FhirRequest(String schemaName, ObjectNode request, ObjectNode resource, HttpServletRequest httpRequest) {
            UriComponents uriComponents = ServletUriComponentsBuilder.fromUriString(request.get("url").asText())
                    .build();
            List<String> pathSegments = uriComponents.getPathSegments();

            this.request = request.deepCopy();
            this.resource = resource;
            this.resourceType = pathSegments.size() > 0 ? pathSegments.get(0) : null;
            this.resourceId = pathSegments.size() > 1 ? pathSegments.get(1) : null;
            this.parameters = multivalueMapToStringArrayMap(uriComponents.getQueryParams());
            this.method = FhirRequestMethod.valueOf(request.get("method").asText().toUpperCase(Locale.ENGLISH));
        }

        private Map<String, String[]> multivalueMapToStringArrayMap(MultiValueMap<String, String> parameters) {
            Map<String, String[]> result = new ConcurrentHashMap<>();
            for (String key : parameters.keySet()) {
                List<String> value = parameters.get(key);
                result.put(key, value.toArray(new String[value.size()]));
            }
            return result;
        }

        public URI toURI(String schemaName) throws URISyntaxException, UnsupportedEncodingException {
            UriComponents uri = ServletUriComponentsBuilder.fromCurrentRequest().build();
            return new URI(String.format("%s://%s:%d/fhir/%s/fhir%s", uri.getScheme(), uri.getHost(), uri.getPort(),
                    schemaName, (request.get("url").asText().charAt(0) == '/' ? "" : "/")
                            + UriUtils.encodeQuery(request.get("url").asText(), "UTF-8")));
        }

        @SuppressWarnings({ "rawtypes", "unchecked" })
        public HttpEntity getEntity(HttpServletRequest httpRequest) {
            // if (this.resource == null) {
            // return null;
            // }
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(FhirMediaTypes.FHIR_JSON);
            headers.setAccept(Arrays.asList(FhirMediaTypes.FHIR_JSON));
            headers.set(HttpHeaders.AUTHORIZATION, httpRequest.getHeader(HttpHeaders.AUTHORIZATION));
            return new HttpEntity(this.resource, headers);
        }

        @Override
        public int compareTo(FhirRequest that) {
            return Integer.compare(this.method.priority, that.method.priority);
        }
    }

}
