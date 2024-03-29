package legacy.health.genomics.vcf.parser;

import java.util.List;

public class InputParameter {

	private String properties;
	private String blobView;
	private List <String> files;
	private String parentAuditLogID;
	private String profileID;
	private String remoteSource;
	public String getProperties() {
		return properties;
	}
	public void setProperties(String properties) {
		this.properties = properties;
	}
	public String getBlobView() {
		return blobView;
	}
	public void setBlobView(String blobView) {
		this.blobView = blobView;
	}
	public List<String> getFiles() {
		return this.files;
	}
	public void setFiles(List <String> files) {
		this.files = files;
	}
	
	public void addFile (String file) {
		this.files.add(file);
	}
	public String getParentAuditLogID() {
		return parentAuditLogID;
	}
	public void setParentAuditLogID(String parentAuditLogID) {
		this.parentAuditLogID = parentAuditLogID;
	}
	public String getProfileID() {
		return profileID;
	}
	public void setProfileID(String profileID) {
		this.profileID = profileID;
	}
	public String getRemoteSource() {
		return remoteSource;
	}
	public void setRemoteSource(String remoteSource) {
		this.remoteSource = remoteSource;
	}
}
