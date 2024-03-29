package legacy.health.genomics.vcf.parser.capability;


import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;

import java.util.*;

@JsonDeserialize(using = ImportConfigurationDeserializer.class)
public class ImportConfiguration {

    private static final int DEFAULT_BATCH_SIZE = 20000;
    private static final int DEFAULT_PARALLEL_COUNT = 1;

    private final List<String> filterExpr;
    private Map<String, Set<Pair<String,String> >> attrFilter;
    private Map<Integer,Integer> sampleMapping;

    private int dwid;
    private int batchSize;
    private int parallelCount;

    private String user;
    private String password;
    private String host;
    private String schema;
    private String dtUser;
    private String dtPassword;

    public ImportConfiguration() {
        filterExpr = new LinkedList<>();
        attrFilter = new HashMap<>();
        sampleMapping = new HashMap<>();
    }

    public void setDwid(int dwid) {
        this.dwid = dwid;
    }

    public int getBatchSize() {
        return batchSize;
    }

    public void setBatchSize(int batchSize) {
        this.batchSize = batchSize;
    }

    public void setParallelCount(int parallelCount) {
        this.parallelCount = parallelCount;
    }

    public void addFilter(String s) {
        this.filterExpr.add(s);
    }

      public void addSampleMapping(int source_id, int target_id) {
        this.sampleMapping.put(source_id,target_id);
    }
      
     public void setSampleMapping (Map<Integer, Integer> sampleMapping) {
    	 this.sampleMapping = sampleMapping;
     }

    public int getParallelCount() {
        return parallelCount;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public List<String> getFilterExpr() {
        return filterExpr;
    }

    public Map<String, Set<Pair<String,String> > > getAttrFilter() {
        return attrFilter;
    }

    public Map<Integer, Integer> getSampleMapping() {
        return sampleMapping;
    }

    public int getDwid() {
        return dwid;
    }

    public void addAttributeToImport(String name, String alias, String type) {
        if(!this.attrFilter.containsKey(type)) {
            this.attrFilter.put(type,new HashSet<>());
        }
        this.attrFilter.get(type).add(new ImmutablePair(name, alias == null ? name : alias));

    }

	public static int getDefaultBatchSize() {
		return DEFAULT_BATCH_SIZE;
	}

	public static int getDefaultParallelCount() {
		return DEFAULT_PARALLEL_COUNT;
	}

	public String getSchema() {
		return schema;
	}

	public void setSchema(String schema) {
		this.schema = schema;
	}

	public String getDtUser() {
		return dtUser;
	}

	public void setDtUser(String dtUser) {
		this.dtUser = dtUser;
	}

	public String getDtPassword() {
		return dtPassword;
	}

	public void setDtPassword(String dtPassword) {
		this.dtPassword = dtPassword;
	}
}
