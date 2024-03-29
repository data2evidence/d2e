package com.legacy.health.fhir.meta.utils;

import static org.junit.Assert.assertTrue;

import java.io.IOException;
import org.junit.Before;
import org.junit.Test;

public class TestPatientIsStandardResourceType {

	@Before
	public void setUp() {
	}

	@Test
	public void test() {
		try {
			boolean flag = Utility.isStandardResourceType("Patient");
			assertTrue("Check Patient Resource Exists", flag);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			assertTrue(false);
		}
	}

}
