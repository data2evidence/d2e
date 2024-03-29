-----------------------------------------------------------------------------------------
-- NOTES: PERFORMED IN PRODUCTION ON 16 JULY 2021 @ 10:30AM
-- DETECTED 17 RECORDS IN PRODUCTION ERROR TABLE HAVING SINGLE QUOTE CHARACTER, ’
-----------------------------------------------------------------------------------------

-- 1) DATA PATCHING FOR SINGLE QUOTE, ’ --
UPDATE fhir_data.d4l_dd_with_error SET text = REPLACE(text, '', '’' )
WHERE error_reason = 'Malformed json object detected by study data donation api'
AND text like ('%youre%');

UPDATE fhir_data.d4l_dd_with_error SET text = REPLACE(text, '', '’' )
WHERE error_reason = 'Malformed json object detected by study data donation api'
AND text like ('%youve%');

UPDATE fhir_data.d4l_dd_with_error SET text = REPLACE(text, '', '’' )
WHERE error_reason = 'Malformed json object detected by study data donation api'
AND text like ('%Doctors%');


-- 2) MOVE TO DECRYPTION TABLE --
INSERT INTO fhir_data.d4l_dd_with_decryption (text, alp_id, created_at, record_id, encrypted_text, http_context_identifier, http_multipart_fragments_sequence_number, http_multipart_fragments_total_number)
SELECT text, alp_id, created_at, record_id, encrypted_text, http_context_identifier, http_multipart_fragments_sequence_number, http_multipart_fragments_total_number FROM fhir_data.d4l_dd_with_error
WHERE error_reason = 'Malformed json object detected by study data donation api';


-- 3) REMOVE FROM ERROR TABLE --
DELETE FROM fhir_data.d4l_dd_with_error
WHERE error_reason = 'Malformed json object detected by study data donation api';


-- 4) CHECKPOINT ON DECRYPTION TABLE --
SELECT * FROM fhir_data.d4l_dd_with_decryption;
