package legacy.health.genomics.vcf.environment;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import legacy.health.genomics.vcf.parser.capability.ImportConfiguration;
import legacy.health.genomics.vcf.parser.exceptions.EnvironmentException;
import com.sap.xs.env.Credentials;
import com.sap.xs.env.Service;
import com.sap.xs.env.VcapServices;

public class EnvironmentDetails {

	@Autowired
	private VcapServices env;
	private Connection connection;
	private ImportConfiguration config;
	private static final Logger LOGGER = LoggerFactory.getLogger(EnvironmentDetails.class);

	public EnvironmentDetails(ImportConfiguration config) throws EnvironmentException {
		this.config = config;
	}

	public EnvironmentDetails() throws EnvironmentException {
		this.setConnection();
	}

	private void setConnection() throws EnvironmentException {
		try {

			VcapServices services = VcapServices.fromEnvironment();

			// find HDI service by label "hana"
			String hostName = "";
			String userName;
			String password;
			Service service = services.findService("hana", "", "");
			if (service == null) {
				LOGGER.info("Loading xs local environment...");
	            String json = this.localEnv();
	            VcapServices vcapServices = VcapServices.from(json);
	            Credentials credentials = vcapServices.getCredentials("chp-hdi");
				hostName += credentials.getHost() + ":" + credentials.getPort();
				userName = credentials.getUser();
				password = credentials.getPassword();
			} else {
				Credentials credentials = service.getCredentials();
				hostName += credentials.getHost() + ":" + credentials.getPort();
				userName = credentials.getUser();
				password = credentials.getPassword();
			}
			
			
			String url = "jdbc:sap://" + hostName + "/?autocommit=false" + "&encrypt=true&validateCertificate=false";
			/*this.connection = DriverManager.getConnection("jdbc:sap://" + hostName + "/?autocommit=false", userName,
					password);*/
			this.connection = DriverManager.getConnection(url, userName,
					password);

		} catch (SQLException e) {
			LOGGER.error("Error creating connection: \n" + e.getMessage());
			throw new EnvironmentException("Error creating connection:", e);
		}

	}

	public Connection getConnection() throws EnvironmentException {
		if (this.connection == null) {
			this.setConnection();
		}
		return this.connection;
	}

	public Connection getDTUserConnection() throws EnvironmentException {

		try {

			VcapServices services = VcapServices.fromEnvironment();

			ObjectMapper mapper = new ObjectMapper();

			// find HDI service by label "hana"
			String hostName = "";
			String userName;
			String password;
			Service service = services.findService("hana", "", "");
			if (service == null) {
				// non xsa environment
				hostName = config.getHost();
				userName = config.getDtUser();
				password = config.getDtPassword();
				
				String json = this.localEnv();
	            VcapServices vcapServices = VcapServices.from(json);
	            Credentials credentials = vcapServices.getCredentials("chp-hdi");
	            JsonNode node = mapper.convertValue(credentials, JsonNode.class);
	            hostName += credentials.getHost() + ":" + credentials.getPort();
				userName = node.get("hdi_user").asText();
				password = node.get("hdi_password").asText();
			} else {
				Credentials credentials = service.getCredentials();
				JsonNode node = mapper.convertValue(credentials, JsonNode.class);
				hostName += credentials.getHost() + ":" + credentials.getPort();
				userName = node.get("hdi_user").asText();
				password = node.get("hdi_password").asText();
			}
			connection = DriverManager.getConnection("jdbc:sap://" + hostName + "/?autocommit=false", userName,
					password);
			if (connection == null) {
				throw new EnvironmentException("Error Message :" + "Wrong connection details", null);
			}

		} catch (Exception e) {
			throw new EnvironmentException(e.getMessage(), null);
		}
		return connection;
	}

	public String getSchemaName() throws EnvironmentException, SQLException {
		VcapServices services = VcapServices.fromEnvironment();
		ObjectMapper mapper = new ObjectMapper();
		String schemaName;
		Service service = services.findService("hana", "", "");
		if (service == null) {
			// non xsa environment
			schemaName = config.getSchema();
			/*schemaName = this.getConnection().getSchema();
			 String json = this.localEnv();
	            VcapServices vcapServices = VcapServices.from(json);
	            Credentials credentials = vcapServices.getCredentials("chp-hdi");
	            JsonNode node = mapper.convertValue(credentials, JsonNode.class);
				schemaName = node.get("schema").asText();*/
		} else {
			Credentials credentials = service.getCredentials();
			JsonNode node = mapper.convertValue(credentials, JsonNode.class);
			schemaName = node.get("schema").asText();
		}
		
		if ( schemaName == null || this.isValidSchema(schemaName)) {
			return schemaName;
		}
		
		else throw new EnvironmentException("User is not authorized to access Schema :"+schemaName,null);

	}
	
	public boolean isValidSchema (String schemaName) throws SQLException, EnvironmentException {
		List <String> validSchemas = new ArrayList <String> ();
		PreparedStatement preparedStatement = this.getConnection().prepareStatement("select SCHEMA_NAME from SYS.SCHEMAS");
		ResultSet resultSet = preparedStatement.executeQuery();
		while (resultSet.next()) {
			validSchemas.add(resultSet.getString(1));
		}
		return validSchemas.contains(schemaName);
	}

	public void close() throws SQLException {
		if (this.connection != null) {
			this.connection.close();
		}
	}

	public void setConfiguration(ImportConfiguration config) {
		this.config = config;

	}
	
	public String localEnv(){
        try {
            Path vcapServicesRoot = Paths.get(new File(".").getAbsolutePath()).getParent().resolve("src/main/resources/");
            String env= new String(Files.readAllBytes(vcapServicesRoot.resolve("default-env.json")), StandardCharsets.UTF_8);
            return env;
        } catch (IOException ex) {
            LOGGER.error(ex.getMessage(),ex);
        }
        return null;
    }

}