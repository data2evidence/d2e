export const DASHBOARD = {
  population: "person/population.sql",
  gender: "person/gender.sql",
  cumulativeDuration: "observationperiod/cumulativeduration.sql",
  observedByMonth: "observationperiod/observedbymonth.sql",
  ageAtFirst: "observationperiod/ageatfirst.sql",
};

export const DATA_DENSITY = {
  conceptsPerPerson: "datadensity/conceptsperperson.sql",
  recordsPerPerson: "datadensity/recordsperperson.sql",
  totalRecords: "datadensity/totalrecords.sql",
};

export const PERSON = {
  population: "person/population.sql",
  gender: "person/gender.sql",
  race: "person/race.sql",
  ethnicity: "person/ethnicity.sql",
  yearOfBirthData: "person/yearofbirth_data.sql",
  yearOfBirthStats: "person/yearofbirth_stats.sql",
};

export const VISIT = {
  treemap: "visit/treemap.sql",
};

export const CONDITION = {
  treemap: "condition/treemap.sql",
};

export const CONDITION_ERA = {
  treemap: "conditionera/treemap.sql",
};

export const PROCEDURE = {
  treemap: "procedure/treemap.sql",
};

export const DRUG = {
  treemap: "drug/treemap.sql",
};

export const DRUG_ERA = {
  treemap: "drugera/treemap.sql",
};

export const MEASUREMENT = {
  treemap: "measurement/treemap.sql",
};

export const OBSERVATION = {
  treemap: "observation/treemap.sql",
};

export const OBSERVATION_PERIOD = {
  ageAtFirst: "observationperiod/ageatfirst.sql",
  ageByGender: "observationperiod/agebygender.sql",
  cumulativeDuration: "observationperiod/cumulativeduration.sql",
  observationLengthData: "observationperiod/observationlength_data.sql",
  observationLengthStats: "observationperiod/observationlength_stats.sql",
  observationLengthByAge: "observationperiod/observationlengthbyage.sql",
  observationLengthByGender: "observationperiod/observationlengthbygender.sql",
  observedByMonth: "observationperiod/observedbymonth.sql",
  observedByYearData: "observationperiod/observedbyyear_data.sql",
  observedByYearStats: "observationperiod/observedbyyear_stats.sql",
  periodsPerPerson: "observationperiod/periodsperperson.sql",
};

export const DEATH = {
  ageAtDeath: "death/sqlAgeAtDeath.sql",
  deathByType: "death/sqlDeathByType.sql",
  prevalenceByGenderAgeYear: "death/sqlPrevalenceByGenderAgeYear.sql",
  prevalenceByMonth: "death/sqlPrevalenceByMonth.sql",
};
