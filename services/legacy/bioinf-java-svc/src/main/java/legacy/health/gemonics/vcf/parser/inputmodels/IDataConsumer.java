package legacy.health.genomics.vcf.parser.inputmodels;

import java.sql.SQLException;

import legacy.health.genomics.vcf.parser.datamodel.Dataline;
import legacy.health.genomics.vcf.parser.datamodel.VCFStructureDefinition;

public interface IDataConsumer {

    /*abort*/ boolean consumeDataRow(Dataline line) throws Exception;

    void consumeHeader(VCFStructureDefinition vcfFileDefintion) throws Exception;

    void close() throws SQLException;
    
    void stopProcessing();
}
