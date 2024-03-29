package legacy.health.genomics.vcf.parser.datamodel;

import legacy.health.genomics.vcf.parser.capability.ImportConfiguration;
import legacy.health.genomics.vcf.parser.datamodel.VCFStructureDefinition;
import legacy.health.genomics.vcf.parser.inputmodels.IContext;

import org.junit.jupiter.api.BeforeEach;
import org.mockito.Mockito;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

public class TestUtils {
    final String CATALOG_LOOKUP_QUERY= "Select * from SYS.TABLE_COLUMNS where table_name=?";
    ImportConfiguration context;
    Connection jdbcConnection;
    VCFStructureDefinition def;
    List<FakePreparedStmt> mockStmts;

    void initMocks () throws SQLException {
        mockStmts = new ArrayList<>();
        jdbcConnection = Mockito.mock(Connection.class);
        when(jdbcConnection.prepareStatement(anyString())).thenAnswer( new FakePreparedStmt.PrepStmtAnswer(mockStmts));
        context = Mockito.mock(ImportConfiguration.class);
        def = Mockito.mock(VCFStructureDefinition.class);
    }


    int lookupIndex(String fieldNameInLowerCase, List<String> fields) {
        return IntStream.range(0, fields.size()).boxed().filter(i -> fields.get(i).toLowerCase().equals(fieldNameInLowerCase)).collect(Collectors.toList()).get(0);
    }

    protected Map<String,String> getValueMapForInfoField(String id, String number, String type) {
        Map<String,String>ret = new HashMap<>();
        ret.put("id",id);
        ret.put("number",number);
        ret.put("type",type);
        return ret;
    }

    protected List<String> getFieldsFromInsert(String queryString) {
        List<String> ret = new ArrayList<>();
        int from = queryString.indexOf("(");
        int to = queryString.indexOf(")",from);
        String col = queryString.substring(from+1,to);
        for(String x : col.split(",")) {
            ret.add(x.trim().replace("\"",""));
        }
        return ret;
    }
}
