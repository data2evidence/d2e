package legacy.health.genomics.vcf.parser.datamodel;

import legacy.health.genomics.vcf.parser.datamodel.FilterField;
import legacy.health.genomics.vcf.parser.datamodel.InfoField;
import legacy.health.genomics.vcf.parser.datamodel.SNVVariantAlleles;
import legacy.health.genomics.vcf.parser.datamodel.SNVVariantMV;
import legacy.health.genomics.vcf.parser.exceptions.DatalineParseException;
import legacy.health.genomics.vcf.parser.exceptions.EnvironmentException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.sql.SQLException;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SNVVariantAllelesTest extends TestUtils {


    @BeforeEach
    void init () throws SQLException {
        super.initMocks();
    }


    @Test
    void closeCallShouldCommitAndEndTheConnection() throws Exception {
        SNVVariantAlleles variants = new SNVVariantAlleles(def,jdbcConnection,context);
        variants.init();
        variants.close();
        verify(jdbcConnection,times(1)).commit();
    }


    /*@Test
    void checkHeaderAgainstDatabaseTableBase () throws SQLException, DatalineParseException, EnvironmentException {
        Map<String, InfoField> infoFields= new HashMap<>();
        Map<String, FilterField> filterFields= new HashMap<>();
        infoFields.put("NS",InfoField.getFromValueMapInfo(getValueMapForInfoField("NS","1","Integer")));
        infoFields.put("NS",InfoField.getFromValueMapInfo(getValueMapForInfoField("NS2","1","Integer")));
        infoFields.put("NSMV",InfoField.getFromValueMapInfo(getValueMapForInfoField("NSMV","10","Integer")));
        infoFields.put("NSR",InfoField.getFromValueMapInfo(getValueMapForInfoField("NSR","R","Integer")));
        infoFields.put("NSA",InfoField.getFromValueMapInfo(getValueMapForInfoField("NSA","A","Integer")));
        infoFields.put("NSG",InfoField.getFromValueMapInfo(getValueMapForInfoField("NSG","G","Integer")));
        infoFields.put("NSD",InfoField.getFromValueMapInfo(getValueMapForInfoField("NSD",".","Integer")));
        filterFields.put("s50",FilterField.getFromValueMapFilter(getValueMapForInfoField("s50","0","Flag")));
        filterFields.put("q20",FilterField.getFromValueMapFilter(getValueMapForInfoField("q20","0","Flag")));
        when(def.getInfo()).thenReturn(infoFields);
        when(def.getFilter()).thenReturn(filterFields);
        SNVVariantAlleles variants = new SNVVariantAlleles(def,jdbcConnection,context);
        variants.init();

        Map<String, List<String>> tableToMissingFieldsMap = new HashMap<>();
        FakePreparedStmt catalogQuery = mockStmts.get(0);
        catalogQuery.ThrowException().ifParametersAre(variants.getTableName(),"Attr.NS","INTEGER");
        catalogQuery.ThrowException().ifParametersAre(variants.getTableName(),"Attr.NS2","INTEGER");
        catalogQuery.ThrowException().ifParametersAre(variants.getTableName(),"Attr.NSMV","INTEGER");
        catalogQuery.ReturnNonNextableResultSet().ifParametersAre(variants.getTableName(),"Attr.NSR","INTEGER");
        catalogQuery.ReturnNextableResultSet().ifParametersAre(variants.getTableName(),"Attr.NSA","INTEGER");
        catalogQuery.ThrowException().ifParametersAre(variants.getTableName(),"Attr.NSG","INTEGER");
        catalogQuery.ThrowException().ifParametersAre(variants.getTableName(),"Attr.NSD","INTEGER");
        catalogQuery.ThrowException().ifParametersAre(variants.getTableName(),"Filter.s50","TINYINT");
        catalogQuery.ThrowException().ifParametersAre(variants.getTableName(),"Filter.q20","TINYINT");

        //Modify fake to return true false depending on attributes
        variants.checkHeaderAgainstDatabase(tableToMissingFieldsMap);
        assertEquals(tableToMissingFieldsMap.size(),1);
        assertEquals(tableToMissingFieldsMap.keySet(), new HashSet<>(Arrays.asList("hc.hph.genomics.db.models::SNV.VariantAlleles-Attr.")));
        assertEquals(tableToMissingFieldsMap.get("hc.hph.genomics.db.models::SNV.VariantAlleles-Attr."), Collections.singletonList("\"NSR\" : Integer"));


    }*/

    /*  .addInfoField(new DatalineInfoField("AF", Arrays.asList("0.333")))
            .addInfoField(new DatalineInfoField("AF2", Arrays.asList("0.333",".")))
            .addInfoField(new DatalineInfoField("AF3", Arrays.asList("0.33","0.33","0.33")))
          */



    @Test
    void AlternativeCountFieldsToManyValuesInAf() throws Exception {

        Map<String, InfoField> infoFields = new HashMap<>();

        infoFields.put("NS", InfoField.getFromValueMapInfo(getValueMapForInfoField("NS", "1", "Integer")));
        infoFields.put("AF", InfoField.getFromValueMapInfo(getValueMapForInfoField("AF", "A", "Float")));
        infoFields.put("AF2", InfoField.getFromValueMapInfo(getValueMapForInfoField("AF2", "A", "Float")));
        infoFields.put("AF3", InfoField.getFromValueMapInfo(getValueMapForInfoField("AF3", "A", "Float")));

        when(def.getInfo()).thenReturn(infoFields);


        SNVVariantAlleles variants = new SNVVariantAlleles(def, jdbcConnection, context);
        assertEquals(variants.getFields().size(), 1);
        assertEquals(variants.getFields().get(0).size(), 3l);
        assertEquals(variants.sqlColumnNames.size(), SNVVariantAlleles.STATIC_FIELDS.values().length);
        variants.init();
        assertEquals(mockStmts.size(), 2);
        assertTrue(mockStmts.get(0).queryString.contains(CATALOG_LOOKUP_QUERY));
        assertTrue(mockStmts.get(1).queryString.contains(
                "INSERT INTO \""+variants.getSchemaName()+"\".\"" + variants.getTableName() + "\"("));

        List<String> fields = getFieldsFromInsert(mockStmts.get(1).queryString);

        assertThrows(DatalineParseException.class,
                () -> variants.consumeDataRow(Datalines.DL_VariantAllelesTestRowZeroAlternatives.setSourceLine(5)),
                "To many values for field: AF3 expected 2 (Alleles + Reference) but got 3");

        assertThrows(DatalineParseException.class,
                () -> variants.consumeDataRow(Datalines.DL_VariantAllelesTestRowOneAlternatives.setSourceLine(5)),
                "To many values for field: AF3 expected 2 (Alleles + Reference) but got 3");

    }

    @Test
    void ReferenceCountFieldsToManyValuesInAf() throws Exception {

        Map<String, InfoField> infoFields = new HashMap<>();

        infoFields.put("NS", InfoField.getFromValueMapInfo(getValueMapForInfoField("NS", "1", "Integer")));
        infoFields.put("AF", InfoField.getFromValueMapInfo(getValueMapForInfoField("AF", "R", "Float")));
        infoFields.put("AF2", InfoField.getFromValueMapInfo(getValueMapForInfoField("AF2", "R", "Float")));
        infoFields.put("AF3", InfoField.getFromValueMapInfo(getValueMapForInfoField("AF3", "R", "Float")));

        when(def.getInfo()).thenReturn(infoFields);


        SNVVariantAlleles variants = new SNVVariantAlleles(def, jdbcConnection, context);
        assertEquals(variants.getFields().size(), 1);
        assertEquals(variants.getFields().get(0).size(), 3l);
        assertEquals(variants.sqlColumnNames.size(), SNVVariantAlleles.STATIC_FIELDS.values().length);
        variants.init();
        assertEquals(mockStmts.size(), 2);
        assertTrue(mockStmts.get(0).queryString.contains(CATALOG_LOOKUP_QUERY));
        assertTrue(mockStmts.get(1).queryString.contains(
                "INSERT INTO \""+variants.getSchemaName()+"\".\"" + variants.getTableName() + "\"("));

        List<String> fields = getFieldsFromInsert(mockStmts.get(1).queryString);

        assertThrows(DatalineParseException.class,
                () -> variants.consumeDataRow(Datalines.DL_VariantAllelesTestRowZeroAlternatives.setSourceLine(5)),
                "To many values for field: AF3 expected 2 (Alleles + Reference) but got 3");

        assertThrows(DatalineParseException.class,
                () -> variants.consumeDataRow(Datalines.DL_VariantAllelesTestRowOneAlternatives.setSourceLine(5)),
                "To many values for field: AF3 expected 2 (Alleles + Reference) but got 3");

    }

    @Test
    void AlternativeCountFieldsAllValid() throws Exception {

        Map<String, InfoField> infoFields= new HashMap<>();

        infoFields.put("NS",InfoField.getFromValueMapInfo(getValueMapForInfoField("NS","1","Integer")));
        infoFields.put("AF",InfoField.getFromValueMapInfo(getValueMapForInfoField("AF","A","Float")));
        infoFields.put("AF2",InfoField.getFromValueMapInfo(getValueMapForInfoField("AF2","A","Float")));
        infoFields.put("AF3",InfoField.getFromValueMapInfo(getValueMapForInfoField("AF3","A","Float")));

        when(def.getInfo()).thenReturn(infoFields);



        SNVVariantAlleles variants = new SNVVariantAlleles(def,jdbcConnection,context);
        assertEquals(variants.getFields().size(), 1);
        assertEquals(variants.getFields().get(0).size(),3l);
        assertEquals(variants.sqlColumnNames.size(),SNVVariantAlleles.STATIC_FIELDS.values().length);
        variants.init();
        assertEquals(mockStmts.size(),2);
        assertTrue(mockStmts.get(0).queryString.contains(CATALOG_LOOKUP_QUERY));
        assertTrue(mockStmts.get(1).queryString.contains(
                "INSERT INTO \""+variants.getSchemaName()+"\".\"" + variants.getTableName() + "\"("));

        List<String> fields = getFieldsFromInsert(mockStmts.get(1).queryString);

        when(context.getDwid()).thenReturn(200);
        variants.consumeDataRow(Datalines.DL_VariantAllelesTestRowThreeAlternatives.setSourceLine(6));


        int rows = 4; //See datalines
        for(int line = 0; line < rows; ++line) {
            FakePreparedStmt insertStmt = mockStmts.get(1);
            assertEquals(insertStmt.buffer.size(), rows+1);
            assertEquals(insertStmt.buffer.get(line).size(),8);
            assertEquals(insertStmt.is_valid.get(line).size(),8);

            assertEquals(fields.size()+1, insertStmt.getRow(line).size());

            assertEquals(200, insertStmt.getRow(line).get(0 + 1));

            assertEquals(6, insertStmt.getRow(line).get(1 + 1));
            //AlleleIndex
            assertEquals(line, insertStmt.getRow(line).get(2 + 1));

            int idx = lookupIndex("attr.af",fields);
            assertEquals(Arrays.asList(null,new Double(0.333),null,null).get(line % 8), insertStmt.getRow(line).get(idx + 1));

            idx = lookupIndex("attr.af2",fields);
            assertEquals(Arrays.asList(null,new Double(0.333),null,null).get(line % 8), insertStmt.getRow(line).get(idx + 1));

            idx = lookupIndex("attr.af3",fields);
            assertEquals(Arrays.asList(null,new Double(0.33),new Double(0.33),new Double(0.33)).get(line % 8), insertStmt.getRow(line).get(idx + 1));


        }
    }



    @Test
    void ReferenceCountFieldsAllValid() throws Exception {

        Map<String, InfoField> infoFields= new HashMap<>();

        infoFields.put("NS",InfoField.getFromValueMapInfo(getValueMapForInfoField("NS","1","Integer")));
        infoFields.put("AF",InfoField.getFromValueMapInfo(getValueMapForInfoField("AF","R","Float")));
        infoFields.put("AF2",InfoField.getFromValueMapInfo(getValueMapForInfoField("AF2","R","Float")));
        infoFields.put("AF3",InfoField.getFromValueMapInfo(getValueMapForInfoField("AF3","R","Float")));

        when(def.getInfo()).thenReturn(infoFields);



        SNVVariantAlleles variants = new SNVVariantAlleles(def,jdbcConnection,context);
        assertEquals(variants.getFields().size(), 1);
        assertEquals(variants.getFields().get(0).size(),3l);
        assertEquals(variants.sqlColumnNames.size(),SNVVariantAlleles.STATIC_FIELDS.values().length);
        variants.init();
        assertEquals(mockStmts.size(),2);
        assertTrue(mockStmts.get(0).queryString.contains(CATALOG_LOOKUP_QUERY));
        assertTrue(mockStmts.get(1).queryString.contains(
                "INSERT INTO \""+variants.getSchemaName()+"\".\"" + variants.getTableName() + "\"("));

        List<String> fields = getFieldsFromInsert(mockStmts.get(1).queryString);

        when(context.getDwid()).thenReturn(200);
        variants.consumeDataRow(Datalines.DL_VariantAllelesTestRowTwoAlternatives.setSourceLine(6));


        int rows = 3; //See datalines
        for(int line = 0; line < rows; ++line) {
            FakePreparedStmt insertStmt = mockStmts.get(1);
            assertEquals(insertStmt.buffer.size(), rows+1);
            assertEquals(insertStmt.buffer.get(line).size(),8);
            assertEquals(insertStmt.is_valid.get(line).size(),8);

            assertEquals(fields.size()+1, insertStmt.getRow(line).size());

            assertEquals(200, insertStmt.getRow(line).get(0 + 1));

            assertEquals(6, insertStmt.getRow(line).get(1 + 1));
            //AlleleIndex
             assertEquals(line, insertStmt.getRow(line).get(2 + 1));

            int idx = lookupIndex("attr.af",fields);
            assertEquals(Arrays.asList(new Double(0.333),null,null).get(line % 8), insertStmt.getRow(line).get(idx + 1));

            idx = lookupIndex("attr.af2",fields);
            assertEquals(Arrays.asList(new Double(0.333),null,null).get(line % 8), insertStmt.getRow(line).get(idx + 1));

            idx = lookupIndex("attr.af3",fields);
            assertEquals(Arrays.asList(new Double(0.33),new Double(0.33),new Double(0.33)).get(line % 8), insertStmt.getRow(line).get(idx + 1));


        }
    }



    @Test
    void InvalidInfoFieldWithTooWrongElementCount() throws Exception {
        Map<String, InfoField> infoFields= new HashMap<>();
        infoFields.put("MV9",InfoField.getFromValueMapInfo(getValueMapForInfoField("MV8","2","Float")));
        when(def.getInfo()).thenReturn(infoFields);
        SNVVariantMV variants = new SNVVariantMV(def,jdbcConnection,context);
        variants.init();
        assertThrows(DatalineParseException.class,
                () -> variants.consumeDataRow(Datalines.DL_With_MissingIDQualAltInfoFormatValues_2_alt_2_id_2samples_many_multivalue_info.setSourceLine(5)),
                "Expected one value for field AF got: 2");
    }

    @Test
    void InvalidInfoFieldWithTooWrongType() throws Exception {
        Map<String, InfoField> infoFields= new HashMap<>();
        infoFields.put("MV9",InfoField.getFromValueMapInfo(getValueMapForInfoField("MV8","8","Integer")));
        when(def.getInfo()).thenReturn(infoFields);
        SNVVariantMV variants = new SNVVariantMV(def,jdbcConnection,context);
        variants.init();
        assertThrows(NumberFormatException.class,
                () -> variants.consumeDataRow(Datalines.DL_With_MissingIDQualAltInfoFormatValues_2_alt_2_id_2samples_many_multivalue_info.setSourceLine(5)),
                "Expected one value for field AF got: 2");
    }








    @Test
    void additionalFieldsInHeaderAndInDatalineAllValid() throws Exception {

        Map<String, InfoField> infoFields= new HashMap<>();

        infoFields.put("NS",InfoField.getFromValueMapInfo(getValueMapForInfoField("NS","1","Integer")));
        infoFields.put("MV1",InfoField.getFromValueMapInfo(getValueMapForInfoField("MV1","2","Float")));
        infoFields.put("MV2",InfoField.getFromValueMapInfo(getValueMapForInfoField("MV2","3","Float")));
        infoFields.put("MV3",InfoField.getFromValueMapInfo(getValueMapForInfoField("MV3","3","Float")));
        infoFields.put("MV4",InfoField.getFromValueMapInfo(getValueMapForInfoField("MV4","4","Float")));
        infoFields.put("MV5",InfoField.getFromValueMapInfo(getValueMapForInfoField("MV5","2","Float")));
        infoFields.put("MV6",InfoField.getFromValueMapInfo(getValueMapForInfoField("MV6","2","Float")));
        infoFields.put("MV7",InfoField.getFromValueMapInfo(getValueMapForInfoField("MV7","3","Float")));
        infoFields.put("MV9",InfoField.getFromValueMapInfo(getValueMapForInfoField("MV8","9","Float")));

        when(def.getInfo()).thenReturn(infoFields);


        SNVVariantMV variants = new SNVVariantMV(def,jdbcConnection,context);
        assertEquals(variants.getFields().size(), 1);
        assertEquals(variants.getFields().get(0).size(),8);

        assertEquals(variants.sqlColumnNames.size(),SNVVariantMV.STATIC_FIELDS.values().length);
        variants.init();
        assertEquals(mockStmts.size(),2);
        assertTrue(mockStmts.get(0).queryString.contains(CATALOG_LOOKUP_QUERY));
        assertTrue(mockStmts.get(1).queryString.contains(
                "INSERT INTO \""+variants.getSchemaName()+"\".\"" + variants.getTableName() + "\"("));

        List<String> fields = getFieldsFromInsert(mockStmts.get(1).queryString);

        when(context.getDwid()).thenReturn(200);
        variants.consumeDataRow(Datalines.DL_With_MissingIDQualAltInfoFormatValues_2_alt_2_id_2samples_many_multivalue_info.setSourceLine(5));

        variants.consumeDataRow(Datalines.DL_With_MissingIDQualAltInfoFormatValues_2_alt_2_id_2samples_many_multivalue_info.setSourceLine(6));


        int rows = 2*8; //2 rows * 8 as max count from mv8
        assertEquals(mockStmts.get(1).buffer.size(), rows+1); //2 rows * 8 as max count from mv8 +1 as current empty one
        for(int line = 0; line < rows; ++line) {
            FakePreparedStmt insertStmt = mockStmts.get(1);
            assertEquals(fields.size()+1, insertStmt.getRow(line).size());

            assertEquals(200, insertStmt.getRow(line).get(0 + 1));

            assertEquals(line < 8 ? 5 : 6, insertStmt.getRow(line).get(1 + 1));

            assertEquals(line%8, insertStmt.getRow(line).get(2 + 1));


            int idx = lookupIndex("attr.mv1",fields);
            assertEquals(Arrays.asList(new Double(0.333),null,null,null,null,null,null,null).get(line % 8), insertStmt.getRow(line).get(idx + 1));

            idx = lookupIndex("attr.mv2",fields);
            assertEquals(Arrays.asList(new Double(0.333),null,null,null,null,null,null,null).get(line % 8), insertStmt.getRow(line).get(idx + 1));

            idx = lookupIndex("attr.mv3",fields);
            assertEquals(Arrays.asList(new Double(0.333),null,new Double(0.6),null,null,null,null,null).get(line % 8), insertStmt.getRow(line).get(idx + 1));

            idx = lookupIndex("attr.mv4",fields);
            assertEquals(Arrays.asList(new Double(0.333),null,null,new Double(0.6),null,null,null,null).get(line % 8), insertStmt.getRow(line).get(idx + 1));

            idx = lookupIndex("attr.mv5",fields);
            assertEquals(Arrays.asList(null,null,null,null,null,null,null,null).get(line % 8), insertStmt.getRow(line).get(idx + 1));

            idx = lookupIndex("attr.mv6",fields);
            assertEquals(Arrays.asList(null,new Double(0.6),null,null,null,null,null,null).get(line % 8), insertStmt.getRow(line).get(idx + 1));

            idx = lookupIndex("attr.mv7",fields);
            assertEquals(Arrays.asList(null,null,null,null,null,null,null,null).get(line % 8), insertStmt.getRow(line).get(idx + 1));

            idx = lookupIndex("attr.mv8",fields);
            assertEquals(Arrays.asList(new Double(0.333),new Double(0.7),new Double(0.6),new Double(0.7),new Double(0.7),new Double(0.7),new Double(0.7),new Double(0.6)).get(line % 8), insertStmt.getRow(line).get(idx + 1));

        }
    }

}