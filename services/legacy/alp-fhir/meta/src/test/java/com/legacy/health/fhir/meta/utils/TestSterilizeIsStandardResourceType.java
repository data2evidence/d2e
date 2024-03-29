package com.legacy.health.fhir.meta.utils;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.io.IOException;

import org.junit.Before;
import org.junit.Test;

public class TestSterilizeIsStandardResourceType {
	@Before
	public void setUp() {
	}

	@Test
	public void test() {
		try {
			boolean flag = Utility.isStandardResourceType("Sterilize");
			assertFalse("Check Sterilize Resource Is Standard FHIR Resource", flag);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			assertTrue(false);
		}
	}
}
