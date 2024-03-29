----------------------------------------------------------------------------------------------
-- NOTES: PERFORMED IN PRODUCTION ON 16 JULY 2021 @ 10:30AM
-- DETECTED 16 RECORDS IN PRODUCTION DECRYPTION TABLE HAVING SPECIAL CHARACTER, Ä Ö Ü ß ä ö ü
----------------------------------------------------------------------------------------------

-- 1) DATA PATCHING FOR ECOV SPECIAL CHAR, Ä Ö Ü ß ä ö ü --
UPDATE fhir_data.d4l_dd_with_decryption SET text = REPLACE(text, 'Wie gro� sind Sie (cm)?', 'Wie groß sind Sie (cm)?')
WHERE text LIKE ('%http://fhir.data4life.care/stu3/ECOV/Questionnaire/personal_info%')
AND text LIKE ('%�%');

UPDATE fhir_data.d4l_dd_with_decryption SET text = REPLACE(text, 'Was ist Ihr K�rpergewicht (kg)?', 'Was ist Ihr Körpergewicht (kg)?')
WHERE text LIKE ('%http://fhir.data4life.care/stu3/ECOV/Questionnaire/personal_info%')
AND text LIKE ('%�%');

UPDATE fhir_data.d4l_dd_with_decryption SET text = REPLACE(text, 'Wie viele Kinder (j�nger als 15 Jahre) leben in Ihrem Haushalt?', 'Wie viele Kinder (jünger als 15 Jahre) leben in Ihrem Haushalt?')
WHERE text LIKE ('%http://fhir.data4life.care/stu3/ECOV/Questionnaire/personal_info%')
AND text LIKE ('%�%');

UPDATE fhir_data.d4l_dd_with_decryption SET text = REPLACE(text, 'Haben Sie eine Immunschw�che oder nehmen Sie aktuell (oder in den letzten 3 Monaten) Medikamente mit Wirkung auf das Immunsystem ein (zum Beispiel Kortison)?', 'Haben Sie eine Immunschwäche oder nehmen Sie aktuell (oder in den letzten 3 Monaten) Medikamente mit Wirkung auf das Immunsystem ein (zum Beispiel Kortison)?')
WHERE text LIKE ('%http://fhir.data4life.care/stu3/ECOV/Questionnaire/personal_info%')
AND text LIKE ('%�%');

UPDATE fhir_data.d4l_dd_with_decryption SET text = REPLACE(text, 'Sind Sie berufst�tig?', 'Sind Sie berufstätig?')
WHERE text LIKE ('%http://fhir.data4life.care/stu3/ECOV/Questionnaire/personal_info%')
AND text LIKE ('%�%');

UPDATE fhir_data.d4l_dd_with_decryption SET text = REPLACE(text, 'Sind Sie in einem der folgenden medizinischen Bereiche t�tig?', '│Sind Sie in einem der folgenden medizinischen Bereiche tätig?')
WHERE text LIKE ('%http://fhir.data4life.care/stu3/ECOV/Questionnaire/personal_info%')
AND text LIKE ('%�%');

UPDATE fhir_data.d4l_dd_with_decryption SET text = REPLACE(text, 'Werden Sie regelm��ig auf SARS-CoV-2 getestet (z.B. �ber den Arbeitgeber)?', 'Werden Sie regelmäßig auf SARS-CoV-2 getestet (z.B. über den Arbeitgeber)?')
WHERE text LIKE ('%http://fhir.data4life.care/stu3/ECOV/Questionnaire/personal_info%')
AND text LIKE ('%�%');

UPDATE fhir_data.d4l_dd_with_decryption SET text = REPLACE(text, 'Wann wurde der positive Test durchgef�hrt?', 'Wann wurde der positive Test durchgeführt?')
WHERE text LIKE ('%http://fhir.data4life.care/stu3/ECOV/Questionnaire/personal_info%')
AND text LIKE ('%�%');
--


UPDATE fhir_data.d4l_dd_with_decryption SET text = REPLACE(text, 'Hatten Sie Kontakt zu einer Person mit einer best�tigen SARS-CoV-2-Infektion?', 'Hatten Sie Kontakt zu einer Person mit einer bestätigen SARS-CoV-2-Infektion?')
WHERE text LIKE ('%http://fhir.data4life.care/stu3/ECOV/Questionnaire/covid_exposition%')
AND text LIKE ('%�%');

UPDATE fhir_data.d4l_dd_with_decryption SET text = REPLACE(text, 'Zu wie vielen Personen au�erhalb Ihres pers�nlichen Wohnumfelds hatten Sie engen Kontakt (Abstand weniger als 1,5 Meter, jeweils l�nger als 15 Minuten)?', 'Zu wie vielen Personen außerhalb Ihres persönlichen Wohnumfelds hatten Sie engen Kontakt (Abstand weniger als 1,5 Meter, jeweils länger als 15 Minuten)?')
WHERE text LIKE ('%http://fhir.data4life.care/stu3/ECOV/Questionnaire/covid_exposition%')
AND text LIKE ('%�%');

UPDATE fhir_data.d4l_dd_with_decryption SET text = REPLACE(text, 'Wie h�ufig haben Sie �ffentliche Verkehrsmittel benutzt?', 'Wie häufig haben Sie öffentliche Verkehrsmittel benutzt?')
WHERE text LIKE ('%http://fhir.data4life.care/stu3/ECOV/Questionnaire/covid_exposition%')
AND text LIKE ('%�%');

UPDATE fhir_data.d4l_dd_with_decryption SET text = REPLACE(text, 'Wie h�ufig haben Sie Ihren Mund-Nasen-Schutz gewechselt oder gewaschen?', 'Wie häufig haben Sie Ihren Mund-Nasen-Schutz gewechselt oder gewaschen?')
WHERE text LIKE ('%http://fhir.data4life.care/stu3/ECOV/Questionnaire/covid_exposition%')
AND text LIKE ('%�%');
--


UPDATE fhir_data.d4l_dd_with_decryption SET text = REPLACE(text, 'Hatten Sie, Ihr Kind oder eine andere Person aus dem Haushalt Kontakt zu einer Person mit best�tigter SARS-CoV-2-Infektion?', 'Hatten Sie, Ihr Kind oder eine andere Person aus dem Haushalt Kontakt zu einer Person mit bestätigter SARS-CoV-2-Infektion?')
WHERE text LIKE ('%http://fhir.data4life.care/stu3/ECOV/Questionnaire/corona_testing_and_symptoms%')
AND text LIKE ('%�%');


-- 2) CHECKPOINT ON DECRYPTION TABLE --
SELECT * FROM fhir_data.d4l_dd_with_decryption
WHERE text LIKE ('%�%');

SELECT * FROM fhir_data.d4l_dd_with_decryption;
