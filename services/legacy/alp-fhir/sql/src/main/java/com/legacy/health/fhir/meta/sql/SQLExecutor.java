package com.legacy.health.fhir.meta.sql;

import java.util.Properties;

import com.legacy.health.fhir.extension.ExtensionProvider;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.sql.hana.service.InstanceManagerService;
import com.sap.xsa.core.instancemanager.client.ImClientException;
import com.zaxxer.hikari.HikariDataSource;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Collection;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import javax.sql.DataSource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class SQLExecutor {

	private Connection con;
	private Properties connectionProperties;
	private boolean ownConnection = false;
	private String schema;

	private Log log = LogFactory.getLog(SQLExecutor.class);

	public String getSchema() {
		return schema;
	}

	public void setSchema(String schema) {
		this.schema = schema;
	}

	public void connect(Properties properties) throws FhirException {
		try {
			con = getConnectionFromDataSource(properties);
		} catch (SQLException e) {
			throw new FhirException("Error while creating connection", e);
		}
		ownConnection = true;
	}

	public void connect(Properties properties, boolean autoCommit, String activeProfile)
			throws FhirException, SQLException {
		Properties activeProperties = getProperties(properties, activeProfile);
		try {
			con = getConnectionFromDataSource(activeProperties);
		} catch (SQLException e) {
			throw new FhirException("Error while creating connection", e);
		}
		con.setAutoCommit(autoCommit);
		ownConnection = true;
	}

	private Connection getConnectionFromDataSource(Properties activeProperties)
			throws SQLException, FhirException {
		con = FHIRDataSource.getInstance().getDataSource(activeProperties).getConnection();

		// set the connection property to global properties
		this.connectionProperties = getValidProperties(activeProperties);

		// get the schema that is created from instance manager
		if (this.connectionProperties.containsKey("schema")) {
			this.setSchema(this.connectionProperties.getProperty("schema"));
		}
		return con;
	}

	private Properties getValidProperties(Properties activeProperties) throws FhirException {
		if (!activeProperties.containsKey("datasource.url")) {
			throw (new FhirException("Data Source URL missing to connect to DB", null));
		}
		return activeProperties;
	}

	public Connection connect(Properties properties, String activeProfile) throws FhirException {
		Properties activeProperties = getProperties(properties, activeProfile);
		try {
			con = getConnectionFromDataSource(activeProperties);
			ownConnection = true;
			return con;
		} catch (SQLException e) {
			throw new FhirException("Error while creating connection", e);
		}

	}

	public Properties getProperties(Properties properties, String activeProfile) {
		InstanceManagerService service = new InstanceManagerService();
		Properties prop = null;
		try {
			prop = service.createInstanceAndGetConnectionProperties(schema, properties, activeProfile);
		} catch (ClassNotFoundException | ImClientException e) {
			log.error("Error Loading Schema through InstanceManager Service: ", e);
			prop = properties; // using the default connection method (No
								// instance Manager)
		}

		// get the schema that is created from instance manager
		if (prop.containsKey("schema")) {
			this.setSchema(prop.getProperty("schema"));
		}

		return prop;
	}

	public Connection connect() throws FhirException {
		try {
			if (con == null || con.isClosed()) {
				this.connect(connectionProperties);
				// con = SQLConnector.connect(connectionProperties);
				ownConnection = true;
			}
		} catch (SQLException e) {
			log.error(e);
			return con;
		}
		return con;
	}

	public void connect(Connection connection) {
		con = connection;
	}

	public void connect(DataSource datsSource) throws FhirException {
		try {
			con = datsSource.getConnection();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw new FhirException("Error providing sql connection", e);
		}
		ownConnection = true;
	}

	public Connection connect(String fileName) throws FhirException {
		FileInputStream fis = null;
		Properties properties = null;
		File file = new File(this.getClass().getClassLoader().getResource(fileName).getFile());
		try {
			fis = new FileInputStream(file);
			properties = new Properties();
			properties.load(fis);
		} catch (FileNotFoundException e) {
			log.error(e);
			e.printStackTrace();
			throw new FhirException("Error providing sql connection", e);
		} catch (IOException e) {
			log.error(e);
			e.printStackTrace();
			throw new FhirException("Error providing sql connection", e);
		} finally {
			if (fis != null) {
				try {
					fis.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					log.error("Error closing fis" + e.getLocalizedMessage());
					e.printStackTrace();
				}
			}
		}

		connect(properties);

		return con;
	}

	public boolean schemaExists(String schemaName) {
		try {
			schemaName = schemaName.toUpperCase(Locale.ROOT);
			ResultSet resultSet = this.con.getMetaData().getSchemas(null, schemaName);
			while (resultSet.next()) {
				if (resultSet.getString(1).equals(schemaName)) {
					log.info("Schema Exists: " + schemaName);
					return true;
				}
			}
			log.info("Schema Does not Exist: " + schemaName);
			return false;
		} catch (SQLException ex) {
			log.error("SQLExcepion - Schema check fail" + ex);
			return false;
		}
	}

	public Collection<Table> getMissingTables(String schemaName, Collection<Table> tables,
			String activeSpringProfileConfiguration) {
		try {
			Set<Table> missingTables = new LinkedHashSet<>();
			Set<String> existingTables = null;

			if (activeSpringProfileConfiguration.equalsIgnoreCase("xsa")) {
				InstanceManagerService instService = new InstanceManagerService();
				existingTables = instService.getExistingTables(this.con, this.getSchema());
			} else {
				existingTables = getExistingTables(schemaName);
			}

			for (Table table : tables) {
				if (!existingTables.contains(table.getTableName().substring(1, table.getTableName().length() - 1))) {
					missingTables.add(table);
				}
			}
			return missingTables;
		} catch (SQLException | FhirException ex) {
			log.error("SQLExcepion - getMissingTables fail: " + ex);
			return tables;
		}
	}

	private Set<String> getExistingTables(String schemaName) throws SQLException {
		ResultSet resultSet = this.con.getMetaData().getTables(null, schemaName.toUpperCase(Locale.ROOT), "%",
				new String[] { "TABLE" });

		Set<String> existingTables = new HashSet<>();
		while (resultSet.next()) {
			existingTables.add(resultSet.getString("TABLE_NAME"));
		}

		return existingTables;
	}

	@SuppressFBWarnings("SQL_INJECTION_JDBC")
	public void executeBatch(List<String> ddls, boolean ignoreError) throws SQLException {
		Statement stmt = null;
		try {
			// TO-DO
			// There is case when connection seems to be closed while attemting
			// to execute the executeBatch. Need to drill down and fix this.
			if (con.isClosed()) {
				this.connect();
			}
			stmt = con.createStatement();
			for (String ddl : ddls) {
				stmt.addBatch(ddl);
			}
			stmt.executeBatch();
			stmt.close();
		} catch (SQLException | FhirException e) {
			if (ignoreError) {
				log.warn(e);
				return;
			} else {
				log.error(e);
			}
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	@SuppressFBWarnings("SQL_INJECTION_JDBC")
	public boolean executeDDL(String ddl, boolean ignoreError) throws SQLException {
		Statement stmt = null;
		try {
			// TO-DO
			// There is case when connection seems to be closed while attemting
			// to execute the executeDDL. Need to drill down and fix this.
			if (con.isClosed()) {
				this.connect();
			}
			stmt = con.createStatement();
			return stmt.execute(ddl);
		} catch (SQLException | FhirException e) {
			if (ignoreError) {
				return true;
			}
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	public void closeConnection() throws SQLException {
		if (con != null && ownConnection) {
			con.close();
			log.info("CONNECTION CLOSED...");
		}
	}

	public void initializeInstancemanager(String schemaTenenat) {
		InstanceManagerService service = new InstanceManagerService();
		try {
			Properties prop = service.initializeInstancemanager(schemaTenenat);
			this.connect(prop);
		} catch (ClassNotFoundException | ImClientException | FhirException e) {
			log.error(e); // need to check how to deal with this
		}
	}

	public void deleteInstanceManager(String schemaTenenat) {
		InstanceManagerService service = new InstanceManagerService();
		try {
			service.deleteInstancemanager(schemaTenenat);
		} catch (ClassNotFoundException | ImClientException e) {
			log.error(e); // need to check how to deal with this
		}
	}

}

/**
 * GetDataSource Class that is singleton to get one dataSource for multiple
 * intances of SQLExecutor Enabled Pooling
 * 
 * @author i069216
 *
 */
class FHIRDataSource {
	private static FHIRDataSource dataSourceInstance = null;
	private HikariDataSource dataSource;

	private Log log = LogFactory.getLog(FHIRDataSource.class);

	public static FHIRDataSource getInstance() {
		if (dataSourceInstance == null) {
			dataSourceInstance = new FHIRDataSource();
		}
		return dataSourceInstance;
	}

	/**
	 * Get pooled DataSource
	 * 
	 * @param property
	 * @return
	 * @throws SQLException
	 */
	public synchronized HikariDataSource getDataSource(Properties property) throws SQLException {
		boolean needNewDataSource = false;

		if (dataSource != null) {

			String url = dataSource.getJdbcUrl();
			String username = dataSource.getUsername();
			String password = dataSource.getPassword();
			String driver = dataSource.getDriverClassName();

			String toMatchUrl = property.getProperty("datasource.url");
			String toMatchUsername = property.getProperty("datasource.username");
			String toMatchPassword = property.getProperty("datasource.password");
			String toMatchDriver = property.getProperty("datasource.driver");

			// if there is a change in property issue a new Connection
			// DataSource to connect with
			if (!url.equals(toMatchUrl) || !username.equals(toMatchUsername) || !password.equals(toMatchPassword)
					|| !driver.equals(toMatchDriver)) {
				needNewDataSource = true;
			}

		}

		// get a new DataSource
		// if we find a change in property or dataSource is not initialized
		if (needNewDataSource == true || dataSource == null) {
			log.info("New Data Source creation process...");
			dataSource = new HikariDataSource();
			Properties prop = new Properties();
			prop.setProperty("encrypt",
					ExtensionProvider.isFeatureActive("FHIR_JDBC_ENCRYPTION", true) ? "true" : "false");
			prop.setProperty("validateCertificate",
					ExtensionProvider.isFeatureActive("FHIR_JDBC_ENCRYPTION_CERTIFICATE_VALIDATION", true) ? "true"
							: "false");

			dataSource.setDataSourceProperties(prop);
			dataSource.setDriverClassName(property.getProperty("datasource.driver"));
			dataSource.setJdbcUrl(property.getProperty("datasource.url"));
			dataSource.setUsername(property.getProperty("datasource.username"));
			dataSource.setPassword(property.getProperty("datasource.password"));

			if (property.containsKey("spring.datasource.hikari.leak-detection-threshold")
					&& property.getProperty("spring.datasource.hikari.leak-detection-threshold") != null) {
				dataSource.setLeakDetectionThreshold(
						Long.parseLong(property.getProperty("spring.datasource.hikari.leak-detection-threshold")));
			} else {
				// TO-DO identify the maximum leak detection trashold that we
				// need to add as default
				dataSource.setLeakDetectionThreshold(60 * 1000);
			}

			if (property.containsKey("datasource.pool.maxSize")
					&& property.getProperty("datasource.pool.maxSize") != null) {
				dataSource.setMaximumPoolSize(Integer.parseInt(property.getProperty("datasource.pool.maxSize")));
			} else {
				// TO-DO identify the maximum desired pool that we need to add
				// as default
				dataSource.setMaximumPoolSize(30);
			}

			// TO-DO Remove in production ( used only for testing )
			// log.info("URL: "+property.getProperty("datasource.url"));
			// log.info("Driver: "+property.getProperty("datasource.driver"));
			// log.info("Schema: "+property.getProperty("schema"));

			log.info("trying to connect....");
		}

		return dataSource;
	}

}
