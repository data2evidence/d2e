package legacy.health.genomics.vcf.parser.datamodel;

import legacy.health.genomics.vcf.parser.capability.BatchCountingStatement;
import legacy.health.genomics.vcf.parser.capability.ImportConfiguration;
import legacy.health.genomics.vcf.parser.capability.TableBase;
import legacy.health.genomics.vcf.parser.exceptions.DatalineParseException;
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
public class SNVGenotypeAlleles extends TableBase<VCFDataField> {
    List<String> sqlColumnNames;
    enum STATIC_FIELDS {
        DWAuditID(1),
        VariantIndex(2),
        SampleIndex(3),
        AlleleIndex(4),
        AlleleCount(5);

        private final int idx;
        STATIC_FIELDS(int idx) {this.idx = idx;}
        int getIdx() {return idx;}
    }

    public SNVGenotypeAlleles(VCFStructureDefinition vcfFileDefintion, Connection conn, ImportConfiguration context) throws SQLException, EnvironmentException {
        super("hc.hph.genomics.db.models::SNV.GenotypeAlleles", conn, context);
        getFields().add(new LinkedList<>());
        for (FormatField f : vcfFileDefintion.getFormatList()) {
            if ("AR".contains(f.getNumber()) && !vcfFileDefintion.getBlackListedFormatFields().contains(f.getId())) {
                getFields().get(0).add(f);
            }
        }
        sqlColumnNames = new ArrayList<>(5);
        for ( STATIC_FIELDS x : STATIC_FIELDS.values()) {
            sqlColumnNames.add(x.getIdx()-1,x.name());
        }
    }

    public void init() throws SQLException, EnvironmentException {
        setInsertStmt(createPreparedInsertStmt(super.getSchemaName(),getTableName(),sqlColumnNames));
    }
    @Override
    public void consumeDataRow(Dataline line) throws SQLException, DatalineParseException {
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
            getInsertStmt().setInt(STATIC_FIELDS.AlleleIndex.getIdx(),0);
            SQLUtils.addIntegerOrNull(getInsertStmt(),STATIC_FIELDS.AlleleCount.getIdx(),line.getReferenceCount(sampleIdx));
            int index = STATIC_FIELDS.values().length+1;
            for(VCFDataField f : getFields().get(0)) {
                FormatField format = (FormatField) f;
                List<String> field = line.getSampleField(format.getId(),sampleIdx);
                if(format.getNumber().equals("R") && field != null) {
                    SQLUtils.addValueWithCorrectType(getInsertStmt(),
                            index,
                            field.isEmpty() ? null : field.get(0),
                            format.getType());
                } else {
                    SQLUtils.addValueWithCorrectType(getInsertStmt(),
                            index,
                            null,
                            format.getType());
                }
                ++index;
            }
            getInsertStmt().addBatch();
            for(int altIdx = 0; altIdx < line.getAlt().size(); ++altIdx) {
                getInsertStmt().setInt(STATIC_FIELDS.DWAuditID.getIdx(),getConfig().getDwid());
                getInsertStmt().setInt(STATIC_FIELDS.VariantIndex.getIdx(),line.getSourceLine());
                getInsertStmt().setInt(STATIC_FIELDS.SampleIndex.getIdx(),targetSampleIdx);
                getInsertStmt().setInt(STATIC_FIELDS.AlleleIndex.getIdx(),altIdx+1);
                final int sIdx = altIdx+1;
               Integer alleleCount = line.getGtSubVals(sampleIdx) == null ? null : (int)line.getGtSubVals(sampleIdx).stream()
                        .filter(p -> p != null &&  p.equals(sIdx))
                        .count();
                SQLUtils.addIntegerOrNull(getInsertStmt(),STATIC_FIELDS.AlleleCount.getIdx(),alleleCount);
                index = STATIC_FIELDS.values().length+1;
                for(VCFDataField f : getFields().get(0)) {
                    FormatField format = (FormatField) f;
                    List<String> field = line.getSampleField(format.getId(),sampleIdx);
                    int lookUpIndex = format.getNumber().equals("R") ? altIdx + 1 : altIdx;
                    if(field!= null && field.size()>lookUpIndex ) {
                        if (format.getNumber().equals("R") && field.size() > line.getAlt().size() + 1) {
                            throw new DatalineParseException("To many values for field: " + format.getId() + " expected " + (line.getAlt().size() + 1) + " (Alleles + Reference) but got " + field.size());
                        } else if (format.getNumber().equals("A") && field.size() > line.getAlt().size()) {
                            throw new DatalineParseException("To many values for field: " + format.getId() + " expected " + line.getAlt().size() + " (Alleles) but got " + field.size());
                        }
                        SQLUtils.addValueWithCorrectType(getInsertStmt(),
                                index,
                                field.get(lookUpIndex),
                                format.getType());
                    } else {
                        SQLUtils.addValueWithCorrectType(getInsertStmt(),
                                index,
                                null,
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
