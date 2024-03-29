package legacy.health.genomics.vcf.parser.inputmodels;

import legacy.health.genomics.vcf.parser.datamodel.HeaderField;
import legacy.health.genomics.vcf.parser.exceptions.HeaderParseException;

public interface IHeaderParser {

    HeaderLine parseLine(HeaderLine line) throws Exception;

    HeaderField parseHeaderLine(HeaderLine line) throws HeaderParseException;
}
