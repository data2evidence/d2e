package legacy.health.genomics.vcf.parser.datamodel;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import legacy.health.genomics.vcf.parser.capability.BatchCountingStatement;
import legacy.health.genomics.vcf.parser.capability.ImportConfiguration;
import legacy.health.genomics.vcf.parser.capability.TableBase;
import legacy.health.genomics.vcf.parser.exceptions.EnvironmentException;

/**
 * Created by D058991 on 24.02.2018.
 */
public class SNVVariantIds extends  TableBase<VCFDataField>{
    List<String> sqlColumnNames;

    enum STATIC_FIELDS {
        DWAuditID(1),
        VariantIndex(2),
        VariantID(3);

        private final int idx;
        STATIC_FIELDS(int idx) {this.idx = idx;}
        int getIdx() {return idx;}
    }

    public SNVVariantIds(Connection conn, ImportConfiguration context) throws SQLException, EnvironmentException {
        super("hc.hph.genomics.db.models::SNV.VariantIDs",conn, context);
        sqlColumnNames = new ArrayList<>(3);
        for ( STATIC_FIELDS x : STATIC_FIELDS.values()) {
            sqlColumnNames.add(x.getIdx()-1,x.name());
        }

    }

    public void init() throws SQLException, EnvironmentException {
        setInsertStmt(createPreparedInsertStmt(super.getSchemaName(),getTableName(),sqlColumnNames));
    }

    @Override
    public void consumeDataRow(Dataline line) throws SQLException {
        getInsertStmt().clearParameters();
        for(String id : line.getId()) {
            if(id == null || id.equals(".")) {
                continue;
            }
            getInsertStmt().setInt(STATIC_FIELDS.DWAuditID.getIdx(), getConfig().getDwid());
            getInsertStmt().setLong(STATIC_FIELDS.VariantIndex.getIdx(), line.getSourceLine());
            getInsertStmt().setString(STATIC_FIELDS.VariantID.getIdx(),id);
            getInsertStmt().addBatch();
        }
        if(((BatchCountingStatement)getInsertStmt()).getBatchCount()>getConfig().getBatchSize()) {
            getInsertStmt().executeBatch();
            getConnection().commit();
            getInsertStmt().clearBatch();
        }
    }



    @Override
    public int getStaticFieldSize() {
        return STATIC_FIELDS.values().length;
    }
}
