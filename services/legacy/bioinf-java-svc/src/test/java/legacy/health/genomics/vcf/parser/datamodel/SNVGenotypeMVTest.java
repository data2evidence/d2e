package legacy.health.genomics.vcf.parser.datamodel;

import legacy.health.genomics.vcf.parser.datamodel.FormatField;
import legacy.health.genomics.vcf.parser.datamodel.SNVGenotypeMV;
import legacy.health.genomics.vcf.parser.exceptions.DatalineParseException;
import legacy.health.genomics.vcf.parser.exceptions.EnvironmentException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.sql.SQLException;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SNVGenotypeMVTest extends TestUtils {


    @BeforeEach
    void init () throws SQLException {
        super.initMocks();
    }


    @Test
    void closeCallShouldCommitAndEndTheConnection() throws Exception {
        SNVGenotypeMV variants = new SNVGenotypeMV(def,jdbcConnection,context);
        variants.init();
        variants.close();
        verify(jdbcConnection,times(1)).commit();
    }


    /*@Test
    void checkHeaderAgainstDatabaseTableBase () throws SQLException, DatalineParseException, EnvironmentException {

        List<FormatField> formatFields = new LinkedList<>();


        formatFields.add(FormatField.getFromValueMapFormat(getValueMapForInfoField("NS","1","Integer")));
        formatFields.add(FormatField.getFromValueMapFormat((getValueMapForInfoField("GT","2","Integer"))));
        formatFields.add(FormatField.getFromValueMapFormat((getValueMapForInfoField("GQ","10","Integer"))));
        formatFields.add(FormatField.getFromValueMapFormat((getValueMapForInfoField("DP","R","Integer"))));
        formatFields.add(FormatField.getFromValueMapFormat((getValueMapForInfoField("SP","A","Integer"))));
        formatFields.add(FormatField.getFromValueMapFormat((getValueMapForInfoField("GT1","3","Float"))));


        when(def.getFormatList()).thenReturn(formatFields);

        SNVGenotypeMV variants = new SNVGenotypeMV(def,jdbcConnection,context);
        variants.init();

        Map<String, List<String>> tableToMissingFieldsMap = new HashMap<>();
        FakePreparedStmt catalogQuery = mockStmts.get(0);
        catalogQuery.ReturnNextableResultSet().ifParametersAre(variants.getTableName(),"Attr.GT1","REAL");
        catalogQuery.ReturnNextableResultSet().ifParametersAre(variants.getTableName(),"Attr.GT","INTEGER");
        catalogQuery.ReturnNonNextableResultSet().ifParametersAre(variants.getTableName(),"Attr.GQ","INTEGER");
        catalogQuery.ThrowException().ifParametersAre(variants.getTableName(),"Attr.DP","INTEGER");
        catalogQuery.ThrowException().ifParametersAre(variants.getTableName(),"Attr.GQ","INTEGER");
        catalogQuery.ThrowException().ifParametersAre(variants.getTableName(),"Attr.SP","INTEGER");


        //Modify fake to return true false depending on attributes
        variants.checkHeaderAgainstDatabase(tableToMissingFieldsMap);
        assertEquals(tableToMissingFieldsMap.size(),1);
        assertEquals(tableToMissingFieldsMap.keySet(), new HashSet<>(Arrays.asList("hc.hph.genomics.db.models::SNV.GenotypeMultiValueAttributes-Attr.")));
        assertEquals(tableToMissingFieldsMap.get("hc.hph.genomics.db.models::SNV.GenotypeMultiValueAttributes-Attr."), Collections.singletonList("\"GQ\" : Integer"));


    }*/


    @Test
    void AlternativeCountFieldsAllValid() throws Exception {

        List<FormatField> formatFields = new LinkedList<>();


        formatFields.add(FormatField.getFromValueMapFormat(getValueMapForInfoField("NS","1","Integer")));
        formatFields.add(FormatField.getFromValueMapFormat((getValueMapForInfoField("GT2","2","Integer"))));
        formatFields.add(FormatField.getFromValueMapFormat((getValueMapForInfoField("GQ","2","Integer"))));
        formatFields.add(FormatField.getFromValueMapFormat((getValueMapForInfoField("DP","R","Integer"))));
        formatFields.add(FormatField.getFromValueMapFormat((getValueMapForInfoField("SP","A","Integer"))));
        formatFields.add(FormatField.getFromValueMapFormat((getValueMapForInfoField("GP1","3","Float"))));


        when(def.getFormatList()).thenReturn(formatFields);


        SNVGenotypeMV variants = new SNVGenotypeMV(def,jdbcConnection,context);
        assertEquals(variants.getFields().size(), 1);
        assertEquals(variants.getFields().get(0).size(),3);
        assertEquals(variants.sqlColumnNames.size(),SNVGenotypeMV.STATIC_FIELDS.values().length);
        variants.init();
        assertEquals(mockStmts.size(),2);
        assertTrue(mockStmts.get(0).queryString.contains(CATALOG_LOOKUP_QUERY));
        assertTrue(mockStmts.get(1).queryString.contains(
                "INSERT INTO \""+variants.getSchemaName()+"\".\"" + variants.getTableName() + "\"("));
        List<String> fields = getFieldsFromInsert(mockStmts.get(1).queryString);

        when(context.getDwid()).thenReturn(200);
        variants.consumeDataRow(Datalines.DL_GenotypesTest_id_3samplesTest2.setSourceLine(6));



        int rows = 2+2+3+1;
        for(int line = 0; line < rows; ++line) {
            FakePreparedStmt insertStmt = mockStmts.get(1);
            assertEquals(insertStmt.buffer.size(), rows+1);
            assertEquals(insertStmt.buffer.get(line).size(),8);
            assertEquals(insertStmt.is_valid.get(line).size(),8);


        /*

                   .addSample(Arrays.asList(Arrays.asList("0","0"),Arrays.asList("48"),Arrays.asList(".","."), Arrays.asList("."),Arrays.asList(".")))
            .addSample(Arrays.asList(Arrays.asList("1","0"),Arrays.asList("49","60"),Arrays.asList("23","3"), Arrays.asList("2","1"))Arrays.asList(".","1"))
            .addSample(Arrays.asList(Arrays.asList("1","1"),Arrays.asList("."),Arrays.asList("."), Arrays.asList("3","2","1"))Arrays.asList("1","2","3"))
            .addSample(Arrays.asList(Arrays.asList("."),Arrays.asList("50"),Arrays.asList("23"), Arrays.asList("3"))));
         */


            assertEquals(200, insertStmt.getRow(line).get(0 + 1));  //DWAuditID

            assertEquals(6, insertStmt.getRow(line).get(1 + 1)); //VariantIndex

            assertEquals(Arrays.asList(0,0,1,1,2,2,2,3).get(line), insertStmt.getRow(line).get(2 + 1));  //SampleIndex

            assertEquals(Arrays.asList(0,1,0,1,0,1,2,0).get(line), insertStmt.getRow(line).get(3 + 1));  //ValueIndex


            int idx = lookupIndex("attr.gp1",fields);
            assertEquals(Arrays.asList(null,null,null,1.0,1.0,2.0,3.0, null).get(line), insertStmt.getRow(line).get(idx + 1));

            idx = lookupIndex("attr.gt2",fields);
            assertEquals(Arrays.asList(0,0,1,0,1,1,null,null).get(line), insertStmt.getRow(line).get(idx + 1));

            idx = lookupIndex("attr.gq",fields);
            assertEquals(Arrays.asList(48,null,49,60,null,null,null,50).get(line), insertStmt.getRow(line).get(idx + 1));

        }
    }




}