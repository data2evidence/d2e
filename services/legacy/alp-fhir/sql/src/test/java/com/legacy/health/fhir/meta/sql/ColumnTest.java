package com.legacy.health.fhir.meta.sql;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

public class ColumnTest {

	// private static Log log = LogFactory.getLog(ColumnTest.class);

	@Test
	public void extractSizeFromVarchartype() {

		Column column1 = new Column("col1", "VARCHAR(55)");
		assertEquals(55, column1.getVarcharTypeLength());

		Column column2 = new Column("col1", "VARCHAR()");
		assertEquals(0, column2.getVarcharTypeLength());

		Column column3 = new Column("col1", "VARCHAR(2,1)");
		assertEquals(0, column3.getVarcharTypeLength());

		Column column4 = new Column("col1", "CHAR(3696)");
		assertEquals(3696, column4.getVarcharTypeLength());

		Column column5 = new Column("col1", "LARGE BINARY(1)");
		assertEquals(1, column5.getVarcharTypeLength());

		Column column6 = new Column("col1", "LARGE BINARY(1M)");
		assertEquals(0, column6.getVarcharTypeLength());

		Column column7 = new Column("col1", "CHAR");
		assertEquals(0, column7.getVarcharTypeLength());

	}

}
