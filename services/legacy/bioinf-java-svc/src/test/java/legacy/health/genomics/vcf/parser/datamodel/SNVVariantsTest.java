package legacy.health.genomics.vcf.parser.datamodel;

import legacy.health.genomics.vcf.parser.datamodel.*;
import legacy.health.genomics.vcf.parser.exceptions.DatalineParseException;
import legacy.health.genomics.vcf.parser.exceptions.EnvironmentException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.sql.SQLException;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SNVVariantsTest extends TestUtils{



    @BeforeEach
    void init () throws SQLException {
        super.initMocks();
    }


    @Test
    void closeCallShouldCommitAndEndTheConnection() throws Exception {
        SNVVariants variants = new SNVVariants(def,jdbcConnection,context);
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
        SNVVariants variants = new SNVVariants(def,jdbcConnection,context);
        variants.init();

        Map<String, List<String>> tableToMissingFieldsMap = new HashMap<>();
        FakePreparedStmt catalogQuery = mockStmts.get(0);
        catalogQuery.ReturnNextableResultSet().ifParametersAre(variants.getTableName(),"Attr.NS","INTEGER");
        catalogQuery.ReturnNonNextableResultSet().ifParametersAre(variants.getTableName(),"Attr.NS2","INTEGER");
        catalogQuery.ThrowException().ifParametersAre(variants.getTableName(),"Attr.NSMV","INTEGER");
        catalogQuery.ThrowException().ifParametersAre(variants.getTableName(),"Attr.NSR","INTEGER");
        catalogQuery.ThrowException().ifParametersAre(variants.getTableName(),"Attr.NSA","INTEGER");
        catalogQuery.ThrowException().ifParametersAre(variants.getTableName(),"Attr.NSG","INTEGER");
        catalogQuery.ThrowException().ifParametersAre(variants.getTableName(),"Attr.NSD","INTEGER");
        catalogQuery.ReturnNextableResultSet().ifParametersAre(variants.getTableName(),"Filter.s50","TINYINT");
        catalogQuery.ReturnNonNextableResultSet().ifParametersAre(variants.getTableName(),"Filter.q20","TINYINT");

        //Modify fake to return true false depending on attributes
        variants.checkHeaderAgainstDatabase(tableToMissingFieldsMap);
        assertEquals(tableToMissingFieldsMap.size(),2);
        assertEquals(tableToMissingFieldsMap.keySet(), new HashSet<>(Arrays.asList("hc.hph.genomics.db.models::SNV.Variants-Attr.","hc.hph.genomics.db.models::SNV.Variants-Filter.")));
        assertEquals(tableToMissingFieldsMap.get("hc.hph.genomics.db.models::SNV.Variants-Attr."), Collections.singletonList("\"NS2\" : Integer"));
        assertEquals(tableToMissingFieldsMap.get("hc.hph.genomics.db.models::SNV.Variants-Filter."), Collections.singletonList("\"q20\" : Integer"));

    }*/

    @Test
    void onlyDefaultValuesInHeaderMoreFieldsInDatalineAllValid() throws Exception {
        SNVVariants variants = new SNVVariants(def,jdbcConnection,context);
        assertEquals(variants.getFields().size(), 2);
        assertTrue(variants.getFields().get(0).isEmpty());
        assertTrue(variants.getFields().get(1).isEmpty());
        assertEquals(variants.sqlColumnNames.size(),SNVVariants.STATIC_FIELDS.values().length);
        variants.init();
        assertEquals(mockStmts.size(),2);
        assertTrue(mockStmts.get(0).queryString.contains(CATALOG_LOOKUP_QUERY));
        assertTrue(mockStmts.get(1).queryString.contains(
                "INSERT INTO \""+variants.getSchemaName()+"\".\"" + variants.getTableName() + "\"("));

        List<String> fields = getFieldsFromInsert(mockStmts.get(1).queryString);

        when(context.getDwid()).thenReturn(200);
        variants.consumeDataRow(Datalines.DL_With_Valid_Info_Valid_Format_2_alt_2_id_2samples.setSourceLine(5));

        variants.consumeDataRow(Datalines.DL_With_Valid_Info_Valid_Format_2_alt_2_id_2samples.setSourceLine(6));

        for(int line = 0; line < 2; ++line) {
            FakePreparedStmt insertStmt = mockStmts.get(1);
            assertEquals(insertStmt.buffer.size(), 3);
            assertEquals(insertStmt.is_valid.size(), 3);
            assertEquals(fields.size()+1, insertStmt.getRow(line).size());

            assertEquals("dwauditid", fields.get(0).toLowerCase());
            assertEquals(200, insertStmt.getRow(line).get(0 + 1));

            assertEquals("variantindex", fields.get(1).toLowerCase());
            assertEquals(5+line, insertStmt.getRow(line).get(1 + 1));

            assertEquals("chromosomeindex", fields.get(2).toLowerCase());
            assertEquals(19, insertStmt.getRow(line).get(2 + 1));

            assertEquals("position", fields.get(3).toLowerCase());
            assertEquals(14369, insertStmt.getRow(line).get(3 + 1));

            assertEquals("variantid", fields.get(4).toLowerCase());
            assertEquals("Id1", insertStmt.getRow(line).get(4 + 1));

            assertEquals("quality", fields.get(5).toLowerCase());
            assertEquals(44.0, insertStmt.getRow(line).get(5 + 1));

            assertEquals("filter.pass", fields.get(6).toLowerCase());
            assertEquals(1, insertStmt.getRow(line).get(6 + 1));
        }
    }



    @Test
    void InvalidInfoFieldWithTooManyEntries() throws Exception {
        Map<String, InfoField> infoFields= new HashMap<>();
        infoFields.put("NS1",InfoField.getFromValueMapInfo(getValueMapForInfoField("AF","1","Integer")));
        when(def.getInfo()).thenReturn(infoFields);
        SNVVariants variants = new SNVVariants(def,jdbcConnection,context);
        variants.init();
        assertThrows(DatalineParseException.class,
                () -> variants.consumeDataRow(Datalines.DL_With_Valid_Info_Valid_Format_2_alt_2_id_2samples.setSourceLine(5)),
                "Expected one value for field AF got: 2");
    }

    @Test
    void additionalFieldsInHeaderAndInDatalineAllValid() throws Exception {

        Map<String, InfoField> infoFields= new HashMap<>();
        Map<String, FilterField> filterFields= new HashMap<>();
        infoFields.put("NS",InfoField.getFromValueMapInfo(getValueMapForInfoField("NS","1","Integer")));
        infoFields.put("NSMV",InfoField.getFromValueMapInfo(getValueMapForInfoField("NSMV","10","Integer")));
        infoFields.put("NSR",InfoField.getFromValueMapInfo(getValueMapForInfoField("NSR","R","Integer")));
        infoFields.put("NSA",InfoField.getFromValueMapInfo(getValueMapForInfoField("NSA","A","Integer")));
        infoFields.put("NSG",InfoField.getFromValueMapInfo(getValueMapForInfoField("NSG","G","Integer")));
        infoFields.put("NSD",InfoField.getFromValueMapInfo(getValueMapForInfoField("NSD",".","Integer")));
        filterFields.put("s50",FilterField.getFromValueMapFilter(getValueMapForInfoField("s50","0","Flag")));
        filterFields.put("q20",FilterField.getFromValueMapFilter(getValueMapForInfoField("q20","0","Flag")));
        when(def.getInfo()).thenReturn(infoFields);
        when(def.getFilter()).thenReturn(filterFields);

        SNVVariants variants = new SNVVariants(def,jdbcConnection,context);
        assertEquals(variants.getFields().size(), 2);
        assertEquals(variants.getFields().get(0).size(),1);
        assertEquals(variants.getFields().get(1).size(),2);
        assertEquals(variants.sqlColumnNames.size(),SNVVariants.STATIC_FIELDS.values().length);
        variants.init();
        assertEquals(mockStmts.size(),2);
        assertTrue(mockStmts.get(0).queryString.contains(CATALOG_LOOKUP_QUERY));
        assertTrue(mockStmts.get(1).queryString.contains(
                "INSERT INTO \""+variants.getSchemaName()+"\".\"" + variants.getTableName() + "\"("));

        List<String> fields = getFieldsFromInsert(mockStmts.get(1).queryString);

        when(context.getDwid()).thenReturn(200);
        variants.consumeDataRow(Datalines.DL_With_Valid_Info_Valid_Format_2_alt_2_id_2samples.setSourceLine(5));

        variants.consumeDataRow(Datalines.DL_With_Valid_Info_Valid_Format_2_alt_2_id_2samples.setSourceLine(6));

        for(int line = 0; line < 2; ++line) {
            FakePreparedStmt insertStmt = mockStmts.get(1);
            assertEquals(insertStmt.buffer.size(), 3);
            assertEquals(insertStmt.is_valid.size(), 3);
            assertEquals(fields.size()+1, insertStmt.getRow(line).size());

            assertEquals("dwauditid", fields.get(0).toLowerCase());
            assertEquals(200, insertStmt.getRow(line).get(0 + 1));

            assertEquals("variantindex", fields.get(1).toLowerCase());
            assertEquals(5+line, insertStmt.getRow(line).get(1 + 1));

            assertEquals("chromosomeindex", fields.get(2).toLowerCase());
            assertEquals(19, insertStmt.getRow(line).get(2 + 1));

            assertEquals("position", fields.get(3).toLowerCase());
            assertEquals(14369, insertStmt.getRow(line).get(3 + 1));

            assertEquals("variantid", fields.get(4).toLowerCase());
            assertEquals("Id1", insertStmt.getRow(line).get(4 + 1));

            assertEquals("quality", fields.get(5).toLowerCase());
            assertEquals(44.0, insertStmt.getRow(line).get(5 + 1));

            assertEquals("filter.pass", fields.get(6).toLowerCase());
            assertEquals(1, insertStmt.getRow(line).get(6 + 1));

            int idx = lookupIndex("attr.ns",fields);
            assertEquals(3, insertStmt.getRow(line).get(idx + 1));

            idx = lookupIndex("filter.q20",fields);
            assertEquals(0, insertStmt.getRow(line).get(idx + 1));

            idx = lookupIndex("filter.s50",fields);
            assertEquals(1, insertStmt.getRow(line).get(idx + 1));

        }
    }

    @Test
    void missingFieldsInDatalineButValid() throws Exception {

        Map<String, InfoField> infoFields= new HashMap<>();
        Map<String, FilterField> filterFields= new HashMap<>();
        InfoField i1 = InfoField.getFromValueMapInfo(getValueMapForInfoField("NS", "1", "Integer"));
        i1.setAlias("NSALIAS");
        infoFields.put("NS",i1);
        filterFields.put("s50",FilterField.getFromValueMapFilter(getValueMapForInfoField("s50","0","Flag")));
        filterFields.put("q20",FilterField.getFromValueMapFilter(getValueMapForInfoField("q20","0","Flag")));
        when(def.getInfo()).thenReturn(infoFields);
        when(def.getFilter()).thenReturn(filterFields);

        SNVVariants variants = new SNVVariants(def,jdbcConnection,context);
        assertEquals(variants.getFields().size(), 2);
        assertEquals(variants.getFields().get(0).size(),1);
        assertEquals(variants.getFields().get(1).size(),2);
        assertEquals(variants.sqlColumnNames.size(),SNVVariants.STATIC_FIELDS.values().length);
        variants.init();
        assertEquals(mockStmts.size(),2);
        assertTrue(mockStmts.get(0).queryString.contains(CATALOG_LOOKUP_QUERY));
        assertTrue(mockStmts.get(1).queryString.contains(
                "INSERT INTO \""+variants.getSchemaName()+"\".\"" + variants.getTableName() + "\"("));

        List<String> fields = getFieldsFromInsert(mockStmts.get(1).queryString);

        when(context.getDwid()).thenReturn(200);
        variants.consumeDataRow(Datalines.DL_With_MissingIDQualAltInfoFormatValues_2_alt_2_id_2samples.setSourceLine(5));

        variants.consumeDataRow(Datalines.DL_With_MissingIDQualAltInfoFormatValues_2_alt_2_id_2samples.setSourceLine(6));

        for(int line = 0; line < 2; ++line) {
            FakePreparedStmt insertStmt = mockStmts.get(1);
            assertEquals(insertStmt.buffer.size(), 3);
            assertEquals(insertStmt.is_valid.size(), 3);
            assertEquals(fields.size()+1, insertStmt.getRow(line).size());

            assertEquals("dwauditid", fields.get(0).toLowerCase());
            assertEquals(200, insertStmt.getRow(line).get(0 + 1));

            assertEquals("variantindex", fields.get(1).toLowerCase());
            assertEquals(5+line, insertStmt.getRow(line).get(1 + 1));

            assertEquals("chromosomeindex", fields.get(2).toLowerCase());
            assertEquals(19, insertStmt.getRow(line).get(2 + 1));

            assertEquals("position", fields.get(3).toLowerCase());
            assertEquals(14369, insertStmt.getRow(line).get(3 + 1));

            assertEquals("variantid", fields.get(4).toLowerCase());
            assertEquals(null, insertStmt.getRow(line).get(4 + 1));

            assertEquals("quality", fields.get(5).toLowerCase());
            assertEquals(null, insertStmt.getRow(line).get(5 + 1));

            assertEquals("filter.pass", fields.get(6).toLowerCase());
            assertEquals(0, insertStmt.getRow(line).get(6 + 1));

            int idx = lookupIndex("attr.nsalias",fields);
            assertEquals(null, insertStmt.getRow(line).get(idx + 1));

            idx = lookupIndex("filter.q20",fields);
            assertEquals(0, insertStmt.getRow(line).get(idx + 1));

            idx = lookupIndex("filter.s50",fields);
            assertEquals(0, insertStmt.getRow(line).get(idx + 1));

        }
    }

}