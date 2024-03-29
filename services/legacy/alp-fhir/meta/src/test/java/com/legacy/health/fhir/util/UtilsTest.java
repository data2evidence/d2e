package com.legacy.health.fhir.util;

import static org.junit.Assert.*;

import java.sql.Timestamp;

import org.junit.Before;
import org.junit.Test;

public class UtilsTest {

	@Before
	public void setUp() {
	}

	@Test
	public void test() {
		assertNotNull(Utils.convert2Target("1977-12-12"));
		assertNotNull(Utils.convert2Target("1977"));
		Timestamp ts = Timestamp.from(Utils.convert2Target("1977-12-12"));
		System.out.println(ts);
	}

}
