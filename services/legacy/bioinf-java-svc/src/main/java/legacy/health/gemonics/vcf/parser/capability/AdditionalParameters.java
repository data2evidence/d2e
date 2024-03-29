package legacy.health.genomics.vcf.parser.capability;



import java.util.HashMap;
import java.util.Map;


import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

@JsonDeserialize(using = AdditionalParametersDeserializer.class)
public class AdditionalParameters {
	private Map<String,ImportConfiguration> importConfigurationMap = new HashMap<String,ImportConfiguration>();

	public Map<String,ImportConfiguration> getImportConfigurationMap() {
		return importConfigurationMap;
	}

	public void setImportConfigurationMap(Map<String,ImportConfiguration> importConfigurationMap) {
		this.importConfigurationMap = importConfigurationMap;
	}
	
	}
