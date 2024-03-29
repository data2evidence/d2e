package com.legacy.health.fhir.meta.sql.queryengine.consumer;

import java.sql.Connection;

public interface ConnectionConsumer {
	void setConnection(Connection connection);
}
