SELECT 
  table_name  AS "SERIES_NAME",
  stratum_1   AS "X_CALENDAR_MONTH",
  count_value AS "Y_RECORD_COUNT" 
FROM 
  (
    SELECT 
      'Visit occurrence' AS table_name,
      stratum_1,
      count_value 
    FROM @results_database_schema.achilles_results WHERE analysis_id = 220 
    UNION ALL 
    SELECT 
      'Condition occurrence' AS table_name,
      stratum_1,
      count_value 
    FROM @results_database_schema.achilles_results WHERE analysis_id = 420 
    UNION ALL 
    SELECT 
      'Death' AS table_name,
      stratum_1,
      count_value 
    FROM @results_database_schema.achilles_results WHERE analysis_id = 502 
    UNION ALL 
    SELECT 
      'Procedure occurrence' AS table_name,
      stratum_1,
      count_value 
    FROM @results_database_schema.achilles_results WHERE analysis_id = 620 
    UNION ALL 
    SELECT 
      'Drug exposure' AS table_name,
      stratum_1,
      count_value 
    FROM @results_database_schema.achilles_results WHERE analysis_id = 720 
    UNION ALL 
    SELECT 
      'Observation' AS table_name,
      stratum_1,
      count_value 
    FROM @results_database_schema.achilles_results WHERE analysis_id = 820 
    UNION ALL 
    SELECT 
      'Drug era' AS table_name,
      stratum_1,
      count_value 
    FROM @results_database_schema.achilles_results WHERE analysis_id = 920 
    UNION ALL 
    SELECT 
      'Condition era' AS table_name,
      stratum_1,
      count_value 
    FROM @results_database_schema.achilles_results WHERE analysis_id = 1020 
    UNION ALL 
    SELECT 
      'Observation period' AS table_name,
      stratum_1,
      count_value 
    FROM @results_database_schema.achilles_results WHERE analysis_id = 111 
    UNION ALL 
    SELECT 
      'Measurement' AS table_name,
      stratum_1,
      count_value 
    FROM @results_database_schema.achilles_results WHERE analysis_id = 1820 
  ) t1 
ORDER BY "SERIES_NAME", CAST(stratum_1 AS INT)