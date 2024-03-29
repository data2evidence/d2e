package legacy.health.genomics.vcf.parser.datamodel;

import legacy.health.genomics.vcf.parser.capability.BatchCountingStatement;
import legacy.health.genomics.vcf.parser.capability.ImportConfiguration;
import legacy.health.genomics.vcf.parser.capability.TableBase;
import legacy.health.genomics.vcf.parser.exceptions.DatalineParseException;
import legacy.health.genomics.vcf.parser.exceptions.EnvironmentException;
import legacy.health.genomics.vcf.parser.utils.SQLUtils;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by D058991 on 24.02.2018.
 */
public class SNVVariantAlleles extends TableBase<VCFDataField> {
    List<String> sqlColumnNames;

    enum STATIC_FIELDS {
        DWAuditID(1),
        VariantIndex(2),
        AlleleIndex(3),
        Allele(4);

        private final int idx;
        STATIC_FIELDS(int idx) {this.idx = idx;}
        int getIdx() {return idx;}
    }

    public SNVVariantAlleles(VCFStructureDefinition vcfFileDefintion, Connection conn, ImportConfiguration context) throws SQLException, EnvironmentException {
        super("hc.hph.genomics.db.models::SNV.VariantAlleles", conn, context);
        getFields().add(new LinkedList<>());

        for (InfoField f : vcfFileDefintion.getInfo().values()) {
            if ("AR".contains(f.getNumber())) {
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
    public void consumeDataRow(Dataline line) throws SQLException, DatalineParseException {
        getInsertStmt().clearParameters();
        getInsertStmt().setInt(STATIC_FIELDS.DWAuditID.getIdx(),getConfig().getDwid());
        getInsertStmt().setInt(STATIC_FIELDS.VariantIndex.getIdx(),line.getSourceLine());
        getInsertStmt().setInt(STATIC_FIELDS.AlleleIndex.getIdx(),0);
        if(line.getRef() == null || line.getRef().equals(".")) {
            getInsertStmt().setNull(STATIC_FIELDS.Allele.getIdx(), Types.NVARCHAR);
        }else {
            getInsertStmt().setString(STATIC_FIELDS.Allele.getIdx(), line.getRef());
        }

        int index = STATIC_FIELDS.values().length+1;
        for(VCFDataField f : getFields().get(0)) {
            InfoField info = (InfoField) f;
            DatalineInfoField datalineInfoField = null;
            if(line.getInfo().containsKey(info.getId())) {
                datalineInfoField=line.getInfo().get(info.getId());
            }
            if(info.getNumber().equals("R")) {
                SQLUtils.addValueWithCorrectType(getInsertStmt(),
                        index,
                        datalineInfoField == null ? null : datalineInfoField.getValues().get(0),
                        info.getType());
            } else {
                SQLUtils.addValueWithCorrectType(getInsertStmt(),
                        index,
                        null,
                        info.getType());
            }
            ++index;
        }
        getInsertStmt().addBatch();

        for(int altIdx = 0; altIdx < line.getAlt().size(); ++altIdx) {
            String alt = line.getAlt().get(altIdx);
            getInsertStmt().setInt(STATIC_FIELDS.DWAuditID.getIdx(),getConfig().getDwid());
            getInsertStmt().setInt(STATIC_FIELDS.VariantIndex.getIdx(),line.getSourceLine());
            getInsertStmt().setInt(STATIC_FIELDS.AlleleIndex.getIdx(),altIdx+1);
            getInsertStmt().setString(STATIC_FIELDS.Allele.getIdx(),alt);

            index = STATIC_FIELDS.values().length+1;
            for(VCFDataField f : getFields().get(0)) {
                InfoField info = (InfoField) f;
                DatalineInfoField datalineInfoField = null;
                if(line.getInfo().containsKey(info.getId())) {
                    datalineInfoField=line.getInfo().get(info.getId());
                }
                int lookUpIndex = info.getNumber().equals("R") ? altIdx + 1 : altIdx;
                //TODO: Warn, as AlleleField has not enough values
                    if(datalineInfoField!= null && datalineInfoField.getValues().size()>lookUpIndex ) {
                        if(info.getNumber().equals("R") && datalineInfoField.getValues().size() > line.getAlt().size()+1) {
                            throw new DatalineParseException("To many values for field: " + info.getId() +" expected " + (line.getAlt().size()+1) + " (Alleles + Reference) but got " +datalineInfoField.getValues().size());
                        } else if(info.getNumber().equals("A") && datalineInfoField.getValues().size() > line.getAlt().size()) {
                            throw new DatalineParseException("To many values for field: " + info.getId() +" expected " + line.getAlt().size() + " (Alleles) but got " +datalineInfoField.getValues().size());
                        }
                        SQLUtils.addValueWithCorrectType(getInsertStmt(),
                                index,
                                datalineInfoField.getValues().get(lookUpIndex),
                                info.getType());
                    } else {
                        SQLUtils.addValueWithCorrectType(getInsertStmt(),
                                index,
                                null,
                                info.getType());
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