package com.legacy.health.fhir.meta.sql;

import java.sql.SQLException;

import com.legacy.health.fhir.extension.TransactionContext;
import com.legacy.health.fhir.extension.exceptions.FHIRResourceHandlingException;
import com.legacy.health.fhir.meta.FhirException;

public class TransactionContextImpl implements TransactionContext {

	private SQLExecutor sqlExecutor = null;
	private SQLDataConsumer consumer = null;
	private boolean autoCommit;

	public TransactionContextImpl(SQLExecutor sqlExecutor) {
		this.sqlExecutor = sqlExecutor;
	}

	public SQLExecutor getSqlExecutor() {
		return sqlExecutor;
	}

	public SQLDataConsumer getDataConsumer(String schemaName) {
		if (consumer == null) {
			consumer = new SQLDataConsumer();
			consumer.setSchema(schemaName);
		}
		return consumer;
	}

	public boolean isAutoCommit() {
		return this.autoCommit;
	}

	@Override
	public void rollback() throws FHIRResourceHandlingException {
		try {
			sqlExecutor.connect().rollback();
		} catch (SQLException | FhirException e) {
			throw new FHIRResourceHandlingException("Error during rollback", e);
		}
	}

	@Override
	public void commit() throws FHIRResourceHandlingException {
		// TODO Auto-generated method stub
		try {
			if (consumer != null) {
				consumer.flushData();
			}
			if (!autoCommit) {
				sqlExecutor.connect().commit();
			}
		} catch (SQLException | FhirException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw new FHIRResourceHandlingException("Error during commit", e);
		}
	}

	@Override
	public String getId() throws FHIRResourceHandlingException {
		return null;
	}

	@Override
	public void closeConnection() throws FHIRResourceHandlingException {
		try {
			sqlExecutor.connect().close();
		} catch (SQLException | FhirException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw new FHIRResourceHandlingException("Error during closing connection", e);
		}
	}

	public void setAutoCommit(boolean autocommit) {
		this.autoCommit = autocommit;
	}
}
