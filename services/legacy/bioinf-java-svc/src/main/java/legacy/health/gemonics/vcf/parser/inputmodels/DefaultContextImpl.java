package legacy.health.genomics.vcf.parser.inputmodels;

import org.apache.commons.lang3.tuple.Pair;

import java.util.*;

public class DefaultContextImpl implements IContext {

    private int dwid;
    private List<String> filter;
    private Map<String, Set<Pair<String, String>>> attr;
    private Map<Integer, Integer> sample;


    public DefaultContextImpl() {
        this.filter = new LinkedList<>();
        this.attr = new HashMap<>();
        this.sample = new HashMap<>();
    }

    public void setDwid(int dwid) {
        this.dwid = dwid;
    }

    public void setFilterExpr(List<String> filter) {
        this.filter = filter;
    }

    public void setAttrFilter(Map<String, Set<Pair<String, String>>> attr) {
        this.attr = attr;
    }

    public void setSampleMapping(Map<Integer, Integer> sample) {
        this.sample = sample;
    }

    @Override
    public int getDWID() {
        return dwid;
    }

    @Override
    public List<String> getFilterExpr() {
        return filter;
    }

    @Override
    public Map<String, Set<Pair<String, String>>> getAttrFilter() {
        return attr;
    }

    @Override
    public Map<Integer, Integer> getSampleMapping() {
        return sample;
    }
}
