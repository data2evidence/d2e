package legacy.health.genomics.vcf.parser.datamodel;

import java.util.ArrayList;
import java.util.List;

public class DatalineInfoField {
	private final String key;
	private final List<String> values;

    public DatalineInfoField(String key, List<String> values) {
		this.key = key;
		this.values = values != null ? values : new ArrayList<>();
    }
	
	public String getKey() {
		return key;
	}

    public List<String> getValues() {
		return values;
	}

    @Override
	public String toString() {
		if (values.size() > 0) {
			return key + "=" + String.join(",", values);
		}
		else {
			return key;
		}
	}

	@Override
	public boolean equals(Object o) {
		if(o==null) return false;
    	if (getClass() != o.getClass())
			return false;
		return this.equals((DatalineInfoField)o);
	}
	
	@Override
	public int hashCode() {
	  assert false : "hashCode not designed";
	  return 42; // any arbitrary constant will do
	  }

	private boolean equals(DatalineInfoField o) {
		if (this.getValues() == null) {
			if (o.getValues() != null) {
				return false;
			}
			if (this.getKey() == null && o.getKey() != null) {
				return false;
			} else {
				return this.getKey() == null || this.getKey().equals(o.getKey());
			}
		} else {
			if (this.getKey() == null && o.getKey() != null) {
				return false;
			} else {
				return this.getKey() == null || this.getKey().equals(o.getKey()) && this.getValues().equals((o.getValues()));

			}
		}
	}

}
