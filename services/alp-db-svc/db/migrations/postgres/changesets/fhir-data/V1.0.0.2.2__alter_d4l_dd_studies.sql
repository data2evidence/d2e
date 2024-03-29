ALTER TABLE d4l_dd_studies ALTER COLUMN "processed" DROP DEFAULT;
ALTER TABLE d4l_dd_studies ALTER COLUMN "processed" TYPE INT USING CASE WHEN TRUE THEN 2 ELSE 0 END;
ALTER TABLE d4l_dd_studies ALTER COLUMN "processed" SET DEFAULT 0;

ALTER TABLE d4l_dd_studies ADD COLUMN "processingStatus" text;
ALTER TABLE d4l_dd_studies ADD COLUMN "processingStartedAt" timestamp with time zone;