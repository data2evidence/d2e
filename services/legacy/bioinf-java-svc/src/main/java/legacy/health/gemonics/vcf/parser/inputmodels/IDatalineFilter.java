package legacy.health.genomics.vcf.parser.inputmodels;

import legacy.health.genomics.vcf.parser.datamodel.Dataline;
import legacy.health.genomics.vcf.parser.datamodel.VCFStructureDefinition;

public interface IDatalineFilter {

    void filterAttritbutes(VCFStructureDefinition def);

    boolean skipDataLine(Dataline line);

}
