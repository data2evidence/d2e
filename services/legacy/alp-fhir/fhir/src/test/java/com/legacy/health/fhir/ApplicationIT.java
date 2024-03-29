package com.legacy.health.fhir;

import static org.junit.Assert.assertTrue;

import org.junit.Test;

public class ApplicationIT {

	@Test
	public void containerComesUp() throws Exception {
		String[] args = new String[] {
				"--server.port=0" // this sets a random port..
		};
		// Start the Spring Container itself..
		Application.main(args);
		assertTrue("If this Code gets reached, the test was succesful and the application came up..", true);
	}

}
