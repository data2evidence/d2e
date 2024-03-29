package legacy.health.genomics.vcf.parser.datamodel;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;

import legacy.health.genomics.vcf.parser.capability.BatchCountingStatement;
import legacy.health.genomics.vcf.parser.capability.ImportConfiguration;
import legacy.health.genomics.vcf.parser.capability.TableBase;
import legacy.health.genomics.vcf.parser.exceptions.EnvironmentException;

/**
 * Created by D058991 on 24.02.2018.
 */
public class  SNVHaplotype extends TableBase<VCFDataField>{

    List<String> sqlColumnNames;



    enum STATIC_FIELDS {
        DWAuditID(1),
        VariantIndex(2),
        SampleIndex(3),
        HaplotypeIndex(4),
        AlleleIndex(5);

        private final int idx;
        STATIC_FIELDS(int idx) {this.idx = idx;}
        int getIdx() {return idx;}
    }

    public SNVHaplotype(Connection conn, ImportConfiguration context) throws SQLException, EnvironmentException {
        super("hc.hph.genomics.db.models::SNV.Haplotypes",conn, context);
        sqlColumnNames = new ArrayList<>(5);
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
        for(int sampleIdx = 0; sampleIdx < line.getSamples().size();++sampleIdx)
        {
            Integer targetSampleIdx = getConfig().getSampleMapping().getOrDefault(sampleIdx,null);
            if(!getConfig().getSampleMapping().isEmpty() && targetSampleIdx == null) {
                continue;
            }
            if(targetSampleIdx == null) {
                targetSampleIdx = sampleIdx;
            }
            List<Integer> gtValues = line.getGtSubVals(sampleIdx);
            if(gtValues == null) {
                continue;
            }
            for(int gtIdx = 0; gtIdx< gtValues.size(); ++gtIdx)
            {
                getInsertStmt().setInt(STATIC_FIELDS.DWAuditID.getIdx(),getConfig().getDwid());
                getInsertStmt().setInt(STATIC_FIELDS.VariantIndex.getIdx(),line.getSourceLine());
                getInsertStmt().setInt(STATIC_FIELDS.SampleIndex.getIdx(),targetSampleIdx);
                getInsertStmt().setInt(STATIC_FIELDS.HaplotypeIndex.getIdx(),gtIdx);
                Integer alleleIndex = gtValues.get(gtIdx);
                if(alleleIndex.equals(-1)) {
                    getInsertStmt().setNull(STATIC_FIELDS.AlleleIndex.getIdx(), Types.INTEGER);
                } else {
                    getInsertStmt().setInt(STATIC_FIELDS.AlleleIndex.getIdx(),alleleIndex);
                }
                getInsertStmt().addBatch();
            }

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
