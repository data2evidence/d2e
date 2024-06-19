DO $$
DECLARE
    project uuid;
    practitioner uuid;
BEGIN
    SELECT "projectId" INTO project from public."Project" where name = 'Super Admin';
    SELECT id INTO practitioner from public."Practitioner" where "projectId" = project;

    -- client application
    INSERT INTO public."ClientApplication" (id, content, "lastUpdated", compartments, name, "projectId")
	VALUES ( 'db6b2304-f236-45ec-b10c-a852681e7129', format('{"meta":{"project":"%s","versionId":"7ef81144-11f4-40ef-a017-da8885a0d36e","lastUpdated":"2024-06-13T06:40:48.738Z","author":{"reference":"Practitioner/%s","display":"Medplum Admin"},"compartment":[{"reference":"Project/%s"}]},"resourceType":"ClientApplication","name":"d2eClient","secret":"d64bff124d11f1e2a852b1076bacd081fefffa82e2db2711509b88a3397c2f3d","description":"d2eClient","id":"db6b2304-f236-45ec-b10c-a852681e7129"}',project, practitioner, project), '2024-06-13 14:40:48.738 +0800', array[project], 'd2eClient', project);

    -- client application history
    INSERT INTO public."ClientApplication_History" ("versionId", id, content, "lastUpdated")
    VALUES ('7ef81144-11f4-40ef-a017-da8885a0d36e' ,'db6b2304-f236-45ec-b10c-a852681e7129', format('{"meta":{"project":"%s","versionId":"7ef81144-11f4-40ef-a017-da8885a0d36e","lastUpdated":"2024-06-13T06:40:48.738Z","author":{"reference":"Practitioner/%s","display":"Medplum Admin"},"compartment":[{"reference":"Project/%s"}]},"resourceType":"ClientApplication","name":"d2eClient","secret":"d64bff124d11f1e2a852b1076bacd081fefffa82e2db2711509b88a3397c2f3d","description":"d2eClient","id":"db6b2304-f236-45ec-b10c-a852681e7129"}',project, practitioner, project) , '2024-06-13 14:40:48.738 +0800');

    -- client application project membership
    INSERT INTO public."ProjectMembership" (id, content, "lastUpdated", compartments, project, "user", profile, "profileType", "projectId")
    VALUES ('c5e1a35d-c979-428f-81db-9e3502c3ffa3', format('{"meta":{"project":"%s","versionId":"6e4864a8-b1df-417c-8aa9-35a4cb660e07","lastUpdated":"2024-06-13T06:40:48.762Z","author":{"reference":"system"},"compartment":[{"reference":"Project/%s"}]},"resourceType":"ProjectMembership","project":{"reference":"Project/%s"},"user":{"reference":"ClientApplication/db6b2304-f236-45ec-b10c-a852681e7129","display":"d2eClient"},"profile":{"reference":"ClientApplication/db6b2304-f236-45ec-b10c-a852681e7129","display":"d2eClient"},"id":"c5e1a35d-c979-428f-81db-9e3502c3ffa3"}',project, project, project), '2024-06-13 14:40:48.762 +0800', array[project], format('Project/%s', project), 'ClientApplication/db6b2304-f236-45ec-b10c-a852681e7129', 'ClientApplication/db6b2304-f236-45ec-b10c-a852681e7129','ClientApplication', project);

    -- client application project membership history
    INSERT INTO public."ProjectMembership_History" ("versionId", id, content,"lastUpdated")
    VALUES ('6e4864a8-b1df-417c-8aa9-35a4cb660e06', 'c5e1a35d-c979-428f-81db-9e3502c3ffa3',format('{"meta":{"project":"%s","versionId":"6e4864a8-b1df-417c-8aa9-35a4cb660e07","lastUpdated":"2024-06-13T06:40:48.762Z","author":{"reference":"system"},"compartment":[{"reference":"Project/%s"}]},"resourceType":"ProjectMembership","project":{"reference":"Project/%s"},"user":{"reference":"ClientApplication/db6b2304-f236-45ec-b10c-a852681e7129","display":"d2eClient"},"profile":{"reference":"ClientApplication/db6b2304-f236-45ec-b10c-a852681e7129","display":"d2eClient"},"id":"c5e1a35d-c979-428f-81db-9e3502c3ffa3"}', project, project, project),'2024-06-13 14:40:48.762 +0800');

END $$;
