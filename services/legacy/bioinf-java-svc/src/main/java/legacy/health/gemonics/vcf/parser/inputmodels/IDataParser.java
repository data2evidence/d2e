package legacy.health.genomics.vcf.parser.inputmodels;

import legacy.health.genomics.vcf.parser.datamodel.Dataline;
import legacy.health.genomics.vcf.parser.exceptions.DataLineParserException;

public interface IDataParser {

    Dataline parseDataline(String input, int line) throws DataLineParserException;
}
