package legacy.health.genomics.vcf.parser.datamodel;

import legacy.health.genomics.vcf.parser.capability.BatchCountingStatement;
import legacy.health.genomics.vcf.parser.capability.ImportConfiguration;
import legacy.health.genomics.vcf.parser.capability.TableBase;
import legacy.health.genomics.vcf.parser.exceptions.EnvironmentException;
import legacy.health.genomics.vcf.parser.utils.SQLUtils;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;

/**
 * Created by D058991 on 24.02.2018.
 */
public class SNVGenotypes extends TableBase<VCFDataField> {
    List<String> sqlColumnNames;


    enum STATIC_FIELDS {
        DWAuditID(1),
        VariantIndex(2),
        SampleIndex(3),
        Phased(4),
        ReferenceAlleleCount(5),
        CopyNumber(6),
        Zygosity(7);

        private final int idx;
        STATIC_FIELDS(int idx) {this.idx = idx;}
        int getIdx() {return idx;}
    }

    public SNVGenotypes(VCFStructureDefinition vcfFileDefintion, Connection conn, ImportConfiguration context) throws SQLException, EnvironmentException {
        super("hc.hph.genomics.db.models::SNV.Genotypes", conn, context);
        getFields().add(new LinkedList<>());

        for (FormatField f : vcfFileDefintion.getFormatList()) {
            if ("1".contains(f.getNumber())&& !vcfFileDefintion.getBlackListedFormatFields().contains(f.getId())) {
                getFields().get(0).add(f);
            }
        }
        sqlColumnNames = new ArrayList<>(7);
        for (STATIC_FIELDS x : STATIC_FIELDS.values()) {
            sqlColumnNames.add(x.getIdx()-1, x.name());
        }
    }

    public void init() throws SQLException, EnvironmentException {
        //setInsertStmt(createPreparedInsertStmt(super.getConnection().getSchema(),getTableName(),sqlColumnNames));
    	setInsertStmt(createPreparedInsertStmt(super.getSchemaName(),getTableName(),sqlColumnNames));
    }

    @Override
    public void consumeDataRow(Dataline line) throws Exception {
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
            getInsertStmt().setInt(STATIC_FIELDS.DWAuditID.getIdx(),getConfig().getDwid());
            getInsertStmt().setInt(STATIC_FIELDS.VariantIndex.getIdx(),line.getSourceLine());
            getInsertStmt().setInt(STATIC_FIELDS.SampleIndex.getIdx(),targetSampleIdx);
            if(line.getGTIdx() != null) {
                SQLUtils.addBooleanOrNull(getInsertStmt(),STATIC_FIELDS.Phased.getIdx(),line.isPhased(sampleIdx));
                SQLUtils.addIntegerOrNull(getInsertStmt(),STATIC_FIELDS.ReferenceAlleleCount.getIdx(),line.getReferenceCount(sampleIdx));
                SQLUtils.addIntegerOrNull(getInsertStmt(),STATIC_FIELDS.CopyNumber.getIdx(),line.getCopyNumber(sampleIdx));

                if(line.getReferenceCount(sampleIdx) == null && line.getCopyNumber(sampleIdx) == null) {
                    getInsertStmt().setNull(STATIC_FIELDS.Zygosity.getIdx(),Types.NVARCHAR);
                } else if (Objects.equals(line.getReferenceCount(sampleIdx), line.getCopyNumber(sampleIdx))) {
                    getInsertStmt().setString(STATIC_FIELDS.Zygosity.getIdx(), "Homozygous Reference");
                } else if (line.getReferenceCount(sampleIdx) == 0) {
                    getInsertStmt().setString(STATIC_FIELDS.Zygosity.getIdx(), "Homozygous Alternative");
                } else {
                    getInsertStmt().setString(STATIC_FIELDS.Zygosity.getIdx(), "Heterozygous Alternative");
                }
            } else {
                getInsertStmt().setNull(STATIC_FIELDS.Phased.getIdx(), Types.INTEGER);
                getInsertStmt().setNull(STATIC_FIELDS.ReferenceAlleleCount.getIdx(), Types.INTEGER);
                getInsertStmt().setNull(STATIC_FIELDS.CopyNumber.getIdx(), Types.INTEGER);
                getInsertStmt().setNull(STATIC_FIELDS.Zygosity.getIdx(), Types.NVARCHAR);
            }
            int index = STATIC_FIELDS.values().length+1;
            for(VCFDataField formatRaw : getFields().get(0))
            {
                FormatField format = (FormatField) formatRaw;
                List<String> field = line.getSampleField(format.getId(),sampleIdx);
                if(field != null && field.size()>1) {
                    throw new Exception("Expected one value for field: " + format.getId() +" got: " + field.size());
                } else {
                    SQLUtils.addValueWithCorrectType(getInsertStmt(),
                            index,
                            field == null || field.isEmpty() ? null : field.get(0),
                            format.getType());
                }
                ++index;
            }
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