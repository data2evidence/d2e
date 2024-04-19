create table "hc.hph.ots.internals::Entities.ConceptTerms" (
	"ConceptVocabularyID" varchar(100),
	"ConceptCode" varchar(100),
	"TermContext" varchar(100),
	"TermLanguage" varchar(2),
	"TermText" varchar(5000),
	"TermType" varchar(100),
	"TermIsPreferred" Boolean,
	"Provider" varchar(100),
	"DWAuditID" Integer
);
create view "hc.hph.ots::Views.ConceptTerms" as
select "ConceptVocabularyID",
	"ConceptCode",
	"TermContext",
	"TermLanguage",
	"TermText",
	"TermType",
	"TermIsPreferred"
from "hc.hph.ots.internals::Entities.ConceptTerms";
----------------
create table "hc.hph.cdw.db.models::DWEntities.Patient_Key" (
	"DWID" Binary,
	"DWSource" nvarchar(5) not null,
	"DWAuditID" integer not null,
	"PatientID" nvarchar(100) not null -- Patient_Attr_Assoc     association to Patient_Attr on Patient_Attr_Assoc.DWID = DWID;
	-- Patient_BestRecord_Attr_Assoc     association to Patient_BestRecord_Attr 
	-- on Patient_BestRecord_Attr_Assoc.DWID = DWID;
);
create table "hc.hph.cdw.db.models::DWEntities.Patient_Attr" (
	"DWDateFrom" timestamp,
	"DWID" binary,
	"DWDateTo" timestamp,
	"DWAuditID" Integer not null,
	"ValidFrom" Date,
	-- From date since when the record is semantically valid
	"ValidTo" Date,
	-- To date until when the record is semantically valid
	"FamilyName" nvarchar(100),
	-- Family name (often called 'Surname')    
	"GivenName" nvarchar(100),
	-- Given names (not always 'first'). Includes middle names        
	"title" nvarchar(1000),
	-- Title.OriginalValue      nvarchar(100), -- Administrative title (also called 'form of address')
	-- Title.Code      nvarchar(100), -- Administrative title (also called 'form of address')
	-- Title.CodeSystem      nvarchar(100), -- Administrative title (also called 'form of address')
	-- Title.CodeSystemVersion      nvarchar(100), -- Administrative title (also called 'form of address')
	"Gender.OriginalValue" nvarchar(100),
	-- Administrative gender
	"BirthDate" seconddate,
	-- The date and time of birth for the individual
	"MultipleBirthOrder" tinyint,
	-- Indicates whether the patient is part of a multiple or indicates the actual birth order
	"DeceasedDate" seconddate,
	-- The date and time of death for the individual
	"MaritalStatus" nvarchar(1000),
	-- Patient's most recent marital (civil) status       
	"Nationality" nvarchar(1000),
	-- Nationality of the patient        
	"Address" nvarchar(1000),
	-- TODO    
	"Telecom" nvarchar(1000),
	-- Technology-mediated contact details
	"OrgID" nvarchar(100) --OrgID that is linked to Config.
	-- Audit_Assoc      association to DI.AuditLog on Audit_Assoc.AuditLogID = DWAuditID,
) with associations(
	Join "hc.hph.cdw.db.models::DWEntities.Patient_Key" as "Patient_Key_Assoc" on "Patient_Key_Assoc"."DWID" = "DWID"
);
create table "hc.hph.cdw.db.models::DWEntities.Condition_Key" (
	"DWID" binary,
	-- key DWPartition: String(10);
	"DWSource" nvarchar(5) not null,
	"DWAuditID" Integer not null,
	"ConditionID" varchar(100) not null
) with associations (
	-- Audit_Assoc: association to DI.AuditLog on Audit_Assoc.AuditLogID = DWAuditID;
	Join "hc.hph.cdw.db.models::DWEntities.Condition_Attr" as "Condition_Attr_Assoc" on "Condition_Attr_Assoc"."DWID" = "DWID"
);
create table "hc.hph.cdw.db.models::DWEntities.Condition_Attr" (
	"DWDateFrom" timestamp,
	"DWID" binary,
	"DWDateTo" timestamp,
	"DWAuditID" Integer not null,
	"ConditionType" varchar(100),
	"Description" varchar(5000) --   Extend : ExtFP00."Condition";
) with associations (
	Join "hc.hph.cdw.db.models::DWEntities.Condition_Key" as "Condition_Key_Assoc" on "Condition_Key_Assoc"."DWID" = "DWID" --Audit_Assoc : association to DI.AuditLog on Audit_Assoc.AuditLogID = DWAuditID;
);
create table "hc.hph.cdw.db.models::DWEntities.Interactions_Attr" (
	"DWDateFrom" timestamp,
	"DWID" binary,
	"DWDateTo" timestamp,
	"DWAuditID" Integer not null,
	"DWID_Patient" binary,
	"DWID_ParentInteraction" binary,
	"DWID_Condition" binary,
	"InteractionType" varchar(100),
	"InteractionStatus" varchar(100),
	-- Current state of the interaction
	"PeriodStart" timestamp,
	-- Starting time with inclusive boundary
	"PeriodEnd" timestamp,
	-- End time with inclusive boundary, if not ongoing
	"PeriodTimezone" nvarchar(64),
	-- Timezone defining the local time of the period start and end time
	"OrgID" varchar(100) -- Organization that is the custodian of the record
) with associations (
	Join "hc.hph.cdw.db.models::DWEntities.Interactions_Key" as "Interactions_Key_Assoc" on "Interactions_Key_Assoc"."DWID" = "DWID",
	Join "hc.hph.cdw.db.models::DWEntities.Interactions_Key" as "ParentInteractions_Key_Assoc" on "ParentInteractions_Key_Assoc"."DWID" = "DWID_ParentInteraction",
	Join "hc.hph.cdw.db.models::DWEntities.Patient_Key" as "Patient_Key_Assoc" on "Patient_Key_Assoc"."DWID" = "DWID_Patient",
	Join "hc.hph.cdw.db.models::DWEntities.Condition_Key" as "Condition_Key_Assoc" on "Condition_Key_Assoc"."DWID" = "DWID_Condition"
);
create table "hc.hph.cdw.db.models::DWEntities.Interactions_Key" (
	"DWID" binary,
	"DWSource" nvarchar(5) not null,
	"DWAuditID" Integer not null,
	"InteractionID" varchar(100) not null
) with associations (
	--Audit_Assoc: association to DI.AuditLog on Audit_Assoc.AuditLogID = DWAuditID;
	Join "hc.hph.cdw.db.models::DWEntities.Interactions_Attr" as "Int_Atr_Ass" on "Int_Atr_Ass"."DWID" = "DWID"
);
create table "hc.hph.cdw.db.models::DWEntitiesEAV.Interaction_Details" (
	"DWDateFrom" timestamp,
	"DWID" binary,
	"DWAuditID" Integer not null,
	"DWDateTo" timestamp,
	"Attribute.OriginalValue" varchar(100),
	"Value.OriginalValue" varchar(5000),
	"ValueVocabularyID" varchar(100)
) with associations (
	--Audit_Assoc: association to DI.AuditLog on Audit_Assoc.AuditLogID = DWAuditID;
	Join "hc.hph.cdw.db.models::DWEntities.Interactions_Key" as "Interactions_Key_Assoc" on "Interactions_Key_Assoc"."DWID" = "DWID"
);
------------------
create type "hc.hph.genomics.db.models::General.SampleList" as table ("SampleIndex" integer);
create type "hc.hph.genomics.db.models::General.SampleNames" as table (
	"SampleIndex" integer,
	"SampleName" varchar(255)
);
create table "hc.hph.genomics.db.models::General.Sequences" ("SequenceID" varchar(255), "Value" integer);
create table "hc.hph.genomics.db.models::General.Patients" (
	"PatientIndex" Integer,
	"DWID" Binary,
	"DWSource" varchar(5),
	"DWAuditID" Integer,
	"FamilyName" varchar(100),
	"GivenName" varchar(100),
	"Gender" varchar(10),
	-- TODO       maybe a Array is preferred
	"BirthDate" datetime,
	"Nationality" varchar(100),
	"Address" varchar(1000) -- TODO       may be a Array is preferred?
);
create table "hc.hph.genomics.db.models::General.Samples" (
	"SampleIndex" integer,
	"DWAuditID" Integer,
	"DWSource" varchar(5),
	"ReferenceID" varchar(255),
	"SampleID" varchar(255) null,
	"SampleClass" varchar(255) null,
	"PatientDWID" Binary,
	"InteractionDWID" Binary,
	"AnalysisDate" Timestamp null,
	"OrgID" varchar(100) null,
	"Phenotype" varchar(5000),
	"Sex" varchar(10),
	"FamilyID" varchar(255)
) with associations (
	join "hc.hph.cdw.db.models::DWEntities.Patient_Key" as "PatientKey" on "PatientKey"."DWID" = "PatientDWID",
	join "hc.hph.cdw.db.models::DWEntities.Patient_Attr" as "PatientAttr" on "PatientAttr"."DWID" = "PatientDWID",
	join "hc.hph.cdw.db.models::DWEntities.Interactions_Key" as "InteractionKey" on "InteractionKey"."DWID" = "InteractionDWID",
	join "hc.hph.cdw.db.models::DWEntities.Interactions_Attr" as "interactionAttr" on "interactionAttr"."DWID" = "InteractionDWID"
);
create table "hc.hph.genomics.db.models::General.Pedigree" (
	"DWAuditID" Integer,
	"SourceSampleIndex" integer,
	"TargetSampleIndex" integer,
	"Relationship" varchar(5000)
);
create type "hc.hph.genomics.db.models::General.PedigreeSamples" as table (
	"SampleIndex" integer,
	"FamilyName" varchar(100),
	"GivenName" varchar(100),
	"BirthDate" Timestamp,
	"PatientDWID" varchar(64),
	"Gender" varchar(100),
	"AnalysisDate" Timestamp,
	"SampleClass" varchar(100),
	"InteractionDWID" varchar(64),
	"DWSource" varchar(5),
	"InteractionID" varchar(100)
);
create type "hc.hph.genomics.db.models::General.PedigreeAlleles" as table (
	"SampleIndex" integer,
	"DWAuditID" Integer,
	"AlleleIndex" integer,
	"Allele" varchar(255),
	"AlleleCount" integer
);
create type "hc.hph.genomics.db.models::General.SampleDetails" as table (
	"FamilyName" varchar(100),
	"GivenName" varchar(100),
	"BirthDate" Timestamp,
	"PatientDWID" varchar(64),
	"Gender" varchar(100),
	"AnalysisDate" Timestamp,
	"SampleClass" varchar(100),
	"InteractionDWID" varchar(64),
	"SampleIndex" integer,
	"DWAuditID" Integer,
	"DWSource" varchar(5),
	"InteractionID" varchar(100),
	"AlleleIndex" integer,
	"Allele" varchar(255),
	"AlleleCount" integer
);
create table "hc.hph.genomics.db.models::General.SessionSampleGroups" (
	"SampleGroup" varchar(255),
	"SampleIndex" integer
);
-------------------
create table "hc.hph.genomics.db.models::Reference.Chromosomes" (
	"DWAuditID" Integer,
	"ReferenceID" varchar(255),
	"ChromosomeIndex" integer,
	"chromosomename" varchar(255),
	"Size" integer,
	"Topology" varchar(8) default 'linear',
	"Visible" tinyint default 1,
	"MD5Hash" binary(16) null,
	"Description" varchar(5000) null
);
create table "hc.hph.genomics.db.models::Reference.Sequences" (
	"ReferenceID" varchar(255),
	"ChromosomeIndex" integer,
	"beginregion" integer,
	-- TODO
	"endregion" integer,
	-- TODO
	"Sequence" varchar(1024) null
) WITH associations (
	JOIN "hc.hph.genomics.db.models::Reference.Chromosomes" AS "chromosome" on "ReferenceID" = "chromosome"."ReferenceID"
	and "ChromosomeIndex" = "chromosome"."ChromosomeIndex"
);
create table "hc.hph.genomics.db.models::Reference.Features" (
	"DWAuditID" Integer,
	"ReferenceID" varchar(255),
	"ChromosomeIndex" integer,
	"beginregion" integer,
	-- TODO
	"endregion" integer,
	-- TODO
	"FeatureID" varchar(255) null,
	"Class" varchar(255),
	"FeatureName" varchar(1024) null,
	"Strand" varchar(1) null,
	"Frame" integer null,
	"Score" float null,
	"ParentID" varchar(255) null,
	"Description" varchar(5000) null,
	"LongDescription" varchar(5000) null,
	"FileChromosomeName" varchar(255) null,
	"Color" varchar(255) null
) with associations (
	JOIN "hc.hph.genomics.db.models::Reference.Chromosomes" as "chromosome" on "ReferenceID" = "chromosome"."ReferenceID"
	and "ChromosomeIndex" = "chromosome"."ChromosomeIndex"
);
-- @dwannotation.entity.name		'referencefeature'
create table "hc.hph.genomics.db.models::Reference.FeaturesAnnotation" (
	"DWAuditID" Integer,
	"ReferenceID" varchar(255),
	"ChromosomeIndex" integer,
	"beginregion" integer,
	-- TODO
	"endregion" integer,
	-- TODO
	"FeatureID" varchar(255) null,
	"Class" varchar(255),
	"FeatureName" varchar(1024) null,
	"Strand" varchar(1) null,
	"Score" float null,
	"ParentID" varchar(255) null,
	"Description" varchar(5000) null,
	"Sequence" clob null,
	"Rank" integer null,
	"PrePost" varchar(6) null,
	"CDSPosition" integer null,
	"exonrank" integer null,
	"RunAuditID" integer default -1,
	"Transcript" varchar(100) null,
	"GeneName" varchar(100) null
) with associations (
	JOIN "hc.hph.genomics.db.models::Reference.Chromosomes" as "chromosome" on "ReferenceID" = "chromosome"."ReferenceID"
	and "ChromosomeIndex" = "chromosome"."ChromosomeIndex"
);
create table "hc.hph.genomics.db.models::Reference.Codons" (
	"DWAuditID" Integer,
	"ReferenceID" varchar(255),
	"ChromosomeIndex" integer,
	"Codon" varchar(3),
	"AminoAcid" varchar(1),
	"AminoAcidShort" varchar(10)
);
--------------------
create table "hc.hph.genomics.db.models::SNV.Headers" (
	"DWAuditID" Integer,
	"rowindex" integer,
	"keyvalueindex" integer,
	"headerkey" varchar(255),
	"valuekey" varchar(255) null,
	"value" varchar(5000) null
);
create table "hc.hph.genomics.db.models::SNV.Variants" (
	"DWAuditID" Integer,
	"VariantIndex" integer,
	"ChromosomeIndex" integer,
	"Position" integer,
	"VariantID" varchar(255) null,
	"Quality" float null,
	"Filter" tinyint,
	-- todo
	"Attr" varchar(1000) -- generated.variantattributes, -- todo
) with associations (
	join "hc.hph.genomics.db.models::Reference.Features" as "Genes" on "ChromosomeIndex" = "Genes"."ChromosomeIndex"
	and "Position" between "Genes"."beginregion" and ("Genes"."endregion" - 1)
	and "Genes"."Class" = 'gene'
);
create table "hc.hph.genomics.db.models::SNV.VariantIDs" (
	"DWAuditID" Integer,
	"VariantIndex" integer,
	"VariantID" varchar(255)
) with associations (
	join "hc.hph.genomics.db.models::SNV.Variants" as "Variant" on "DWAuditID" = "Variant"."DWAuditID"
	and "VariantIndex" = "Variant"."VariantIndex"
);
create table "hc.hph.genomics.db.models::SNV.VariantMultiValueAttributes" (
	"DWAuditID" Integer,
	"VariantIndex" integer,
	"ValueIndex" integer,
	"Attr" varchar(1000) -- generated.variantmultivalueattributes, -- todo
) with associations (
	join "hc.hph.genomics.db.models::SNV.Variants" as "Variant" on "DWAuditID" = "Variant"."DWAuditID"
	and "VariantIndex" = "Variant"."VariantIndex"
);
create table "hc.hph.genomics.db.models::SNV.VariantStructuredAttributes" (
	"DWAuditID" Integer,
	"VariantIndex" Integer,
	"ValueIndex" Integer,
	"Attr" varchar(1000) -- Generated.VariantStructuredAttributes, -- TODO
) with associations(
	join "hc.hph.genomics.db.models::SNV.Variants" as "Variant" on "DWAuditID" = "Variant"."DWAuditID"
	and "VariantIndex" = "Variant"."VariantIndex"
);
create table "hc.hph.genomics.db.models::SNV.VariantAlleles" (
	"DWAuditID" Integer,
	"VariantIndex" Integer,
	"AlleleIndex" Integer,
	"Allele" varchar(255) null,
	"Attr" varchar(1000) -- Generated.VariantAlleleAttributes, -- TODO
) with associations (
	join "hc.hph.genomics.db.models::SNV.Variants" as "Variant" on "DWAuditID" = "Variant"."DWAuditID"
	and "VariantIndex" = "Variant"."VariantIndex"
);
---------------------
create table "hc.hph.genomics.db.models::SNV.Genotypes" (
	"DWAuditID" Integer,
	"VariantIndex" Integer,
	"SampleIndex" Integer,
	"Phased" TINYINT null,
	"ReferenceAlleleCount" Integer,
	"CopyNumber" Integer,
	"Zygosity" varchar(100),
	"Attr" varchar(1000) -- Generated.GenotypeAttributes,
) with associations (
	join "hc.hph.genomics.db.models::General.Samples" as "Sample" on "SampleIndex" = "Sample"."SampleIndex",
	join "hc.hph.genomics.db.models::SNV.Variants" as "Variant" on "DWAuditID" = "Variant"."DWAuditID"
	and "VariantIndex" = "Variant"."VariantIndex"
);
create table "hc.hph.genomics.db.models::SNV.GenotypeMultiValueAttributes" (
	"DWAuditID" Integer,
	"VariantIndex" Integer,
	"SampleIndex" Integer,
	"ValueIndex" Integer,
	"Attr" varchar(1000) -- Generated.GenotypeMultiValueAttributes,
) with associations (
	join "hc.hph.genomics.db.models::General.Samples" as "Sample" on "SampleIndex" = "Sample"."SampleIndex",
	join "hc.hph.genomics.db.models::SNV.Variants" as "Variant" on "DWAuditID" = "Variant"."DWAuditID"
	and "VariantIndex" = "Variant"."VariantIndex",
	join "hc.hph.genomics.db.models::SNV.Genotypes" as "Genotype" on "DWAuditID" = "Genotype"."DWAuditID"
	and "VariantIndex" = "Genotype"."VariantIndex"
	and "SampleIndex" = "Genotype"."SampleIndex"
);
create table "hc.hph.genomics.db.models::SNV.GenotypeAlleles" (
	"DWAuditID" Integer,
	"VariantIndex" Integer,
	"SampleIndex" Integer,
	"AlleleIndex" Integer,
	"AlleleCount" Integer,
	"Attr" varchar(1000) -- Generated.GenotypeAlleleAttributes,	
) with associations (
	join "hc.hph.genomics.db.models::SNV.VariantAnnotations" as "VariantAnnotation" on "DWAuditID" = "VariantAnnotation"."DWAuditID"
	and "VariantIndex" = "VariantAnnotation"."VariantIndex"
	and "AlleleIndex" = "VariantAnnotation"."AlleleIndex"
);
create table "hc.hph.genomics.db.models::SNV.Haplotypes" (
	"DWAuditID" Integer,
	"VariantIndex" Integer,
	"SampleIndex" Integer,
	"HaplotypeIndex" Integer,
	"AlleleIndex" Integer null
) with associations (
	join "hc.hph.genomics.db.models::General.Samples" as "Sample" on "SampleIndex" = "Sample"."SampleIndex",
	join "hc.hph.genomics.db.models::SNV.Variants" as "Variant" on "DWAuditID" = "Variant"."DWAuditID"
	and "VariantIndex" = "Variant"."VariantIndex",
	join "hc.hph.genomics.db.models::SNV.Genotypes" as "Genotype" on "DWAuditID" = "Genotype"."DWAuditID"
	and "VariantIndex" = "Genotype"."VariantIndex"
	and "SampleIndex" = "Genotype"."SampleIndex",
	join "hc.hph.genomics.db.models::SNV.VariantAlleles" as "VariantAllele" on "DWAuditID" = "VariantAllele"."DWAuditID"
	and "VariantIndex" = "VariantAllele"."VariantIndex"
	and "AlleleIndex" = "VariantAllele"."AlleleIndex",
	join "hc.hph.genomics.db.models::SNV.VariantAnnotations" as "VariantAnnotation" on "DWAuditID" = "VariantAnnotation"."DWAuditID"
	and "VariantIndex" = "VariantAnnotation"."VariantIndex"
	and "AlleleIndex" = "VariantAnnotation"."AlleleIndex"
);
create view "hc.hph.genomics.db.models::SNV.ReferenceAlleleCounts" as
select "DWAuditID",
	"VariantIndex",
	"SampleIndex",
	sum(
		case
			when "AlleleIndex" = 0 then "AlleleCount"
			else 0
		end
	) as "ReferenceAlleleCount",
	sum(
		case
			when "AlleleIndex" <> 0 then "AlleleCount"
			else 0
		end
	) as "AlternativeAlleleCount",
	sum("AlleleCount") as "Multiplicity"
from "hc.hph.genomics.db.models::SNV.GenotypeAlleles"
group by "DWAuditID",
	"VariantIndex",
	"SampleIndex";
create table "hc.hph.genomics.db.models::SNV.GlobalVariantAnnotations" (
	"ReferenceID" varchar(255),
	"ChromosomeIndex" Integer,
	"Position" Integer,
	"Allele" varchar(255),
	"ChromosomeName" varchar(255),
	"GeneName" varchar(1024),
	"Region" varchar(255),
	"SequenceAlteration" varchar(255),
	"AminoAcid.Reference" nvarchar(255),
	"AminoAcid.Alternative" nvarchar(255),
	"MutationType" varchar(255)
) with associations (
	JOIN "hc.hph.genomics.db.models::Reference.Chromosomes" as "chromosome" on "ReferenceID" = "chromosome"."ReferenceID"
	and "ChromosomeIndex" = "chromosome"."ChromosomeIndex",
	join "hc.hph.genomics.db.models::Reference.Sequences" as "ReferenceSequence" on "ReferenceID" = "ReferenceSequence"."ReferenceID"
	and "ChromosomeIndex" = "ReferenceSequence"."ChromosomeIndex"
	and "Position" between "ReferenceSequence"."beginregion" and "ReferenceSequence"."endregion" - 1
);
create table "hc.hph.genomics.db.models::SNV.VariantAnnotations" (
	"DWAuditID" Integer,
	"VariantIndex" Integer,
	"AlleleIndex" Integer,
	"ChromosomeIndex" Integer,
	"Position" Integer,
	"GeneName" varchar(1024),
	"Region" varchar(255),
	"SequenceAlteration" varchar(255),
	"AminoAcid.Reference" nvarchar(255),
	"AminoAcid.Alternative" nvarchar(255),
	"MutationType" varchar(255),
	"CDSPosition" Integer null,
	"Transcript" varchar(100) null,
	"Protein" varchar(100) null,
	"ExonRank" Integer null,
	"RunAuditID" Integer default -1
) with associations (
	join "hc.hph.genomics.db.models::SNV.Variants" as "Variant" on "DWAuditID" = "Variant"."DWAuditID"
	and "VariantIndex" = "Variant"."VariantIndex",
	join "hc.hph.genomics.db.models::SNV.VariantAlleles" as "VariantAllele" on "DWAuditID" = "VariantAllele"."DWAuditID"
	and "VariantIndex" = "VariantAllele"."VariantIndex"
	and "AlleleIndex" = "VariantAllele"."AlleleIndex",
	join "hc.hph.genomics.db.models::SNV.Genotypes" as "Genotype" on "DWAuditID" = "Genotype"."DWAuditID"
	and "VariantIndex" = "Genotype"."VariantIndex"
	and "Genotype"."ReferenceAlleleCount" < "Genotype"."CopyNumber",
	join "hc.hph.genomics.db.models::SNV.GenotypeAlleles" as "GenotypeAllele" on "DWAuditID" = "GenotypeAllele"."DWAuditID"
	and "VariantIndex" = "GenotypeAllele"."VariantIndex"
	and "AlleleIndex" = "GenotypeAllele"."AlleleIndex"
	and "GenotypeAllele"."AlleleCount" > 0
);
create type "hc.hph.genomics.db.models::SNV.VariantAnnotationDetails" as table (
	"DWAuditID" Integer,
	"VariantIndex" Integer,
	"AlleleIndex" Integer,
	"ChromosomeIndex" Integer,
	"Position" Integer,
	"GeneName" varchar(1024),
	"Region" varchar(255),
	"SequenceAlteration" varchar(255),
	"AminoAcid1.Reference" nvarchar(255),
	"AminoAcid1.Alternative" nvarchar(255),
	"MutationType" varchar(255),
	"CDSPosition" Integer,
	"Transcript" varchar(100),
	"Protein" varchar(100),
	"ExonRank" Integer,
	"Allele.Reference" nvarchar(255),
	"Allele.Alternative" nvarchar(255),
	"CDSAllele.Reference" nvarchar(255),
	"CDSAllele.Alternative" nvarchar(255),
	"AminoAcid3.Reference" nvarchar(255),
	"AminoAcid3.Alternative" nvarchar(255)
);
create type "hc.hph.genomics.db.models::SNV.DWAuditIDList" as table ("DWAuditID" Integer);
create type "hc.hph.genomics.db.models::SNV.VariantIDList" as table (
	"VariantIndex" Integer,
	"VariantID" varchar(255)
);
create table "hc.hph.genomics.db.models::SNV.FlatVariants" (
	"DWAuditID" Integer,
	"VariantIndex" Integer,
	"ChromosomeIndex" Integer,
	"Position" Integer,
	"Quality" real null,
	"Filter" tinyint,
	"AlleleIndexRef" Integer,
	"AlleleRef" varchar(255) null,
	"AlleleIndexAlt" Integer,
	"AlleleAlt" varchar(255) null,
	"AlleleCountRef" Integer,
	"AlleleCountAlt" Integer,
	"CopyNumber" Integer
) with associations (
	join "hc.hph.genomics.db.models::Reference.Features" as "Genes" on "ChromosomeIndex" = "Genes"."ChromosomeIndex"
	and "Position" between "Genes"."beginregion" and ("Genes"."endregion" - 1)
	and "Genes"."Class" = 'gene',
	join "hc.hph.genomics.db.models::SNV.VariantAlleles" as "VariantAllele" on "DWAuditID" = "VariantAllele"."DWAuditID"
	and "VariantIndex" = "VariantAllele"."VariantIndex"
	and "AlleleIndexRef" = "VariantAllele"."AlleleIndex",
	join "hc.hph.genomics.db.models::SNV.VariantAlleles" as "VariantAlleleAlt" on "DWAuditID" = "VariantAlleleAlt"."DWAuditID"
	and "VariantIndex" = "VariantAlleleAlt"."VariantIndex"
	and "AlleleIndexRef" = "VariantAlleleAlt"."AlleleIndex",
	join "hc.hph.genomics.db.models::SNV.GenotypeAlleles" as "GenotypeAllele" on "DWAuditID" = "GenotypeAllele"."DWAuditID"
	and "VariantIndex" = "GenotypeAllele"."VariantIndex"
	and "AlleleIndexRef" = "GenotypeAllele"."AlleleIndex"
);
create table "hc.hph.genomics.db.models::SV.Regions" (
	"DWAuditID" Integer,
	"SampleID" varchar(255) null,
	"ReferenceID" varchar(255),
	"ChromosomeIndex" integer,
	"beginregion" integer,
	-- todo
	"endregion" integer,
	-- todo
	"FeatureID" varchar(255) null,
	"Class" varchar(255),
	"FeatureName" varchar(1024) null,
	"Strand" varchar(1) null,
	"Frame" integer null,
	"Score" float null,
	"ParentID" varchar(255) null,
	"Description" varchar(5000) null,
	"FileChromosomeName" varchar(255) null,
	"Color" varchar(255) null
);
-------------------
create table "hc.hph.genomics.db.models::VariantBrowser.BrowserConfiguration" (
	"User" varchar(255),
	"Application" varchar(255),
	"Rank" integer,
	"Created" timestamp,
	"LastUpdated" timestamp,
	"Configuration" varchar(5000)
);
create table "hc.hph.genomics.db.models::VariantBrowser.VariantAnnotationList" (
	"AnnotationType" varchar(255),
	"VariantType" varchar(255),
	"Category" varchar(255)
);
create table "hc.hph.genomics.db.models::VariantBrowser.FilteredVariantAnnotations" (
	"DWAuditID" Integer,
	"VariantIndex" integer,
	"ChromosomeIndex" integer,
	"Position" integer,
	"genename" varchar(1024),
	"VariantType" varchar(255)
);
-- todo: association is required
create view "hc.hph.genomics.db.models::VariantBrowser.DataModelVariants" as
select "DWAuditID",
	"VariantAnnotation"."Variant"."ChromosomeIndex",
	"VariantAnnotation"."Variant"."Position",
	"VariantAnnotation"."Variant"."VariantIndex",
	"SampleIndex",
	"AlleleIndex",
	"VariantAnnotation"."VariantAllele"."Allele",
	"AlleleCount"
from "hc.hph.genomics.db.models::SNV.GenotypeAlleles"
order by "VariantAnnotation"."Variant"."ChromosomeIndex",
	"VariantAnnotation"."Variant"."Position",
	"SampleIndex",
	"AlleleIndex";
create type "hc.hph.genomics.db.models::VariantBrowser.GroupedDataModelVariants" as table (
	"Position" Integer,
	"AlleleIndex" Integer,
	"Allele" varchar(255),
	"Grouping" TINYINT,
	"GroupCount" Integer,
	"AlleleCount" Integer
);
-- todo: association is required
create view "hc.hph.genomics.db.models::VariantBrowser.GeneVariants" as
select "SampleIndex",
	"Variant"."Genes"."FeatureName" as "GeneName",
	"Variant"."Genes"."ReferenceID",
	"Variant"."Genes"."FeatureID",
	MIN("Variant"."ChromosomeIndex") as "ChromosomeIndex",
	MIN("Variant"."Genes"."beginregion") as "Begin",
	MAX("Variant"."Genes"."endregion") as "End"
from "hc.hph.genomics.db.models::SNV.Genotypes"
where "ReferenceAlleleCount" <> "CopyNumber"
group by "SampleIndex",
	"Variant"."Genes"."ReferenceID",
	"Variant"."Genes"."FeatureID",
	"Variant"."Genes"."FeatureName";
-- todo: association is required
create view "hc.hph.genomics.db.models::VariantBrowser.GeneVariantAnnotations" as
select "Genotype"."SampleIndex",
	"GeneName",
	"ChromosomeIndex",
	MIN("Position") as "Begin",
	MAX("Position") as "End"
from "hc.hph.genomics.db.models::SNV.VariantAnnotations"
group by "Genotype"."SampleIndex",
	"GeneName",
	"ChromosomeIndex";
create type "hc.hph.genomics.db.models::VariantBrowser.DisplayVariants" as table (
	"Position" Integer,
	"Allele" varchar(255),
	"AlleleCount" Integer,
	"CopyNumber" Integer
);
create type "hc.hph.genomics.db.models::VariantBrowser.GroupedDisplayVariants" as table (
	"Position" Integer,
	"Allele" varchar(255),
	"Grouping" TINYINT,
	"AlleleCount" Integer,
	"CopyNumber" Integer
);
create type "hc.hph.genomics.db.models::VariantBrowser.BinnedVariants" as table (
	"ChromosomeIndex" Integer,
	"BinIndex" Integer,
	"AlleleIndex" Integer,
	"MaxAlleleIndex" Integer,
	"AlleleCount" Integer
);
create type "hc.hph.genomics.db.models::VariantBrowser.VariantDensityAnnotationCounts" as table (
	"ChromosomeIndex" Integer,
	"BinIndex" Integer,
	"VariantCount" Integer,
	"Grouping" TINYINT
);
create type "hc.hph.genomics.db.models::VariantBrowser.VariantCounts" as table (
	"ChromosomeIndex" Integer,
	"BinIndex" Integer,
	"VariantCount" Integer
);
create type "hc.hph.genomics.db.models::VariantBrowser.RegionCounts" as table (
	"GeneName" varchar(1024),
	"ChromosomeIndex" Integer,
	"Begin" Integer,
	"End" Integer,
	"Count" Integer
);
create type "hc.hph.genomics.db.models::VariantBrowser.ChromosomeInfos" as table (
	"ChromosomeIndex" Integer,
	"Size" Integer,
	"BinCount" Integer
);
create type "hc.hph.genomics.db.models::VariantBrowser.QuantitativeData" as table (
	"ChromosomeIndex" Integer,
	"Score" Integer,
	"BinIndex" Integer
);
create type "hc.hph.genomics.db.models::VariantBrowser.AggrQuantityScore" as table (
	"ChromosomeIndex" Integer,
	"AggrScore" Integer
);
create type "hc.hph.genomics.db.models::VariantBrowser.QualitativeData" as table (
	"BinIndex" Integer,
	"Grouping" TINYINT,
	"BeginPos" Integer,
	"EndPos" Integer,
	"BinPatientFraction" real,
	"GroupPatientFraction" real
);
create type "hc.hph.genomics.db.models::VariantBrowser.MutationData" as table (
	"GeneName" varchar(1024),
	"MutationType" varchar(255),
	"Percent" real
);
create type "hc.hph.genomics.db.models::VariantBrowser.AffectedGene" as table(
	"GeneName" varchar(1024),
	"Description" NCLOB,
	"Percent" real
);
create type "hc.hph.genomics.db.models::VariantBrowser.VariantAnnotationCounts" as table(
	"GeneName" varchar(1024),
	"ChromosomeIndex" Integer,
	"Grouping" TINYINT,
	"Begin" Integer,
	"End" Integer,
	"Count" real,
	"Bin" Integer
);
create type "hc.hph.genomics.db.models::VariantBrowser.VariantAnnotationGrouping" as table(
	"DWAuditID" Integer,
	"VariantIndex" Integer,
	"AlleleIndex" Integer,
	"Grouping" TINYINT
);
create type "hc.hph.genomics.db.models::VariantBrowser.MutationDataAnnotation" as table ("Grouping" TINYINT, "Percent" real);
create type "hc.hph.genomics.db.models::VariantBrowser.AffectedSampleAnnotation" as table ("Percent" real);
create type "hc.hph.genomics.db.models::VariantBrowser.RegionDefinition" as table (
	"ChromosomeIndex" Integer,
	"Begin" Integer,
	"End" Integer,
	"Score" real,
	"Color" varchar(255)
);
create type "hc.hph.genomics.db.models::VariantBrowser.GeneDefinition" as table (
	"GeneName" varchar(255),
	"Description" varchar(255),
	"Synonym" varchar(255)
);
create table "hc.hph.genomics.db.models::VariantBrowser.SearchHistory" (
	"SearchTerm" varchar(100),
	"UserName" varchar(255),
	"Rank" Integer
);
create table "hc.hph.genomics.db.models::VariantBrowser.SearchFavorites" (
	"SearchTerm" varchar(100),
	"Favorite" Boolean
);
create type "hc.hph.genomics.db.models::VariantBrowser.GeneAffectedinCohort" as table (
	"GeneName" varchar(1024),
	"Cohort1Affected" Integer,
	"Cohort2Affected" Integer,
	"Cohort1Total" Integer,
	"Cohort2Total" Integer
);
create type "hc.hph.genomics.db.models::VariantBrowser.PValue" as table ("GeneName" varchar(1024), "PValue" real);
create type "hc.hph.genomics.db.models::VariantBrowser.SampleAttributes" as table (
	"SampleIndex" Integer,
	"Attribute" varchar(100),
	"Value" varchar(5000)
);
create table "hc.hph.genomics.db.models::VariantBrowser.SampleVariants" (
	"SampleIndex" Integer,
	"DWAuditID" Integer,
	"VariantIndex" Integer
);
create type "hc.hph.genomics.db.models::VariantBrowser.FullyQualifiedAttributes" as table (
	"SchemaName" varchar(255),
	"TableName" varchar(255),
	"AttributeName" varchar(255)
);
create type "hc.hph.genomics.db.models::VariantBrowser.GeneSummary" as table (
	"Gene name" varchar(255),
	"Patient count" Integer,
	"Patient fraction" Double,
	"Variant count" Integer,
	"Total patients" Integer
);
create type "hc.hph.genomics.db.models::VariantBrowser.GeneAlteration" as table (
	"Gene name" varchar(255),
	"Patient fraction" Double,
	"index" Integer,
	"interactionDWID" varchar(255),
	"class" varchar(255),
	"patientDWID" varchar(255),
	"sampleID" varchar(255),
	"firstName" varchar(100),
	"lastName" varchar(100),
	"birthDate" datetime,
	"Grouping" TINYINT
);
create type "hc.hph.genomics.db.models::VariantBrowser.GeneAltCohortGroup" as table (
	"index" Integer,
	"interactionDWID" varchar(255),
	"class" varchar(255),
	"patientDWID" varchar(255),
	"sampleID" varchar(255),
	"firstName" varchar(100),
	"lastName" varchar(100),
	"birthDate" datetime
);
------------------
create table "hc.hph.genomics.db.models.extensions::Attribute.CustomAttributes" (
	"AttributeName" varchar(255),
	"Level" varchar(14),
	"DataType" varchar(9),
	"ArraySize" integer null,
	"Description" varchar(5000) null,
	"DWAuditID" INTEGER,
	"Active" tinyint
);
create table "hc.hph.genomics.db.models.extensions::Attribute.StructuredCustomAttributes" (
	"StructuredAttributeName" varchar(255),
	"Level" varchar(14),
	"AttributeName" varchar(255),
	"AttributeIndex" integer,
	"DWAuditID" INTEGER,
	"Separator" varchar(1),
	"DataType" varchar(9),
	"NullValue" varchar(255) null,
	"Active" tinyint
);
------------------
create table "hc.hph.genomics.internal.db.models::GenomeScans.Quantities" (
	"Quantity" varchar(5000),
	"ChromosomeIndex" integer,
	"Position" integer,
	"Value" float
);
create table "hc.hph.genomics.internal.db.models::GenomeScans.Connections" (
	"Quantity" VARCHAR(5000),
	"SourceChromosomeIndex" Integer,
	"SourcePosition" Integer,
	"TargetChromosomeIndex" Integer,
	"TargetPosition" Integer,
	"Value" real
);
-------------------
create view "hc.hph.genomics.db.models::MRI.Variants" as
select "Genotype"."Sample"."PatientKey"."DWID",
	"Genotype"."SampleIndex",
	"Genotype"."Sample"."SampleClass",
	"GenotypeAllele"."AlleleCount",
	"ChromosomeIndex",
	"Position" + 1 as Position,
	"GeneName",
	"Region",
	"SequenceAlteration",
	"MutationType"
from "hc.hph.genomics.db.models::SNV.VariantAnnotations"
where "AlleleIndex" > 0;
create view "hc.hph.genomics.db.models::MRI.VariantInteractions" as
select "VariantAnnotation"."Genotype"."Sample"."PatientDWID" as PATIENT_ID,
	"VariantAnnotation"."ChromosomeIndex" || '_' || TO_VARCHAR("DWAuditID") || '_' || TO_VARCHAR("VariantIndex") || TO_VARCHAR("AlleleIndex") || IFNULL('_' || "VariantAnnotation"."GeneName", '') AS INTERACTION_ID,
	TO_BIGINT("VariantAnnotation"."ChromosomeIndex") * 1000000000 + "VariantAnnotation"."Position" as POSITION_START,
	TO_BIGINT("VariantAnnotation"."ChromosomeIndex") * 1000000000 + "VariantAnnotation"."Position" as POSITION_END,
	"VariantAnnotation"."SequenceAlteration" as SEQUENCE_ALTERATION,
	"VariantAnnotation"."GeneName" as GENE_NAME,
	"VariantAnnotation"."Region" as REGION,
	"VariantAnnotation"."AminoAcid.Reference" as AA_REF,
	"VariantAnnotation"."AminoAcid.Alternative" as AA_ALT,
	"VariantAnnotation"."MutationType" as VARIANT_TYPE
from "hc.hph.genomics.db.models::SNV.GenotypeAlleles"
where "AlleleIndex" > 0
	AND "AlleleCount" > 0;
create view "hc.hph.genomics.db.models::MRI.VariantInteractionsDWViews" as
select "VariantAnnotation"."Genotype"."Sample"."PatientDWID" as "PatientID",
	"VariantAnnotation"."ChromosomeIndex" || '_' || TO_VARCHAR("DWAuditID") || '_' || TO_VARCHAR("VariantIndex") || TO_VARCHAR("AlleleIndex") || IFNULL('_' || "VariantAnnotation"."GeneName", '') AS "InteractionID",
	TO_BIGINT("VariantAnnotation"."ChromosomeIndex") * 1000000000 + "VariantAnnotation"."Position" as POSITION_START,
	TO_BIGINT("VariantAnnotation"."ChromosomeIndex") * 1000000000 + "VariantAnnotation"."Position" as POSITION_END,
	"VariantAnnotation"."SequenceAlteration" as SEQUENCE_ALTERATION,
	"VariantAnnotation"."GeneName" as GENE_NAME,
	"VariantAnnotation"."Region" as REGION,
	"VariantAnnotation"."AminoAcid.Reference" as AA_REF,
	"VariantAnnotation"."AminoAcid.Alternative" as AA_ALT,
	"VariantAnnotation"."MutationType" as VARIANT_TYPE,
	"DWAuditID" AS "DWAuditID",
	"VariantIndex" AS "VariantIndex",
	"AlleleIndex" AS "AlleleIndex",
	"SampleIndex" AS "SampleIndex"
from "hc.hph.genomics.db.models::SNV.GenotypeAlleles"
where "AlleleIndex" > 0
	AND "AlleleCount" > 0;
---------
create type "hc.hph.plugins.vcf.db.models::Staging.geneNonCodingType" as table (
	"DWAuditID" integer,
	"VariantIndex" integer,
	"ChromosomeIndex" integer,
	"Position" integer,
	"AlleleIndex" integer,
	"ALTALLELE" varchar(10),
	"REFALLELE" varchar(10),
	"FeatureName" varchar(255),
	"Class" varchar(255),
	"VT" varchar(10),
	"GENENAME" varchar(100),
	"Region" varchar(255),
	"Strand" varchar(1),
	"Transcript" varchar(255),
	"ExonRank" integer,
	"RunAuditID" integer
);
create type "hc.hph.plugins.vcf.db.models::Staging.geneCodingType" as table (
	"DWAuditID" integer,
	"VariantIndex" integer,
	"ChromosomeIndex" integer,
	"Position" integer,
	"AlleleIndex" integer,
	"ALTALLELE" varchar(10),
	"REFALLELE" varchar(10),
	--FeatureName: String(255);
	"VT" varchar(10),
	"GENENAME" varchar(100),
	"Region" varchar(255),
	"Class" varchar(255),
	"REFCODON" varchar(3),
	"ALTCODON" varchar(3),
	"Strand" varchar(1),
	"CDSPosition" integer,
	"Transcript" varchar(255),
	"Protein" varchar(255),
	"ExonRank" integer,
	"RunAuditID" integer
);