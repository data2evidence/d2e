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
public class SNVVariantStructuredAttributes extends TableBase<InfoField>{

    private List<String> sqlColumnNames;

    enum STATIC_FIELDS {
        DWAuditID(1),
        VariantIndex(2),
        ValueIndex(3);

        private final int idx;
        STATIC_FIELDS(int idx) {this.idx = idx;}
        int getIdx() {return idx;}
    }

    public SNVVariantStructuredAttributes(Connection conn, ImportConfiguration context) throws SQLException, EnvironmentException {
        super("hc.hph.genomics.db.models::SNV.VariantStructuredAttributes",conn, context);
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
        // TODO INSERT DATA
        getInsertStmt().setInt(STATIC_FIELDS.DWAuditID.getIdx(),getConfig().getDwid());
        getInsertStmt().setInt(STATIC_FIELDS.VariantIndex.getIdx(),line.getSourceLine());
        getInsertStmt().setInt(STATIC_FIELDS.ValueIndex.getIdx(),0);

        if(((BatchCountingStatement)getInsertStmt()).getBatchCount()>getConfig().getBatchSize()) {
            getInsertStmt().executeBatch();
            getConnection().commit();
            getInsertStmt().clearBatch();
        }
        getInsertStmt().addBatch();

    }


    @Override
    public void close() throws SQLException {
        getInsertStmt().executeBatch();
        getConnection().commit();
        getInsertStmt().close();
        getConnection().close();
    }

    @Override
    public int getStaticFieldSize() {
        return STATIC_FIELDS.values().length;
    }
}