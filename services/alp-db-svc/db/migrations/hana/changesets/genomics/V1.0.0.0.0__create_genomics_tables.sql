create type SampleList as table
(
    SampleIndex      integer
);

create type SampleNames as table
(
    SampleIndex      integer,
    SampleName      varchar(255)
);

create table Sequences
(
    SequenceID      varchar(255),
    Value      integer
);

create table Patients
(
    PatientIndex      Integer,
    DWID      Binary,
    DWSource      varchar(5),
    DWAuditID      Integer,

    FamilyName      varchar(100), 
    GivenName      varchar(100), 
    Gender      varchar(10),  -- TODO       maybe a Array is preferred
    BirthDate      datetime, 
    Nationality      varchar(100), 
    Address      varchar(1000) -- TODO       may be a Array is preferred?
);

create table Patient_Key (
	DWID     Binary,
	DWSource     nvarchar(5) not null,  
	DWAuditID     integer not null,
	PatientID     nvarchar(100) not null
	-- Patient_Attr_Assoc     association to Patient_Attr on Patient_Attr_Assoc.DWID = DWID;
	-- Patient_BestRecord_Attr_Assoc     association to Patient_BestRecord_Attr 
		-- on Patient_BestRecord_Attr_Assoc.DWID = DWID;
);

create table Patient_Attr (
	DWDateFrom     timestamp,
	DWID      binary,
	DWDateTo      timestamp,
	DWAuditID      Integer not null,
	ValidFrom      Date, -- From date since when the record is semantically valid
	ValidTo      Date, -- To date until when the record is semantically valid
	
	FamilyName      nvarchar(100), -- Family name (often called 'Surname')    
	GivenName      nvarchar(100), -- Given names (not always 'first'). Includes middle names        
	title			nvarchar(1000),
	-- Title.OriginalValue      nvarchar(100), -- Administrative title (also called 'form of address')
	-- Title.Code      nvarchar(100), -- Administrative title (also called 'form of address')
	-- Title.CodeSystem      nvarchar(100), -- Administrative title (also called 'form of address')
	-- Title.CodeSystemVersion      nvarchar(100), -- Administrative title (also called 'form of address')
	Gender      nvarchar(100), -- Administrative gender
	BirthDate      seconddate, -- The date and time of birth for the individual
	MultipleBirthOrder      tinyint, -- Indicates whether the patient is part of a multiple or indicates the actual birth order
	DeceasedDate      seconddate, -- The date and time of death for the individual
	MaritalStatus      nvarchar(1000), -- Patient's most recent marital (civil) status       
	Nationality      nvarchar(1000), -- Nationality of the patient        
	Address      nvarchar(1000), -- TODO    
	Telecom      nvarchar(1000), -- Technology-mediated contact details
	OrgID        nvarchar(100) --OrgID that is linked to Config.

	-- Audit_Assoc      association to DI.AuditLog on Audit_Assoc.AuditLogID = DWAuditID,
) with associations(
	Join Patient_Key as Patient_Key_Assoc on Patient_Key_Assoc.DWID = DWID
) ;

create table Samples
(
    SampleIndex      integer,
    DWAuditID      Integer,
    DWSource      varchar(5),
    ReferenceID      varchar(255),
    SampleID      varchar(255) null,
    SampleClass      varchar(255) null,
    PatientDWID      Binary,
    InteractionDWID      Binary,
    AnalysisDate      Timestamp null,
    OrgID      varchar(100) null,
    Phenotype      varchar(5000),
    Sex      varchar(10),
    FamilyID      varchar(255)

) with associations (
	join Patient_Key as patientkey on patientkey.dwid = patientdwid,
	join patient_attr as patientattr on  patientattr.dwid = patientdwid,
	join Interactions_Key as InteractionKey on interactionkey.dwid = interactiondwid,
	join interactions_attr as interactionattr on interactionattr.dwid = interactiondwid
);

create table Pedigree
(
    DWAuditID      Integer,
    SourceSampleIndex      integer,
    TargetSampleIndex      integer,
    Relationship      varchar(5000)
);

create type PedigreeSamples as table
(
    SampleIndex      integer,
    FamilyName      varchar(100),
    GivenName      varchar(100),
    BirthDate      Timestamp,
    PatientDWID      varchar(64),
    Gender      varchar(100),
    AnalysisDate      Timestamp,
    SampleClass      varchar(100),
    InteractionDWID      varchar(64),
    DWSource      varchar(5),
    InteractionID      varchar(100)
);

create type PedigreeAlleles as table
(
    SampleIndex      integer,
    DWAuditID      Integer,
    AlleleIndex      integer,
    Allele      varchar(255),
    AlleleCount      integer
);

create type SampleDetails as table
(
    FamilyName      varchar(100),
    GivenName      varchar(100),
    BirthDate      Timestamp,
    PatientDWID      varchar(64),
    Gender      varchar(100),
    AnalysisDate      Timestamp,
    SampleClass      varchar(100),
    InteractionDWID      varchar(64),
    SampleIndex      integer,
    DWAuditID      Integer,
    DWSource      varchar(5),
    InteractionID      varchar(100),
    AlleleIndex      integer,
    Allele      varchar(255),
    AlleleCount      integer
);


create table SessionSampleGroups
(
    SampleGroup      varchar(255),
    SampleIndex      integer
);



create table chromosomes
(
	DWAuditID     Integer,
	referenceid		varchar(255),
	chromosomeindex		integer,
	chromosomename		varchar(255),
	size		integer,
	topology		varchar(8) default 'linear',
	visible		tinyint default 1,
	md5hash		binary(16) null,
	description		varchar(5000) null
); 

create table referencesequences
(
	referenceid		varchar(255),
	chromosomeindex		integer,
	beginregion     integer,  -- TODO
	endregion       integer,  -- TODO
	sequence		varchar(1024) null
) WITH associations (
	JOIN chromosomes AS chromosome on referenceid = chromosome.referenceid and chromosomeindex = chromosome.chromosomeindex
);

create table features
(
	DWAuditID     Integer,
	referenceid		varchar(255),
	chromosomeindex		integer,
	beginregion     integer,  -- TODO
	endregion       integer,  -- TODO
	featureid		varchar(255) null,
	class		varchar(255),
	featurename		varchar(1024) null,
	strand		varchar(1) null,
	frame		integer null,
	score		float null,
	parentid		varchar(255) null,
	description		varchar(5000) null,
	longdescription		varchar(5000) null,
	filechromosomename		varchar(255) null,
	color		varchar(255) null
) with associations (
	JOIN chromosomes as chromosome on referenceid = chromosome.referenceid and chromosomeindex = chromosome.chromosomeindex
);

-- @dwannotation.entity.name		'referencefeature'
create table featuresannotation
(
	DWAuditID     Integer,
	referenceid		varchar(255),
	chromosomeindex		integer,
	beginregion     integer, -- TODO
	endregion       integer, -- TODO
	featureid		varchar(255) null,
	class		varchar(255),
	featurename		varchar(1024) null,
	strand		varchar(1) null,
	score		float null,
	parentid		varchar(255) null,
	description		varchar(5000) null,
	sequence        clob null,               
	rank            integer null,
	prepost         varchar(6) null,
	cdsposition     integer null,
	exonrank        integer null,
	runauditid		integer default -1,	
	transcript      varchar(100) null,
	genename        varchar(100) null
) with associations (
	JOIN chromosomes as chromosome on referenceid = chromosome.referenceid and chromosomeindex = chromosome.chromosomeindex
);

create table codons
(
	DWAuditID     Integer,
	referenceid		varchar(255),
	chromosomeindex		integer,
	codon		varchar(3),
	aminoacid		varchar(1),
	aminoacidshort		varchar(10)
);


create table headers
(
	DWAuditID     Integer,
	rowindex		integer,
	keyvalueindex		integer,
	headerkey		varchar(255),
	valuekey		varchar(255) null,
	value		varchar(5000) null
); 

create table variants
(
	DWAuditID     Integer,
	variantindex		integer,
	chromosomeindex		integer,
	position		integer,
	variantid		varchar(255) null,
	quality		float null,
	filter		tinyint, -- todo
	attr		varchar(1000) -- generated.variantattributes, -- todo
) with associations (
	join features as genes on chromosomeindex = genes.chromosomeindex and position between genes.beginregion and ( genes.endregion - 1 ) and genes.class = 'gene'
);

create table variantids
(
	DWAuditID     Integer,
	variantindex		integer,
	variantid		varchar(255)
) with associations (
	join variants as variant on  dwauditid = variant.dwauditid and variantindex = variant.variantindex
);

create table variantmultivalueattributes
(
	DWAuditID     Integer,
	variantindex		integer,
	valueindex		integer,
	attr		varchar(1000) -- generated.variantmultivalueattributes, -- todo
) with associations (
	join variants as variant on dwauditid = variant.dwauditid and variantindex = variant.variantindex
);

create table VariantStructuredAttributes
(
	DWAuditID     Integer,
	VariantIndex     Integer,
	ValueIndex     Integer,
	Attr     varchar(1000) -- Generated.VariantStructuredAttributes, -- TODO
) with associations(
	join variants as variant on DWAuditID = Variant.DWAuditID and VariantIndex = Variant.VariantIndex
);
    
create table VariantAlleles
(
	DWAuditID     Integer,
	VariantIndex     Integer,
	AlleleIndex     Integer,
	Allele     varchar(255) null,
	Attr     varchar(1000) -- Generated.VariantAlleleAttributes, -- TODO
) with associations (
	join variants as variant on DWAuditID = Variant.DWAuditID and VariantIndex = Variant.VariantIndex
);

create table Genotypes
(
	DWAuditID     Integer,
	VariantIndex     Integer,
	SampleIndex     Integer,
	Phased     TINYINT null,
	ReferenceAlleleCount     Integer,
	CopyNumber     Integer,
	Zygosity     varchar(100),
	Attr     varchar(1000) -- Generated.GenotypeAttributes,
) with associations (
	join samples as sample on SampleIndex = Sample.SampleIndex,
	join variants as variant on DWAuditID = Variant.DWAuditID and VariantIndex = Variant.VariantIndex
);

create table GenotypeMultiValueAttributes
(
	DWAuditID     Integer,
	VariantIndex     Integer,
	SampleIndex     Integer,
	ValueIndex     Integer,
	Attr     varchar(1000) -- Generated.GenotypeMultiValueAttributes,
)with associations (
	join samples as sample on SampleIndex = Sample.SampleIndex,
	join variants as variant on DWAuditID = Variant.DWAuditID and VariantIndex = Variant.VariantIndex,
	join Genotypes as Genotype on DWAuditID = Genotype.DWAuditID and VariantIndex = Genotype.VariantIndex and SampleIndex = Genotype.SampleIndex
);

create table GenotypeAlleles
(
	DWAuditID     Integer,
	VariantIndex     Integer,
	SampleIndex     Integer,
	AlleleIndex     Integer,
	AlleleCount     Integer,
	Attr     varchar(1000) -- Generated.GenotypeAlleleAttributes,	
) with associations (
	join VariantAnnotations as VariantAnnotation on DWAuditID = VariantAnnotation.DWAuditID and VariantIndex = VariantAnnotation.VariantIndex and AlleleIndex = VariantAnnotation.AlleleIndex
);

create table Haplotypes
(
	DWAuditID     Integer,
	VariantIndex     Integer,
	SampleIndex     Integer,
	HaplotypeIndex     Integer,
	AlleleIndex     Integer null
) with associations (
	join Samples as Sample on SampleIndex = Sample.SampleIndex,
	join Variants as Variant on DWAuditID = Variant.DWAuditID and VariantIndex = Variant.VariantIndex,
	join Genotypes as Genotype on DWAuditID = Genotype.DWAuditID and VariantIndex = Genotype.VariantIndex and SampleIndex = Genotype.SampleIndex,
	join VariantAlleles as VariantAllele on DWAuditID = VariantAllele.DWAuditID and VariantIndex = VariantAllele.VariantIndex and AlleleIndex = VariantAllele.AlleleIndex,
	join VariantAnnotations as VariantAnnotation on DWAuditID = VariantAnnotation.DWAuditID and VariantIndex = VariantAnnotation.VariantIndex and AlleleIndex = VariantAnnotation.AlleleIndex
);


create view ReferenceAlleleCounts as select 
	DWAuditID,
	VariantIndex,
	SampleIndex,
	sum(case when AlleleIndex = 0 then AlleleCount else 0 end) as ReferenceAlleleCount,
	sum(case when AlleleIndex <> 0 then AlleleCount else 0 end) as AlternativeAlleleCount,
	sum(AlleleCount) as Multiplicity
 from GenotypeAlleles
group by
	DWAuditID,
	VariantIndex,
	SampleIndex;

create table GlobalVariantAnnotations
(
	ReferenceID     varchar(255),
	ChromosomeIndex     Integer,
	Position     Integer,
	Allele     varchar(255),
	ChromosomeName     varchar(255),
	GeneName     varchar(1024),
	Region     varchar(255),
	SequenceAlteration     varchar(255),
	"AminoAcid.Reference" 	nvarchar(255),
	"AminoAcid.Alternative" 	nvarchar(255),
	MutationType     varchar(255)
) with associations (
	join Chromosomes as chromosome on ReferenceID = Chromosome.ReferenceID and ChromosomeIndex = Chromosome.ChromosomeIndex,
	join Sequences as ReferenceSequence on ReferenceID = ReferenceSequence.ReferenceID and ChromosomeIndex = ReferenceSequence.ChromosomeIndex and Position between ReferenceSequence.beginregion and ReferenceSequence.endregion - 1
); 

create table VariantAnnotations
(
	DWAuditID     Integer,
	VariantIndex     Integer,
	AlleleIndex     Integer,
	ChromosomeIndex     Integer,
	Position     Integer,
	GeneName     varchar(1024),
	Region     varchar(255),
	SequenceAlteration     varchar(255),
	"AminoAcid.Reference" 	nvarchar(255),
	"AminoAcid.Alternative" 	nvarchar(255),
	MutationType     varchar(255),
	CDSPosition      Integer null,
	Transcript      varchar(100) null,
	Protein      varchar(100) null,
	ExonRank      Integer null,
	RunAuditID     Integer default -1

) with associations (
	join Variants as Variant on DWAuditID = Variant.DWAuditID and VariantIndex = Variant.VariantIndex,
	join VariantAlleles as VariantAllele on DWAuditID = VariantAllele.DWAuditID and VariantIndex = VariantAllele.VariantIndex and AlleleIndex = VariantAllele.AlleleIndex,
	join Genotypes as genotype on DWAuditID = Genotype.DWAuditID and VariantIndex = Genotype.VariantIndex and Genotype.ReferenceAlleleCount < Genotype.CopyNumber,
	join GenotypeAlleles as GenotypeAllele on DWAuditID = GenotypeAllele.DWAuditID and VariantIndex = GenotypeAllele.VariantIndex and AlleleIndex = GenotypeAllele.AlleleIndex and GenotypeAllele.AlleleCount > 0
);

create type VariantAnnotationDetails as table
(
	DWAuditID     Integer,
	VariantIndex     Integer,
	AlleleIndex     Integer,
	ChromosomeIndex     Integer,
	Position     Integer,
	GeneName     varchar(1024),
	Region     varchar(255),
	SequenceAlteration     varchar(255),
	"AminoAcid1.Reference" 	nvarchar(255),
	"AminoAcid1.Alternative" 	nvarchar(255),
	MutationType     varchar(255),
	CDSPosition      Integer,
	Transcript      varchar(100),
	Protein      varchar(100),
	ExonRank      Integer,
	"Allele.Reference" 	nvarchar(255),
	"Allele.Alternative" 	nvarchar(255),
	"CDSAllele.Reference" 	nvarchar(255),
	"CDSAllele.Alternative" 	nvarchar(255),
	"AminoAcid3.Reference" 	nvarchar(255),
	"AminoAcid3.Alternative" 	nvarchar(255)
);

create type DWAuditIDList as table
(
	DWAuditID     Integer
);

create type VariantIDList as table
(
	VariantIndex     Integer,
	VariantID     varchar(255)
);

create table FlatVariants
(
	DWAuditID     Integer,
	VariantIndex     Integer,
	ChromosomeIndex     Integer,
	Position     Integer,
	Quality     real null,
	Filter     tinyint,
	AlleleIndexRef     Integer,
	AlleleRef     varchar(255) null,
	AlleleIndexAlt     Integer,
	AlleleAlt     varchar(255) null,
	AlleleCountRef     Integer,
	AlleleCountAlt     Integer,
	CopyNumber     Integer
) with associations (
	join features as genes on ChromosomeIndex = Genes.ChromosomeIndex and Position between Genes.beginregion and ( Genes.endregion - 1 ) and Genes.Class = 'gene',
	join VariantAlleles as VariantAllele on DWAuditID = VariantAllele.DWAuditID and VariantIndex = VariantAllele.VariantIndex and AlleleIndexRef = VariantAllele.AlleleIndex,
	join VariantAlleles as VariantAlleleAlt on DWAuditID = VariantAlleleAlt.DWAuditID and VariantIndex = VariantAlleleAlt.VariantIndex and AlleleIndexAlt = VariantAlleleAlt.AlleleIndex,
	join GenotypeAlleles as GenotypeAllele on DWAuditID = GenotypeAllele.DWAuditID and VariantIndex = GenotypeAllele.VariantIndex and AlleleIndexRef = GenotypeAllele.AlleleIndex
);			



create table regions
(
	DWAuditID     Integer,
	sampleid		varchar(255) null,
	referenceid		varchar(255),
	chromosomeindex		integer,
	beginregion     integer,  -- todo
	endregion       integer,  -- todo
	featureid		varchar(255) null,
	class		varchar(255),
	featurename		varchar(1024) null,
	strand		varchar(1) null,
	frame		integer null,
	score		float null,
	parentid		varchar(255) null,
	description		varchar(5000) null,
	filechromosomename		varchar(255) null,
	color		varchar(255) null
);



create table browserconfiguration
(
	user		varchar(255),
	application		varchar(255),
	rank		integer,
	created		timestamp,
	lastupdated		timestamp,
	configuration		varchar(5000)
);

create table variantannotationlist
(
	annotationtype		varchar(255),
	varianttype		varchar(255),
	category		varchar(255)
);


create table filteredvariantannotations
(
	DWAuditID     Integer,
	variantindex		integer,
	chromosomeindex		integer,
	position		integer,
	genename		varchar(1024),
	varianttype     varchar(255)
);

-- todo: association is required
create view DataModelVariants as select 
	DWAuditID,
	VariantAnnotation.Variant.ChromosomeIndex,
	VariantAnnotation.Variant.Position,
	VariantAnnotation.Variant.VariantIndex,
	SampleIndex,
	AlleleIndex,
	VariantAnnotation.VariantAllele.Allele,
	AlleleCount
from GenotypeAlleles
order by
	VariantAnnotation.Variant.ChromosomeIndex,
	VariantAnnotation.Variant.Position,
	SampleIndex,
	AlleleIndex;

create type GroupedDataModelVariants as table
(
	Position     Integer,
	AlleleIndex     Integer,
	Allele     varchar(255),
	Grouping     TINYINT,
	GroupCount     Integer,
	AlleleCount     Integer
);

-- todo: association is required
create view GeneVariants as select 
	SampleIndex,
	Variant.Genes.FeatureName as "GeneName",
	Variant.Genes.ReferenceID,
	Variant.Genes.FeatureID,
	MIN(Variant.ChromosomeIndex) as "ChromosomeIndex",
	MIN(Variant.Genes.beginregion) as "Begin",
	MAX(Variant.Genes.endregion) as "End"
from Genotypes
where
	ReferenceAlleleCount <> CopyNumber
group by
	SampleIndex,
	Variant.Genes.ReferenceID,
	Variant.Genes.FeatureID,
	Variant.Genes.FeatureName;

-- todo: association is required
create view GeneVariantAnnotations as select 
	Genotype.SampleIndex,
	GeneName,
	ChromosomeIndex,
	MIN(Position) as "Begin",
	MAX(Position) as "End"
from VariantAnnotations
group by
	Genotype.SampleIndex,
	GeneName,
	ChromosomeIndex;

create type DisplayVariants as table
(
	Position     Integer,
	Allele     varchar(255),
	AlleleCount     Integer,
	CopyNumber     Integer
);
create type GroupedDisplayVariants as table
(
	Position     Integer,
	Allele     varchar(255),
	Grouping     TINYINT,
	AlleleCount     Integer,
	CopyNumber     Integer
);
create type BinnedVariants as table
(
	ChromosomeIndex     Integer,
	BinIndex     Integer,
	AlleleIndex     Integer,
	MaxAlleleIndex     Integer,
	AlleleCount     Integer
);
create type VariantDensityAnnotationCounts as table
(
	ChromosomeIndex     Integer,
	BinIndex     Integer,
	VariantCount     Integer,
	Grouping       TINYINT
);
create type VariantCounts as table
(
	ChromosomeIndex     Integer,
	BinIndex     Integer,
	VariantCount     Integer
);
create type RegionCounts as table
(
	GeneName     varchar(1024),
	ChromosomeIndex     Integer,
	"Begin"     Integer,
	"End"     Integer,
	Count     Integer
);
create type ChromosomeInfos as table
(
	ChromosomeIndex     Integer,
	Size     Integer,
	BinCount     Integer
);
create type QuantitativeData as table
(
	ChromosomeIndex     Integer,
	Score     Integer,
	BinIndex       Integer
);
create type AggrQuantityScore as table
(
	ChromosomeIndex     Integer,
	AggrScore     Integer
);
create type QualitativeData as table
(
	BinIndex     Integer,
	Grouping     TINYINT,
	BeginPos     Integer,
	EndPos     Integer,
	BinPatientFraction     real,
	GroupPatientFraction     real
);
create type MutationData as table
(
	GeneName     varchar(1024),
	MutationType     varchar(255),
	Percent     real
);
create type AffectedGene as table(
	GeneName     varchar(1024),
	Description     NCLOB,
	Percent     real
);
create type VariantAnnotationCounts as table( 
	GeneName     varchar(1024),
	ChromosomeIndex     Integer,
	Grouping     TINYINT,
	"Begin"     Integer, 
	"End"     Integer,
	Count     real,
	Bin       Integer
);
create type VariantAnnotationGrouping as table(
	DWAuditID     Integer,
	VariantIndex     Integer,
	AlleleIndex     Integer,
	Grouping     TINYINT
);

create type MutationDataAnnotation as table
(
	Grouping     TINYINT,
	Percent     real
);

create type AffectedSampleAnnotation as table
(
	Percent     real
);

create type RegionDefinition as table
(
	ChromosomeIndex     Integer,
	"Begin"       Integer,
	"End"       Integer,
	Score       real,
	Color       varchar(255)
);

create type GeneDefinition as table
(
	GeneName      varchar(255),
	Description       varchar(255),
	Synonym       varchar(255)
);

create table SearchHistory
(
	SearchTerm     varchar(100),
	UserName     varchar(255),
	Rank       Integer
);

create table SearchFavorites
(
	SearchTerm     varchar(100),
	Favorite     Boolean
);

create type GeneAffectedinCohort as table
(
	GeneName     varchar(1024),
	Cohort1Affected     Integer,
	Cohort2Affected     Integer,
	Cohort1Total     Integer,
	Cohort2Total     Integer
	);
			
	create type PValue as table
	(
	GeneName     varchar(1024),
	PValue       real
	);  	
	
create type SampleAttributes as table
(
	SampleIndex     Integer,
	Attribute     varchar(100),
	Value     varchar(5000)
);

create table SampleVariants
(
	SampleIndex     Integer,
	DWAuditID     Integer,
	VariantIndex     Integer
);

create type FullyQualifiedAttributes as table
(
	SchemaName     varchar(255),
	TableName     varchar(255),
	AttributeName     varchar(255)
);


create type GeneSummary as table
	(
	"Gene name"       varchar(255),
	"Patient count"       Integer,
	"Patient fraction"       Double,
	"Variant count"       Integer,
	"Total patients"       Integer
	);

	create type GeneAlteration as table
	(
	"Gene name"       varchar(255),
	"Patient fraction"       Double,
	index       Integer,
	interactionDWID       varchar(255),
	class       varchar(255),
	patientDWID       varchar(255),
	sampleID       varchar(255),
	firstName       varchar(100),
	lastName       varchar(100),
	birthDate       datetime,
	Grouping       TINYINT
	);

	create type GeneAltCohortGroup as table
	(
	index       Integer,
	interactionDWID       varchar(255),
	class       varchar(255),
	patientDWID       varchar(255),
	sampleID       varchar(255),
	firstName       varchar(100),
	lastName       varchar(100),
	birthDate       datetime
	);



create table customattributes
	(
		attributename		varchar(255),
		level		varchar(14),
		datatype		varchar(9),
		arraysize		integer null,
		description		varchar(5000) null,
		DWAuditID     INTEGER,
		active		tinyint
	);

create table structuredcustomattributes
	(
		structuredattributename		varchar(255),
		level		varchar(14),
		attributename		varchar(255),
		attributeindex		integer,
		DWAuditID     INTEGER,
		separator		varchar(1),
		datatype		varchar(9),
		nullvalue		varchar(255) null,
		active		tinyint
	);

create table quantities
	(
		quantity		varchar(5000),
		chromosomeindex		integer,
		position		integer,
		value		float
	);

	create table Connections
	(
		Quantity     VARCHAR(5000),
		SourceChromosomeIndex     Integer,
		SourcePosition     Integer,
		TargetChromosomeIndex     Integer,
		TargetPosition     Integer,
		Value     real
	);

create view VariantInteractions as select
	VariantAnnotation.Genotype.Sample.PatientDWID as PATIENT_ID,
	VariantAnnotation.ChromosomeIndex || '_' || TO_VARCHAR(DWAuditID) || '_' || TO_VARCHAR(VariantIndex) || TO_VARCHAR(AlleleIndex) || IFNULL('_' || VariantAnnotation.GeneName, '') AS INTERACTION_ID,
	TO_BIGINT(VariantAnnotation.ChromosomeIndex) * 1000000000 + VariantAnnotation.Position as POSITION_START,
	TO_BIGINT(VariantAnnotation.ChromosomeIndex) * 1000000000 + VariantAnnotation.Position as POSITION_END,
	VariantAnnotation.SequenceAlteration as SEQUENCE_ALTERATION,
	VariantAnnotation.GeneName as GENE_NAME,
	VariantAnnotation.Region as REGION,
	VariantAnnotation."AminoAcid.Reference" as AA_REF,
	VariantAnnotation."AminoAcid.Alternative" as AA_ALT,
	VariantAnnotation.MutationType as VARIANT_TYPE
from GenotypeAlleles
where
	AlleleIndex > 0 AND AlleleCount > 0;

create view VariantInteractionsDW as select 
	VariantAnnotation.Genotype.Sample.PatientDWID as "PatientID",
	VariantAnnotation.ChromosomeIndex || '_' || TO_VARCHAR(DWAuditID) || '_' || TO_VARCHAR(VariantIndex) || TO_VARCHAR(AlleleIndex) || IFNULL('_' || VariantAnnotation.GeneName, '') AS "InteractionID",
	TO_BIGINT(VariantAnnotation.ChromosomeIndex) * 1000000000 + VariantAnnotation.Position as POSITION_START,
	TO_BIGINT(VariantAnnotation.ChromosomeIndex) * 1000000000 + VariantAnnotation.Position as POSITION_END,
	VariantAnnotation.SequenceAlteration as SEQUENCE_ALTERATION,
	VariantAnnotation.GeneName as GENE_NAME,
	VariantAnnotation.Region as REGION,
	VariantAnnotation."AminoAcid.Reference" as AA_REF,
	VariantAnnotation."AminoAcid.Alternative" as AA_ALT,
	VariantAnnotation.MutationType as VARIANT_TYPE,
	DWAuditID AS "DWAuditID",
	VariantIndex AS "VariantIndex",
	AlleleIndex AS "AlleleIndex",
	SampleIndex AS "SampleIndex"
from GenotypeAlleles
where
	AlleleIndex > 0 AND AlleleCount > 0;
