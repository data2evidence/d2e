package legacy.health.genomics.vcf.parser.datamodel;

import legacy.health.genomics.vcf.parser.capability.BatchCountingStatement;
import legacy.health.genomics.vcf.parser.capability.ImportConfiguration;
import legacy.health.genomics.vcf.parser.capability.TableBase;
import legacy.health.genomics.vcf.parser.exceptions.DatalineParseException;
import legacy.health.genomics.vcf.parser.exceptions.EnvironmentException;
import legacy.health.genomics.vcf.parser.utils.SQLUtils;
import legacy.health.genomics.vcf.parser.utils.VariantUtils;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Types;
import java.util.*;

/**
 * Created by D058991 on 24.02.2018.
 */
public class SNVVariants extends TableBase<VCFDataField> {
    protected List<String> sqlColumnNames;

    enum STATIC_FIELDS {
        DWAuditID(1),
        VariantIndex(2),
        ChromosomeIndex(3),
        Position(4),
        VariantID(5),
        Quality(6),
        FilterPASS(7);

        private final int idx;
        STATIC_FIELDS(int idx) {this.idx = idx;}
        int getIdx() {return idx;}
    }

    public SNVVariants(VCFStructureDefinition vcfFileDefintion, Connection conn, ImportConfiguration context) throws SQLException, EnvironmentException {
        super("hc.hph.genomics.db.models::SNV.Variants",conn,context);
        setPrefixes(Arrays.asList("Attr.","Filter."));
        getFields().add(new LinkedList<>());
        getFields().add(new LinkedList<>());
        for (InfoField f : vcfFileDefintion.getInfo().values()) {
            if ("01".contains(f.getNumber())) {
                getFields().get(0).add(f);  //Would be enough to store the IDs, but for debugging puposes we keep the field here
            }
        }
        for (FilterField f : vcfFileDefintion.getFilter().values()) {
            if(!f.getId().equals("PASS")) {
                getFields().get(1).add(f);
            }
        }
        sqlColumnNames = new ArrayList<>(7);
        for ( STATIC_FIELDS x : STATIC_FIELDS.values()) {
            sqlColumnNames.add(x.getIdx()-1,x.name().replace("Filter","Filter."));
        }
    }

    public void init() throws SQLException, EnvironmentException {
        setInsertStmt(createPreparedInsertStmt(super.getSchemaName(),getTableName(),sqlColumnNames));
    }

    @Override
    public void consumeDataRow(Dataline line) throws Exception {
        getInsertStmt().clearParameters();
        getInsertStmt().setInt(STATIC_FIELDS.DWAuditID.getIdx(),getConfig().getDwid());
        getInsertStmt().setInt(STATIC_FIELDS.VariantIndex.getIdx(),line.getSourceLine());
        getInsertStmt().setInt(STATIC_FIELDS.ChromosomeIndex.getIdx(), VariantUtils.inferChromosomeIndex(line.getChrom()));
        getInsertStmt().setInt(STATIC_FIELDS.Position.getIdx(), (int) (line.getPos()-1));
        getInsertStmt().setString(STATIC_FIELDS.VariantID.getIdx(),
                line.getId().size() > 0 && !line.getId().get(0).equals(".")? line.getId().get(0):null);
        if(line.getQual() != null) {
            getInsertStmt().setDouble(STATIC_FIELDS.Quality.getIdx(), line.getQual());
        } else {
            getInsertStmt().setNull(STATIC_FIELDS.Quality.getIdx(), Types.REAL);
        }
        getInsertStmt().setInt(STATIC_FIELDS.FilterPASS.getIdx(),line.getFilter().contains("PASS") ? 1 : 0);
        int index = STATIC_FIELDS.values().length +1;
        for(VCFDataField infoRaw : getFields().get(0))
        {
            InfoField info = (InfoField) infoRaw;

            DatalineInfoField field = null;
            if(line.getInfo().containsKey(info.getId())) {
                field=line.getInfo().get(info.getId());
            }
            if(field != null && field.getValues().size()>1) {
                throw new DatalineParseException("Expected one value for field: " + info.getId() +" got: " + field.getValues().size());
            } else {
                if (info.getNumber().equals("0")) {
                    SQLUtils.addValueWithCorrectType(getInsertStmt(),
                            index,
                            field == null || field.getValues() == null  ? "0" : "1",
                            info.getType());
                } else {
                    SQLUtils.addValueWithCorrectType(getInsertStmt(),
                            index,
                            field == null ? null : field.getValues().get(0),
                            info.getType());
                }
            }

            ++index;
        }
        for(VCFDataField infoRaw : getFields().get(1))
        {
            FilterField filter = (FilterField) infoRaw;
            boolean filterExists = line.getFilter().contains(filter.getId());
            if (filterExists) {
                getInsertStmt().setInt(index,1);
            } else {
                getInsertStmt().setInt(index, 0);
            }
            ++index;
        }
        getInsertStmt().addBatch();
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
