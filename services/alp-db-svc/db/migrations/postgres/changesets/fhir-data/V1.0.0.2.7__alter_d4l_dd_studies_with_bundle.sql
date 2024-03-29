ALTER TABLE d4l_dd_studies_with_bundle ALTER COLUMN processed DROP DEFAULT;
ALTER TABLE d4l_dd_studies_with_bundle
ALTER COLUMN processed TYPE bool using case when processed = 0 then false else true end;
ALTER TABLE d4l_dd_studies_with_bundle ALTER COLUMN processed SET DEFAULT FALSE;