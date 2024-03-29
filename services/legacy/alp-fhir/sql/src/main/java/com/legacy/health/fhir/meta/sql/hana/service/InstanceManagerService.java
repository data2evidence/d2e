package com.legacy.health.fhir.meta.sql.hana.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Properties;
import java.util.Set;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.legacy.health.fhir.meta.FhirException;
import com.sap.xsa.core.instancemanager.client.ImClientException;
import com.sap.xsa.core.instancemanager.client.ImClientOperationException;
import com.sap.xsa.core.instancemanager.client.InstanceManagerClient;
import com.sap.xsa.core.instancemanager.client.ManagedServiceInstance;
import com.sap.xsa.core.instancemanager.client.ServiceInstance;
import com.sap.xsa.core.instancemanager.client.impl.InstanceManagerClientFactory;

public class InstanceManagerService {

	private static Log log = LogFactory.getLog(InstanceManagerService.class);

	/**
	 * Get instance manager Client
	 * 
	 * @return
	 * @throws ClassNotFoundException
	 * @throws ImClientException
	 */
	private InstanceManagerClient getInstaceManagerClientFactory() throws ClassNotFoundException, ImClientException {
		List<ServiceInstance> serviceInstances = new LinkedList<ServiceInstance>();
		String vcapServices = (String) System.getenv().get("VCAP_SERVICES");
		if (vcapServices != null && !vcapServices.isEmpty()) {
			serviceInstances = InstanceManagerClientFactory.getServicesFromVCAP(vcapServices);
			log.info("Creating Service from VCAPService ");
		}

		InstanceManagerClient imClient = null;
		if (serviceInstances.size() > 0) {
			ServiceInstance serviceInstance = serviceInstances.get(0);
			imClient = InstanceManagerClientFactory.getInstance(serviceInstance);
			log.info("Get service instance..");
		}
		return imClient;
	}

	/**
	 * Create instance service
	 * 
	 * @param imClient
	 * @param tenant
	 * @return
	 * @throws ImClientException
	 */
	private Properties createManagedInstance(InstanceManagerClient imClient, String tenant) throws ImClientException {

		ManagedServiceInstance managedServiceInstance = imClient.getManagedInstance(tenant);
		if (managedServiceInstance == null) {
			managedServiceInstance = imClient.createManagedInstance(tenant);
		}
		String host = (String) managedServiceInstance.getCredentials().get("host");
		String port = (String) managedServiceInstance.getCredentials().get("port");
		String driver = (String) managedServiceInstance.getCredentials().get("driver");
		String url = (String) managedServiceInstance.getCredentials().get("url");
		String schema = (String) managedServiceInstance.getCredentials().get("schema");
		String username = (String) managedServiceInstance.getCredentials().get("user");
		String password = (String) managedServiceInstance.getCredentials().get("password");

		log.info(" ID: " + managedServiceInstance.getId());
		log.info(" Status: " + managedServiceInstance.getStatus());
		log.info(" host: " + host);
		log.info(" port: " + port);
		log.info(" driver: " + driver);
		log.info(" url: " + url);
		log.info(" Schema: " + schema);

		Properties prop = new Properties();
		prop.setProperty("datasource.driver", driver);
		prop.setProperty("datasource.url", url);
		prop.setProperty("datasource.username", username);
		prop.setProperty("datasource.password", password);
		prop.setProperty("schema", schema);
		prop.setProperty("host", host);
		prop.setProperty("port", port);

		log.info("Get managed instance...");

		return prop;

	}

	/**
	 * Get connection properties
	 * 
	 * @param tenantId
	 * @param properties
	 * @param activeProfile
	 * @return
	 * @throws ClassNotFoundException
	 * @throws ImClientException
	 */
	public Properties createInstanceAndGetConnectionProperties(String tenantId, Properties properties,
			String activeProfile) throws ClassNotFoundException, ImClientException {

		log.info("INSIDE InstanceManager");
		log.info("Active Profile in InstanceManager: " + activeProfile);

		if (activeProfile == null || !activeProfile.equals("xsa")) {
			return properties;
		}
		Properties prop = null;
		InstanceManagerClient imClient = this.getInstaceManagerClientFactory();

		if (imClient != null) {
			prop = this.createManagedInstance(imClient, tenantId);
		} else {
			log.info(" Could not get the instance for Instance Manager ");
			prop = properties;
		}
		return prop;
	}

	/**
	 * Initialize instance manager
	 * 
	 * @param tenantId
	 * @return
	 * @throws ImClientOperationException
	 * @throws ImClientException
	 * @throws ClassNotFoundException
	 */
	public Properties initializeInstancemanager(String tenantId)
			throws ImClientOperationException, ImClientException, ClassNotFoundException {
		log.info(" Tenant: " + tenantId);
		log.info("INSIDE InstanceManager");

		InstanceManagerClient imClient = this.getInstaceManagerClientFactory();
		if (imClient != null) {
			ManagedServiceInstance managedServiceInstance = imClient.getManagedInstance(tenantId);
			if (managedServiceInstance != null) {
				log.info("Deleting the old instance manager service instance");
				imClient.deleteManagedInstance(tenantId);
			}
			log.info("Creating new instance manager service instance");
			return this.createManagedInstance(imClient, tenantId);
		}

		return null;
	}

	/**
	 * Delete instance manager tenant
	 * 
	 * @param tenantId
	 * @return
	 * @throws ImClientOperationException
	 * @throws ImClientException
	 * @throws ClassNotFoundException
	 */
	public Properties deleteInstancemanager(String tenantId)
			throws ImClientOperationException, ImClientException, ClassNotFoundException {
		log.info(" Tenant: " + tenantId);
		log.info(" Deleting InstanceManager");

		InstanceManagerClient imClient = this.getInstaceManagerClientFactory();
		if (imClient != null) {
			ManagedServiceInstance managedServiceInstance = imClient.getManagedInstance(tenantId);
			if (managedServiceInstance != null) {
				log.info("Deleting the old instance manager service instance");
				imClient.deleteManagedInstance(tenantId);
			}
		}

		return null;
	}

	/**
	 * Get the list of tables from instance manager created Schema
	 * 
	 * @param con
	 * @param schemaName
	 * @return
	 * @throws FhirException
	 * @throws SQLException
	 */
	public Set<String> getExistingTables(Connection con, String schemaName)
			throws FhirException, SQLException {

		ResultSet resultSet = null;
		PreparedStatement prStmt = null;
		Set<String> existingTables = null;
		try {
			String hanaGetAllTables = "select \"TABLE_NAME\" from SYS.M_TABLES\n" +
					"where \"SCHEMA_NAME\" = ?";
			prStmt = con.prepareStatement(hanaGetAllTables);
			prStmt.setString(1, schemaName);

			resultSet = prStmt.executeQuery();

			existingTables = new HashSet<>();
			while (resultSet.next()) {
				existingTables.add(resultSet.getString("TABLE_NAME"));
			}

		} catch (SQLException e) {
			throw (new FhirException("Could not get list of tables", e));
		} finally {
			if (prStmt != null) {
				prStmt.close();
			}
			if (resultSet != null) {
				resultSet.close();
			}
		}

		return existingTables;
	}

}
