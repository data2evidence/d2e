package legacy.health.genomics.vcf.parser.datamodel;

import java.util.*;

import legacy.health.genomics.vcf.parser.utils.VariantUtils;


public class Dataline {
    private String chrom;
    private Long pos;
    private final List<String> id;
    private String ref;
    private final List<String> alt;
    private Double qual;
    private final Set<String> filter;
    private final Map<String, DatalineInfoField> info;
    private final LinkedHashMap<String, Integer> format;	//Key is field, value is index
    private final LinkedHashMap<Integer,String> formatList;	//Key is field, value is index
    private final List<List<List<String>>> samples;
    private int sourceLine;
    private Integer GTIdx = null;
    private final List<Integer> copyNumber;
    private final List<Integer> referenceCount;
    private final List<List<Integer> >gtSubVals;
    private final List<Boolean> phased;

    public Dataline() {
        this.id = new ArrayList<>();
        this.alt = new ArrayList<>();
        this.filter = new HashSet<>();
        this.info = new HashMap<>();
        this.format = new LinkedHashMap<>();
        this.formatList = new LinkedHashMap<>();
        this.samples = new ArrayList<>();
        this.copyNumber = new ArrayList<>();
        this.referenceCount = new ArrayList<>();
        this.gtSubVals = new ArrayList<>();
        this.phased = new ArrayList<>();

    }

    public String getChrom() {
        return chrom;
    }

    public Dataline setChrom(String chrom) {
        this.chrom = chrom;
        return this;
    }

    public Long getPos() {
        return pos;
    }

    public Dataline setPos(Long pos) {
        this.pos = pos;
        return this;
    }

    public List<String> getId() {
        return id;
    }

    public Dataline addIdField(String idField) {
        id.add(idField);
        return this;
    }

    public String getRef() {
        return ref;
    }

    public Dataline setRef(String ref) {
        this.ref = ref;
        return this;
    }

    public List<String> getAlt() {
        return alt;
    }


    public Dataline addAltField(String altField) {
        if (alt != null) {
            alt.add(altField);
        }
        return this;
    }

    public Double getQual() {
        return qual;
    }

    public Dataline setQual(Double qual) {
        this.qual = qual;
        return this;
    }

    public Set<String> getFilter() {
        return filter;
    }

    public Dataline addFilterField(String filterField) {
        if (filter != null) {
            filter.add(filterField);
        }
        return this;
    }

    public Map<String, DatalineInfoField> getInfo() {
        return info;
    }

    public Dataline addInfoField(DatalineInfoField infoField) {
        if (info != null) {
            info.put(infoField.getKey(), infoField);
        }
        return this;
    }

    public LinkedHashMap<String, Integer> getFormat() {
        return format;
    }

    public Dataline addFormatField(String formatField, Integer index) {
        if(formatField.equals("GT"))
        {
            this.GTIdx = index;
        }
        if (format != null) {
            format.put(formatField, index);
            formatList.put(index,formatField);
        }
        return this;
    }

    public List<List<String>> getSample(int i) {
        return samples.get(i);
    }
    public List<List<List<String>>> getSamples() {
        return samples;
    }

    public Dataline addSample(List<List<String>> sample) {
        if(GTIdx != null && sample.size() >= GTIdx)
        {
            this.fillGTInformation(sample.get(GTIdx));
        } else {
            this.gtSubVals.add(new LinkedList<>());
            this.phased.add(false);
            this.copyNumber.add(null);
            this.referenceCount.add(null);
        }
        if (samples != null) {
            samples.add(sample);
        }
        return this;
    }

    private void fillGTInformation(List<String> gt) {
        String gtVal = gt.get(0);
        List<Integer> currentGT = VariantUtils.parseGTField(gtVal);
        this.gtSubVals.add(gtVal.equals(".") ? null : currentGT);
        this.copyNumber.add(gtVal.equals(".") ?  null : currentGT.size());
        this.referenceCount.add(gtVal.equals(".") ?  null : (int) currentGT
                .stream()
                .filter(p -> p.equals(0))
                .count());

        this.phased.add(gtVal.equals(".") ? null : gtVal.contains("|"));
    }


    public String getFormatField(int sampleValueIndex) {
        return this.formatList.get(sampleValueIndex);
    }

    public Dataline setSourceLine(int sourceLine) {
        this.sourceLine = sourceLine;
        return this;
    }

    public int getSourceLine() {
        return this.sourceLine;
    }

    public Integer getCopyNumber(int sampleIdx) {
        return copyNumber.get(sampleIdx);
    }

    public Integer getReferenceCount(int sampleIdx) {
        return referenceCount.get(sampleIdx);
    }

    public List<Integer> getGtSubVals(int sampleIndex) {
        return sampleIndex < gtSubVals.size() ?  gtSubVals.get(sampleIndex) : null;
    }

    public List<String> getSampleField(String id, int sampleIdx) {
        List<String> field = null;
        if( getFormat().containsKey(id)) {
            final int formatFieldIdx = getFormat().get(id);
            if(formatFieldIdx < getSample(sampleIdx).size()) {
                field = getSample(sampleIdx).get(formatFieldIdx);
            }
        }
        return field;
    }

    public Boolean isPhased(int sampleIdx) {

        return phased.get(sampleIdx);
    }

    public Integer getGTIdx() {
        return GTIdx;
    }
}

