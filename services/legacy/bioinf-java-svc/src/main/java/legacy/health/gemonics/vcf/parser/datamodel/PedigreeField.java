package legacy.health.genomics.vcf.parser.datamodel;

import java.util.Locale;
import java.util.Map;
import java.util.TreeMap;

import legacy.health.genomics.vcf.parser.exceptions.HeaderParseException;

public class PedigreeField {

    private String id;
    final private Map<String, String> ancestors;

    public String getId() {
        return id;
    }

    public Map<String, String> getAncestors() {
        return ancestors;
    }

    private PedigreeField() {
        this.ancestors = new TreeMap<>();
    }

    private void addAncenstor(String ancestorId, String ancestorValue) throws HeaderParseException {
        final String oldVal = this.ancestors.put(ancestorId, ancestorValue);
        if(oldVal!=null)
        {
            throw new HeaderParseException("AncestorId " + ancestorId + "is duplicated",0);
        }
    }

    public static PedigreeField getFromValueMapPedigree(Map<String, String> valuePair) throws HeaderParseException {
        PedigreeField ped = new PedigreeField();
        for (Map.Entry<String, String> entry : valuePair.entrySet()){
            if(!entry.getKey().toLowerCase(Locale.ENGLISH).equals("id")){
                ped.addAncenstor(entry.getKey(),entry.getValue());
            } else{
                ped.setId(entry.getValue());
            }
        }
        return ped;
    }

    private void setId(String id) {
        this.id = id;
    }
}
