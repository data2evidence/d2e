package com.legacy.health.fhir.helper;

import java.net.InetSocketAddress;
import java.net.Proxy;
import java.nio.charset.Charset;

import org.apache.commons.codec.binary.Base64;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

public class RestClient {

  // private String server = "http://localhost:3000";
  private RestTemplate rest;
  private HttpHeaders headers;
  private HttpStatus status;

  public RestClient() {
    this.rest = new RestTemplate();
    this.headers = new HttpHeaders();
    headers.add("Content-Type", "application/json");
    headers.add("Accept", "*/*");

    String httpProxy = System.getenv("HTTP_PROXY");
    if (httpProxy == null)
      httpProxy = System.getenv("http_proxy");

    if (httpProxy != null) {
      SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
      UriComponents proxyComponents = UriComponentsBuilder.fromHttpUrl(httpProxy).build();
      factory.setProxy(
          new Proxy(Proxy.Type.HTTP, new InetSocketAddress(proxyComponents.getHost(), proxyComponents.getPort())));
      this.rest.setRequestFactory(factory);
    }
  }

  private String createHeaders(String username, String password) {
    String auth = username + ":" + password;
    byte[] encodedAuth = Base64.encodeBase64(auth.getBytes(Charset.forName("US-ASCII")));
    String authHeader = "Basic " + new String(encodedAuth);
    return authHeader;
  }

  public void basic(String user, String password) {
    headers.add("Authorization", createHeaders(user, password));
  }

  public void bearerToken(String token) {
    headers.add("Authorization", "Bearer " + token);
  }

  public String get(String uri) {
    HttpEntity<String> requestEntity = new HttpEntity<String>("", headers);
    ResponseEntity<String> responseEntity = rest.exchange(uri, HttpMethod.GET, requestEntity, String.class);
    this.setStatus(responseEntity.getStatusCode());
    return responseEntity.getBody();
  }

  public String post(String uri, String data) {
    HttpEntity<String> requestEntity = new HttpEntity<String>(data, headers);
    ResponseEntity<String> responseEntity = rest.exchange(uri, HttpMethod.POST, requestEntity, String.class);
    this.setStatus(responseEntity.getStatusCode());
    return responseEntity.getBody();
  }

  public HttpStatus getStatus() {
    return status;
  }

  public void setStatus(HttpStatus status) {
    this.status = status;
  }

  public String curl(String endpoint, String username, String password, String data) {
    return "";
  }
}
