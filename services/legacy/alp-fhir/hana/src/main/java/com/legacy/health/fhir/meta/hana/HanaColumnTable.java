package com.legacy.health.fhir.meta.hana;

import com.legacy.health.fhir.meta.sql.Table;

public class HanaColumnTable extends Table {
	public String getPrefix() {
		return "CREATE COLUMN TABLE ";
	}
}
