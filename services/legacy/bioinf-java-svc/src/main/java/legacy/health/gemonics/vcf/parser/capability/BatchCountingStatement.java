package legacy.health.genomics.vcf.parser.capability;

import java.sql.PreparedStatement;

public interface BatchCountingStatement extends PreparedStatement {
    int getBatchCount();
}
