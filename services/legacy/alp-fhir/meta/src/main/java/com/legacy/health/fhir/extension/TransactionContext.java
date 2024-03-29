package com.legacy.health.fhir.extension;

import com.legacy.health.fhir.extension.exceptions.FHIRResourceHandlingException;
import com.legacy.health.fhir.meta.Context;

public interface TransactionContext extends Context {

	public void rollback() throws FHIRResourceHandlingException;

	public void commit() throws FHIRResourceHandlingException;

	public void closeConnection() throws FHIRResourceHandlingException;

	public String getId() throws FHIRResourceHandlingException;
}
