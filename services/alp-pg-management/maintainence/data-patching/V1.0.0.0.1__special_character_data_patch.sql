----------------------------------------------------------------------------------------------
-- NOTES: PERFORMED IN PRODUCTION ON 2 JUNE 2021 @ 5:00PM
-- DETECTED 42 RECORDS IN PRODUCTION DECRYPTION TABLE HAVING SPECIAL CHARACTER, Ä Ö Ü ß ä ö ü
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



-- 2) DATA PATCHING FOR CRONOS SPECIAL CHAR, Ä Ö Ü ß ä ö ü --
UPDATE fhir_data.d4l_dd_with_decryption SET text = REPLACE(text, 'Ich denke, dass meine Ansteckung mit dem Coronavirus keine negativen Folgen f�r die Geburt hat.', 'Ich denke, dass meine Ansteckung mit dem Coronavirus keine negativen Folgen für die Geburt hat.')
WHERE text LIKE ('%http://fhir.data4life.care/stu3/CRONOS/Questionnaire/Q2a_coronoa_effects_pregnancy%')
AND text LIKE ('%�%');

UPDATE fhir_data.d4l_dd_with_decryption SET text = REPLACE(text, 'Ich denke, dass meine Ansteckung mit dem Coronavirus keine negativen Folgen f�r mein ungeborenes Kind hat.', 'Ich denke, dass meine Ansteckung mit dem Coronavirus keine negativen Folgen für mein ungeborenes Kind hat.')
WHERE text LIKE ('%http://fhir.data4life.care/stu3/CRONOS/Questionnaire/Q2a_coronoa_effects_pregnancy%')
AND text LIKE ('%�%');

UPDATE fhir_data.d4l_dd_with_decryption SET text = REPLACE(text, 'Ich denke, dass sich mein Baby w�hrend der Geburt nicht mit dem Coronavirus infizieren wird.', 'Ich denke, dass sich mein Baby während der Geburt nicht mit dem Coronavirus infizieren wird.')
WHERE text LIKE ('%http://fhir.data4life.care/stu3/CRONOS/Questionnaire/Q2a_coronoa_effects_pregnancy%')
AND text LIKE ('%�%');

UPDATE fhir_data.d4l_dd_with_decryption SET text = REPLACE(text, 'Meine Gesundheit ist durch die Infektion mit dem Coronavirus beeintr�chtigt.', 'Meine Gesundheit ist durch die Infektion mit dem Coronavirus beeinträchtigt.')
WHERE text LIKE ('%http://fhir.data4life.care/stu3/CRONOS/Questionnaire/Q2a_coronoa_effects_pregnancy%')
AND text LIKE ('%�%');

UPDATE fhir_data.d4l_dd_with_decryption SET text = REPLACE(text, 'Als ich von meiner Infektion mit dem Coronavirus erfuhr, hatte ich gro�e Angst um meine Gesundheit.', 'Als ich von meiner Infektion mit dem Coronavirus erfuhr, hatte ich große Angst um meine Gesundheit.')
WHERE text LIKE ('%http://fhir.data4life.care/stu3/CRONOS/Questionnaire/Q2a_coronoa_effects_pregnancy%')
AND text LIKE ('%�%');

UPDATE fhir_data.d4l_dd_with_decryption SET text = REPLACE(text, 'Als ich von meiner Infektion mit dem Coronavirus erfuhr, hatte ich gro�e Angst um die Gesundheit meines ungeborenen Kindes.', 'Als ich von meiner Infektion mit dem Coronavirus erfuhr, hatte ich große Angst um die Gesundheit meines ungeborenen Kindes.')
WHERE text LIKE ('%http://fhir.data4life.care/stu3/CRONOS/Questionnaire/Q2a_coronoa_effects_pregnancy%')
AND text LIKE ('%�%');

UPDATE fhir_data.d4l_dd_with_decryption SET text = REPLACE(text, 'Die COVID-19-Pandemie beeintr�chtigt (unabh�ngig von meiner eigenen Infektion) meine Schwangerschafts-Vorsorgeuntersuchungen.', 'Die COVID-19-Pandemie beeinträchtigt (unabhängig von meiner eigenen Infektion) meine Schwangerschafts-Vorsorgeuntersuchungen.')
WHERE text LIKE ('%http://fhir.data4life.care/stu3/CRONOS/Questionnaire/Q2a_coronoa_effects_pregnancy%')
AND text LIKE ('%�%');

UPDATE fhir_data.d4l_dd_with_decryption SET text = REPLACE(text, 'Unabh�ngig von meiner eigenen Infektion beeintr�chtigt die COVID-19-Pandemie meine Schwangerschaft.', 'Unabhängig von meiner eigenen Infektion beeinträchtigt die COVID-19-Pandemie meine Schwangerschaft.')
WHERE text LIKE ('%http://fhir.data4life.care/stu3/CRONOS/Questionnaire/Q2a_coronoa_effects_pregnancy%')
AND text LIKE ('%�%');
--


UPDATE fhir_data.d4l_dd_with_decryption SET text = REPLACE(text, 'Es f�llt mir schwer, stressige Situationen durchzustehen.', 'Es fällt mir schwer, stressige Situationen durchzustehen.')
WHERE text LIKE ('%http://fhir.data4life.care/stu3/CRONOS/Questionnaire/Q6_handling_challenges%')
AND text LIKE ('%�%');

UPDATE fhir_data.d4l_dd_with_decryption SET text = REPLACE(text, 'Es f�llt mir schwer zur Normalit�t zur�ckzukehren, wenn etwas Schlimmes passiert ist.', 'Es fällt mir schwer zur Normalität zurückzukehren, wenn etwas Schlimmes passiert ist.')
WHERE text LIKE ('%http://fhir.data4life.care/stu3/CRONOS/Questionnaire/Q6_handling_challenges%')
AND text LIKE ('%�%');

UPDATE fhir_data.d4l_dd_with_decryption SET text = REPLACE(text, 'Normalerweise �berstehe ich schwierige Zeiten ohne gr��ere Probleme.', 'Normalerweise überstehe ich schwierige Zeiten ohne größere Probleme.')
WHERE text LIKE ('%http://fhir.data4life.care/stu3/CRONOS/Questionnaire/Q6_handling_challenges%')
AND text LIKE ('%�%');

UPDATE fhir_data.d4l_dd_with_decryption SET text = REPLACE(text, 'Ich brauche tendenziell lange, um �ber R�ckschl�ge in meinem Leben hinwegzukommen.', 'Ich brauche tendenziell lange, um über Rückschläge in meinem Leben hinwegzukommen.')
WHERE text LIKE ('%http://fhir.data4life.care/stu3/CRONOS/Questionnaire/Q6_handling_challenges%')
AND text LIKE ('%�%');


-- 3) CHECKPOINT ON DECRYPTION TABLE --
SELECT * FROM fhir_data.d4l_dd_with_decryption
WHERE text LIKE ('%�%');

SELECT * FROM fhir_data.d4l_dd_with_decryption;
