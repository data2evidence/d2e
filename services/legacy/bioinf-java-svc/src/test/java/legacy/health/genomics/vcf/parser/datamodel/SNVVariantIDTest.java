package legacy.health.genomics.vcf.parser.datamodel;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import legacy.health.genomics.vcf.parser.datamodel.SNVVariantIds;

import java.sql.SQLException;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SNVVariantIDTest extends TestUtils{



    SNVVariantIds variants;

    @BeforeEach
    void init () throws SQLException {
        super.initMocks();
    }


    @Test
    void closeCallShouldCommitAndEndTheConnection() throws Exception {
        SNVVariantIds variants = new SNVVariantIds(jdbcConnection,context);
        variants.init();
        variants.close();
        verify(jdbcConnection,times(1)).commit();
    }


    @Test
    void validDataLine() throws Exception {


        SNVVariantIds variants = new SNVVariantIds(jdbcConnection,context);
        assertEquals(variants.getFields().size(), 0);

        assertEquals(variants.sqlColumnNames.size(),SNVVariantIds.STATIC_FIELDS.values().length);
        variants.init();
        assertEquals(mockStmts.size(),2);
        assertTrue(mockStmts.get(0).queryString.contains(CATALOG_LOOKUP_QUERY));
        assertTrue(mockStmts.get(1).queryString.contains(
                "INSERT INTO \""+variants.getSchemaName()+"\".\"" + variants.getTableName() + "\"("));

        List<String> fields = getFieldsFromInsert(mockStmts.get(1).queryString);

        when(context.getDwid()).thenReturn(200);
        variants.consumeDataRow(Datalines.DL_With_Valid_Info_Valid_Format_2_alt_2_id_2samples.setSourceLine(5));

        variants.consumeDataRow(Datalines.DL_With_MissingIDQualAltInfoFormatValues_2_alt_2_id_2samples.setSourceLine(6));

        FakePreparedStmt insertStmt = mockStmts.get(1);
        assertEquals(insertStmt.buffer.size(), 3);
        assertEquals(insertStmt.is_valid.size(), 3);

        Set<String> varIds = new HashSet<>();
        varIds.add("Id1");
        varIds.add("Id2");
        assertEquals(insertStmt.buffer.size(),3);
        for(int line = 0; line < 2; ++line) {

            assertEquals(fields.size()+1, insertStmt.getRow(line).size());

            assertEquals("dwauditid", fields.get(0).toLowerCase());
            assertEquals(200, insertStmt.getRow(line).get(0 + 1));

            assertEquals("variantindex", fields.get(1).toLowerCase());
            assertEquals(5l, insertStmt.getRow(line).get(1 + 1));

            long variantId = (long) insertStmt.getRow(line).get(1 + 1);
            assertEquals("variantid", fields.get(2).toLowerCase());
            if(variantId ==5 ){
                varIds.remove(insertStmt.getRow(line).get(2 + 1));
            }else {
                assertFalse(true);
            }



        }
        assertTrue(varIds.isEmpty());
    }

}