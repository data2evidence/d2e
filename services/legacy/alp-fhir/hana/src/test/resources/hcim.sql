DROP SCHEMA HCIM CASCADE;
CREATE SCHEMA HCIM;

CREATE COLUMN TABLE HCIM.HCIM_PATIENT (
  "identification_number" NVARCHAR(64),
  "information_source_patient" NVARCHAR(64),
  "information_source_professional" NVARCHAR(64),
  "information_source_contact_person" NVARCHAR(64),
  "author_patient" NVARCHAR(64),
  "author_professional" NVARCHAR(64),
  "author_contact_person" NVARCHAR(64),
  "subject" NVARCHAR(64),
  "datetime" TIMESTAMP,
  "dateOfBirth" TIMESTAMP,
  "gender" NVARCHAR(100),
  "multipleBirthIndicator" BOOLEAN,
  "dateOfDeath" TIMESTAMP,
  "deathIndicator" BOOLEAN
);

CREATE COLUMN TABLE HCIM.HCIM_PATIENT_IDENTIFICATION(
  "identification_number" NVARCHAR(64),
  "PatientIdentification" NVARCHAR(100),
  "System" NVARCHAR(255) --usually http://fhir.nl/fhir/NamingSystem/bsn
 
);

CREATE COLUMN TABLE HCIM.HCIM_PATIENT_NAME_INFORMATION(
  "identification_number" NVARCHAR(64),
  "FirstNames" NVARCHAR(100),
  "Initials" NVARCHAR(100),
  "GivenName" NVARCHAR(100),
  "NameUsage" NVARCHAR(100),
  "LastName_Prefix" NVARCHAR(100),
  "LastName_LastName" NVARCHAR(100),
  "LastNamePartner_Prefix" NVARCHAR(100),
  "LastNamePartner_LastName" NVARCHAR(100)
);

delete from HCIM.HCIM_PATIENT_NAME_INFORMATION;
insert into HCIM.HCIM_PATIENT_NAME_INFORMATION("identification_number","FirstNames","Initials","GivenName","NameUsage","LastName_Prefix","LastName_LastName")
values('medmij-bgz-patient-01','Thomas','T.',null,'NL4','van','Beek');


CREATE COLUMN TABLE HCIM.HCIM_PATIENT_ADDRESS_INFORMATION (
  "identification_number" NVARCHAR(64),
  "Street" NVARCHAR(100),
  "HouseNumber" NVARCHAR(100),
  "HouseNumberLetter" NVARCHAR(100),
  "HouseNumberAddition" NVARCHAR(100),
  "HouseNumberIndication" NVARCHAR(100),
  "Postcode" NVARCHAR(100),
  "PlaceOfResidence" NVARCHAR(100),
  "Municipality" NVARCHAR(100),
  "Country" NVARCHAR(100),
  "AdditionalInformation" NVARCHAR(100),
  "AddressType" NVARCHAR(100)
);

delete from HCIM.HCIM_PATIENT_ADDRESS_INFORMATION ;
INSERT INTO HCIM.HCIM_PATIENT_ADDRESS_INFORMATION("identification_number","Street","HouseNumber","HouseNumberLetter","Postcode","Municipality","PlaceOfResidence","Country","AddressType")
VALUES('medmij-bgz-patient-01','Straatweg','12','bII','1200AA','Amsterdam','Amsterdam','NLD','HP');
INSERT INTO HCIM.HCIM_PATIENT_ADDRESS_INFORMATION("identification_number","Street","HouseNumber","HouseNumberLetter","Postcode","Municipality","PlaceOfResidence","Country","AddressType")
VALUES('medmij-bgz-patient-01','R1','14','a','68161','Amsterdam','Amsterdam','NLD','HP');


CREATE COLUMN TABLE HCIM.HCIM_BODYWEIGHT (
    "identification_number" NVARCHAR(64),
  "information_source_patient" NVARCHAR(64),
  "information_source_professional" NVARCHAR(64),
  "information_source_contact_person" NVARCHAR(64),
  "author_patient" NVARCHAR(64),
  "author_professional" NVARCHAR(64),
  "author_contact_person" NVARCHAR(64),
  "subject" NVARCHAR(64),
  "datetime" TIMESTAMP,
  "weightValue" Double,
  "weightUnit" NVARCHAR(100),
  "weightDate" TIMESTAMP,
  "clothingConceptName" NVARCHAR(100),
  "clothingConcept" NVARCHAR(100),
  "clothingCodesystemName" NVARCHAR(100),
  "clothingCodesystemOid" NVARCHAR(100),
  "clothingDisplay" NVARCHAR(100)
);

CREATE COLUMN TABLE HCIM.HCIM_BODYHEIGHT (
  "identification_number" NVARCHAR(64),
  "information_source_patient" NVARCHAR(64),
  "information_source_professional" NVARCHAR(64),
  "information_source_contact_person" NVARCHAR(64),
  "author_patient" NVARCHAR(64),
  "author_professional" NVARCHAR(64),
  "author_contact_person" NVARCHAR(64),
  "subject" NVARCHAR(64),
  "datetime" TIMESTAMP,
  "heightValue" Double,
  "heightUnit" NVARCHAR(100),
  "heightDate" TIMESTAMP,
  "comment" NVARCHAR(100), 
  "positionConceptName" NVARCHAR(100),
  "positionConcept" NVARCHAR(100),
  "positionCodesystemName" NVARCHAR(100),
  "positionCodesystemOid" NVARCHAR(100),
  "positionDisplay" NVARCHAR(100)
);

CREATE COLUMN TABLE HCIM.HCIM_BLOODPRESSURE (
  "identification_number" NVARCHAR(64),
  "information_source_patient" NVARCHAR(64),
  "information_source_professional" NVARCHAR(64),
  "information_source_contact_person" NVARCHAR(64),
  "author_patient" NVARCHAR(64),
  "author_professional" NVARCHAR(64),
  "author_contact_person" NVARCHAR(64),
  "subject" NVARCHAR(64),
  "datetime" TIMESTAMP,
  "systolicBloodPressureValue" Double,
  "systolicBloodPressureUnit" NVARCHAR(100),
  "diastolicBloodPressureValue" Double,
  "diastolicBloodPressureUnit" NVARCHAR(100),
  "averageBloodPressureValue" Double,
  "averageBloodPressureUnit" NVARCHAR(100),
  "bloodPressureDate" TIMESTAMP,
  "comment" NVARCHAR(100), 
  "measuringLocationConceptName" NVARCHAR(100),
  "measuringLocationConcept" NVARCHAR(100),
  "measuringLocationCodesystemName" NVARCHAR(100),
  "measuringLocationCodesystemOid" NVARCHAR(100),
  "measuringLocationDisplay" NVARCHAR(100),
  "measuringMethodConceptName" NVARCHAR(100),
  "measuringMethodConcept" NVARCHAR(100),
  "measuringMethodCodesystemName" NVARCHAR(100),
  "measuringMethodCodesystemOid" NVARCHAR(100),
  "measuringMethodDisplay" NVARCHAR(100),
  "cuffTypeConceptName" NVARCHAR(100),
  "cuffTypeConcept" NVARCHAR(100),
  "cuffTypeCodesystemName" NVARCHAR(100),
  "cuffTypeCodesystemOid" NVARCHAR(100),
  "cuffTypeDisplay" NVARCHAR(100),
  "positionConceptName" NVARCHAR(100),
  "positionConcept" NVARCHAR(100),
  "positionCodesystemName" NVARCHAR(100),
  "positionCodesystemOid" NVARCHAR(100),
  "positionDisplay" NVARCHAR(100),
  "diastolicEndpointConceptName" NVARCHAR(100),
  "diastolicEndpointConcept" NVARCHAR(100),
  "diastolicEndpointCodesystemName" NVARCHAR(100),
  "diastolicEndpointCodesystemOid" NVARCHAR(100),
  "diastolicEndpointDisplay" NVARCHAR(100)
);
CREATE VIEW HCIM.HCIM_OBSERVATION_BASE AS 
	select  
		"identification_number",
  		"subject",
  		"datetime",
  		'vital-signs' "category_value",
  		'http://hl7.org/fhir/observation-category' "category_codesystem",
  		'29463-7' "code_value",
  		'http://loinc.org' "code_codesystem"
	from HCIM.HCIM_BODYWEIGHT
	UNION ALL
	select  
		"identification_number",
  		"subject",
  		"datetime",
  		'vital-signs' "category_value",
  		'http://hl7.org/fhir/observation-category' "category_codesystem",
  		'8302-2' "code_value",
  		'http://loinc.org' "code_codesystem"
	from HCIM.HCIM_BODYHEIGHT
	UNION ALL 
	select  
		"identification_number",
  		"subject",
  		"datetime",
  		'vital-signs' "category_value",
  		'http://hl7.org/fhir/observation-category' "category_codesystem",
  		'85354-9' "code_value",
  		'http://loinc.org' "code_codesystem"
	from HCIM.HCIM_BLOODPRESSURE;

CREATE VIEW "HCIM"."BODYHEIGHT_STAGING" AS 
select 
	o1."ID" "identification_number", 
	o1."EFFECTIVEDATETIME" "datetime",
	or1."REFERENCE" "subject",
	oq1."VALUE" "heightValue",
	oq1."UNIT" "heightUnit",
	o1."EFFECTIVEDATETIME" "heightDate",
	o1."COMMENT" "comment",
	pos1."CODE" "positionConcept",
	pos1."SYSTEM" "positionCodesystemName",
	pos1."DISPLAY" "positionDisplay"
FROM "BGZ"."OBSERVATION" o1
JOIN "BGZ"."OBSERVATION_CODING" oc1 on o1."ID" = oc1."PARENT_ID"
JOIN "BGZ"."OBSERVATION_CODING" pos1 on o1."ID" = pos1."PARENT_ID"
JOIN "BGZ"."FHIR_REFERENCE_TABLE" or1 on o1."ID" = or1."PARENT_ID"
JOIN "BGZ"."OBSERVATION_QUANTITY" oq1 on o1."ID" = oq1."PARENT_ID"
where oc1."CODE"='8302-2' 
and or1."DATAELEMENT_ID" = 'Observation.subject'
and oq1."DATAELEMENT_ID" = 'Observation.valueQuantity'
and pos1."CODE" IN('8306-3','8308-9')
;

INSERT INTO "HCIM"."HCIM_BODYHEIGHT" ("identification_number","datetime","subject","heightValue","heightUnit","heightDate","comment","positionConcept","positionCodesystemName","positionDisplay") 
select "identification_number","datetime","subject","heightValue","heightUnit","heightDate","comment","positionConcept","positionCodesystemName","positionDisplay" FROM "HCIM"."BODYHEIGHT_STAGING";

CREATE VIEW "HCIM"."PATIENT_STAGING" AS 
select
 p1."ID" "identification_number",
 p1."BIRTHDATE" "dateOfBirth",
 p1."MULTIPLEBIRTHBOOLEAN" "multipleBirthIndicator",
 (CASE   WHEN p1."GENDER" = 'female'  THEN 'F' 
         WHEN p1."GENDER" = 'male'  THEN 'M' 
  END) "gender"
from "BGZ"."PATIENT" p1;

INSERT INTO "HCIM"."HCIM_PATIENT" ("identification_number","dateOfBirth","multipleBirthIndicator","gender")
select "identification_number","dateOfBirth","multipleBirthIndicator","gender" from "HCIM"."PATIENT_STAGING";

CREATE VIEW "HCIM"."PATIENT_IDENTIFIER_STAGING" AS
select
 p1."PARENT_ID" "identification_number",
 p1."VALUE" "PatientIdentification",
 p1."SYSTEM" "System"
from  "BGZ"."PATIENT_IDENTIFIER" p1
where p1."DATAELEMENT_ID" = 'Patient.identifier';

INSERT INTO "HCIM"."HCIM_PATIENT_IDENTIFICATION" ("identification_number","PatientIdentification","System")
select "identification_number","PatientIdentification","System" from "HCIM"."PATIENT_IDENTIFIER_STAGING";

select * from "HCIM"."HCIM_OBSERVATION_BASE";

SELECT  "t1"."identification_number"   
FROM  "HCIM"."HCIM_OBSERVATION_BASE" "t1"   
JOIN  "HCIM"."HCIM_PATIENT" "t2"  ON ( "t1"."subject"  =  "t2"."identification_number" )  
JOIN  "HCIM"."HCIM_PATIENT_IDENTIFICATION" "t0"  ON ( "t2"."identification_number"  =  "t0"."identification_number" ) 
WHERE (( "t0"."PatientIdentification"  = '999911338')  
AND  (( "t1"."code_value"  = '8302-2') and ( "t1"."code_codesystem"  = 'http://loinc.org')))
