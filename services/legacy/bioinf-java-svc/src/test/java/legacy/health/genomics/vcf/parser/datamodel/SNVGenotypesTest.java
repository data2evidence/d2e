package legacy.health.genomics.vcf.parser.datamodel;

import legacy.health.genomics.vcf.parser.datamodel.FormatField;
import legacy.health.genomics.vcf.parser.datamodel.SNVGenotypes;
import legacy.health.genomics.vcf.parser.exceptions.DatalineParseException;
import legacy.health.genomics.vcf.parser.exceptions.EnvironmentException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.sql.SQLException;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SNVGenotypesTest extends TestUtils {


    @BeforeEach
    void init () throws SQLException {
        super.initMocks();
    }


    @Test
    void closeCallShouldCommitAndEndTheConnection() throws Exception {
        SNVGenotypes variants = new SNVGenotypes(def,jdbcConnection,context);
        variants.init();
        variants.close();
        verify(jdbcConnection,times(1)).commit();
    }


    /*@Test
    void checkHeaderAgainstDatabaseTableBase () throws SQLException, DatalineParseException, EnvironmentException {

        List<FormatField> formatFields = new LinkedList<>();

        formatFields.add(FormatField.getFromValueMapFormat(getValueMapForInfoField("NS","1","Integer")));
        formatFields.add(FormatField.getFromValueMapFormat((getValueMapForInfoField("GT","1","Integer"))));
        formatFields.add(FormatField.getFromValueMapFormat((getValueMapForInfoField("GQ","10","Integer"))));
        formatFields.add(FormatField.getFromValueMapFormat((getValueMapForInfoField("DP","R","Integer"))));
        formatFields.add(FormatField.getFromValueMapFormat((getValueMapForInfoField("SP","A","Integer"))));
        formatFields.add(FormatField.getFromValueMapFormat((getValueMapForInfoField("GT1","1","Float"))));

        when(def.getFormatList()).thenReturn(formatFields);

        SNVGenotypes variants = new SNVGenotypes(def,jdbcConnection,context);
        variants.init();

        Map<String, List<String>> tableToMissingFieldsMap = new HashMap<>();
        FakePreparedStmt catalogQuery = mockStmts.get(0);
        catalogQuery.ReturnNonNextableResultSet().ifParametersAre(variants.getTableName(),"Attr.GT1","REAL");
        catalogQuery.ReturnNextableResultSet().ifParametersAre(variants.getTableName(),"Attr.GT","INTEGER");
        catalogQuery.ReturnNonNextableResultSet().ifParametersAre(variants.getTableName(),"Attr.NSMV","INTEGER");
        catalogQuery.ReturnNonNextableResultSet().ifParametersAre(variants.getTableName(),"Attr.NS","INTEGER");
        catalogQuery.ThrowException().ifParametersAre(variants.getTableName(),"Attr.GQ","INTEGER");
        catalogQuery.ReturnNextableResultSet().ifParametersAre(variants.getTableName(),"Attr.DP","INTEGER");
        catalogQuery.ReturnNextableResultSet().ifParametersAre(variants.getTableName(),"Attr.SP","INTEGER");


        //Modify fake to return true false depending on attributes
        variants.checkHeaderAgainstDatabase(tableToMissingFieldsMap);
        assertEquals(tableToMissingFieldsMap.size(),1);
        assertEquals(tableToMissingFieldsMap.keySet(), new HashSet<>(Arrays.asList("hc.hph.genomics.db.models::SNV.Genotypes-Attr.")));
        assertEquals(tableToMissingFieldsMap.get("hc.hph.genomics.db.models::SNV.Genotypes-Attr."), Arrays.asList("\"NS\" : Integer","\"GT1\" : Double"));


    }*/


    @Test
    void onlyDefaultValuesInHeaderMoreNoGTFieldAvailable() throws Exception {
        SNVGenotypes variants = new SNVGenotypes(def,jdbcConnection,context);
        assertEquals(variants.getFields().size(), 1);
        assertTrue(variants.getFields().get(0).isEmpty());
        assertEquals(variants.sqlColumnNames.size(),SNVGenotypes.STATIC_FIELDS.values().length);
        variants.init();
        assertEquals(mockStmts.size(),2);
        assertTrue(mockStmts.get(0).queryString.contains(CATALOG_LOOKUP_QUERY));
        assertTrue(mockStmts.get(1).queryString.contains(
                "INSERT INTO \""+variants.getSchemaName()+"\".\"" + variants.getTableName() + "\"("));

        List<String> fields = getFieldsFromInsert(mockStmts.get(1).queryString);

        when(context.getDwid()).thenReturn(200);
        variants.consumeDataRow(Datalines.DL_GenotypesTest_id_3missingGT.setSourceLine(5));

        variants.consumeDataRow(Datalines.DL_GenotypesTest_id_3missingGT.setSourceLine(6));

        int rows = 6;
        for(int line = 0; line < rows; ++line) {
            FakePreparedStmt insertStmt = mockStmts.get(1);
            assertEquals(insertStmt.buffer.size(), rows+1);
            assertEquals(insertStmt.is_valid.size(), rows+1);

            assertEquals(200, insertStmt.getRow(line).get(0 + 1)); //AuditId

            assertEquals(Arrays.asList(5,5,5,6,6,6).get(line), insertStmt.getRow(line).get(1 + 1)); //VariantiNdex

            assertEquals(Arrays.asList(0,1,2,0,1,2).get(line), insertStmt.getRow(line).get(2 + 1)); //SampleIndex

            assertEquals(null, insertStmt.getRow(line).get(3 + 1)); //phased

            assertEquals(null, insertStmt.getRow(line).get(4 + 1)); //ReferenceAllleCpount

            assertEquals(null, insertStmt.getRow(line).get(5 + 1)); //CopyNumber

            assertEquals(null, insertStmt.getRow(line).get(6 + 1)); //Zygosity

        }
    }



    @Test
    void onlyDefaultValuesInHeaderMoreFieldsInDatalineAllValid() throws Exception {
        SNVGenotypes variants = new SNVGenotypes(def,jdbcConnection,context);
        assertEquals(variants.getFields().size(), 1);
        assertTrue(variants.getFields().get(0).isEmpty());
        assertEquals(variants.sqlColumnNames.size(),SNVGenotypes.STATIC_FIELDS.values().length);
        variants.init();
        assertEquals(mockStmts.size(),2);
        assertTrue(mockStmts.get(0).queryString.contains(CATALOG_LOOKUP_QUERY));
        assertTrue(mockStmts.get(1).queryString.contains(
                "INSERT INTO \""+variants.getSchemaName()+"\".\"" + variants.getTableName() + "\"("));

        List<String> fields = getFieldsFromInsert(mockStmts.get(1).queryString);

        when(context.getDwid()).thenReturn(200);
        variants.consumeDataRow(Datalines.DL_GenotypesTest_id_3samples.setSourceLine(5));

        variants.consumeDataRow(Datalines.DL_GenotypesTest_id_3samples.setSourceLine(6));

        int rows = 8;
        for(int line = 0; line < rows; ++line) {
            FakePreparedStmt insertStmt = mockStmts.get(1);
            assertEquals(insertStmt.buffer.size(), rows+1);
            assertEquals(insertStmt.is_valid.size(), rows+1);

            assertEquals(200, insertStmt.getRow(line).get(0 + 1)); //AuditId

            assertEquals(Arrays.asList(5,5,5,5,6,6,6,6).get(line), insertStmt.getRow(line).get(1 + 1)); //VariantiNdex

            assertEquals(Arrays.asList(0,1,2,3,0,1,2,3).get(line), insertStmt.getRow(line).get(2 + 1)); //SampleIndex

            assertEquals(Arrays.asList(1,1,0,null).get(line % 4), insertStmt.getRow(line).get(3 + 1)); //phased

            assertEquals(Arrays.asList(2,1,0,null).get(line % 4), insertStmt.getRow(line).get(4 + 1)); //ReferenceAllleCpount

            assertEquals(Arrays.asList(2,2,2,null).get(line % 4), insertStmt.getRow(line).get(5 + 1)); //CopyNumber

            assertEquals(Arrays.asList("Homozygous Reference","Heterozygous Alternative","Homozygous Alternative",null).get(line % 4), insertStmt.getRow(line).get(6 + 1)); //Zygosity

        }
    }




    @Test
    void additionalFieldsInHeaderAndInDatalineAllValid() throws Exception {

        List<FormatField> formatFields = new LinkedList<>();

        formatFields.add(FormatField.getFromValueMapFormat(getValueMapForInfoField("NS","1","Integer")));
        formatFields.add(FormatField.getFromValueMapFormat((getValueMapForInfoField("GT","1","String"))));
        formatFields.add(FormatField.getFromValueMapFormat((getValueMapForInfoField("GQ","1","Integer"))));
        formatFields.add(FormatField.getFromValueMapFormat((getValueMapForInfoField("DP","3","Float"))));
        formatFields.add(FormatField.getFromValueMapFormat((getValueMapForInfoField("SP","1","Float"))));

        when(def.getFormatList()).thenReturn(formatFields);


        SNVGenotypes variants = new SNVGenotypes(def,jdbcConnection,context);
        assertEquals(variants.getFields().size(), 1);
        assertEquals(variants.getFields().get(0).size(),4);

        assertEquals(variants.sqlColumnNames.size(),SNVGenotypes.STATIC_FIELDS.values().length);
        variants.init();
        assertEquals(mockStmts.size(),2);
        assertTrue(mockStmts.get(0).queryString.contains(CATALOG_LOOKUP_QUERY));
        assertTrue(mockStmts.get(1).queryString.contains(
                "INSERT INTO \""+variants.getSchemaName()+"\".\"" + variants.getTableName() + "\"("));

        List<String> fields = getFieldsFromInsert(mockStmts.get(1).queryString);

        when(context.getDwid()).thenReturn(200);
        variants.consumeDataRow(Datalines.DL_GenotypesTest_id_3samples_1.setSourceLine(5));

        variants.consumeDataRow(Datalines.DL_GenotypesTest_id_3samples_1.setSourceLine(6));


        int rows = 8;
        assertEquals(mockStmts.get(1).buffer.size(), rows+1); //2 rows * 8 as max count from mv8 +1 as current empty one
        for(int line = 0; line < rows; ++line) {
            FakePreparedStmt insertStmt = mockStmts.get(1);
            assertEquals(fields.size()+1, insertStmt.getRow(line).size());

            assertEquals(200, insertStmt.getRow(line).get(0 + 1)); //AuditId

            assertEquals(Arrays.asList(5,5,5,5,6,6,6,6).get(line), insertStmt.getRow(line).get(1 + 1)); //VariantiNdex

            assertEquals(Arrays.asList(0,1,2,3,0,1,2,3).get(line), insertStmt.getRow(line).get(2 + 1)); //SampleIndex

            assertEquals(Arrays.asList(1,1,0, null).get(line % 4), insertStmt.getRow(line).get(3 + 1)); //phased

            assertEquals(Arrays.asList(2,1,0,null).get(line % 4), insertStmt.getRow(line).get(4 + 1)); //ReferenceAllleCpount

            assertEquals(Arrays.asList(2,2,2,null).get(line % 4), insertStmt.getRow(line).get(5 + 1)); //CopyNumber

            assertEquals(Arrays.asList("Homozygous Reference","Heterozygous Alternative","Homozygous Alternative",null).get(line % 4), insertStmt.getRow(line).get(6 + 1)); //Zygosity

            int idx = lookupIndex("attr.gt",fields);
            assertEquals(Arrays.asList("0|0","1|0","1/1",null,"0|0","1|0","1/1",null).get(line), insertStmt.getRow(line).get(idx + 1));

            idx = lookupIndex("attr.gq",fields);
            assertEquals(Arrays.asList(48,49,50,50).get(line%4), insertStmt.getRow(line).get(idx + 1));

            idx = lookupIndex("attr.sp",fields);
            assertEquals(Arrays.asList(null,null,new Double(3),new Double(3)).get(line % 4), insertStmt.getRow(line).get(idx + 1));

            idx = lookupIndex("attr.ns",fields);
            assertEquals(null, insertStmt.getRow(line).get(idx + 1));

        }
    }

}