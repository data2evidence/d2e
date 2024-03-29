package legacy.health.genomics.vcf.parser.datamodel;

import legacy.health.genomics.vcf.parser.capability.BatchCountingStatement;
import legacy.health.genomics.vcf.parser.capability.ImportConfiguration;
import legacy.health.genomics.vcf.parser.capability.TableBase;
import legacy.health.genomics.vcf.parser.exceptions.EnvironmentException;
import legacy.health.genomics.vcf.parser.utils.SQLUtils;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by D058991 on 24.02.2018.
 */
public class SNVGenotypeMV extends TableBase<VCFDataField> {

    List<String> sqlColumnNames;
    
    enum STATIC_FIELDS {
        DWAuditID(1),
        VariantIndex(2),
        SampleIndex(3),
        ValueIndex(4);

        private final int idx;
        STATIC_FIELDS(int idx) {this.idx = idx;}
        int getIdx() {return idx;}
    }

    public SNVGenotypeMV(VCFStructureDefinition vcfFileDefintion, Connection conn, ImportConfiguration context) throws SQLException, EnvironmentException {
        super("hc.hph.genomics.db.models::SNV.GenotypeMultiValueAttributes", conn, context);
        getFields().add(new LinkedList<>());
        for (FormatField f : vcfFileDefintion.getFormatList()) {
            if (!"1AR".contains(f.getNumber())&& !vcfFileDefintion.getBlackListedFormatFields().contains(f.getId())) {
                getFields().get(0).add(f);
            }
        }
        sqlColumnNames = new ArrayList<>(4);
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
        for(int sampleIdx = 0; sampleIdx < line.getSamples().size(); ++sampleIdx)
        {
            Integer targetSampleIdx = getConfig().getSampleMapping().getOrDefault(sampleIdx,null);
            if(!getConfig().getSampleMapping().isEmpty() && targetSampleIdx == null) {
                continue;
            }
            if(targetSampleIdx == null) {
                targetSampleIdx = sampleIdx;
            }
            int maxValueCount=0;
            for(VCFDataField f : getFields().get(0)) {

                FormatField format = (FormatField) f;
                List<String> field = null;
                if( line.getFormat().containsKey(format.getId()) && line.getFormat().get(format.getId()) < line.getSample(sampleIdx).size()) {
                    field = line.getSample(sampleIdx).get(line.getFormat().get(format.getId()));
                }
                if(field != null) {
                    maxValueCount = Math.max(maxValueCount, field.size());
                }
            }

            for(int currentValueIndex = 0; currentValueIndex< maxValueCount; ++currentValueIndex)
            {
                getInsertStmt().setInt(STATIC_FIELDS.DWAuditID.getIdx(),getConfig().getDwid());
                getInsertStmt().setInt(STATIC_FIELDS.VariantIndex.getIdx(),line.getSourceLine());
                getInsertStmt().setInt(STATIC_FIELDS.SampleIndex.getIdx(),targetSampleIdx);
                getInsertStmt().setInt(STATIC_FIELDS.ValueIndex.getIdx(),currentValueIndex);
                int index = STATIC_FIELDS.values().length+1;
                for(VCFDataField f : getFields().get(0)) {
                    FormatField format = (FormatField) f;

                    List<String> field = line.getSampleField(format.getId(),sampleIdx);
                    if (field == null || field.size() <= currentValueIndex) {
                        SQLUtils.addValueWithCorrectType(getInsertStmt(),
                                index,
                                null,
                                format.getType());
                    } else {
                        SQLUtils.addValueWithCorrectType(getInsertStmt(),
                                index,
                                field.get(currentValueIndex),
                                format.getType());
                    }
                    ++index;
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
