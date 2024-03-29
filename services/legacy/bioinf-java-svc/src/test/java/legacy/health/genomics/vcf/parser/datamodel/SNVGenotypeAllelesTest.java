package legacy.health.genomics.vcf.parser.datamodel;

import legacy.health.genomics.vcf.parser.datamodel.FormatField;
import legacy.health.genomics.vcf.parser.datamodel.SNVGenotypeAlleles;
import legacy.health.genomics.vcf.parser.exceptions.DatalineParseException;
import legacy.health.genomics.vcf.parser.exceptions.EnvironmentException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.sql.SQLException;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SNVGenotypeAllelesTest extends TestUtils {


    @BeforeEach
    void init () throws SQLException {
        super.initMocks();
    }


    @Test
    void closeCallShouldCommitAndEndTheConnection() throws Exception {
        SNVGenotypeAlleles variants = new SNVGenotypeAlleles(def,jdbcConnection,context);
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

        SNVGenotypeAlleles variants = new SNVGenotypeAlleles(def,jdbcConnection,context);
        variants.init();

        Map<String, List<String>> tableToMissingFieldsMap = new HashMap<>();
        FakePreparedStmt catalogQuery = mockStmts.get(0);
        catalogQuery.ThrowException().ifParametersAre(variants.getTableName(),"Attr.GT1","REAL");
        catalogQuery.ThrowException().ifParametersAre(variants.getTableName(),"Attr.GT","INTEGER");
        catalogQuery.ThrowException().ifParametersAre(variants.getTableName(),"Attr.GQ","INTEGER");
        catalogQuery.ReturnNonNextableResultSet().ifParametersAre(variants.getTableName(),"Attr.DP","INTEGER");
        catalogQuery.ThrowException().ifParametersAre(variants.getTableName(),"Attr.GQ","INTEGER");
        catalogQuery.ReturnNextableResultSet().ifParametersAre(variants.getTableName(),"Attr.SP","INTEGER");


        //Modify fake to return true false depending on attributes
        variants.checkHeaderAgainstDatabase(tableToMissingFieldsMap);
        assertEquals(tableToMissingFieldsMap.size(),1);
        assertEquals(tableToMissingFieldsMap.keySet(), new HashSet<>(Arrays.asList("hc.hph.genomics.db.models::SNV.GenotypeAlleles-Attr.")));
        assertEquals(tableToMissingFieldsMap.get("hc.hph.genomics.db.models::SNV.GenotypeAlleles-Attr."), Collections.singletonList("\"DP\" : Integer"));


    }*/


    @Test
    void AlternativeCountFieldsToManyValuesInvalidCount() throws Exception {

        List<FormatField> formatFields = new LinkedList<>();

        formatFields.add(FormatField.getFromValueMapFormat(getValueMapForInfoField("NS","1","Integer")));
        formatFields.add(FormatField.getFromValueMapFormat((getValueMapForInfoField("GQ","A","Integer"))));


        when(def.getFormatList()).thenReturn(formatFields);

        SNVGenotypeAlleles variants = new SNVGenotypeAlleles(def,jdbcConnection,context);
        assertEquals(variants.getFields().size(), 1);
        assertEquals(variants.getFields().get(0).size(), 1);
        assertEquals(variants.sqlColumnNames.size(), SNVGenotypeAlleles.STATIC_FIELDS.values().length);
        variants.init();
        assertEquals(mockStmts.size(), 2);
        assertTrue(mockStmts.get(0).queryString.contains(CATALOG_LOOKUP_QUERY));
        assertTrue(mockStmts.get(1).queryString.contains(
                "INSERT INTO \""+variants.getSchemaName()+"\".\"" + variants.getTableName() + "\"("));

        List<String> fields = getFieldsFromInsert(mockStmts.get(1).queryString);

        assertThrows(DatalineParseException.class,
                () -> variants.consumeDataRow(Datalines.DL_GenotypeAlleleTestWrongCounts.setSourceLine(5)),
                "To many values for field: GQ expected 2 (Alleles + Reference) but got 3");
    }

    @Test
    void AlternativeCountFieldsToManyValuesInvalidCount2() throws Exception {

        List<FormatField> formatFields = new LinkedList<>();

        formatFields.add(FormatField.getFromValueMapFormat(getValueMapForInfoField("NS","1","Integer")));
        formatFields.add(FormatField.getFromValueMapFormat((getValueMapForInfoField("GQ","R","Integer"))));


        when(def.getFormatList()).thenReturn(formatFields);

        SNVGenotypeAlleles variants = new SNVGenotypeAlleles(def,jdbcConnection,context);
        assertEquals(variants.getFields().size(), 1);
        assertEquals(variants.getFields().get(0).size(), 1);
        assertEquals(variants.sqlColumnNames.size(), SNVGenotypeAlleles.STATIC_FIELDS.values().length);
        variants.init();
        assertEquals(mockStmts.size(), 2);
        assertTrue(mockStmts.get(0).queryString.contains(CATALOG_LOOKUP_QUERY));
        assertTrue(mockStmts.get(1).queryString.contains(
                "INSERT INTO \""+variants.getSchemaName()+"\".\"" + variants.getTableName() + "\"("));

        List<String> fields = getFieldsFromInsert(mockStmts.get(1).queryString);

        assertThrows(DatalineParseException.class,
                () -> variants.consumeDataRow(Datalines.DL_GenotypeAlleleTestWrongCounts.setSourceLine(5)),
                "To many values for field: GQ expected 2 (Alleles + Reference) but got 3");
    }


    @Test
    void AlternativeCountFieldsAllValid() throws Exception {

        List<FormatField> formatFields = new LinkedList<>();

        formatFields.add(FormatField.getFromValueMapFormat((getValueMapForInfoField("GT","1","Integer"))));
        formatFields.add(FormatField.getFromValueMapFormat((getValueMapForInfoField("GQ","10","Integer"))));
        formatFields.add(FormatField.getFromValueMapFormat((getValueMapForInfoField("DP","A","Integer"))));
        formatFields.add(FormatField.getFromValueMapFormat((getValueMapForInfoField("SP","R","Integer"))));


        when(def.getFormatList()).thenReturn(formatFields);

        SNVGenotypeAlleles variants = new SNVGenotypeAlleles(def,jdbcConnection,context);
        assertEquals(variants.getFields().size(), 1);
        assertEquals(variants.getFields().get(0).size(),2);
        assertEquals(variants.sqlColumnNames.size(),SNVGenotypeAlleles.STATIC_FIELDS.values().length);
        variants.init();
        assertEquals(mockStmts.size(),2);
        assertTrue(mockStmts.get(0).queryString.contains(CATALOG_LOOKUP_QUERY));
        /*assertTrue(mockStmts.get(1).queryString.contains(
                "INSERT INTO \""+jdbcConnection.getSchema()+"\".\"" + variants.getTableName() + "\"("));*/
        assertTrue(mockStmts.get(1).queryString.contains(
                "INSERT INTO \""+variants.getSchemaName()+"\".\"" + variants.getTableName() + "\"("));

        List<String> fields = getFieldsFromInsert(mockStmts.get(1).queryString);

        when(context.getDwid()).thenReturn(200);
        variants.consumeDataRow(Datalines.DL_GenotypesTest_id_3samples.setSourceLine(6));






        int rows = 12; //2+Alleles + 1 Ref * 4 Samples
        for(int line = 0; line < rows; ++line) {
            FakePreparedStmt insertStmt = mockStmts.get(1);
            assertEquals(insertStmt.buffer.size(), rows+1);
            assertEquals(insertStmt.buffer.get(line).size(),8);
            assertEquals(insertStmt.is_valid.get(line).size(),8);

            assertEquals(fields.size()+1, insertStmt.getRow(line).size());

            assertEquals(200, insertStmt.getRow(line).get(0 + 1));  //DWAuditID

            assertEquals(6, insertStmt.getRow(line).get(1 + 1)); //VariantIndex

            assertEquals(Arrays.asList(0,0,0,1,1,1,2,2,2,3,3,3).get(line), insertStmt.getRow(line).get(2 + 1));  //SampleIndex

            assertEquals(Arrays.asList(0,1,2).get(line % 3), insertStmt.getRow(line).get(3 + 1));  //AlleleIndex

            assertEquals(Arrays.asList(2,0,0,1,1,0,0,2,0,null,null,null).get(line), insertStmt.getRow(line).get(4 + 1));  //AlleleCount

            int idx = lookupIndex("attr.dp",fields);
            assertEquals(Arrays.asList(null,null,null,null,23,3,null,null,null, null,23,null).get(line), insertStmt.getRow(line).get(idx + 1));

            idx = lookupIndex("attr.sp",fields);
            assertEquals(Arrays.asList(null,null,null,2,1,null,3,2,1,3,null,null).get(line), insertStmt.getRow(line).get(idx + 1));

        }
    }




}