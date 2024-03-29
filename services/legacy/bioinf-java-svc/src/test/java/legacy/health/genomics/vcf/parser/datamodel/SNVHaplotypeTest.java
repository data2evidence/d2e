package legacy.health.genomics.vcf.parser.datamodel;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import legacy.health.genomics.vcf.parser.datamodel.SNVHaplotype;
import legacy.health.genomics.vcf.parser.datamodel.SNVVariantIds;

import java.sql.SQLException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SNVHaplotypeTest extends TestUtils{



    SNVVariantIds variants;

    @BeforeEach
    void init () throws SQLException {
        super.initMocks();
    }


    @Test
    void closeCallShouldCommitAndEndTheConnection() throws Exception {
        SNVHaplotype variants = new SNVHaplotype(jdbcConnection,context);
        variants.init();
        variants.close();
        verify(jdbcConnection,times(1)).commit();
    }


    @Test
    void validDataLine() throws Exception {


        SNVHaplotype variants = new SNVHaplotype(jdbcConnection,context);
        assertEquals(variants.getFields().size(), 0);

        assertEquals(variants.sqlColumnNames.size(),SNVHaplotype.STATIC_FIELDS.values().length);
        variants.init();
        assertEquals(mockStmts.size(),2);
        assertTrue(mockStmts.get(0).queryString.contains(CATALOG_LOOKUP_QUERY));
        assertTrue(mockStmts.get(1).queryString.contains(
                "INSERT INTO \""+variants.getSchemaName()+"\".\"" + variants.getTableName() + "\"("));

        List<String> fields = getFieldsFromInsert(mockStmts.get(1).queryString);

        when(context.getDwid()).thenReturn(200);
        variants.consumeDataRow(Datalines.DL_With_Valid_Info_Valid_Format_2_alt_2_id_2samples.setSourceLine(5));


        FakePreparedStmt insertStmt = mockStmts.get(1);
        assertEquals(insertStmt.buffer.size(), 5);
        assertEquals(insertStmt.is_valid.size(), 5);

        for(int line = 0; line < 4; ++line) {

            assertEquals(fields.size()+1, insertStmt.getRow(line).size());

            assertEquals("dwauditid", fields.get(0).toLowerCase());
            assertEquals(200, insertStmt.getRow(line).get(0 + 1));

            assertEquals("variantindex", fields.get(1).toLowerCase());
            assertEquals(5, insertStmt.getRow(line).get(1 + 1));

            assertEquals("sampleindex", fields.get(2).toLowerCase());
            assertEquals(Arrays.asList(0,0,1,1).get(line), insertStmt.getRow(line).get(2 + 1));

            assertEquals("haplotypeindex", fields.get(3).toLowerCase());
            assertEquals(Arrays.asList(0,1,0,1).get(line), insertStmt.getRow(line).get(3 + 1));

            assertEquals("alleleindex", fields.get(4).toLowerCase());
            assertEquals(Arrays.asList(0,0,1,null).get(line), insertStmt.getRow(line).get(4 + 1));

        }

    }

}