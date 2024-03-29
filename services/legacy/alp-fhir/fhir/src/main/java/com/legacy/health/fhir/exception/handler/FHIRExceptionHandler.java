package com.legacy.health.fhir.exception.handler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legacy.health.fhir.exception.InvalidConditionException;
import com.legacy.health.fhir.exception.InvalidRequestException;
import com.legacy.health.fhir.exception.InvalidResourceException;
import com.legacy.health.fhir.exception.ResourceDeletedException;
import com.legacy.health.fhir.exception.ResourceNotFoundException;
import com.legacy.health.fhir.exception.ResourceNotFoundForDeletion;
import com.legacy.health.fhir.exception.StructureNotReadableException;
import com.legacy.health.fhir.exception.TenantNotInitializedException;
import com.legacy.health.fhir.exception.UnsupportedFormatException;
import com.legacy.health.fhir.extension.exceptions.CapabilityValidationException;
import com.legacy.health.fhir.helper.FhirUtils;
import com.legacy.health.fhir.meta.OperationOutcomeBuilder;
import com.legacy.health.fhir.meta.ResourceTypeNotSupportedException;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.Issue;
import com.legacy.health.fhir.meta.entity.OperationOutcome;
import com.legacy.health.fhir.meta.instance.Structure;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpMediaTypeException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = { "com.legacy.health.fhir.controller" })
public class FHIRExceptionHandler {

    private static final Logger auditLogger = Logger.getLogger(FHIRExceptionHandler.class);
    private static Log logger = LogFactory.getLog(FHIRExceptionHandler.class);

    @Autowired
    private ObjectMapper objectMapper;

    private @Autowired HttpServletRequest request;

    @ExceptionHandler({ CapabilityValidationException.class })
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Structure handleCapabilityException(CapabilityValidationException ex) {
        logger.error(ex.getMessage(), ex);
        return FhirUtils.toStructure((JsonNode) objectMapper.valueToTree(ex.getOperationOutcome()));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public void handleNotReadable(Exception ex) throws StructureNotReadableException {
        throw new StructureNotReadableException("Unable to parse the input.", ex);
    }

    @ExceptionHandler({ TenantNotInitializedException.class, InvalidResourceException.class,
            InvalidRequestException.class, StructureNotReadableException.class })
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Structure handleBadRequestException(FhirException ex) {
        logger.error(ex.getMessage(), ex);
        return toOperationOutcome(ex);
    }

    @ExceptionHandler({ ResourceTypeNotSupportedException.class, ResourceNotFoundException.class })
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Structure handleNotFoundException(FhirException ex) {
        logger.error(ex.getMessage(), ex);
        return toOperationOutcome(ex);
    }

    @ExceptionHandler({ ResourceDeletedException.class })
    @ResponseStatus(HttpStatus.GONE)
    public Structure handleResourceDeletedException(FhirException ex) {
        logger.error(ex.getMessage(), ex);
        return toOperationOutcome(ex);
    }

    @ExceptionHandler({ InvalidConditionException.class })
    @ResponseStatus(HttpStatus.PRECONDITION_FAILED)
    public Structure handlePreConditionFailedException(FhirException ex) {
        logger.error(ex.getMessage(), ex);
        return toOperationOutcome(ex);
    }

    @ExceptionHandler({ HttpMediaTypeException.class, UnsupportedFormatException.class })
    @ResponseStatus(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
    public Structure unsupportedMediaTypeException(Exception ex) {
        ex.printStackTrace();

        logger.error(ex.getMessage(), ex);
        OperationOutcome outcome = new OperationOutcomeBuilder()
                .addIssue(Issue.Severity.error, "exception")
                .withDetails(ex)
                .issue()
                .outcome();

        return FhirUtils.toStructure((JsonNode) objectMapper.valueToTree(outcome));
    }

    @ExceptionHandler({ ResourceNotFoundForDeletion.class })
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Structure noResourceFoundToDelete(ResourceNotFoundForDeletion ex) {

        logger.error(ex.getMessage(), ex);

        return null;
    }

    @ExceptionHandler({ Exception.class })
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Structure handleServerException(Exception ex) {
        logger.error(ex.getMessage(), ex);
        OperationOutcome outcome = new OperationOutcomeBuilder()
                .addIssue(Issue.Severity.error, "exception")
                .withDetails(ex)
                .issue()
                .outcome();
        return FhirUtils.toStructure((JsonNode) objectMapper.valueToTree(outcome));
    }

    public Structure toOperationOutcome(FhirException ex) {
        OperationOutcome outcome = new OperationOutcomeBuilder()
                .addIssue(ex.getSeverity(), ex.getIssueType())
                .withDetails(ex)
                .issue()
                .outcome();

        return FhirUtils.toStructure((JsonNode) objectMapper.valueToTree(outcome));
    }

}
