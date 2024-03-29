package legacy.health.genomics.vcf.parser.datamodel;

import java.util.Map;

public class ContigField {
    private String id;
    private Long length;
    private String assembly;
    private String md5;
    private String species;
    private String taxonomy;
    private String url;

    private ContigField() {

    }

    public static ContigField getFromValueMapContig(Map<String,String> valueMap) {

        ContigField field = new ContigField();

        field.setId(valueMap.get("id"));
        field.setLength(Long.parseLong(valueMap.get("length")));
        field.setAssembly(valueMap.get("assembly"));
        field.setMd5(valueMap.get("md5"));
        field.setSpecies(valueMap.get("species"));
        field.setTaxonomy(valueMap.get("taxonomy"));
        field.setUrl(valueMap.get("url"));

        return field;
    }

    public String getId() {
        return id;
    }

    public Long getLength() {
        return length;
    }

    public String getAssembly() {
        return assembly;
    }

    public String getMd5() {
        return md5;
    }

    public String getSpecies() {
        return species;
    }

    public String getTaxonomy() {
        return taxonomy;
    }

    public String getUrl() {
        return url;
    }

    private void setId(String id) {
        this.id = id;
    }

    private void setLength(Long length) {
        this.length = length;
    }

    private void setAssembly(String assembly) {
        this.assembly = assembly;
    }

    private void setMd5(String md5) {
        this.md5 = md5;
    }

    private void setSpecies(String species) {
        this.species = species;
    }

    private void setTaxonomy(String taxonomy) {
        this.taxonomy = taxonomy;
    }

    private void setUrl(String url) {
        this.url = url;
    }

}
