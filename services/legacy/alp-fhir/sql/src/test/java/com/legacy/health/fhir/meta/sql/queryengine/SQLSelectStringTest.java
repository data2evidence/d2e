package com.legacy.health.fhir.meta.sql.queryengine;

import com.legacy.health.fhir.meta.FhirException;
import org.junit.Test;

import java.sql.JDBCType;

import static org.junit.Assert.*;

public class SQLSelectStringTest {

    @Test
    public void testQuotedValuesAreNotReplaced() throws FhirException {
        PreparedStatementValues vals = new PreparedStatementValues();
        String id = vals.getNameForValue("XXX", JDBCType.NVARCHAR);
        SQLSelectString select = new SQLSelectString(vals);
        String query = "\"test:" + id + "\" from Dummy";
        select.joiner.add(query);
        String preStmt = select.fillIndexInformationOfParameterMap();
        assertFalse(preStmt.contains("?"));
        assertEquals(("SELECT " + query), preStmt);
        assertEquals(vals.getIndex(id), -1);
    }

    @Test
    public void testSingleQuotedValuesAreNotReplaced() throws FhirException {
        PreparedStatementValues vals = new PreparedStatementValues();
        String id = vals.getNameForValue("XXX", JDBCType.NVARCHAR);
        SQLSelectString select = new SQLSelectString(vals);
        String query = "'test:" + id + "' from Dummy";
        select.joiner.add(query);
        String preStmt = select.fillIndexInformationOfParameterMap();
        assertFalse(preStmt.contains("?"));
        assertEquals(("SELECT " + query), preStmt);
        assertEquals(vals.getIndex(id), -1);
    }

    @Test
    public void testEscapeQuotesAreDetectedInSingleQuotes() throws FhirException {
        PreparedStatementValues vals = new PreparedStatementValues();
        String id = vals.getNameForValue("XXX", JDBCType.NVARCHAR);
        SQLSelectString select = new SQLSelectString(vals);
        String query = "'test'':" + id + "' from Dummy";
        select.joiner.add(query);
        String preStmt = select.fillIndexInformationOfParameterMap();
        assertFalse(preStmt.contains("?"));
        assertEquals(("SELECT " + query), preStmt);
        assertEquals(vals.getIndex(id), -1);

    }

    @Test
    public void testEscapeQuotesAreDetectedInDoubleQuotes() throws FhirException {
        PreparedStatementValues vals = new PreparedStatementValues();
        String id = vals.getNameForValue("XXX", JDBCType.NVARCHAR);
        SQLSelectString select = new SQLSelectString(vals);
        String query = "\"test\"\":" + id + "\" from Dummy";
        select.joiner.add(query);
        String preStmt = select.fillIndexInformationOfParameterMap();
        assertFalse(preStmt.contains("?"));
        assertEquals(("SELECT " + query), preStmt);
        assertEquals(vals.getIndex(id), -1);

    }

    @Test
    public void testUnQuotedIsReplaced() throws FhirException {
        PreparedStatementValues vals = new PreparedStatementValues();
        String id = vals.getNameForValue("XXX", JDBCType.NVARCHAR);
        SQLSelectString select = new SQLSelectString(vals);
        String query = "test:" + id + " from Dummy";
        select.joiner.add(query);
        String preStmt = select.fillIndexInformationOfParameterMap();
        assertTrue(preStmt.contains("?"));
        assertEquals(("SELECT test? from Dummy"), preStmt);
        assertEquals(vals.getIndex(id), 1);
        assertEquals(vals.get().get(id), "XXX");
    }

    @Test
    public void testUnQuotedIsReplacedMultiple() throws FhirException {
        PreparedStatementValues vals = new PreparedStatementValues();
        String id = vals.getNameForValue("XXX", JDBCType.NVARCHAR);
        String id2 = vals.getNameForValue("YYY", JDBCType.NVARCHAR);
        SQLSelectString select = new SQLSelectString(vals);
        String query = "test:" + id + ",:" + id2 + " from Dummy";
        select.joiner.add(query);
        String preStmt = select.fillIndexInformationOfParameterMap();
        assertTrue(preStmt.contains("?"));
        assertEquals(("SELECT test?,? from Dummy"), preStmt);
        assertEquals(vals.getIndex(id), 1);
        assertEquals(vals.get().get(id), "XXX");
        assertEquals(vals.getIndex(id2), 2);
        assertEquals(vals.get().get(id2), "YYY");
    }

}
