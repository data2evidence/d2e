package com.legacy.health.fhir.exception.handler;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.legacy.health.fhir.helper.FhirUtils;
import com.legacy.health.fhir.meta.OperationOutcomeBuilder;
import com.legacy.health.fhir.meta.entity.Issue;
import com.legacy.health.fhir.meta.entity.OperationOutcome;
import com.legacy.health.fhir.meta.instance.Structure;

@ControllerAdvice
@RestControllerAdvice(basePackages = { "com.legacy.health.fhir.controller" })
public class FHIRFileUploadExceptionHandler extends ResponseEntityExceptionHandler {

	private static final Log logUploader = LogFactory.getLog(FHIRFileUploadExceptionHandler.class);

	@Value("${spring.http.multipart.max-request-size}")
	private String maxRequestFileSize;

	@ExceptionHandler(MultipartException.class)
	@ResponseStatus(value = HttpStatus.PAYLOAD_TOO_LARGE)
	public Structure handleMultipartException(MultipartException ex) {
		logUploader.error(ex.getMessage(), ex);
		OperationOutcome outcome = new OperationOutcomeBuilder()
				.addIssue(Issue.Severity.error, "too-long")
				.withDetails("File too large, allowed upto [" + maxRequestFileSize + "]. " + ex.getMessage())
				.issue()
				.outcome();

		return FhirUtils.toStructure(outcome);
	}

}
