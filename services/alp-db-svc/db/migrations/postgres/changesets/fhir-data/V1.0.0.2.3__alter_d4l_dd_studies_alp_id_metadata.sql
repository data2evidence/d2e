ALTER TABLE d4l_dd_studies_alp_id_metadata ADD COLUMN "status" text;
ALTER TABLE d4l_dd_studies_alp_id_metadata ADD COLUMN "updated_at" timestamp with time zone;


--Update newly added status and update_at field values
UPDATE d4l_dd_studies_alp_id_metadata AS alp_metadata
SET status = subQuery.status, updated_at = now()
FROM
(
	SELECT
	alp_id,
	text ::jsonb ->> 'status' AS status
	FROM(
		SELECT
			record_id,
			text,
			created_at,
			alp_id,
			ROW_NUMBER() OVER(PARTITION BY alp_id ORDER BY created_at DESC) AS "rn"
		FROM d4l_dd_studies
		WHERE text!= ''
		AND "text"::jsonb ->> 'resourceType' = 'ResearchSubject'
		AND processed = 2
		GROUP BY alp_id, text, created_at, record_id
		ORDER BY alp_id
		) AS temp WHERE "rn" = 1
) AS subQuery
WHERE alp_metadata.alp_id = subQuery.alp_id