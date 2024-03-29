package legacy.health.genomics.di;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import legacy.health.genomics.vcf.parser.ApplicationController;
import legacy.health.genomics.vcf.parser.exceptions.BodyParseException;
import legacy.health.genomics.vcf.parser.exceptions.DIJobStatusException;


public class DIJob {
private String jobID;
private String remoteSourceName;
private static final String REMOTE_VIRTUAL_TABLE = "SAP_HPH_VT_BLOB";
private Connection connection;
private String schemaName;
private String parentAuditID;
static String LOG_TRACEID = "JAVA_LOG_TRACE";
private String docName;
private static final Logger LOGGER = LoggerFactory.getLogger(ApplicationController.class);
private Map<Integer,Integer> sampleMapping = new HashMap<>();

public DIJob(Connection connection, String schemaName, String parentAuditID, String remoteSourceName, String docName) throws DIJobStatusException, SQLException {
	this.setJobID();
	this.setConnection(connection);
	this.setSchemaName(schemaName);
	this.setParentAuditID(parentAuditID);
	this.setDocName(docName);
	this.setRemoteSourceName(remoteSourceName);
}

public void createLogTrace (String docName, String notes, String status) throws DIJobStatusException {
	try {
		//Completed,Failed
		long auditLogID = 0;
		Connection conn = this.getConnection();
		PreparedStatement pstmt = this.getConnection().prepareStatement("select \"AuditLogID\" from "+this.getSchemaName()+"."+"\"hc.hph.di.model::DataIntegration.AuditLog\" where \"ParentAuditLogID\"=? and \"DocumentURI\"=?");
		pstmt.setString(1, sanitizeSQLExpression(this.parentAuditID));
		pstmt.setString(2, sanitizeSQLExpression(docName));
		Timestamp timestamp = new Timestamp(System.currentTimeMillis());
		ResultSet rs = pstmt.executeQuery();
		while (rs.next()) {
			auditLogID =  rs.getLong(1);
			break;
		}
		
		if (auditLogID == 0 ) {
			throw new DIJobStatusException ("Error getting AuditLogID from AuditLog table");
		}
		String query = "CALL " + this.getSchemaName()
				+ ".\"hc.hph.di.procedures::create_log_trace\" ("+auditLogID+",'"+LOG_TRACEID+"','"+status+"','"+timestamp+"','"+docName+"','"+notes+"')";
		CallableStatement stmt = conn.prepareCall(query);
		stmt.execute();
		
		if (!conn.getAutoCommit()) {
			conn.commit();
		}
		
	} catch (SQLException e) {
		throw new DIJobStatusException(e.getMessage());
	}
	
	
}

public long getAuditLogID (String docName) throws DIJobStatusException {
	try {
		//Completed,Failed
		long auditLogID = 0;
		Connection conn = this.getConnection();
		PreparedStatement pstmt = this.getConnection().prepareStatement("select \"AuditLogID\" from "+this.getSchemaName()+"."+"\"hc.hph.di.model::DataIntegration.AuditLog\" where \"ParentAuditLogID\"=? and \"DocumentURI\"=?");
		pstmt.setString(1, sanitizeSQLExpression(this.parentAuditID));
		pstmt.setString(2, sanitizeSQLExpression(docName));
		ResultSet rs = pstmt.executeQuery();
		while (rs.next()) {
			auditLogID =  rs.getLong(1);
			break;
		}
		
		if (auditLogID == 0 ) {
			throw new DIJobStatusException ("Error getting AuditLogID from AuditLog table");
		}
		
		if (!conn.getAutoCommit()) {
			conn.commit();
		}
		
		return auditLogID;
		
	} catch (SQLException e) {
		throw new DIJobStatusException(e.getMessage());
	}
	
	
}

public void setAuditLogCompleted (String parentAuditLogID, String docName, String notes) throws DIJobStatusException {
	try {
		long auditLogID = 0;
		Connection conn = this.getConnection();
		CallableStatement stmt = null;
		String query;
		if (docName != null) {
			PreparedStatement pstmt = this.getConnection().prepareStatement("select \"AuditLogID\" from "+this.getSchemaName()+"."+"\"hc.hph.di.model::DataIntegration.AuditLog\" where \"ParentAuditLogID\"=? and \"DocumentURI\"=?");
			pstmt.setString(1, sanitizeSQLExpression(this.parentAuditID));
			pstmt.setString(2, sanitizeSQLExpression(docName));
			ResultSet rs = pstmt.executeQuery();
			while (rs.next()) {
				auditLogID =  rs.getLong(1);
				break;
			}
			
			if (auditLogID == 0 ) {
				throw new DIJobStatusException ("Error getting AuditLogID from AuditLog table");
			}
			query = "CALL " + this.getSchemaName()
					+ ".\"hc.hph.di.procedures::set_audit_log_completed\" ("+auditLogID+",'"+notes+"')"; 
			stmt = conn.prepareCall(query);
			stmt.execute();
		}
		
		else {
			query = "CALL " + this.getSchemaName()
			+ ".\"hc.hph.di.procedures::set_audit_log_completed\" (?,?)"; 
			
			stmt = conn.prepareCall(query);
			stmt.setString(1, sanitizeSQLExpression(this.parentAuditID));
			stmt.setString(2, sanitizeSQLExpression(notes));
			stmt.execute();
		}
		
		if (!conn.getAutoCommit()) {
			conn.commit();
		}
		
	} catch (SQLException e) {
		throw new DIJobStatusException(e.getMessage());
	}
	
	
}

public void setAuditLogRunning (String docName, String notes) throws DIJobStatusException {
	try {
		long auditLogID = 0;
		Connection conn = this.getConnection();
		
		if (docName == null) {
			auditLogID = Long.parseLong(this.parentAuditID);
		}
		else {
			
			PreparedStatement pstmt = this.getConnection().prepareStatement("select \"AuditLogID\" from "+this.getSchemaName()+"."+"\"hc.hph.di.model::DataIntegration.AuditLog\" where \"ParentAuditLogID\"=? and \"DocumentURI\"=?");
			pstmt.setString(1, sanitizeSQLExpression(this.parentAuditID));
			pstmt.setString(2, sanitizeSQLExpression(docName));
			ResultSet rs = pstmt.executeQuery();
			while (rs.next()) {
				auditLogID =  rs.getLong(1);
				break;
			}
			
			if (auditLogID == 0 ) {
				throw new DIJobStatusException ("Error getting AuditLogID from AuditLog table");
			}
			
		}
		
		String query = "CALL " + this.getSchemaName()
				+ ".\"hc.hph.di.procedures::set_audit_log_running\" ("+auditLogID+",'"+notes+"')"; 
		CallableStatement stmt = conn.prepareCall(query);
		stmt.execute();
		if (!conn.getAutoCommit()) {
			conn.commit();
		}
		
	} catch (SQLException e) {
		throw new DIJobStatusException(e.getMessage());
	}
	
	
}


public void setAuditLogFailed( String parentAuditLogID, String docName, String notes) throws DIJobStatusException {
	try {
		long auditLogID = 0;
		
		Connection conn = this.getConnection();
		if (docName != null) {
			PreparedStatement pstmt = this.getConnection().prepareStatement("select \"AuditLogID\" from "+this.getSchemaName()+"."+"\"hc.hph.di.model::DataIntegration.AuditLog\" where \"ParentAuditLogID\"=? and \"DocumentURI\"=?");
			pstmt.setString(1, sanitizeSQLExpression(this.parentAuditID));
			pstmt.setString(2, sanitizeSQLExpression(docName));
			ResultSet rs = pstmt.executeQuery();
			while (rs.next()) {
				auditLogID =  rs.getLong(1);
				break;
			}
			
			if (auditLogID == 0 ) {
				throw new DIJobStatusException ("Error getting AuditLogID from AuditLog table");
			}
		}
		
		else {
			auditLogID = Long.parseLong(this.parentAuditID);
		}
		
		/*String query = "CALL " + this.getSchemaName()
				+ ".\"hc.hph.di.procedures::set_audit_log_failed\" ("+auditLogID+",'"+notes+"')"; 
		CallableStatement stmt = conn.prepareCall(query);
		stmt.execute();*/
		String query = "CALL " + this.getSchemaName()
		+ ".\"hc.hph.di.procedures::set_audit_log_failed\" (?,?)"; 
		CallableStatement stmt = conn.prepareCall(query);
		stmt.setString(1, sanitizeSQLExpression(String.valueOf(auditLogID)));
		stmt.setString(2, sanitizeSQLExpression(notes));
		stmt.execute();
		if (!conn.getAutoCommit()) {
			conn.commit();
		}
		
	} catch (SQLException e) {
		throw new DIJobStatusException(e.getMessage());
	}
	
	
}

public void writeDataToCDW() throws SQLException, BodyParseException{
    try {
    	Connection conn = this.getConnection();
    	conn.setAutoCommit(false);
    	PreparedStatement pstmtCheckForPatients = conn.prepareStatement("Select \"DWAuditID\" from " +this.getSchemaName() +".\"hc.hph.cdw.db.models::DWEntities.Patient_Key\"  where \"DWAuditID\"=?");
    	pstmtCheckForPatients.setString(1, sanitizeSQLExpression(this.getParentAuditID()));
    	ResultSet resultSet = pstmtCheckForPatients.executeQuery();
    	if (resultSet.next()) {
    		LOGGER.info("Not writing to CDW as the patient data already present in CDW");
    		return;
    	}
    	
    	PreparedStatement pstmtPatientKeys = conn.prepareStatement("insert into "+this.getSchemaName()+"."+"\"hc.hph.cdw.db.models::DWEntities.Patient_Key\" ( \"DWID\",\"DWAuditID\",\"DWSource\", \"PatientID\") select  \"DWID\",\"DWAuditID\",\"DWSource\", \"PatientID\" from "+this.getSchemaName() +".\"hc.hph.plugins.vcf.db.models.cdw::PatientKeys\"  where \"DWAuditID\"=?");
        pstmtPatientKeys.setString(1, sanitizeSQLExpression(this.getParentAuditID()));
        pstmtPatientKeys.executeUpdate();
        PreparedStatement pstmtInteractionDetails = conn.prepareStatement("insert into "+this.getSchemaName()+"."+"\"hc.hph.cdw.db.models::DWEntitiesEAV.Interaction_Details\" (\"DWID\",\"DWAuditID\",\"DWDateFrom\",\"DWDateTo\", \"Attribute.OriginalValue\",\"Attribute.Code\",\"Attribute.CodeSystem\",\"Attribute.CodeSystemVersion\", \"Value.OriginalValue\",\"Value.Code\", \"Value.CodeSystem\",\"Value.CodeSystemVersion\") select \"DWID\",\"DWAuditID\",\"DWDateFrom\",\"DWDateTo\", \"Attribute.OriginalValue\",\"Attribute.Code\",\"Attribute.CodeSystem\",\"Attribute.CodeSystemVersion\", \"Value.OriginalValue\",\"Value.Code\", \"Value.CodeSystem\",\"Value.CodeSystemVersion\" from "+this.getSchemaName() +".\"hc.hph.plugins.vcf.db.models.cdw::InteractionDetails\" where \"DWAuditID\"=?");
        pstmtInteractionDetails.setString(1, sanitizeSQLExpression(this.getParentAuditID()));
        pstmtInteractionDetails.executeUpdate();
        PreparedStatement pstmtInteractionAttributes = conn.prepareStatement("insert into "+this.getSchemaName()+"."+"\"hc.hph.cdw.db.models::DWEntities.Interactions_Attr\" (\"DWDateFrom\",\"DWID\",\"DWDateTo\",\"DWAuditID\",\"DWID_Patient\",\"DWID_ParentInteraction\",\"DWID_Condition\",\"InteractionType.OriginalValue\",\"InteractionType.Code\",\"InteractionType.CodeSystem\",\"InteractionType.CodeSystemVersion\",\"InteractionStatus\",\"PeriodStart\",\"PeriodEnd\",\"OrgID\") select \"DWDateFrom\",\"DWID\",\"DWDateTo\",\"DWAuditID\",\"DWID_Patient\",\"DWID_ParentInteraction\",\"DWID_Condition\",\"InteractionType.OriginalValue\",\"InteractionType.Code\",\"InteractionType.CodeSystem\",\"InteractionType.CodeSystemVersion\",\"InteractionStatus\",\"PeriodStart\",\"PeriodEnd\",\"OrgID\" from "+this.getSchemaName() +".\"hc.hph.plugins.vcf.db.models.cdw::InteractionAttributes\" where \"DWAuditID\"=?");
        pstmtInteractionAttributes.setString(1, sanitizeSQLExpression(this.getParentAuditID()));
        pstmtInteractionAttributes.executeUpdate();
        PreparedStatement pstmtInteractionKeys = conn.prepareStatement("insert into "+this.getSchemaName()+"."+"\"hc.hph.cdw.db.models::DWEntities.Interactions_Key\" (\"DWID\",\"DWAuditID\",\"DWSource\",\"InteractionID\") select \"DWID\",\"DWAuditID\",\"DWSource\",\"InteractionID\" from "+this.getSchemaName() +".\"hc.hph.plugins.vcf.db.models.cdw::InteractionKeys\" where \"DWAuditID\" = ?");
        pstmtInteractionKeys.setString(1, sanitizeSQLExpression(this.getParentAuditID()));
        pstmtInteractionKeys.executeUpdate();
        PreparedStatement pstmtPatientAttr = conn.prepareStatement("insert into "+this.getSchemaName()+"."+"\"hc.hph.cdw.db.models::DWEntities.Patient_Attr\" (\"DWID\",\"DWAuditID\",\"DWDateFrom\",\"DWDateTo\",\"ValidFrom\",\"ValidTo\",\"FamilyName\",\"GivenName\",\"Title.OriginalValue\",\"Title.Code\",\"Title.CodeSystem\",\"Title.CodeSystemVersion\",\"Gender.OriginalValue\",\"Gender.Code\",\"Gender.CodeSystem\",\"Gender.CodeSystemVersion\",\"BirthDate\",\"MultipleBirthOrder\",\"DeceasedDate\",\"MaritalStatus.OriginalValue\",\"MaritalStatus.Code\",\"MaritalStatus.CodeSystem\",\"MaritalStatus.CodeSystemVersion\",\"Nationality.OriginalValue\",\"Nationality.Code\",\"Nationality.CodeSystem\",\"Nationality.CodeSystemVersion\",\"Address.StreetName\",\"Address.StreetNumber\",\"Address.PostOfficeBox\",\"Address.City\",\"Address.PostalCode\",\"Address.State\", \"Address.Country.OriginalValue\",\"Address.Country.Code\",\"Address.Country.CodeSystem\", \"Address.Country.CodeSystemVersion\",\"Telecom.Phone\",\"Telecom.Mobile\",\"Telecom.Fax\",\"Telecom.Email\") select \"DWID\",\"DWAuditID\",\"DWDateFrom\",\"DWDateTo\",\"ValidFrom\",\"ValidTo\",\"FamilyName\",\"GivenName\",\"Title.OriginalValue\",\"Title.Code\",\"Title.CodeSystem\",\"Title.CodeSystemVersion\",\"Gender.OriginalValue\",\"Gender.Code\",\"Gender.CodeSystem\",\"Gender.CodeSystemVersion\",\"BirthDate\",\"MultipleBirthOrder\",\"DeceasedDate\",\"MaritalStatus.OriginalValue\",\"MaritalStatus.Code\",\"MaritalStatus.CodeSystem\",\"MaritalStatus.CodeSystemVersion\",\"Nationality.OriginalValue\",\"Nationality.Code\",\"Nationality.CodeSystem\",\"Nationality.CodeSystemVersion\",\"Address.StreetName\",\"Address.StreetNumber\",\"Address.PostOfficeBox\",\"Address.City\",\"Address.PostalCode\",\"Address.State\", \"Address.Country.OriginalValue\",\"Address.Country.Code\",\"Address.Country.CodeSystem\", \"Address.Country.CodeSystemVersion\",\"Telecom.Phone\",\"Telecom.Mobile\",\"Telecom.Fax\",\"Telecom.Email\" from "+this.getSchemaName() +".\"hc.hph.plugins.vcf.db.models.cdw::PatientAttributes\" where \"DWAuditID\" = ?");
        pstmtPatientAttr.setString(1, sanitizeSQLExpression(this.getParentAuditID()));
        pstmtPatientAttr.executeUpdate();
        
        if (!conn.getAutoCommit()) {
			conn.commit();
		}
    }catch (SQLException e) {
        throw new BodyParseException("An error occured while writing to CDW tables ", e);
    }
}

public void updateAuditTrace () {
	
}

public void createVirtualTable () throws SQLException {
	String query = "CALL " + this.getSchemaName()+ ".\"hc.hph.di.procedures::create_virtual_tables\"(?,?,null,null,'"+REMOTE_VIRTUAL_TABLE+"',?)";
	CallableStatement stmt = this.getConnection().prepareCall(query);
	stmt.setString(1, sanitizeSQLExpression(this.getJobID()));
	stmt.setString(2, sanitizeSQLExpression(this.getRemoteSourceName()));
	stmt.execute();	
	LOGGER.info("Virtual Table :"+this.getJobID()+ " created");
}

public void dropVirtualTable () throws SQLException {
	String query = "CALL " + this.getSchemaName()+ ".\"hc.hph.di.procedures::delete_virtual_table\"('"+this.getJobID()+"')";
	CallableStatement stmt = this.getConnection().prepareCall(query);
	stmt.execute();
	LOGGER.info("Virtual Table :"+this.getJobID()+ " deleted");
}

private void setJobID() {
	String uniqueID = UUID.randomUUID().toString();
	jobID = uniqueID.replaceAll("-", "");
	
}

public String getJobID() {
	return jobID;
}

public Connection getConnection() {
	return connection;
}


public void setConnection(Connection connection) {
	this.connection = connection;
}


public String getSchemaName() {
	return schemaName;
}


public void setSchemaName(String schemaName) {
	this.schemaName = schemaName;
}


public String getRemoteSourceName() {
	return remoteSourceName;
}


public void setRemoteSourceName(String remoteSourceName) throws DIJobStatusException, SQLException {
	if (isValidRemoteSource (remoteSourceName)) {
		this.remoteSourceName = remoteSourceName;
	}
	
	else {
		
		this.setAuditLogFailed(this.parentAuditID, this.docName,
				BodyParseException.getBaseErrorMessage());
		this.createLogTrace(this.docName, BodyParseException.getBaseErrorMessage(), " Failed");
		throw new DIJobStatusException("Not a Valid Remote Source :"+remoteSourceName);
	}
	
}

private boolean isValidRemoteSource(String remoteSourceName) throws SQLException {
	List <String> validRemoteSources = new ArrayList <String> ();
	PreparedStatement preparedStatement = this.connection.prepareStatement("select REMOTE_SOURCE_NAME from REMOTE_SOURCES");
	ResultSet resultSet = preparedStatement.executeQuery();
	while (resultSet.next()) {
		validRemoteSources.add(resultSet.getString(1));
	}
	return validRemoteSources.contains(remoteSourceName);
}

public String getParentAuditID() {
	return parentAuditID;
}


public void setParentAuditID(String parentAuditID) {
	this.parentAuditID = parentAuditID;
}

public String getDocName() {
	return docName;
}

public void setDocName(String docName) {
	this.docName = docName;
}

public static String sanitizeSQLExpression(String str) {
    	 return ((!str.isEmpty() && str!=null) ? str : null);
    }

public void addSampleMapping(String parentAuditLogID) throws DIJobStatusException {
	// select "SampleIndex" from SAP_CHP200_1."hc.hph.genomics.db.models::General.Samples" where "DWAuditID"=64
	try {
		
		Connection conn = this.getConnection();
		PreparedStatement pstmt = this.getConnection().prepareStatement("select \"SampleIndex\" from "+this.getSchemaName()+"."+"\"hc.hph.genomics.db.models::General.Samples\" where \"DWAuditID\"=?");
		pstmt.setString(1, sanitizeSQLExpression(this.parentAuditID));
		ResultSet rs = pstmt.executeQuery();
		int sampleCounter =0;
		while (rs.next()) {
			sampleMapping.put(sampleCounter++, rs.getInt(1));
		}
		if (!conn.getAutoCommit()) {
			conn.commit();
		}
		
	} catch (SQLException e) {
		throw new DIJobStatusException(e.getMessage());
	}
	
}

public Map<Integer, Integer> getSampleMapping () {
	return this.sampleMapping;
}
}
