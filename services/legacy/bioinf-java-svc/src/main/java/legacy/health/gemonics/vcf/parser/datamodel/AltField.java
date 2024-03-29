package legacy.health.genomics.vcf.parser.datamodel;

import java.util.Map;

import legacy.health.genomics.vcf.parser.utils.StringUtils;

public class AltField {
    private String id;
    private String description;

    private AltField() {

    }

    public static AltField getFromValueMapAlt(Map<String,String> valueMap) {

        AltField field = new AltField();
        field.setId(valueMap.get("id"));
        field.setDescription(valueMap.get("description"));
        return field;
    }


    public String getId() {
        return id;
    }

    private void setId(String id) {
        this.id = id;
    }

    private void setDescription(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
