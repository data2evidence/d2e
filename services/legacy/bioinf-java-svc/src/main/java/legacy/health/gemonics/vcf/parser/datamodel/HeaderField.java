package legacy.health.genomics.vcf.parser.datamodel;

import java.util.ArrayList;
import java.util.List;

public class HeaderField {

    //String columnHeader;
    private final List<String> columnHeader;
    private final List<String> sampleId;

    public HeaderField() {
        this.sampleId = new ArrayList<>();
        this.columnHeader = new ArrayList<>();
    }

    public List<String> getHeader() {
        return columnHeader;
    }

    public void setHeader(String header) {
        //System.out.println(header);
        this.columnHeader.add(header);
    }

    public List<String> getSampleId() {
        return sampleId;
    }
    public void setSampleId(String sampleId) {
        //System.out.println(sampleId);
        this.sampleId.add(sampleId);
    }

}
