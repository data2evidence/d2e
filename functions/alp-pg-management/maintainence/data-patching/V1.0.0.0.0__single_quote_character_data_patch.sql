-----------------------------------------------------------------------------------------
-- NOTES: PERFORMED IN PRODUCTION ON 1 JUNE 2021 @ 2:30PM
-- DETECTED 52 RECORDS IN PRODUCTION ERROR TABLE HAVING SINGLE QUOTE CHARACTER, ’
-----------------------------------------------------------------------------------------

-- 1) DATA PATCHING FOR SINGLE QUOTE, ’ --
UPDATE fhir_data.d4l_dd_with_error SET text = REPLACE(text, '', '’' )
WHERE error_reason = 'Malformed json object'
AND text like ('%youre%');

UPDATE fhir_data.d4l_dd_with_error SET text = REPLACE(text, '', '’' )
WHERE error_reason = 'Malformed json object'
AND text like ('%Doctors%');


-- 2) MOVE TO DECRYPTION TABLE --
INSERT INTO fhir_data.d4l_dd_with_decryption (text, alp_id, created_at)
SELECT text, alp_id, created_at FROM fhir_data.d4l_dd_with_error
WHERE error_reason = 'Malformed json object';


-- 3) REMOVE FROM ERROR TABLE --
DELETE FROM fhir_data.d4l_dd_with_error
WHERE error_reason = 'Malformed json object';