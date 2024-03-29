package legacy.health.genomics.vcf.parser.inputmodels;

import org.apache.commons.lang3.tuple.Pair;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by D058991 on 27.02.2018.
 */
public interface IContext {

    int getDWID();
    
    List<String> getFilterExpr();

    Map<String, Set<Pair<String, String>>> getAttrFilter();

    Map<Integer, Integer> getSampleMapping();

}
