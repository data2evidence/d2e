package com.legacy.health.fhir.content;

import com.legacy.health.fhir.content.model.Scenario;
import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.queryengine.InstanceAuthorizationHook;

public class ScenarioContext implements Context {

	Scenario scenario;
	InstanceAuthorizationHook authorizationHook;

	public Scenario getScenario() {
		return scenario;
	}

	public void setScenario(Scenario scenario) {
		this.scenario = scenario;
	}

	public void setInstanceAuthorizationHook(InstanceAuthorizationHook hook) {
		this.authorizationHook = hook;
	}

	public InstanceAuthorizationHook getAuthorizationHook() {
		return this.authorizationHook;
	}

}
