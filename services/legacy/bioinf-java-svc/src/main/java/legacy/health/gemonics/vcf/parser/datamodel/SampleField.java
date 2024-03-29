package legacy.health.genomics.vcf.parser.datamodel;

import java.util.Map;

public class SampleField {
    private String id;
    private String assay;
    private String ethnicity;

    private void setId(String id) {
        this.id = id;
    }

    private void setAssay(String assay) {
        this.assay = assay;
    }

    private void setEthnicity(String ethnicity) {
        this.ethnicity = ethnicity;
    }

    private void setDisease(String disease) {
        this.disease = disease;
    }

    private void setTissue(String tissue) {
        this.tissue = tissue;
    }

    private void setDescription(String description) {
        this.description = description;
    }

    private void setDoi(String doi) {
        this.doi = doi;
    }

    private String disease;
    private String tissue;
    private String description;
    private String doi;

    private SampleField() {

    }

    public static SampleField getFromValueMapSample(Map<String,String> valueMap) {

        SampleField field = new SampleField();
        field.setId(valueMap.get("id"));
        field.setDescription(valueMap.get("description"));
        field.setAssay(valueMap.get("assay"));
        field.setEthnicity(valueMap.get("ethnicity"));
        field.setDisease(valueMap.get("disease"));
        field.setTissue(valueMap.get("tissue"));
        field.setDoi(valueMap.get("doi"));
        return field;
    }

    public String getId() {
        return id;
    }

    public String getAssay() {
        return assay;
    }

    public String getEthnicity() {
        return ethnicity;
    }

    public String getDisease() {
        return disease;
    }

    public String getTissue() {
        return tissue;
    }

    public String getDescription() {
        return description;
    }

    public String getDoi() {
        return doi;
    }
}
