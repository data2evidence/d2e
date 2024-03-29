package legacy.health.genomics.vcf.parser.inputmodels;

import java.sql.SQLException;

/**
 * Created by D058991 on 23.02.2018.
 */
public interface IErrorConsumer {

    /*continue processing*/ boolean consumeError(Exception e, int i);
    
    void stopProcessing();

}
