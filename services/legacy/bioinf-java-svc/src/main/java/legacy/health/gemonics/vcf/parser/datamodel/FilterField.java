package legacy.health.genomics.vcf.parser.datamodel;

import java.util.Map;

public class FilterField extends VCFDataField {
    private String id;
    private String description;

    private FilterField() {

    }

    public String getId() {
        return id;
    }

    @Override
    public EPrimitiveType getType() {
        return EPrimitiveType.Flag;
    }

    private void setId(String id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    private void setDescription(String description) {
        this.description = description;
    }

    public static FilterField getFromValueMapFilter(Map<String,String> valueMap) {

        FilterField field = new FilterField();
        field.setId(valueMap.get("id"));
        field.setAlias(valueMap.get("id"));
        field.setDescription(valueMap.get("description"));
        return field;
    }



}
