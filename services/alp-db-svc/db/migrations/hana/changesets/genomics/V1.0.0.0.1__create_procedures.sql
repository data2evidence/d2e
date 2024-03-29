
CREATE OR REPLACE procedure P_FillCodonsTable ( audit_id INTEGER ) AS
BEGIN
    DECLARE CURSOR chromosomes FOR
        SELECT
            ReferenceID,
            ChromosomeIndex
        FROM
            Chromosomes
        WHERE
            DWAuditID = :audit_id;
    
    FOR chromosome AS chromosomes DO
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'AAA', 'K','Lys');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'AAC', 'N','Asn');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'AAG', 'K','Lys');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'AAT', 'N','Asn');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'ACA', 'T','Thr');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'ACC', 'T','Thr');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'ACG', 'T','Thr');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'ACT', 'T','Thr');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'AGA', 'R','Arg');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'AGC', 'S','Ser');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'AGG', 'R','Arg');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'AGT', 'S','Ser');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'ATA', 'I','Ile');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'ATC', 'I','Ile');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'ATG', 'M','Met');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'ATT', 'I','Ile');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'CAA', 'Q','Gln');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'CAC', 'H','His');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'CAG', 'Q','Gln');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'CAT', 'H','His');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'CCA', 'P','Pro');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'CCC', 'P','Pro');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'CCG', 'P','Pro');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'CCT', 'P','Pro');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'CGA', 'R','Arg');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'CGC', 'R','Arg');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'CGG', 'R','Arg');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'CGT', 'R','Arg');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'CTA', 'L','Leu');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'CTC', 'L','Leu');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'CTG', 'L','Leu');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'CTT', 'L','Leu');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'GAA', 'E','Glu');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'GAC', 'D','Asp');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'GAG', 'E','Glu');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'GAT', 'D','Asp');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'GCA', 'A','Ala');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'GCC', 'A','Ala');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'GCG', 'A','Ala');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'GCT', 'A','Ala');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'GGA', 'G','Gly');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'GGC', 'G','Gly');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'GGG', 'G','Gly');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'GGT', 'G','Gly');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'GTA', 'V','Val');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'GTC', 'V','Val');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'GTG', 'V','Val');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'GTT', 'V','Val');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'TAA', '.','.');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'TAC', 'Y','Tyr');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'TAG', '.','.');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'TAT', 'Y','Tyr');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'TCA', 'S','Ser');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'TCC', 'S','Ser');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'TCG', 'S','Ser');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'TCT', 'S','Ser');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'TGA', '.','.');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'TGC', 'C','Cys');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'TGG', 'W','Trp');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'TGT', 'C','Cys');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'TTA', 'L','Leu');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'TTC', 'F','Phe');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'TTG', 'L','Leu');
        INSERT INTO Codons ( DWAuditID, ReferenceID, ChromosomeIndex, Codon, AminoAcid ,AminoAcidShort) VALUES ( :audit_id, chromosome.ReferenceID, chromosome.ChromosomeIndex, 'TTT', 'F','Phe');
    END FOR;
END;


create or replace FUNCTION GetMutationType (region nvarchar(1000),
	 refAllele nvarchar(1000),
	 altAllele nvarchar(1000),
	 refAmino nvarchar(1000),
	 altAmino nvarchar(1000),
	 vt nvarchar(1000) ) RETURNS mutationType nvarchar(1000) LANGUAGE SQLSCRIPT AS 
BEGIN 
if vt= 'INS' 
or vt = 'DEL' 
or ( region = 'CDS_region' 
	and (refAmino is null 
		or altAmino is null)) 
or region is null 
then mutationType = null
;
elseif altAmino = 'M' 
and region = 'five_prime_UTR' 
then mutationType ='5_prime_UTR_premature_start_codon_variant' 
;
elseif region = 'five_prime_UTR' 
then mutationType ='5_prime_UTR_variant' 
;
elseif region= 'intergenic_region' 
then mutationType ='intergenic_variant' 
;
elseif region= 'intron' 
then mutationType ='intron_variant' 
;
elseif region= 'three_prime_UTR' 
then mutationType ='3_prime_UTR_variant' 
;
elseif region= 'CDS_region' 
and altAmino='.' 
then mutationType ='stop_gained' 
;
elseif region= 'start_codon' 
then mutationType ='start_lost' 
;
elseif region= 'CDS_region' 
and altAmino != refAmino 
then mutationType ='missense_variant' 
;
elseif region= 'CDS_region' 
and altAmino = refAmino 
then mutationType ='synonymous_variant' 
;
elseif region= 'stop_codon' 
and altAmino = refAmino 
then mutationType ='stop_retained_variant' 
;
elseif region= 'stop_codon' 
and altAmino != refAmino 
then mutationType ='stop_lost' 
;
--elseif region= 'CDS_region' and round (abs(length(altAllele) - length(refAllele)/3)) = abs(length(altAllele) - length(refAllele)/3)
elseif region= 'CDS_region' 
and mod(length(altAllele) - length(refAllele),
	 3) = 0 
and length(refAllele) < length(altAllele) 
then mutationType ='inframe_insertion' 
;
elseif region= 'CDS_region' 
and mod(length(altAllele) - length(refAllele),
	 3) = 0 
and length(refAllele) > length(altAllele) 
then mutationType ='inframe_deletion' 
;
elseif region= 'CDS_region' 
and mod(length(altAllele) - length(refAllele),
	 3) !=0 
and length(refAllele) < length(altAllele) 
then mutationType ='frame_shift_elongation' 
;
elseif region= 'CDS_region' 
and mod(length(altAllele) - length(refAllele),
	 3) !=0 
and length(refAllele) > length(altAllele) 
then mutationType ='frame_shift_truncation' 
;
elseif region= 'trans_splice_acceptor_site' 
then mutationType = 'splice_acceptor_variant' 
;
elseif region= 'trans_splice_donor_site' 
then mutationType = 'splice_donor_variant' 
;
 
END IF;      
 
END;


create or replace Function getAminoAcidName (
	 aminoAcid nvarchar(1000),
	 format nvarchar(1000) ) RETURNS aminoAcidName nvarchar(1000) LANGUAGE SQLSCRIPT AS 
BEGIN 
if UPPER(:format)= 'THREE' then
  if UPPER(:aminoAcid) = 'A'
    then aminoAcidName ='Ala' ;
   elseif UPPER(:aminoAcid) = 'B'
     then aminoAcidName ='Asx' ;    
   elseif UPPER(:aminoAcid) = 'C'
     then aminoAcidName ='Cys' ;
   elseif UPPER(:aminoAcid) = 'D'
    then aminoAcidName ='Asp' ;
   elseif UPPER(:aminoAcid) = 'E'
    then aminoAcidName ='Glu' ;
   elseif UPPER(:aminoAcid) = 'F'
    then aminoAcidName ='Phe' ;
   elseif UPPER(:aminoAcid) = 'G'
    then aminoAcidName ='Gly' ;
   elseif UPPER(:aminoAcid) = 'H'
    then aminoAcidName ='His' ;
   elseif UPPER(:aminoAcid) = 'I'
    then aminoAcidName ='Ile' ;
   elseif UPPER(:aminoAcid) = 'K'
    then aminoAcidName ='Lys' ;
   elseif UPPER(:aminoAcid) = 'L'
    then aminoAcidName ='Leu' ;
   elseif UPPER(:aminoAcid) = 'M'
    then aminoAcidName ='Met' ;
   elseif UPPER(:aminoAcid) = 'N'
    then aminoAcidName ='Asn' ;
   elseif UPPER(:aminoAcid) = 'P'
    then aminoAcidName ='Pro' ;
   elseif UPPER(:aminoAcid) = 'Q'
    then aminoAcidName ='Gln' ;
   elseif UPPER(:aminoAcid) = 'R'
    then aminoAcidName ='Arg' ;
   elseif UPPER(:aminoAcid) = 'S'
    then aminoAcidName ='Ser' ;
   elseif UPPER(:aminoAcid) = 'T'
    then aminoAcidName ='Thr' ;
   elseif UPPER(:aminoAcid) = 'U'
    then aminoAcidName ='Sec' ;
   elseif UPPER(:aminoAcid) = 'V'
    then aminoAcidName ='Val' ;
   elseif UPPER(:aminoAcid) = 'W'
    then aminoAcidName ='Trp' ;
   elseif UPPER(:aminoAcid) = 'X'
    then aminoAcidName ='Xaa' ;
   elseif UPPER(:aminoAcid) = 'Y'
    then aminoAcidName ='Tyr' ;
   elseif UPPER(:aminoAcid) = 'Z'
    then aminoAcidName ='Glx' ;
   elseif UPPER(:aminoAcid) = '*'
    then aminoAcidName ='*' ;   
   elseif UPPER(:aminoAcid) = '.'
    then aminoAcidName ='*' ;  
   end if;    
else 
aminoAcidName =aminoAcid ;
 end if ;
 
END;


create or replace Function GetReverseComplement (codon nvarchar(1000)) 
       RETURNS modifiedCodon nvarchar(1000)
       LANGUAGE SQLSCRIPT AS
BEGIN

declare count int default 0;
declare base nvarchar(1000) default '';
modifiedCodon = '';
codon:=UPPER(codon);

 while count < length(codon) do
count = count +1;
base = substr(codon,count,1);
  if base = 'A'
  THEN 
  modifiedCodon = 'T' || modifiedCodon;
  end if; 
  if base = 'G'
  THEN
  modifiedCodon = 'C' || modifiedCodon;
  end if;
  if base = 'C'
  THEN
  modifiedCodon = 'G' || modifiedCodon;
  end if;
  if base = 'T'
  THEN
  modifiedCodon = 'A' || modifiedCodon;
  end if;
end while;
END;

create or replace procedure P_GeneAlteration (
    IN sample_list SampleList,
    IN variant_grouping VariantAnnotationGrouping,
    IN annotationGrouping BOOLEAN,
    IN sortColumn NVARCHAR(255),
    IN sortType NVARCHAR(10),
    IN reference NVARCHAR(255),
    IN guardedPatients Patients, -- TODO: change to Patient View
    OUT output GeneAlteration,
    OUT cohortgroup GeneAltCohortGroup)
   LANGUAGE SQLSCRIPT
   READS SQL DATA AS
BEGIN
   DECLARE totalPatients INTEGER;

   SELECT COUNT(DISTINCT S.PatientDWID) INTO totalPatients 
   FROM 
    SessionSampleGroups  TT       -- /* temporary temple for getting patients from cohorts*/
        JOIN Samples AS S
	           ON TT.SampleIndex = S.SampleIndex
        -- TODO
	    INNER JOIN :guardedPatients AS gp
	        ON S.PatientDWID = gp.DWID; 

    cohortgroup = SELECT S.SampleIndex AS index,
                    BINTOHEX(S.InteractionDWID) AS interactionDWID,
                    S.SampleClass AS class,
                    BINTOHEX(S.PatientDWID) AS patientDWID,
                    S.SampleID AS sampleID,
                    PA.GivenName AS firstName,
                    PA.FamilyName AS lastName,
                    PA.BirthDate AS birthDate
                    FROM
                    	:sample_list TT
                        	JOIN Samples AS S
	                        	ON TT.SampleIndex = S.SampleIndex
                            JOIN Patient_Attr AS PA 
	                        	ON PA.DWID=S.PatientDWID
                            -- TODO
	                        INNER JOIN :guardedPatients AS gp
	                            ON S.PatientDWID = gp.DWID;

   IF annotationGrouping = true
   THEN
            geneGroup = SELECT GA.GeneName AS "Gene name",
                            ROUND((COUNT(DISTINCT CG.patientDWID) / :totalPatients * 100), 4) AS "Patient fraction"
                         FROM 
                            :cohortgroup AS CG
                                JOIN Genotypes AS G
        	                        ON CG.index = G.SampleIndex AND G.ReferenceAlleleCount <> G.CopyNumber
        	                    JOIN Variants AS UV
        	                        ON G.DWAuditID = UV.DWAuditID AND G.VariantIndex = UV.VariantIndex
        	                    JOIN (SELECT DISTINCT CASE WHEN FeatureName IS NULL OR FeatureName = '' THEN FeatureID ELSE FeatureName END AS GeneName,
        	                        ChromosomeIndex,beginregion,endregion FROM Features WHERE ReferenceID=:reference AND Class='gene') AS GA
        	                        ON UV.ChromosomeIndex = GA.ChromosomeIndex AND UV.Position>= GA.beginregion AND UV.Position< GA.endregion
        	                    JOIN :variant_grouping
                                    ON :variant_grouping.DWAuditID = G.DWAuditID AND :variant_grouping.VariantIndex = G.VariantIndex 
        	            GROUP BY GA.GeneName        	           
            	        ORDER BY 
                            CASE WHEN :sortColumn = 'Gene name' AND :sortType = 'ASC' THEN "Gene name" ELSE NULL END ASC,
                            CASE WHEN :sortColumn = 'Gene name' AND :sortType = 'DESC' THEN "Gene name" ELSE NULL END DESC,
                            CASE WHEN :sortColumn = 'Patient fraction' AND :sortType = 'ASC' THEN "Patient fraction" ELSE NULL END ASC,
                            CASE WHEN :sortColumn = 'Patient fraction' AND :sortType = 'DESC' THEN "Patient fraction" ELSE NULL END DESC
	                    LIMIT 100;  
			
			output = SELECT DISTINCT GA.GeneName AS "Gene name",
                    GS."Patient fraction" AS "Patient fraction",
                    CG.index AS index,
                    CG.interactionDWID AS interactionDWID,
                    CG.class AS class,
                    CG.patientDWID AS patientDWID,
                    CG.sampleID AS sampleID,
                    CG.firstName AS firstName,
                    CG.lastName AS lastName,
                    CG.birthDate AS birthDate,
                    :variant_grouping.Grouping AS Grouping
                    FROM
                    	:cohortgroup AS CG
	                        JOIN Genotypes AS G
	                        	ON CG.index = G.SampleIndex AND G.ReferenceAlleleCount <> G.CopyNumber
	                        JOIN Variants AS UV
	                           	ON G.DWAuditID = UV.DWAuditID AND G.VariantIndex = UV.VariantIndex
	                        JOIN :variant_grouping
                                ON :variant_grouping.DWAuditID = G.DWAuditID AND :variant_grouping.VariantIndex = G.VariantIndex
	                        JOIN (SELECT DISTINCT CASE WHEN FeatureName IS NULL OR FeatureName = '' THEN FeatureID ELSE FeatureName END AS GeneName,
	                            ChromosomeIndex,beginregion,endregion FROM Features WHERE ReferenceID=:reference AND Class='gene') AS GA
	                        	ON UV.ChromosomeIndex = GA.ChromosomeIndex AND UV.Position>= GA.beginregion AND UV.Position< GA.endregion
	                       JOIN :geneGroup AS GS
                                ON GA.GeneName= GS."Gene name"
					ORDER BY 
                            CASE WHEN :sortColumn = 'Gene name' AND :sortType = 'ASC' THEN "Gene name" ELSE NULL END ASC,
                            CASE WHEN :sortColumn = 'Gene name' AND :sortType = 'DESC' THEN "Gene name" ELSE NULL END DESC,
                            CASE WHEN :sortColumn = 'Patient fraction' AND :sortType = 'ASC' THEN "Patient fraction" ELSE NULL END ASC,
                            CASE WHEN :sortColumn = 'Patient fraction' AND :sortType = 'DESC' THEN "Patient fraction" ELSE NULL END DESC;
	                    
	    
	ELSE
			geneGroup = SELECT GA.GeneName AS "Gene name",
						 ROUND((COUNT(DISTINCT CG.patientDWID) / :totalPatients * 100), 4) AS "Patient fraction"
						 FROM 
							:cohortgroup AS CG
								JOIN Genotypes AS G
									ON CG.index = G.SampleIndex AND G.ReferenceAlleleCount <> G.CopyNumber
							    JOIN Variants AS UV
									ON G.DWAuditID = UV.DWAuditID AND G.VariantIndex = UV.VariantIndex
								JOIN (SELECT DISTINCT CASE WHEN FeatureName IS NULL OR FeatureName = '' THEN FeatureID ELSE FeatureName END AS GeneName,
	                            ChromosomeIndex,beginregion,endregion FROM Features WHERE ReferenceID=:reference AND Class='gene') AS GA
	                        	ON UV.ChromosomeIndex = GA.ChromosomeIndex AND UV.Position>= GA.beginregion AND UV.Position< GA.endregion
						GROUP BY GA.GeneName
						ORDER BY 
                                CASE WHEN :sortColumn = 'Gene name' AND :sortType = 'ASC' THEN "Gene name" ELSE NULL END ASC,
                                CASE WHEN :sortColumn = 'Gene name' AND :sortType = 'DESC' THEN "Gene name" ELSE NULL END DESC,
                                CASE WHEN :sortColumn = 'Patient fraction' AND :sortType = 'ASC' THEN "Patient fraction" ELSE NULL END ASC,
                                CASE WHEN :sortColumn = 'Patient fraction' AND :sortType = 'DESC' THEN "Patient fraction" ELSE NULL END DESC
						LIMIT 100;
						
			output = SELECT DISTINCT GA.GeneName AS "Gene name",
                    GS."Patient fraction" AS "Patient fraction",
                    CG.index AS index,
                    CG.interactionDWID AS interactionDWID,
                    CG.class AS class,
                    CG.patientDWID AS patientDWID,
                    CG.sampleID AS sampleID,
                    CG.firstName AS firstName,
                    CG.lastName AS lastName,
                    CG.birthDate AS birthDate,
                    0 AS Grouping
                    FROM
                    	:cohortgroup AS CG
	                        JOIN Genotypes AS G
	                        	ON CG.index = G.SampleIndex AND G.ReferenceAlleleCount <> G.CopyNumber
	                        JOIN Variants AS UV
	                           	ON G.DWAuditID = UV.DWAuditID AND G.VariantIndex = UV.VariantIndex
	                        JOIN (SELECT DISTINCT CASE WHEN FeatureName IS NULL OR FeatureName = '' THEN FeatureID ELSE FeatureName END AS GeneName,
	                            ChromosomeIndex,beginregion,endregion FROM Features WHERE ReferenceID=:reference AND Class='gene') AS GA
	                        	ON UV.ChromosomeIndex = GA.ChromosomeIndex AND UV.Position>= GA.beginregion AND UV.Position< GA.endregion
	                       JOIN :geneGroup AS GS
                                ON GA.GeneName= GS."Gene name"
					ORDER BY 
                            CASE WHEN :sortColumn = 'Gene name' AND :sortType = 'ASC' THEN "Gene name" ELSE NULL END ASC,
                            CASE WHEN :sortColumn = 'Gene name' AND :sortType = 'DESC' THEN "Gene name" ELSE NULL END DESC,
                            CASE WHEN :sortColumn = 'Patient fraction' AND :sortType = 'ASC' THEN "Patient fraction" ELSE NULL END ASC,
                            CASE WHEN :sortColumn = 'Patient fraction' AND :sortType = 'DESC' THEN "Patient fraction" ELSE NULL END DESC;
	END IF;
END;


create or replace procedure P_GeneCohortPValue (IN GenesAffectedinCohort GeneAffectedinCohort
, OUT PValue PValue) 
      LANGUAGE SQLSCRIPT AS 
n         BIGINT;
a         BIGINT;
b         BIGINT;
c         BIGINT;
d         BIGINT;
sumab     BIGINT;
sumcd     BIGINT;
sumac     BIGINT;
sumbd     BIGINT;
loga      DOUBLE;
logb      DOUBLE;
logc      DOUBLE;
logd      DOUBLE;
logsumab  DOUBLE;
logsumcd  DOUBLE;
logsumac  DOUBLE;
logsumbd  DOUBLE;
logsum    DOUBLE;
OnePValue DOUBLE;

CURSOR PVal for 
select * from :GenesAffectedinCohort;

BEGIN

FOR GeneAffectedinCohort AS PVal DO

a := GeneAffectedinCohort.Cohort1Affected;
b := GeneAffectedinCohort.Cohort2Affected;
c := GeneAffectedinCohort.Cohort1Total - a;
d := GeneAffectedinCohort.Cohort2Total - b;
sumab := a + b + 1;
sumcd := c + d + 1;
sumac := a + c + 1; 
sumbd := b + d + 1;
n := GeneAffectedinCohort.Cohort1Total + GeneAffectedinCohort.Cohort2Total + 1;
c := c + 1;
d := d + 1;
a := a + 1;
b := b + 1;

-- log factorial with Stirlings approximation ==> (x - 0.5)*LN(x) - x + 0.5*LN(2*PI) + 1.0/(12.0*x) 
loga := (a - 0.5) * LN(a) - a + 0.5 * LN(2 * 3.14159) + 1.0/(12.0 * a);
logb := (b - 0.5) * LN(b) - b + 0.5 * LN(2 * 3.14159) + 1.0/(12.0 * b);
logc := (c - 0.5) * LN(c) - c + 0.5 * LN(2 * 3.14159) + 1.0/(12.0 * c);
logd := (d - 0.5) * LN(d) - d + 0.5 * LN(2 * 3.14159) + 1.0/(12.0 * d);

logsumab := (sumab - 0.5) * LN(sumab) - sumab + 0.5 * LN(2 * 3.14159) + 1.0/(12.0 * sumab); 
logsumcd := (sumcd - 0.5) * LN(sumcd) - sumcd + 0.5 * LN(2 * 3.14159) + 1.0/(12.0 * sumcd);
logsumac := (sumac - 0.5) * LN(sumac) - sumac + 0.5 * LN(2 * 3.14159) + 1.0/(12.0 * sumac);
logsumbd := (sumbd - 0.5) * LN(sumbd) - sumbd + 0.5 * LN(2 * 3.14159) + 1.0/(12.0 * sumbd);
   
logsum := (n - 0.5) * LN(n) - n + 0.5 * LN(2 * 3.14159) + 1.0/(12.0 * n);

-- Log of PValue ==> [log{(a+b)!} + log{(c+d)!} + log{(a+c)!} + log{(b+d)!}] − [log{N!} + log{a!} + log{b!} + log{c!} + log{d!}] 
OnePValue := (logsumab + logsumcd + logsumac + logsumbd) - (logsum + loga + logb + logc + logd);

PValue = select GeneAffectedinCohort.GeneName, 
				OnePValue AS PValue
                from DUMMY
			UNION ALL 
			select * from :PValue;
END FOR ;

END;


create or replace procedure P_GeneCorrelation (
	IN sample_list SampleList,
	IN variant_grouping VariantAnnotationGrouping,
	IN reference NVARCHAR(255),
	OUT output_table table(GeneName NVARCHAR(255),
						   PatientDWID NVARCHAR(255),
						   TotalPatients INTEGER)
	)
   	LANGUAGE SQLSCRIPT
  	 READS SQL DATA AS
BEGIN
	DECLARE totalPatients INTEGER;
   
   	SELECT COUNT(DISTINCT S.PatientDWID) INTO totalPatients 
   	FROM 
   	:sample_list TT
    	INNER JOIN Samples AS S
	    	ON TT.SampleIndex = S.SampleIndex;

	output_table = SELECT DISTINCT
		F.GeneName AS GeneName,
	 	BINTOHEX(S.PatientDWID) AS PatientDWID,
	 	:totalPatients AS TotalPatients
	FROM 
	:sample_list TT
    	INNER JOIN Samples AS S
	    	ON TT.SampleIndex = S.SampleIndex
	    INNER JOIN Genotypes AS G
	        ON TT.SampleIndex = G.SampleIndex AND G.ReferenceAlleleCount <> G.CopyNumber
	    INNER JOIN Variants AS UV
           	ON G.DWAuditID = UV.DWAuditID AND G.VariantIndex = UV.VariantIndex
        INNER JOIN :variant_grouping
        	ON :variant_grouping.DWAuditID = UV.DWAuditID AND :variant_grouping.VariantIndex = UV.VariantIndex
        INNER JOIN (SELECT DISTINCT CASE WHEN FeatureName IS NULL OR FeatureName = '' THEN FeatureID ELSE FeatureName END AS GeneName,
			  ChromosomeIndex,beginregion,endregion 
    	      FROM Features WHERE ReferenceID=:reference AND Class='gene') AS F
    	      ON UV.ChromosomeIndex = F.ChromosomeIndex AND UV.Position BETWEEN F.beginregion AND F.endregion-1
    ORDER BY GeneName;
      
END;
 
--  DONE
create or replace procedure P_GeneSummary (
    IN sample_list SampleList,
    IN variant_grouping VariantAnnotationGrouping,
    IN annotationGrouping BOOLEAN,
    IN sortColumn NVARCHAR(255),
    IN sortType NVARCHAR(10),
    IN reference NVARCHAR(255),
    OUT output_table GeneSummary)
   LANGUAGE SQLSCRIPT
   READS SQL DATA AS
BEGIN
   DECLARE totalPatients INTEGER;
   
   SELECT COUNT(DISTINCT S.PatientDWID) INTO totalPatients 
   FROM 
    :sample_list TT                   /* temporary temple for getting patients from cohorts*/
        JOIN Samples AS S
	           ON TT.SampleIndex = S.SampleIndex;
	
	IF annotationGrouping = true
    THEN  
        output_table = SELECT GA.GeneName AS "Gene name",
        COUNT(DISTINCT S.PatientDWID) AS "Patient count", 
        ROUND((COUNT(DISTINCT S.PatientDWID) / :totalPatients * 100),4) AS "Patient fraction",
        COUNT(DISTINCT UV.VariantIndex)AS "Variant count", 
        :totalPatients AS "Total patients"
        FROM 
    	:sample_list TT
        JOIN Samples AS S
    	    ON TT.SampleIndex = S.SampleIndex
    	JOIN Genotypes AS G
    	    ON TT.SampleIndex = G.SampleIndex AND G.ReferenceAlleleCount <> G.CopyNumber
    	JOIN Variants AS UV
    	    ON G.DWAuditID = UV.DWAuditID AND G.VariantIndex = UV.VariantIndex
    	JOIN :variant_grouping
            ON :variant_grouping.DWAuditID = UV.DWAuditID AND :variant_grouping.VariantIndex = UV.VariantIndex
    	JOIN (SELECT DISTINCT CASE WHEN FeatureName IS NULL OR FeatureName = '' THEN FeatureID ELSE FeatureName END AS GeneName,
                ChromosomeIndex,beginregion,endregion 
                FROM Features WHERE ReferenceID=:reference AND Class='gene') AS GA
    	            ON UV.ChromosomeIndex = GA.ChromosomeIndex AND UV.Position>= GA.beginregion AND UV.Position< GA.endregion
                GROUP BY GA.GeneName
                ORDER BY CASE WHEN :sortColumn = 'Gene name' AND :sortType = 'ASC' THEN "Gene name" ELSE NULL END ASC,
                         CASE WHEN :sortColumn = 'Gene name' AND :sortType = 'DESC' THEN "Gene name" ELSE NULL END DESC,
                         CASE WHEN :sortColumn = 'Patient fraction' AND :sortType = 'ASC' THEN "Patient fraction" ELSE NULL END ASC,
                         CASE WHEN :sortColumn = 'Patient fraction' AND :sortType = 'DESC' THEN "Patient fraction" ELSE NULL END DESC,
                         CASE WHEN :sortColumn = 'Patient count' AND :sortType = 'ASC' THEN "Patient count" ELSE NULL END ASC,
                         CASE WHEN :sortColumn = 'Patient count' AND :sortType = 'DESC' THEN "Patient count" ELSE NULL END DESC,
                         CASE WHEN :sortColumn = 'Variant count' AND :sortType = 'ASC' THEN "Variant count" ELSE NULL END ASC,
                         CASE WHEN :sortColumn = 'Variant count' AND :sortType = 'DESC' THEN "Variant count" ELSE NULL END DESC
                LIMIT 100 ;
            
    ELSE 
    output_table = SELECT GA.GeneName AS "Gene name",
                    COUNT(DISTINCT S.PatientDWID) AS "Patient count", 
                    ROUND((COUNT(DISTINCT S.PatientDWID) / :totalPatients * 100),4) AS "Patient fraction",
                    COUNT(DISTINCT UV.VariantIndex)AS "Variant count", 
                    :totalPatients AS "Total patients"
                    FROM 
	                    :sample_list TT
                        	JOIN Samples AS S
	                        	ON TT.SampleIndex = S.SampleIndex
	                        JOIN Genotypes AS G
	                        	ON TT.SampleIndex = G.SampleIndex AND G.ReferenceAlleleCount <> G.CopyNumber
	                        JOIN Variants AS UV
	                           	ON G.DWAuditID = UV.DWAuditID AND G.VariantIndex = UV.VariantIndex
	                        JOIN (SELECT DISTINCT CASE WHEN FeatureName IS NULL OR FeatureName = '' THEN FeatureID ELSE FeatureName END AS GeneName,
	                              ChromosomeIndex,beginregion,endregion 
                                  FROM Features WHERE ReferenceID=:reference AND Class='gene') AS GA
	                        	ON UV.ChromosomeIndex = GA.ChromosomeIndex AND UV.Position>= GA.beginregion AND UV.Position< GA.endregion
                    GROUP BY GA.GeneName
                    ORDER BY CASE WHEN :sortColumn = 'Gene name' AND :sortType = 'ASC' THEN "Gene name" ELSE NULL END ASC,
                             CASE WHEN :sortColumn = 'Gene name' AND :sortType = 'DESC' THEN "Gene name" ELSE NULL END DESC,
                             CASE WHEN :sortColumn = 'Patient fraction' AND :sortType = 'ASC' THEN "Patient fraction" ELSE NULL END ASC,
                             CASE WHEN :sortColumn = 'Patient fraction' AND :sortType = 'DESC' THEN "Patient fraction" ELSE NULL END DESC,
                             CASE WHEN :sortColumn = 'Patient count' AND :sortType = 'ASC' THEN "Patient count" ELSE NULL END ASC,
                             CASE WHEN :sortColumn = 'Patient count' AND :sortType = 'DESC' THEN "Patient count" ELSE NULL END DESC,
                             CASE WHEN :sortColumn = 'Variant count' AND :sortType = 'ASC' THEN "Variant count" ELSE NULL END ASC,
                             CASE WHEN :sortColumn = 'Variant count' AND :sortType = 'DESC' THEN "Variant count" ELSE NULL END DESC
                    LIMIT 100;
        
    END IF;
   END;
   
--  DONE
   create or replace procedure P_DeletePatient ( IN PatientId VARBINARY(32) )
    LANGUAGE SQLSCRIPT
    SQL SECURITY DEFINER
    AS
BEGIN 
  -- get all SampleIdx that match this PatientId
  DECLARE CURSOR sample_idx_cursor
    FOR SELECT SampleIndex
		FROM Samples
   		WHERE PatientDWID = :PatientId;
   			
   	FOR sample_idx AS sample_idx_cursor DO
   		relevantAuditIds = SELECT DWAuditID
			FROM Genotypes
   			WHERE SampleIndex = :sample_idx.SampleIndex;
   			
   		-- Delete data corresponding directly to the patientid
   		DELETE FROM Genotypes WHERE SampleIndex = :sample_idx.SampleIndex;
   		DELETE FROM GenotypeMultiValueAttributes WHERE SampleIndex = :sample_idx.SampleIndex;
   		DELETE FROM Haplotypes WHERE SampleIndex = :sample_idx.SampleIndex;
   		DELETE FROM GenotypeAlleles WHERE SampleIndex = :sample_idx.SampleIndex;
   		DELETE FROM Samples WHERE SampleIndex = :sample_idx.SampleIndex;
   		
   		--Look for empty analysis
   		BEGIN
    		DECLARE CURSOR audit_id_cursor
        		FOR SELECT DWAuditID
    			    FROM :relevantAuditIds;
    		DECLARE sample_count INTEGER;
    	    FOR audit_id AS audit_id_cursor DO
    	        SELECT COUNT(SampleIndex) INTO sample_count FROM Genotypes WHERE DWAuditID = :audit_id.DWAuditID;
    	        IF sample_count = 0 THEN
    	            DELETE FROM Variants WHERE DWAuditID = :audit_id.DWAuditID;
    	            DELETE FROM VariantMultiValueAttributes WHERE DWAuditID = :audit_id.DWAuditID;
    	            DELETE FROM VariantAlleles WHERE DWAuditID = :audit_id.DWAuditID;
    	            DELETE FROM VariantStructuredAttributes WHERE DWAuditID = :audit_id.DWAuditID;
    	            DELETE FROM Headers WHERE DWAuditID = :audit_id.DWAuditID;
    	            DELETE FROM VariantAnnotations WHERE DWAuditID = :audit_id.DWAuditID;
    	        END IF;
            END FOR;
        END;
   	END FOR;
END;

create or replace procedure P_DeletePatientWorkAround ( IN PatientIdChar NVarchar(64) )
    LANGUAGE SQLSCRIPT
    SQL SECURITY DEFINER
    AS
BEGIN
  CALL P_DeletePatient (HEXTOBIN (  :PatientIdChar ));
END;


create or replace procedure P_GetPatientInfo ( IN PatientId VARBINARY(32),
    OUT  Genotypes Genotypes,
    OUT GenotypeMultiValueAttributes GenotypeMultiValueAttributes,
    OUT Haplotypes Haplotypes,
    OUT GenotypeAlleles GenotypeAlleles,
    OUT Samples Samples,
    OUT Variants Variants,
    OUT VariantMultiValueAttributes VariantMultiValueAttributes,
    OUT VariantAlleles VariantAlleles,
    OUT VariantStructuredAttributes VariantStructuredAttributes,
    OUT Headers Headers,
    OUT VariantAnnotations VariantAnnotations)
    LANGUAGE SQLSCRIPT
    SQL SECURITY DEFINER
    AS
BEGIN 
  -- get all SampleIdx that match this PatientId
  DECLARE CURSOR sample_idx_cursor
    FOR SELECT SampleIndex
        FROM Samples
        WHERE PatientDWID = :PatientId;
            
    FOR sample_idx AS sample_idx_cursor DO
        relevantAuditIds = SELECT DWAuditID
            FROM Genotypes
            WHERE SampleIndex = :sample_idx.SampleIndex;
            
        -- Delete data corresponding directly to the patientid
        Genotypes = SELECT * FROM Genotypes WHERE SampleIndex = :sample_idx.SampleIndex;
        GenotypeMultiValueAttributes = SELECT * FROM GenotypeMultiValueAttributes WHERE SampleIndex = :sample_idx.SampleIndex;
        Haplotypes = SELECT * FROM Haplotypes WHERE SampleIndex = :sample_idx.SampleIndex;
        GenotypeAlleles = SELECT * FROM GenotypeAlleles WHERE SampleIndex = :sample_idx.SampleIndex;
        Samples = SELECT * FROM Samples WHERE SampleIndex = :sample_idx.SampleIndex;
        
        --Look for empty analysis
        BEGIN
            DECLARE CURSOR audit_id_cursor
                FOR SELECT DWAuditID
                    FROM :relevantAuditIds;
            DECLARE sample_count INTEGER;
            FOR audit_id AS audit_id_cursor DO
                SELECT COUNT(SampleIndex) INTO sample_count FROM Genotypes WHERE SampleIndex = :sample_idx.SampleIndex;
                IF sample_count = 0 THEN
                    Variants = SELECT * FROM Variants WHERE DWAuditID = :audit_id.DWAuditID;
                    VariantMultiValueAttributes = SELECT * FROM VariantMultiValueAttributes WHERE DWAuditID = :audit_id.DWAuditID;
                    VariantAlleles = SELECT * FROM VariantAlleles WHERE DWAuditID = :audit_id.DWAuditID;
                    VariantStructuredAttributes = SELECT * FROM VariantStructuredAttributes WHERE DWAuditID = :audit_id.DWAuditID;
                    Headers = SELECT * FROM Headers WHERE DWAuditID = :audit_id.DWAuditID;
                    VariantAnnotations = SELECT * FROM VariantAnnotations WHERE DWAuditID = :audit_id.DWAuditID;
                END IF;
            END FOR;
        END;
    END FOR;
END;


create or replace procedure P_GetPatientInfoWorkAround ( IN PatientIdChar NVarchar(64),
    OUT Genotypes Genotypes,
    OUT GenotypeMultiValueAttributes GenotypeMultiValueAttributes,
    OUT Haplotypes Haplotypes,
    OUT GenotypeAlleles GenotypeAlleles,
    OUT Samples Samples,
    OUT Variants Variants,
    OUT VariantMultiValueAttributes VariantMultiValueAttributes,
    OUT VariantAlleles VariantAlleles,
    OUT VariantStructuredAttributes VariantStructuredAttributes,
    OUT Headers Headers,
    OUT VariantAnnotations VariantAnnotations)
    LANGUAGE SQLSCRIPT
    SQL SECURITY DEFINER
    AS
BEGIN
    CALL P_GetPatientInfo(
        HEXTOBIN(:PatientIdChar),
        Genotypes,
        GenotypeMultiValueAttributes,
        Haplotypes,
        GenotypeAlleles,
        Samples,
        Variants,
        VariantMultiValueAttributes,
        VariantAlleles,
        VariantStructuredAttributes,
        Headers,
        VariantAnnotations
    );
END;


create or replace procedure P_SampleNames (
        IN sample_list SampleList,
        OUT sample_names SampleNames
    )
    LANGUAGE SQLSCRIPT
    SQL SECURITY INVOKER
    READS SQL DATA AS
BEGIN
    sample_names = SELECT
            QuerySamples.SampleIndex,
            KnownSamples.SampleID AS SampleName
        FROM
            :sample_list AS QuerySamples
        LEFT OUTER JOIN
            Samples AS KnownSamples
        ON
            QuerySamples.SampleIndex = KnownSamples.SampleIndex
        ORDER BY
            SampleID;
END;


create or replace procedure P_updateNextSampleSequence ( 
IN reserveCount INT) 
	LANGUAGE SQLSCRIPT
	SQL SECURITY DEFINER AS
BEGIN
 
DECLARE count INT;
DECLARE value INT;
DECLARE endValue INT;

--Generating sequence for each Sample
SELECT COUNT(*) into count FROM Sequences WHERE SequenceID='SampleIndex';

IF :count=1 THEN
   SELECT TOP 1 Value INTO value FROM Sequences WHERE SequenceID='SampleIndex';
   SELECT TOP 1 Value INTO endValue FROM Sequences WHERE SequenceID='SampleIndex';	
ELSE
	value := -1;
	endValue := -1;
	INSERT INTO Sequences (SequenceID,Value) VALUES ('SampleIndex',:value);
END IF;

END;


create or replace procedure P_updateSampleSequence ( 
IN reserveCount INT) 
	LANGUAGE SQLSCRIPT
	SQL SECURITY DEFINER AS
BEGIN
 
DECLARE count INT;
DECLARE value INT;
DECLARE endValue INT;

--Generating sequence for each Sample
SELECT COUNT(*) into count FROM Sequences WHERE SequenceID='SampleIndex';

IF :count=1 THEN
   SELECT TOP 1 Value INTO value FROM Sequences WHERE SequenceID='SampleIndex';
   SELECT TOP 1 Value INTO endValue FROM Sequences WHERE SequenceID='SampleIndex';	
ELSE
	value := -1;
	endValue := -1;
	INSERT INTO Sequences (SequenceID,Value) VALUES ('SampleIndex',:value);
END IF;

END;


create or replace procedure P_AlleleStatistics ( 
        IN sample_list SampleList,
        IN chromosome_index INTEGER,
        IN position INTEGER,
        IN allele NVARCHAR( 255 ),
        OUT affected_count INTEGER,
        OUT sample_count INTEGER
    )
   LANGUAGE SQLSCRIPT
   SQL SECURITY INVOKER
   READS SQL DATA AS
BEGIN
    SELECT COUNT( DISTINCT PatientDWID ) INTO sample_count FROM :sample_list AS samples INNER JOIN Samples AS all_samples ON samples.SampleIndex = all_samples.SampleIndex;
    
    SELECT
            COUNT( DISTINCT AllSamples.PatientDWID ) INTO affected_count
        FROM
            :sample_list AS Samples
            INNER JOIN Samples AS AllSamples
                ON Samples.SampleIndex = AllSamples.SampleIndex
            JOIN  GenotypeAlleles AS GenotypeAlleles
                ON GenotypeAlleles.SampleIndex = Samples.SampleIndex
            JOIN Variants AS Variants
                ON GenotypeAlleles.DWAuditID = Variants.DWAuditID
                AND GenotypeAlleles.VariantIndex = Variants.VariantIndex
            JOIN VariantAlleles AS VariantAlleles
                ON Variants.DWAuditID = VariantAlleles.DWAuditID
                AND Variants.VariantIndex = VariantAlleles.VariantIndex
        WHERE GenotypeAlleles.AlleleCount > 0
            AND VariantAlleles.Allele = :allele
            AND Variants.ChromosomeIndex = :chromosome_index
            AND Variants.Position = :position;
END;


create or replace procedure P_DisplayVariants (
        IN sample_list SampleList,
        IN variant_grouping VariantAnnotationGrouping,
        IN chromosome_index INTEGER,
        IN begin_position INTEGER,
        IN end_position INTEGER,
        OUT display_variants GroupedDisplayVariants,
        OUT sample_count INTEGER
    )
    LANGUAGE SQLSCRIPT
    SQL SECURITY INVOKER
    READS SQL DATA AS
BEGIN
    DECLARE position_array INTEGER ARRAY;
    DECLARE allele_array VARCHAR( 255 ) ARRAY;
    DECLARE grouping_array TINYINT ARRAY;
    DECLARE allele_count_array INTEGER ARRAY;
    DECLARE copy_number_array INTEGER ARRAY;
    DECLARE reference_allele VARCHAR( 255 );
    DECLARE variant_group TINYINT;
    DECLARE alternative_allele VARCHAR( 255 );
    DECLARE position_cursor INTEGER;
    DECLARE inner_position_cursor INTEGER;
    DECLARE outer_position_cursor INTEGER;
    DECLARE row_index INTEGER := 1;
    DECLARE groupingCount INTEGER;
    DECLARE last_reference_allele VARCHAR( 255 );
    DECLARE CURSOR grouped_variants ( data_model_variants GroupedDataModelVariants ) FOR
        SELECT
            Position,
            AlleleIndex,
            Allele,
            AlleleCount,
            SUM( AlleleCount / GroupCount ) OVER ( PARTITION BY Position ) AS CopyNumber,
            Grouping
        FROM
            :data_model_variants 
        ORDER BY
            Position ASC,
            AlleleIndex ASC;

    -- find sites overlapping selected area
    variant_positions = SELECT DISTINCT
            Position
        FROM
            DataModelVariants
        WHERE
            ChromosomeIndex = :chromosome_index AND
            Position < :end_position AND
            Position + LENGTH( Allele ) >= :begin_position AND
            ( AlleleIndex = 0 OR AlleleCount > 0 );

    SELECT COUNT( * ) INTO groupingCount FROM :variant_grouping;
    IF groupingCount > 0 THEN
        -- query data model variants
        SELECT COUNT( DISTINCT PatientDWID ) INTO sample_count FROM :sample_list AS samples INNER JOIN Samples AS all_samples ON samples.SampleIndex = all_samples.SampleIndex;
        IF :sample_count = 1 THEN
            DECLARE sample_index INTEGER;
            SELECT SampleIndex INTO sample_index FROM :sample_list;
    
            data_model_variants = SELECT
                    variants.Position,
                    variants.AlleleIndex,
                    variants.Allele,
                    SUM( variants.AlleleCount ) AS AlleleCount
                FROM
                    DataModelVariants AS variants
                WHERE
                    variants.ChromosomeIndex = :chromosome_index AND
                    variants.Position IN ( SELECT * FROM :variant_positions ) AND
                    variants.SampleIndex = :sample_index AND
                    ( variants.AlleleIndex = 0 OR variants.AlleleCount > 0 )
                GROUP BY
                    variants.Position,
                    variants.AlleleIndex,
                    variants.Allele;
        ELSEIF :sample_count > 1 THEN
            data_model_variants = SELECT
                    variants.Position,
                    variants.AlleleIndex,
                    variants.Allele,
                    SUM( variants.AlleleCount ) AS AlleleCount
                FROM
                    DataModelVariants AS variants
                WHERE
                    variants.ChromosomeIndex = :chromosome_index AND
                    variants.Position IN ( SELECT * FROM :variant_positions ) AND
                    variants.SampleIndex IN ( SELECT * FROM :sample_list ) AND
                    ( variants.AlleleIndex = 0 OR variants.AlleleCount > 0 )
                GROUP BY
                    variants.Position,
                    variants.AlleleIndex,
                    variants.Allele;
        END IF;
            
        allele_grouping = SELECT 
            variants.Position,
            variants.AlleleIndex, 
            groups.Grouping
            FROM :variant_grouping AS groups
            JOIN DataModelVariants AS variants
                ON groups.DWAuditID = variants.DWAuditID AND
                groups.VariantIndex = variants.VariantIndex AND
                groups.AlleleIndex = variants.AlleleIndex;            
    
        grouped_data_model_variants = SELECT 
            variants.Position,
            variants.AlleleIndex,
            variants.Allele,
            groups.Grouping,
            COUNT(*) OVER ( PARTITION BY variants.Position, variants.AlleleIndex ) AS GroupCount,
            variants.AlleleCount
            FROM :data_model_variants AS variants
            LEFT OUTER JOIN :allele_grouping AS groups
                ON variants.Position = groups.Position AND
                variants.AlleleIndex = groups.AlleleIndex
            ORDER BY
                variants.Position,
                variants.AlleleIndex,
                groups.Grouping;
    
        -- iterate over data model variants transforming them into display variants
        IF :sample_count > 0 THEN
        	FOR variant AS grouped_variants ( :grouped_data_model_variants ) DO
        	    IF variant.Position = :outer_position_cursor THEN
        	        reference_allele := last_reference_allele;
        	    ELSE
        	        reference_allele := 'N';
        	    END IF;
        	    IF variant.AlleleIndex = 0 THEN
        	        reference_allele := variant.Allele;
        	        last_reference_allele := variant.Allele;
        	        outer_position_cursor := variant.Position;
        	    ELSEIF variant.AlleleIndex > 0 AND variant.AlleleCount > 0 THEN
        	        variant_group := variant.Grouping;
        	        grouping_array[ :row_index ] := variant_group;
        	        alternative_allele := variant.Allele;
        	        inner_position_cursor := variant.Position;
        	        WHILE LENGTH( :reference_allele ) > 0 OR LENGTH( :alternative_allele ) > 0 DO
        	            IF LENGTH( :reference_allele ) <= 1 AND LENGTH( :alternative_allele ) > LENGTH( :reference_allele ) THEN -- insertion
                            position_array[ :row_index ] := :inner_position_cursor;
                            allele_count_array[ :row_index ] := variant.AlleleCount;
                            copy_number_array[ :row_index ] := variant.CopyNumber;
                            allele_array[ :row_index ] := :alternative_allele;
            	            BREAK;
        	            ELSEIF LENGTH( :alternative_allele ) = 0 THEN -- deletion
                            allele_array[ :row_index ] := '';
            	            reference_allele := SUBSTRING( :reference_allele, 2 );
        	            ELSEIF SUBSTRING( :reference_allele, 1, 1 ) <> SUBSTRING( :alternative_allele, 1, 1 ) THEN -- substitution
                            allele_array[ :row_index ] := SUBSTRING( :alternative_allele, 1, 1 );
            	            reference_allele := SUBSTRING( :reference_allele, 2 );
            	            alternative_allele := SUBSTRING( :alternative_allele, 2 );
        	            ELSE -- reference
            	            reference_allele := SUBSTRING( :reference_allele, 2 );
            	            alternative_allele := SUBSTRING( :alternative_allele, 2 );
            	            inner_position_cursor := :inner_position_cursor + 1;
        	                CONTINUE;
        	            END IF;
        
                        position_array[ :row_index ] := :inner_position_cursor;
                        allele_count_array[ :row_index ] := variant.AlleleCount;
                        copy_number_array[ :row_index ] := variant.CopyNumber;
                        
        
        	            inner_position_cursor := :inner_position_cursor + 1;
        	            row_index := :row_index + 1;
        	        END WHILE;
        	    END IF;
            END FOR;
        END IF;
        -- create output table and combine overlapping alleles
        grouped_unaggregated_display_variants = UNNEST( :position_array, :allele_array, :allele_count_array, :copy_number_array, :grouping_array ) AS ( Position, Allele, AlleleCount, CopyNumber, Grouping );
        display_variants = SELECT
                Position,
                Allele,
                Grouping,
                SUM( AlleleCount ) AS AlleleCount,
                MAX( CopyNumber ) AS CopyNumber
            FROM
                :grouped_unaggregated_display_variants
            WHERE
                Position BETWEEN :begin_position AND
                :end_position - 1 
            GROUP BY
                Position,
                Allele,
                Grouping
            ORDER BY
                Position ASC,
                AlleleCount DESC,
                Grouping;
        
    ELSE
        DECLARE CURSOR variants ( data_model_variants DataModelVariants ) FOR
        SELECT
            Position,
            AlleleIndex,
            Allele,
            AlleleCount,
            SUM( AlleleCount ) OVER ( PARTITION BY Position ) AS CopyNumber
        FROM
            :data_model_variants
        ORDER BY
            Position ASC,
            AlleleIndex ASC;
            
        -- query data model variants
        SELECT COUNT( DISTINCT PatientDWID ) INTO sample_count FROM :sample_list AS samples INNER JOIN Samples AS all_samples ON samples.SampleIndex = all_samples.SampleIndex;
        IF :sample_count = 1 THEN
            DECLARE sample_index INTEGER;
            SELECT SampleIndex INTO sample_index FROM :sample_list;
    
            data_model_variants = SELECT
                    Position,
                    AlleleIndex,
                    Allele,
                    SUM( AlleleCount ) AS AlleleCount
                FROM
                    DataModelVariants
                WHERE
                    ChromosomeIndex = :chromosome_index AND
                    Position IN ( SELECT * FROM :variant_positions ) AND
                    SampleIndex = :sample_index AND
                    ( AlleleIndex = 0 OR AlleleCount > 0 )
                GROUP BY
                    Position,
                    AlleleIndex,
                    Allele
                ORDER BY
                    Position,
                    AlleleIndex;
        ELSEIF :sample_count > 1 THEN
            data_model_variants = SELECT
                    Position,
                    AlleleIndex,
                    Allele,
                    SUM( AlleleCount ) AS AlleleCount
                FROM
                    DataModelVariants
                WHERE
                    ChromosomeIndex = :chromosome_index AND
                    Position IN ( SELECT * FROM :variant_positions ) AND
                    SampleIndex IN ( SELECT * FROM :sample_list ) AND
                    ( AlleleIndex = 0 OR AlleleCount > 0 )
                GROUP BY
                    Position,
                    AlleleIndex,
                    Allele
                ORDER BY
                    Position,
                    AlleleIndex;
        END IF;
    
        -- iterate over data model variants transforming them into display variants
        IF :sample_count > 0 THEN
        	FOR variant AS variants ( :data_model_variants ) DO
        	    IF variant.Position = :outer_position_cursor THEN
        	        reference_allele := last_reference_allele;
        	    ELSE
        	        reference_allele := 'N';
        	    END IF;
        	    IF variant.AlleleIndex = 0 THEN
        	        reference_allele := variant.Allele;
        	        last_reference_allele := variant.Allele;
        	        outer_position_cursor := variant.Position;
        	    ELSEIF variant.AlleleIndex > 0 AND variant.AlleleCount > 0 THEN
        	        alternative_allele := variant.Allele;
        	        inner_position_cursor := variant.Position;
        	        WHILE LENGTH( :reference_allele ) > 0 OR LENGTH( :alternative_allele ) > 0 DO
        	            IF LENGTH( :reference_allele ) <= 1 AND LENGTH( :alternative_allele ) > LENGTH( :reference_allele ) THEN -- insertion
                            position_array[ :row_index ] := :inner_position_cursor;
                            allele_count_array[ :row_index ] := variant.AlleleCount;
                            copy_number_array[ :row_index ] := variant.CopyNumber;
                            allele_array[ :row_index ] := :alternative_allele;
            	            BREAK;
        	            ELSEIF LENGTH( :alternative_allele ) = 0 THEN -- deletion
                            allele_array[ :row_index ] := '';
            	            reference_allele := SUBSTRING( :reference_allele, 2 );
        	            ELSEIF SUBSTRING( :reference_allele, 1, 1 ) <> SUBSTRING( :alternative_allele, 1, 1 ) THEN -- substitution
                            allele_array[ :row_index ] := SUBSTRING( :alternative_allele, 1, 1 );
            	            reference_allele := SUBSTRING( :reference_allele, 2 );
            	            alternative_allele := SUBSTRING( :alternative_allele, 2 );
        	            ELSE -- reference
            	            reference_allele := SUBSTRING( :reference_allele, 2 );
            	            alternative_allele := SUBSTRING( :alternative_allele, 2 );
            	            inner_position_cursor := :inner_position_cursor + 1;
        	                CONTINUE;
        	            END IF;
        
                        position_array[ :row_index ] := :inner_position_cursor;
                        allele_count_array[ :row_index ] := variant.AlleleCount;
                        copy_number_array[ :row_index ] := variant.CopyNumber;
                        
        
        	            inner_position_cursor := :inner_position_cursor + 1;
        	            row_index := :row_index + 1;
        	        END WHILE;
        	    END IF;
            END FOR;
        END IF;
        
        -- create output table and combine overlapping alleles
        unaggregated_display_variants = UNNEST( :position_array, :allele_array, :allele_count_array, :copy_number_array ) AS ( Position, Allele, AlleleCount, CopyNumber );
        display_variants = SELECT
                Position,
                Allele,
                CAST( NULL AS TINYINT ) AS Grouping,
                SUM( AlleleCount ) AS AlleleCount,
                MAX( CopyNumber ) AS CopyNumber
            FROM
                :unaggregated_display_variants
            WHERE
                Position BETWEEN :begin_position AND :end_position - 1
            GROUP BY
                Position,
                Allele
            ORDER BY
                Position ASC,
                AlleleCount DESC;
    END IF;
    
END;


create or replace procedure P_GeneVariantAnnotationCounts (
        IN sample_list SampleList,
        IN variant_grouping VariantAnnotationGrouping,
        IN reference_id NVARCHAR(255),
        IN chromosome_index INTEGER,
        IN begin_position INTEGER,
        IN end_position INTEGER,
        IN binSize DOUBLE,
        IN annotationGrouping BOOLEAN,
        OUT gene_variant_counts VariantAnnotationCounts,
        OUT sample_count INTEGER 
    )
    LANGUAGE SQLSCRIPT
    SQL SECURITY INVOKER
     AS
BEGIN
    SELECT COUNT( DISTINCT PatientDWID ) INTO sample_count FROM :sample_list AS samples INNER JOIN Samples AS all_samples ON samples.SampleIndex = all_samples.SampleIndex;
    -- return a list of genes with the number of affected samples
    IF annotationGrouping = true
    THEN
    gene_variant_counts = 
    SELECT GeneName, ChromosomeIndex, Grouping, "Begin", "End", SUM(Weight) AS Count, Bin
        FROM ( 
            SELECT GeneName, ChromosomeIndex, SampleIndex, Grouping, "Begin", "End", Bin, ( 1 / count(*) OVER (Partition by GeneName, ChromosomeIndex, SampleIndex) ) AS Weight 
            FROM ( 
                SELECT Features.FeatureName AS GeneName,
                    Variants.ChromosomeIndex AS ChromosomeIndex,
                    Samples.SampleIndex,
                    :variant_grouping.Grouping AS Grouping,
                    MIN( Features.beginregion ) AS "Begin",
                    MAX( Features.endregion ) AS "End",
                    FLOOR( ( FLOOR( MIN( Features.beginregion ) + MAX( Features.endregion ) / 2 ) ) / :binSize ) AS Bin
                FROM
                    :sample_list AS Samples 
                    JOIN Genotypes AS Genotypes
                        ON Genotypes.SampleIndex = Samples.SampleIndex
                    JOIN Variants AS Variants
                        ON Variants.DWAuditID = Genotypes.DWAuditID 
                        AND Variants.VariantIndex = Genotypes.VariantIndex 
                    JOIN :variant_grouping
                        ON :variant_grouping.DWAuditID = Genotypes.DWAuditID 
                        AND :variant_grouping.VariantIndex = Genotypes.VariantIndex 
                    JOIN Features AS Features
                        ON Variants.ChromosomeIndex = Features.ChromosomeIndex
                        AND Variants.Position BETWEEN Features.beginregion AND Features.endregion - 1 
                        AND Features.Class = 'gene'
                WHERE
                    Genotypes.ReferenceAlleleCount != Genotypes.CopyNumber 
                    AND Features.ReferenceID = :reference_id
                    AND (
                        :end_position IS NULL
                        OR (
                            Features.beginregion < :end_position
                            AND Features.endregion > :begin_position
                        )
                    )
                GROUP BY
                    Variants.ChromosomeIndex,
                    Features.FeatureName,
                    :variant_grouping.Grouping,
                    Samples.SampleIndex
                ORDER BY
                     Variants.ChromosomeIndex,
                     --Features.FeatureName,
                     FLOOR( ( FLOOR( MIN( Features.beginregion ) + MAX( Features.endregion ) / 2 ) ) / :binSize ),
                     Samples.SampleIndex,
                     :variant_grouping.Grouping
                )
            )
    GROUP BY 
        GeneName, 
        ChromosomeIndex, 
        "Begin", 
        "End", 
        Grouping, 
        Bin
    ORDER BY
         ChromosomeIndex,
         GeneName,
         Bin,
         Grouping;
    ELSE
     gene_variant_counts =        
        SELECT
            Features.FeatureName AS GeneName ,
            Variants.ChromosomeIndex AS ChromosomeIndex,
            NULL AS Grouping,
            MIN ( Features.beginregion ) AS "Begin",
            MAX ( Features.endregion ) AS "End",
            COUNT( DISTINCT AllSamples.PatientDWID ) AS Count,
            NULL AS Bin
        FROM
            :sample_list AS Samples
            JOIN Samples AS AllSamples
			    ON Samples.SampleIndex = AllSamples.SampleIndex
            JOIN Genotypes AS Genotypes
                ON Genotypes.SampleIndex = Samples.SampleIndex
            JOIN Variants AS Variants
                ON Genotypes.DWAuditID = Variants.DWAuditID
                AND Genotypes.VariantIndex = Variants.VariantIndex
            JOIN Features AS Features
                ON Variants.ChromosomeIndex = Features.ChromosomeIndex
                AND Variants.Position BETWEEN Features.beginregion AND Features.endregion - 1
                AND Features.Class = 'gene'
        WHERE
            Genotypes.ReferenceAlleleCount != Genotypes.CopyNumber 
            AND Features.ReferenceID = :reference_id
            AND (
                :end_position IS NULL
                OR (
                    Features.beginregion < :end_position
                    AND Features.endregion > :begin_position
                )
            )
        GROUP BY
            Variants.ChromosomeIndex,
            Features.FeatureName
        ORDER BY
             Variants.ChromosomeIndex;
    END IF;
    
    IF :chromosome_index IS NOT NULL THEN
        gene_variant_counts = SELECT * FROM :gene_variant_counts WHERE ChromosomeIndex = :chromosome_index;
    END IF;
END;


create or replace procedure P_GeneVariantCounts (
        IN sample_list SampleList,
        IN reference_id NVARCHAR(255),
        IN chromosome_index INTEGER,
        IN begin_position INTEGER,
        IN end_position INTEGER,
        OUT gene_variant_counts RegionCounts,
        OUT sample_count INTEGER
    )
    LANGUAGE SQLSCRIPT
    SQL SECURITY INVOKER
    READS SQL DATA AS
BEGIN
    SELECT COUNT( DISTINCT PatientDWID ) INTO sample_count FROM :sample_list AS samples INNER JOIN Samples AS all_samples ON samples.SampleIndex = all_samples.SampleIndex;

    -- return a list of genes with the number of affected patients
    gene_variant_counts =        
        SELECT
            Features.FeatureName AS GeneName ,
            Variants.ChromosomeIndex AS ChromosomeIndex,
            MIN ( Features.beginregion ) AS "Begin",
            MAX ( Features.endregion ) AS "End",
            COUNT( DISTINCT AllSamples.PatientDWID ) AS Count
        FROM
            :sample_list AS Samples
            INNER JOIN Samples AS AllSamples
                ON Samples.SampleIndex = AllSamples.SampleIndex
            JOIN Genotypes AS Genotypes
                ON Genotypes.SampleIndex = Samples.SampleIndex
            JOIN Variants AS Variants
                ON Genotypes.DWAuditID = Variants.DWAuditID
                AND Genotypes.VariantIndex = Variants.VariantIndex
            JOIN Features AS Features
                ON Variants.ChromosomeIndex = Features.ChromosomeIndex
                AND Variants.Position BETWEEN Features.beginregion AND Features.endregion - 1
                AND Features.Class = 'gene'
        WHERE
            Genotypes.ReferenceAlleleCount != Genotypes.CopyNumber 
            AND Features.ReferenceID = :reference_id
            AND (
                :end_position IS NULL
                OR (
                    Features.beginregion < :end_position
                    AND Features.endregion > :begin_position
                )
            )
        GROUP BY
            Variants.ChromosomeIndex,
            Features.FeatureName
        ORDER BY
             Variants.ChromosomeIndex;
    IF :chromosome_index IS NOT NULL THEN
        gene_variant_counts = SELECT * FROM :gene_variant_counts WHERE ChromosomeIndex = :chromosome_index;
    END IF;
END;


create or replace procedure P_GetVariantDetails (
		IN inputDWAuditID DWAuditIDList, 
		IN chromosomeIdx BIGINT, 
		IN positionVal BIGINT, 
		IN referenceID varchar(255), 
		OUT resultOut VariantAnnotationDetails, 
		OUT variantIdOut VariantIDList
	)
	LANGUAGE SQLSCRIPT
	SQL SECURITY DEFINER
AS
BEGIN
	DECLARE countRows INTEGER;
	DECLARE countVariantRows INTEGER;

	resultOut = SELECT DISTINCT 
				vann.DWAuditID, 
				vann.VariantIndex, 
				vann.AlleleIndex, 
				vann.ChromosomeIndex, 
				vann.Position, 
				vann.GeneName, 
				vann.Region, 
				vann.SequenceAlteration, 
				vann."AminoAcid.Reference" AS "AminoAcid1.Reference", 
				vann."AminoAcid.Alternative" AS "AminoAcid1.Alternative", 
				vann.MutationType, 
				vann.CDSPosition, 
				vann.Transcript, 
				vann.Protein, 
				vann.ExonRank, 
				ref.Allele AS "Allele.Reference", 
				va.Allele AS "Allele.Alternative", 
				case when Feat.Strand = '-' then 
				  GetReverseComplement (ref.Allele)
				  else 	ref.Allele end AS "CDSAllele.Reference", 
				case when Feat.Strand = '-' then 
				  GetReverseComplement (va.Allele)
				  else 	va.Allele end AS "CDSAllele.Alternative", 
				getAminoAcidName(
					vann."AminoAcid.Reference", 
					'THREE'
				) AS "AminoAcid3.Reference", 
				getAminoAcidName(
					vann."AminoAcid.Alternative", 
					'THREE'
				) AS "AminoAcid3.Alternative"
			--Feat.Strand AS Strand	
			FROM VariantAnnotations AS vann
				INNER JOIN VariantAlleles AS va
				ON vann.DWAuditID = va.DWAuditID
					AND va.VariantIndex = vann.VariantIndex
					AND va.AlleleIndex > 0
				INNER JOIN VariantAlleles AS ref
				ON vann.DWAuditID = ref.DWAuditID
					AND ref.VariantIndex = vann.VariantIndex
					AND ref.AlleleIndex = 0
			   inner join FeaturesAnnotation  AS feat
			    on feat.GeneName = vann.GeneName
			    and feat.Transcript = vann.Transcript
			    and feat.FeatureName = vann.Protein
			    and feat.ChromosomeIndex = :chromosomeIdx
			    and feat.ReferenceID = :referenceID
			WHERE (vann.DWAuditID IN (SELECT DWAuditID FROM :inputDWAuditID))
				AND vann.Position = :positionVal
				AND vann.ChromosomeIndex = :chromosomeIdx;
	
	
	
	SELECT count(*) INTO countRows FROM :resultOut;

	
	IF (:countRows = 0) THEN
      select count(*) into countVariantRows from Variants v 
      INNER JOIN VariantAlleles AS va
	  ON v.DWAuditID = va.DWAuditID
	  AND v.VariantIndex = va.VariantIndex
      where Position = :positionVal AND ChromosomeIndex = :chromosomeIdx and v.DWAuditID IN (SELECT DWAuditID FROM :inputDWAuditID);
      
        IF ( :countVariantRows = 0 ) THEN
        
         resultOut = SELECT null AS DWAuditID, 
					null AS VariantIndex, 
					null AS AlleleIndex, 
					seq.ChromosomeIndex, 
					:positionVal AS Position, 
					null AS GeneName, 
					null AS Region, 
					null AS SequenceAlteration, 
					null AS "AminoAcid1.Reference", 
					null AS "AminoAcid1.Alternative", 
					null AS MutationType, 
					null AS CDSPosition, 
					null AS Transcript, 
					null AS Protein, 
					null AS ExonRank, 
					SUBSTRING (TO_CHAR(seq.Sequence), :positionVal - seq.beginregion +1,1) AS "Allele.Reference", 
					null AS "Allele.Alternative", 
					SUBSTRING (TO_CHAR(seq.Sequence), :positionVal - seq.beginregion +1,1) AS "CDSAllele.Reference", 
					null AS "CDSAllele.Alternative", 
					null AS "AminoAcid3.Reference", 
					null AS "AminoAcid3.Alternative"
					--null AS Strand
				FROM referencesequences AS seq 
				where  ChromosomeIndex = :chromosomeIdx  and ReferenceID = :referenceID and 
				:positionVal between seq.beginregion and seq.endregion;
         ELSE        			
		resultOut = SELECT
                    variants.DWAuditID,
					variants.VariantIndex, 
					null AS AlleleIndex, 
					variants.ChromosomeIndex, 
					variants.Position, 
					null AS GeneName, 
					null AS Region, 
					null AS SequenceAlteration, 
					null AS "AminoAcid1.Reference", 
					null AS "AminoAcid1.Alternative", 
					null AS MutationType, 
					null AS CDSPosition, 
					null AS Transcript, 
					null AS Protein, 
					null AS ExonRank, 
					ref.Allele AS "Allele.Reference", 
					va.Allele AS "Allele.Alternative", 
					ref.Allele AS "CDSAllele.Reference", 
					va.Allele AS "CDSAllele.Alternative", 
					null AS "AminoAcid3.Reference", 
					null AS "AminoAcid3.Alternative"
					--null AS Strand
				FROM Variants AS variants
					INNER JOIN VariantAlleles AS va
					ON variants.DWAuditID = va.DWAuditID
						AND va.VariantIndex = variants.VariantIndex
						AND va.AlleleIndex > 0
					INNER JOIN VariantAlleles AS ref
					ON variants.DWAuditID = ref.DWAuditID
						AND ref.VariantIndex = variants.VariantIndex
						AND ref.AlleleIndex = 0
				WHERE (variants.DWAuditID IN (SELECT DWAuditID FROM :inputDWAuditID))
					AND variants.Position = :positionVal
					AND variants.ChromosomeIndex = :chromosomeIdx;
	END IF;
	
	END IF;
	
	variantIdOut = SELECT DISTINCT variants.VariantIndex, 
				vaID.VariantID
			FROM :resultOut AS variants
				INNER JOIN VariantIDs AS vaID
				ON vaID.VariantIndex = variants.VariantIndex
				AND vaID.DWAuditID = variants.DWAuditID
				AND vaID.VariantID IS NOT NULL;
					
					
	variantIdOut = SELECT VariantIndex,string_agg(VariantID,',') AS VariantID
			FROM :variantIdOut
			GROUP BY VariantIndex;
END;


create or replace procedure P_LocateSampleVariants(
        IN sample_list SampleList,
        IN chromosome_index INTEGER,
        IN position INTEGER,
        OUT variants SampleVariants
	)
	LANGUAGE SQLSCRIPT
	SQL SECURITY INVOKER
	READS SQL DATA
AS
BEGIN
    variants = SELECT
        Genotypes.SampleIndex,
        Genotypes.DWAuditID,
        Genotypes.VariantIndex
    FROM
        :sample_list AS SampleList
    INNER JOIN
        Genotypes AS Genotypes
    ON
        SampleList.SampleIndex = Genotypes.SampleIndex
    INNER JOIN
        Variants AS Variants
    ON
        Genotypes.DWAuditID = Variants.DWAuditID AND
        Genotypes.VariantIndex = Variants.VariantIndex AND
        Variants.ChromosomeIndex = :chromosome_index AND
        Variants.Position = :position;
END;


create or replace procedure P_MutationDataAnnotation(
		IN sample_list SampleList,
		IN reference_id NVARCHAR(255), 
		IN chromosome_index INTEGER,
		IN begin_position INTEGER,
		IN end_position INTEGER,
		IN variant_grouping VariantAnnotationGrouping,
		OUT mutation_data MutationDataAnnotation,
		OUT affected_count INTEGER,
		OUT sample_count INTEGER
	)
	LANGUAGE SQLSCRIPT
	SQL SECURITY INVOKER
	READS SQL DATA
AS
BEGIN
	DECLARE total_mutation INTEGER;

    SELECT COUNT( DISTINCT PatientDWID ) INTO sample_count FROM :sample_list AS samples INNER JOIN Samples AS all_samples ON samples.SampleIndex = all_samples.SampleIndex;
  
    SELECT 
		COUNT( DISTINCT AllSamples.PatientDWID )
	INTO
		affected_count
	FROM :sample_list AS Samples
		JOIN Samples AS AllSamples
			ON Samples.SampleIndex = AllSamples.SampleIndex
		JOIN Genotypes AS Genotypes
			ON Genotypes.SampleIndex = Samples.SampleIndex
		JOIN :variant_grouping
			ON Genotypes.DWAuditID = :variant_grouping.DWAuditID 
			AND Genotypes.VariantIndex = :variant_grouping.VariantIndex
		JOIN Variants AS Variants
			ON :variant_grouping.DWAuditID = Variants.DWAuditID
			AND :variant_grouping.VariantIndex = Variants.VariantIndex
	WHERE AllSamples.ReferenceID = :reference_id
		AND Variants.ChromosomeIndex = :chromosome_index
		AND Variants.Position < :end_position
		AND Variants.Position >= :begin_position;
    
	affected_group = SELECT
	        :variant_grouping.Grouping AS Grouping
	    FROM :sample_list AS Samples
            JOIN Genotypes AS Genotypes
                ON Genotypes.SampleIndex = Samples.SampleIndex
            JOIN :variant_grouping
                ON Genotypes.DWAuditID = :variant_grouping.DWAuditID 
                AND Genotypes.VariantIndex = :variant_grouping.VariantIndex
            JOIN Variants AS Variants
                ON :variant_grouping.DWAuditID = Variants.DWAuditID
                AND :variant_grouping.VariantIndex = Variants.VariantIndex
            JOIN Features AS Features
                ON Variants.ChromosomeIndex = Features.ChromosomeIndex
		WHERE Features.ReferenceID = :reference_id
		    AND Variants.ChromosomeIndex = :chromosome_index
    		AND Variants.Position < :end_position
            AND Variants.Position >= :begin_position;
            
	mutation_per_group = SELECT Grouping, COUNT ( * ) AS Count
    	FROM :affected_group
    	GROUP BY Grouping
    	ORDER BY Grouping;
	
    SELECT COUNT( * ) INTO total_mutation FROM :affected_group;
	
	mutation_data = SELECT "mutation_per_group".Grouping, "mutation_per_group".Count / :total_mutation AS Percent
        FROM :mutation_per_group AS "mutation_per_group"
    	GROUP BY "mutation_per_group".Grouping,
    		"mutation_per_group".Count
    	ORDER BY "mutation_per_group".Grouping;
END;


create or replace procedure P_QualitativeData(
		IN sample_list SampleList,
		IN reference_id NVARCHAR(255), 
		IN chromosome_index INTEGER, 
		IN begin_position INTEGER, 
		IN end_position INTEGER, 
		IN bin_size REAL,
		IN variant_grouping VariantAnnotationGrouping,
		OUT qualitative_data QualitativeData
	)
	LANGUAGE SQLSCRIPT
	SQL SECURITY INVOKER
	READS SQL DATA
AS
BEGIN
	DECLARE total_patient_count INTEGER;

	SELECT
		COUNT( DISTINCT PatientDWID ) INTO total_patient_count
	FROM
		:sample_list AS samples
	INNER JOIN
		Samples AS all_samples
	ON
		samples.SampleIndex = all_samples.SampleIndex;
	
	variants =
		SELECT 
			FLOOR( ( Variants.Position - :begin_position ) / :bin_size ) AS BinIndex,
			:variant_grouping.Grouping AS Grouping,
			Variants.Position,
			AllSamples.PatientDWID
		FROM
			:sample_list AS Samples
		INNER JOIN
			Samples AS AllSamples
		ON
			Samples.SampleIndex = AllSamples.SampleIndex
		INNER JOIN
			Genotypes AS Genotypes
		ON
			Samples.SampleIndex = Genotypes.SampleIndex
		INNER JOIN
			Variants AS Variants
		ON
			Genotypes.DWAuditID = Variants.DWAuditID
			AND Genotypes.VariantIndex = Variants.VariantIndex
		INNER JOIN
			:variant_grouping
		ON
			Variants.DWAuditID = :variant_grouping.DWAuditID
			AND Variants.VariantIndex = :variant_grouping.VariantIndex
		WHERE
			AllSamples.ReferenceID = :reference_id
			AND Variants.ChromosomeIndex = :chromosome_index
			AND Variants.Position < :end_position
			AND Variants.Position >= :begin_position
			AND Genotypes.ReferenceAlleleCount < Genotypes.CopyNumber;

	binned_patient_variants =
		SELECT
			BinIndex,
			MIN( Grouping ) AS Grouping, -- in case of multiple groups per patient, choose the one with highest priority
			MIN( Position ) AS BeginPos,
			MAX( Position ) AS EndPos,
			( DENSE_RANK() OVER ( PARTITION BY BinIndex ORDER BY PatientDWID ASC ) + DENSE_RANK() OVER ( PARTITION BY BinIndex ORDER BY PatientDWID DESC ) - 1 ) AS BinPatientCount, -- workaround for COUNT( DISTINCT ... ) to work with window function
			PatientDWID
		FROM
			:variants
		GROUP BY
			BinIndex,
			PatientDWID;
	
	qualitative_data =
		SELECT
			BinIndex,
			Grouping,
			MIN( BeginPos ) AS BeginPos,
			MAX( EndPos ) AS EndPos,
			MAX( BinPatientCount ) / :total_patient_count AS BinPatientFraction,
			COUNT( PatientDWID ) / MAX( BinPatientCount ) AS GroupPatientFraction
		FROM
			:binned_patient_variants
		GROUP BY
			BinIndex, 
			Grouping
		ORDER BY
			BinIndex,
			Grouping;
END;

create or replace procedure P_QuantitativeData (
        IN sample_list_name NVARCHAR (255),
        IN reference_id NVARCHAR (255),
        IN chromosome_index INTEGER,
        IN begin_position INTEGER,
        IN end_position INTEGER,
        IN bin_size REAL,
        IN level_name NVARCHAR (255),
        IN col_name NVARCHAR (255),
        IN aggregation NVARCHAR (255),
        OUT white_list_invalid NVARCHAR (5000)
    )
    
    LANGUAGE SQLSCRIPT
    SQL SECURITY INVOKER
    AS
    BEGIN
        
        DECLARE sql_str_aggr NVARCHAR (5000);
        DECLARE sql_aggr_where NVARCHAR (5000);
        
        DECLARE invalid_param CONDITION FOR SQL_ERROR_CODE 10001;
        DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            white_list_invalid := ::SQL_ERROR_MESSAGE;
        END;
        
        IF :level_name <> 'Variants' AND :level_name <> 'Genotypes' THEN
            SIGNAL invalid_param SET MESSAGE_TEXT = 'Level '|| :level_name || ' is not allowed';
        END IF;
        
        IF upper( :aggregation ) <> 'MAX' AND upper( :aggregation ) <> 'MIN' AND upper( :aggregation ) <> 'AVG' THEN
            SIGNAL invalid_param SET MESSAGE_TEXT = 'Aggregate '|| :aggregation || ' is not allowed';
        END IF;
        
        /* To avoid NULL Conversion exception in dynamic SQL */
        IF :chromosome_index IS NULL
        THEN
            sql_aggr_where := '';
        ELSE
            sql_aggr_where := 'AND Variants.ChromosomeIndex = ' || :chromosome_index;
        END IF;

        IF :end_position IS NOT NULL
        THEN
            sql_aggr_where := :sql_aggr_where || ' AND Variants.Position BETWEEN '||:begin_position ||' AND '|| ( :end_position - 1 );
        END IF;
        
        /*Get all the scores irrespective of position to get the aggregated score*/ 
        sql_str_aggr := 'SELECT
                ChromosomeIndex,
                ' || :aggregation || '(Score) AS Score,
                BinIndex
            FROM
            (
                SELECT
                    Variants.ChromosomeIndex AS ChromosomeIndex,"'
                    || ESCAPE_DOUBLE_QUOTES( :level_name ) || '"."' || ESCAPE_DOUBLE_QUOTES( :col_name ) || '" AS Score,
                    FLOOR( ( Variants.Position - ' || :begin_position || ' ) / ' || :bin_size || ' ) AS BinIndex
                FROM
                    "' || ESCAPE_DOUBLE_QUOTES( :sample_list_name ) || '" AS Samples
                    JOIN Genotypes AS Genotypes
                        ON Genotypes.SampleIndex = Samples.SampleIndex
                    JOIN Variants AS Variants
                        ON Genotypes.DWAuditID = Variants.DWAuditID
                    JOIN Features AS Features
                        ON Variants.ChromosomeIndex = Features.ChromosomeIndex
                WHERE
                    Genotypes.ReferenceAlleleCount != Genotypes.CopyNumber
                    AND "' || ESCAPE_DOUBLE_QUOTES( :level_name ) || '"."' || ESCAPE_DOUBLE_QUOTES( :col_name ) || '" > 0
                    AND Features.ReferenceID = ''' || ESCAPE_SINGLE_QUOTES( :reference_id  ) || '''' || :sql_aggr_where || '
            )
            GROUP BY
                ChromosomeIndex,
                BinIndex
            ORDER BY
                ChromosomeIndex,
                BinIndex';
        EXECUTE IMMEDIATE :sql_str_aggr;
    END;


create or replace procedure P_RegionData(
        IN sample_list SampleList,
        IN class NVARCHAR(255),
        IN reference_id NVARCHAR(255),
        IN chromosome_index INTEGER,
        IN begin_position INTEGER,
        IN end_position INTEGER,
        OUT regionAttributes RegionDefinition
	)
	LANGUAGE SQLSCRIPT
	SQL SECURITY INVOKER
	READS SQL DATA
AS
BEGIN
	regionAttributes = SELECT 
	    region.ChromosomeIndex AS ChromosomeIndex,
	    region.beginregion AS "Begin", 
	    region.endregion AS "End",
	    region.Score AS Score,
	    region.Color AS Color
	FROM
	   Regions AS region
	INNER JOIN
	    :sample_list AS sample
	ON
	    region.SampleID = sample.SampleIndex
	WHERE
	    ( :class IS NULL OR region.Class = :class OR region.Class LIKE :class || '.%') AND
	    :reference_id = region.ReferenceID AND
	    ( :chromosome_index IS NULL OR (
	        ChromosomeIndex = :chromosome_index AND
	        region.endregion >= :begin_position AND
	        region.beginregion <= :end_position
	    ) )
	ORDER BY
	    region.beginregion;
END;

create or replace procedure P_RegionNONSampleData(
        IN class NVARCHAR(255),
        IN reference_id NVARCHAR(255),
        IN chromosome_index INTEGER,
        IN begin_position INTEGER,
        IN end_position INTEGER,
        OUT regionAttributes RegionDefinition
	)
	LANGUAGE SQLSCRIPT
	SQL SECURITY INVOKER
	READS SQL DATA
AS
BEGIN
	regionAttributes = SELECT 
	    region.ChromosomeIndex AS ChromosomeIndex,
	    region.beginregion AS "Begin", 
	    region.endregion AS "End",
	    region.Score AS Score,
	    region.Color AS Color
	FROM
	   Features AS region
	WHERE
	     ( :class IS NULL OR region.Class = :class OR region.Class LIKE :class || '.%') AND
	    :reference_id = region.ReferenceID AND
	    ( :chromosome_index IS NULL OR (
	        ChromosomeIndex = :chromosome_index AND
	        region.endregion >= :begin_position AND
	        region.beginregion <= :end_position
	    ) )
	ORDER BY
	    region.beginregion;
END;


create or replace procedure P_VariantAnnotationCounts (
        IN sample_list SampleList,
        IN variant_grouping VariantAnnotationGrouping,
        IN reference_id NVARCHAR(255),
        IN chromosome_index INTEGER,
        IN begin_position INTEGER,
        IN end_position INTEGER,
        IN bin_size REAL,
        OUT chromosome_infos ChromosomeInfos,
        OUT variant_counts VariantDensityAnnotationCounts,
        OUT sample_count INTEGER,
        OUT max_density REAL
    ) 
    LANGUAGE SQLSCRIPT 
    SQL SECURITY INVOKER
    READS SQL DATA AS
BEGIN
    chromosome_infos = SELECT       
            ChromosomeIndex,
            CASE WHEN :end_position IS NOT NULL AND :end_position < Size THEN :end_position ELSE Size END AS Size,
            CEIL( Size / :bin_size ) AS BinCount
        FROM
            Chromosomes
        WHERE
            ( :chromosome_index IS NULL OR ChromosomeIndex = :chromosome_index ) AND
            ReferenceID = :reference_id
        ORDER BY
            ChromosomeIndex;

    -- return a list of variants with their bin index
    SELECT COUNT( DISTINCT PatientDWID ) INTO sample_count FROM :sample_list AS samples INNER JOIN Samples AS all_samples ON samples.SampleIndex = all_samples.SampleIndex;
    IF :sample_count = 1 THEN
        DECLARE sample_index INTEGER;
        SELECT SampleIndex INTO sample_index FROM :sample_list;
        
        binned_variants = SELECT
                Variants.ChromosomeIndex,
                Variants.VariantIndex,
                Variants.DWAuditID,
                CAST( FLOOR( ( Position - :begin_position ) / :bin_size ) AS INTEGER ) AS BinIndex,
                Variants.AlleleIndex,
                MAX( Variants.AlleleIndex ) OVER ( PARTITION BY Variants.ChromosomeIndex, Position, SampleIndex ) AS MaxAlleleIndex,
                Variants.SampleIndex
            FROM
                DataModelVariants AS Variants
            INNER JOIN
                :chromosome_infos AS Chromosomes
            ON
                Variants.ChromosomeIndex = Chromosomes.ChromosomeIndex
            WHERE
                ( :chromosome_index IS NULL OR Variants.ChromosomeIndex = :chromosome_index ) AND
                ( :end_position IS NULL OR Position BETWEEN :begin_position AND :end_position - 1 ) AND
                Position < Size AND
                SampleIndex = :sample_index AND
                Variants.AlleleIndex > 0 AND
                AlleleCount > 0 AND
                Variants.SampleIndex = :sample_index;
    ELSE
        binned_variants = SELECT
                Variants.ChromosomeIndex,
                Variants.VariantIndex,
                Variants.DWAuditID,
                CAST( FLOOR( ( Position - :begin_position ) / :bin_size ) AS INTEGER ) AS BinIndex,
                Variants.AlleleIndex,
                MAX( Variants.AlleleIndex ) OVER ( PARTITION BY Variants.ChromosomeIndex, Position, SampleIndex ) AS MaxAlleleIndex,
                Variants.SampleIndex
            FROM
                DataModelVariants AS Variants
            INNER JOIN
                :chromosome_infos AS Chromosomes
            ON
                Variants.ChromosomeIndex = Chromosomes.ChromosomeIndex
            WHERE
                ( :chromosome_index IS NULL OR Variants.ChromosomeIndex = :chromosome_index ) AND
                ( :end_position IS NULL OR Position BETWEEN :begin_position AND :end_position - 1 ) AND
                Position < Size AND
                SampleIndex IN ( SELECT SampleIndex FROM :sample_list ) AND
                Variants.AlleleIndex > 0 AND
                AlleleCount > 0 AND
                Variants.SampleIndex IN ( SELECT SampleIndex FROM :sample_list );
    END IF;
    
    -- aggregate bins and return result
    variant_counts = SELECT
            ChromosomeIndex, 
            BinIndex,
            COUNT( * ) AS VariantCount,
            Grouping
        FROM
            :binned_variants
        JOIN :variant_grouping 
            ON
                :variant_grouping.AlleleIndex = :binned_variants.AlleleIndex AND
                :variant_grouping.VariantIndex = :binned_variants.VariantIndex AND
                :variant_grouping.DWAuditID = :binned_variants.DWAuditID 
        WHERE
            MaxAlleleIndex = :binned_variants.AlleleIndex
        GROUP BY
            ChromosomeIndex,
            BinIndex,
            Grouping
        ORDER BY
            ChromosomeIndex,
            BinIndex;
            
    SELECT
        MAX( Count ) / ( :bin_size * sample_count )
        INTO max_density
        FROM
        (
            SELECT
                SUM( VariantCount ) AS Count
                FROM
                :variant_counts
                GROUP BY
                    ChromosomeIndex,
                    BinIndex
                ORDER BY
                    ChromosomeIndex,
                    Count DESC
        );
END;


create or replace procedure P_VariantCounts (
        IN sample_list SampleList,
        IN reference_id NVARCHAR(255),
        IN chromosome_index INTEGER,
        IN begin_position INTEGER,
        IN end_position INTEGER,
        IN bin_size REAL,
        OUT chromosome_infos ChromosomeInfos,
        OUT variant_counts VariantCounts,
        OUT sample_count INTEGER
    )
    LANGUAGE SQLSCRIPT
    SQL SECURITY INVOKER
    READS SQL DATA AS
BEGIN
    chromosome_infos = SELECT
            ChromosomeIndex,
            CASE WHEN :end_position IS NOT NULL AND :end_position < Size THEN :end_position ELSE Size END AS Size,
            CEIL( Size / :bin_size ) AS BinCount
        FROM
            Chromosomes
        WHERE
            ( :chromosome_index IS NULL OR ChromosomeIndex = :chromosome_index ) AND
            ReferenceID = :reference_id
        ORDER BY
            ChromosomeIndex;

    -- return a list of variants with their bin index
    SELECT COUNT( DISTINCT PatientDWID ) INTO sample_count FROM :sample_list AS samples INNER JOIN Samples AS all_samples ON samples.SampleIndex = all_samples.SampleIndex;
    IF :sample_count = 1 THEN
        DECLARE sample_index INTEGER;
        SELECT SampleIndex INTO sample_index FROM :sample_list;
        
        binned_variants = SELECT
                Variants.ChromosomeIndex,
                CAST( FLOOR( ( Position - :begin_position ) / :bin_size ) AS INTEGER ) AS BinIndex,
                AlleleIndex,
                MAX( AlleleIndex ) OVER ( PARTITION BY Variants.ChromosomeIndex, Position, SampleIndex ) AS MaxAlleleIndex
            FROM
                DataModelVariants AS Variants
            INNER JOIN
                :chromosome_infos AS Chromosomes
            ON
                Variants.ChromosomeIndex = Chromosomes.ChromosomeIndex
            WHERE
                ( :chromosome_index IS NULL OR Variants.ChromosomeIndex = :chromosome_index ) AND
                ( :end_position IS NULL OR Position BETWEEN :begin_position AND :end_position - 1 ) AND
                Position < Size AND
                SampleIndex = :sample_index AND
                AlleleIndex > 0 AND
                AlleleCount > 0;
    ELSE
        binned_variants = SELECT
                Variants.ChromosomeIndex,
                CAST( FLOOR( ( Position - :begin_position ) / :bin_size ) AS INTEGER ) AS BinIndex,
                AlleleIndex,
                MAX( AlleleIndex ) OVER ( PARTITION BY Variants.ChromosomeIndex, Position, SampleIndex ) AS MaxAlleleIndex
            FROM
                DataModelVariants AS Variants
            INNER JOIN
                :chromosome_infos AS Chromosomes
            ON
                Variants.ChromosomeIndex = Chromosomes.ChromosomeIndex
            WHERE
                ( :chromosome_index IS NULL OR Variants.ChromosomeIndex = :chromosome_index ) AND
                ( :end_position IS NULL OR Position BETWEEN :begin_position AND :end_position - 1 ) AND
                Position < Size AND
                SampleIndex IN ( SELECT SampleIndex FROM :sample_list ) AND
                AlleleIndex > 0 AND
                AlleleCount > 0;
    END IF;
    
    -- aggregate bins and return result
    variant_counts = SELECT
            ChromosomeIndex,
            BinIndex,
            COUNT( * ) AS VariantCount
        FROM
            :binned_variants
        WHERE 
            MaxAlleleIndex = AlleleIndex
        GROUP BY
            ChromosomeIndex,
            BinIndex
        ORDER BY
            ChromosomeIndex,
            BinIndex;
END;


create or replace procedure P_VariantInformation (
        IN sample_list SampleList,
        IN chromosome_index INTEGER,
        IN position INTEGER,
        OUT attributes FullyQualifiedAttributes
	)
	LANGUAGE SQLSCRIPT
	SQL SECURITY INVOKER
AS
BEGIN
    DECLARE schema_array VARCHAR( 255 ) ARRAY;
    DECLARE table_array VARCHAR( 255 ) ARRAY;
    DECLARE attribute_array VARCHAR( 255 ) ARRAY;
    DECLARE attribute_count INTEGER := 0;
    DECLARE attribute_selection NCLOB := '';
    
    -- declare iterators and queries
    DECLARE CURSOR filters FOR
        SELECT
            AttributeName
        FROM
            CustomAttributes
        WHERE
            Level = 'Filter' AND
            DataType = 'Flag' AND
            ArraySize = 0 AND
            AttributeName <> 'PASS' AND
            Active <> 0
        ORDER BY
            AttributeName;
    DECLARE CURSOR variant_attributes FOR
        SELECT
            AttributeName,
            DataType
        FROM
            CustomAttributes
        WHERE
            Level = 'Variant' AND
            DataType IN ( 'Flag', 'Integer', 'Float', 'Character', 'String' ) AND
            ArraySize < 2 AND
            Active <> 0
        ORDER BY
            AttributeName;
    DECLARE CURSOR variant_allele_attributes FOR
        SELECT
            AttributeName,
            DataType
        FROM
            CustomAttributes
        WHERE
            Level = 'VariantAllele' AND
            DataType IN ( 'Flag', 'Integer', 'Float', 'Character', 'String' ) AND
            ArraySize < 2 AND
            Active <> 0
        ORDER BY
            AttributeName;
    DECLARE CURSOR variant_multi_value_attributes FOR
        SELECT
            AttributeName,
            DataType
        FROM
            CustomAttributes
        WHERE
            Level = 'Variant' AND
            DataType IN ( 'Flag', 'Integer', 'Float', 'Character', 'String' ) AND
            ( ArraySize IS NULL OR ArraySize > 1 ) AND
            Active <> 0
        ORDER BY
            AttributeName;
    DECLARE CURSOR variant_structured_attributes FOR
        SELECT
            StructAttr.StructuredAttributeName AS StructuredAttributeName,
            StructAttr.AttributeName AS AttributeName,
            StructAttr.DataType
        FROM
            CustomAttributes AS CustAttr
        INNER JOIN
            StructuredCustomAttributes AS StructAttr
        ON
            CustAttr.AttributeName = StructAttr.StructuredAttributeName AND
            CustAttr.Level = StructAttr.Level
        WHERE
            StructAttr.Level = 'Variant' AND
            CustAttr.DataType = 'Structured' AND
            StructAttr.DataType IN ( 'Integer', 'Float', 'String', 'Allele' ) AND
            CustAttr.Active <> 0 AND
            StructAttr.Active <> 0
        ORDER BY
            StructAttr.StructuredAttributeName,
            StructAttr.AttributeName;
    DECLARE CURSOR genotype_attributes FOR
        SELECT
            AttributeName,
            DataType
        FROM
            CustomAttributes
        WHERE
            Level = 'Genotype' AND
            DataType IN ( 'Flag', 'Integer', 'Float', 'Character', 'String' ) AND
            ArraySize < 2 AND
            Active <> 0
        ORDER BY
            AttributeName;
    DECLARE CURSOR genotype_allele_attributes FOR
        SELECT
            AttributeName,
            DataType
        FROM
            CustomAttributes
        WHERE
            Level = 'GenotypeAllele' AND
            DataType IN ( 'Flag', 'Integer', 'Float', 'Character', 'String' ) AND
            ArraySize < 2 AND
            Active <> 0
        ORDER BY
            AttributeName;
    DECLARE CURSOR genotype_multi_value_attributes FOR
        SELECT
            AttributeName,
            DataType
        FROM
            CustomAttributes
        WHERE
            Level = 'Genotype' AND
            DataType IN ( 'Flag', 'Integer', 'Float', 'Character', 'String' ) AND
            ( ArraySize IS NULL OR ArraySize > 1 ) AND
            Active <> 0
        ORDER BY
            AttributeName;
    
    -- populate sample variants table
    CALL P_LocateSampleVariants ( :sample_list, :chromosome_index, :position, variants );
    INSERT INTO SampleVariants SELECT * FROM :variants;
    
    -- query variant attributes
    attribute_selection := 'SampleVariants.SampleIndex, Variants.Quality, Variants."Filter.PASS"';
    attribute_count := :attribute_count + 1;
    schema_array[ :attribute_count ] := 'CDMDEFAULT';
    table_array[ :attribute_count ] := 'legacy.genomics.db.models::SNV.Variants';
    attribute_array[ :attribute_count ] := 'Quality';
    schema_array[ :attribute_count ] := 'CDMDEFAULT';
    table_array[ :attribute_count ] := 'legacy.genomics.db.models::SNV.Variants';
    attribute_array[ :attribute_count ] := 'Filter.PASS';
    FOR row_result AS filters DO
        attribute_count := :attribute_count + 1;
        schema_array[ :attribute_count ] := 'CDMDEFAULT';
        table_array[ :attribute_count ] := 'legacy.genomics.db.models::SNV.Variants';
        attribute_array[ :attribute_count ] := 'Filter.' || row_result.AttributeName;
        attribute_selection := :attribute_selection || ', Variants."Filter.' || ESCAPE_DOUBLE_QUOTES( row_result.AttributeName ) || '"';
    END FOR;
    FOR row_result AS variant_attributes DO
        attribute_count := :attribute_count + 1;
        schema_array[ :attribute_count ] := 'CDMDEFAULT';
        table_array[ :attribute_count ] := 'legacy.genomics.db.models::SNV.Variants';
        attribute_array[ :attribute_count ] := 'Attr.' || row_result.AttributeName;
        attribute_selection := :attribute_selection || ', Variants."Attr.' || ESCAPE_DOUBLE_QUOTES( row_result.AttributeName ) || '"';
    END FOR;
    EXECUTE IMMEDIATE 'SELECT ' || :attribute_selection || ' FROM Variants AS Variants INNER JOIN SampleVariants AS SampleVariants ON Variants.DWAuditID = SampleVariants.DWAuditID AND Variants.VariantIndex = SampleVariants.VariantIndex';
    
    -- query variant IDs
    SELECT SampleVariants.SampleIndex, VariantIDs.VariantID FROM VariantIDs AS VariantIDs INNER JOIN :variants AS SampleVariants ON VariantIDs.DWAuditID = SampleVariants.DWAuditID AND VariantIDs.VariantIndex = SampleVariants.VariantIndex WHERE VariantIDs.VariantID IS NOT NULL GROUP BY SampleVariants.SampleIndex, VariantIDs.VariantID;
    attribute_count := :attribute_count + 1;
    schema_array[ :attribute_count ] := 'CDMDEFAULT';
    table_array[ :attribute_count ] := 'legacy.genomics.db.models::SNV.VariantIDs';
    attribute_array[ :attribute_count ] := 'VariantID';
    
    -- query variant allele attributes
    attribute_selection := 'SampleVariants.SampleIndex, VariantAlleles.AlleleIndex, VariantAlleles.Allele';
    attribute_count := :attribute_count + 1;
    schema_array[ :attribute_count ] := 'CDMDEFAULT';
    table_array[ :attribute_count ] := 'legacy.genomics.db.models::SNV.VariantAlleles';
    attribute_array[ :attribute_count ] := 'Allele';
    FOR row_result AS variant_allele_attributes DO
        attribute_count := :attribute_count + 1;
        schema_array[ :attribute_count ] := 'CDMDEFAULT';
        table_array[ :attribute_count ] := 'legacy.genomics.db.models::SNV.VariantAlleles';
        attribute_array[ :attribute_count ] := 'Attr.' || row_result.AttributeName;
        attribute_selection := :attribute_selection || ', VariantAlleles."Attr.' || ESCAPE_DOUBLE_QUOTES( row_result.AttributeName ) || '"';
    END FOR;
    EXECUTE IMMEDIATE 'SELECT ' || :attribute_selection || ' FROM VariantAlleles AS VariantAlleles INNER JOIN SampleVariants AS SampleVariants ON VariantAlleles.DWAuditID = SampleVariants.DWAuditID AND VariantAlleles.VariantIndex = SampleVariants.VariantIndex';

    -- query variant multi-value attributes
    attribute_selection := 'SampleVariants.SampleIndex';
    FOR row_result AS variant_multi_value_attributes DO
        attribute_count := :attribute_count + 1;
        schema_array[ :attribute_count ] := 'CDMDEFAULT';
        table_array[ :attribute_count ] := 'legacy.genomics.db.models::SNV.VariantMultiValueAttributes';
        attribute_array[ :attribute_count ] := 'Attr.' || row_result.AttributeName;
        attribute_selection := :attribute_selection || ', VariantAttributes."Attr.' || ESCAPE_DOUBLE_QUOTES( row_result.AttributeName ) || '"';
    END FOR;
    EXECUTE IMMEDIATE 'SELECT ' || :attribute_selection || ' FROM VariantMultiValueAttributes AS VariantAttributes INNER JOIN SampleVariants AS SampleVariants ON VariantAttributes.DWAuditID = SampleVariants.DWAuditID AND VariantAttributes.VariantIndex = SampleVariants.VariantIndex ORDER BY VariantAttributes.ValueIndex';

    -- query structured variant attributes
    attribute_selection := 'SampleVariants.SampleIndex, VariantAttributes.ValueIndex';
    FOR row_result AS variant_structured_attributes DO
        attribute_count := :attribute_count + 1;
        schema_array[ :attribute_count ] := 'CDMDEFAULT';
        table_array[ :attribute_count ] := 'legacy.genomics.db.models::SNV.VariantStructuredAttributes';
        attribute_array[ :attribute_count ] := 'Attr.' || row_result.AttributeName || '.' || row_result.StructuredAttributeName;
        attribute_selection := :attribute_selection || ', VariantAttributes."Attr.' || ESCAPE_DOUBLE_QUOTES( row_result.AttributeName ) || '"."' || ESCAPE_DOUBLE_QUOTES( row_result.StructuredAttributeName ) || '"';
    END FOR;
    EXECUTE IMMEDIATE 'SELECT ' || :attribute_selection || ' FROM VariantStructuredAttributes AS VariantAttributes INNER JOIN SampleVariants AS SampleVariants ON VariantAttributes.DWAuditID = SampleVariants.DWAuditID AND VariantAttributes.VariantIndex = SampleVariants.VariantIndex ORDER BY VariantAttributes.ValueIndex';

    -- query genotype attributes
    attribute_selection := 'SampleVariants.SampleIndex, Genotypes.CopyNumber, Genotypes.Zygosity';
    attribute_count := :attribute_count + 1;
    schema_array[ :attribute_count ] := 'CDMDEFAULT';
    table_array[ :attribute_count ] := 'legacy.genomics.db.models::SNV.Genotypes';
    attribute_array[ :attribute_count ] := 'CopyNumber';
    attribute_count := :attribute_count + 1;
    schema_array[ :attribute_count ] := 'CDMDEFAULT';
    table_array[ :attribute_count ] := 'legacy.genomics.db.models::SNV.Genotypes';
    attribute_array[ :attribute_count ] := 'Zygosity';
    FOR row_result AS genotype_attributes DO
        attribute_count := :attribute_count + 1;
        schema_array[ :attribute_count ] := 'CDMDEFAULT';
        table_array[ :attribute_count ] := 'legacy.genomics.db.models::SNV.Genotypes';
        attribute_array[ :attribute_count ] := 'Attr.' || row_result.AttributeName;
        attribute_selection := :attribute_selection || ', Genotypes."Attr.' || ESCAPE_DOUBLE_QUOTES( row_result.AttributeName ) || '"';
    END FOR;
    EXECUTE IMMEDIATE 'SELECT ' || :attribute_selection || ' FROM Genotypes AS Genotypes INNER JOIN SampleVariants AS SampleVariants ON Genotypes.DWAuditID = SampleVariants.DWAuditID AND Genotypes.VariantIndex = SampleVariants.VariantIndex AND Genotypes.SampleIndex = SampleVariants.SampleIndex';
    
    -- query genotype allele attributes
    attribute_selection := 'SampleVariants.SampleIndex, GenotypeAlleles.AlleleIndex, GenotypeAlleles.AlleleCount';
    attribute_count := :attribute_count + 1;
    schema_array[ :attribute_count ] := 'CDMDEFAULT';
    table_array[ :attribute_count ] := 'legacy.genomics.db.models::SNV.GenotypeAlleles';
    attribute_array[ :attribute_count ] := 'AlleleCount';
    FOR row_result AS genotype_allele_attributes DO
        attribute_count := :attribute_count + 1;
        schema_array[ :attribute_count ] := 'CDMDEFAULT';
        table_array[ :attribute_count ] := 'legacy.genomics.db.models::SNV.GenotypeAlleles';
        attribute_array[ :attribute_count ] := 'Attr.' || row_result.AttributeName;
        attribute_selection := :attribute_selection || ', GenotypeAlleles."Attr.' || ESCAPE_DOUBLE_QUOTES( row_result.AttributeName ) || '"';
    END FOR;
    EXECUTE IMMEDIATE 'SELECT ' || :attribute_selection || ' FROM GenotypeAlleles AS GenotypeAlleles INNER JOIN SampleVariants AS SampleVariants ON GenotypeAlleles.DWAuditID = SampleVariants.DWAuditID AND GenotypeAlleles.VariantIndex = SampleVariants.VariantIndex AND GenotypeAlleles.SampleIndex = SampleVariants.SampleIndex';

    -- query genotype multi-value attributes
    attribute_selection := 'SampleVariants.SampleIndex';
    FOR row_result AS genotype_multi_value_attributes DO
        attribute_count := :attribute_count + 1;
        schema_array[ :attribute_count ] := 'CDMDEFAULT';
        table_array[ :attribute_count ] := 'legacy.genomics.db.models::SNV.GenotypeMultiValueAttributes';
        attribute_array[ :attribute_count ] := 'Attr.' || row_result.AttributeName;
        attribute_selection := :attribute_selection || ', GenotypeAttributes."Attr.' || ESCAPE_DOUBLE_QUOTES( row_result.AttributeName ) || '"';
    END FOR;
    EXECUTE IMMEDIATE 'SELECT ' || :attribute_selection || ' FROM GenotypeMultiValueAttributes AS GenotypeAttributes INNER JOIN SampleVariants AS SampleVariants ON GenotypeAttributes.DWAuditID = SampleVariants.DWAuditID AND GenotypeAttributes.VariantIndex = SampleVariants.VariantIndex AND GenotypeAttributes.SampleIndex = SampleVariants.SampleIndex ORDER BY GenotypeAttributes.ValueIndex';
    
    -- return accessed attributes
    attributes = UNNEST( :schema_array, :table_array, :attribute_array ) AS ( SchemaName, TableName, AttributeName );
END;



create or replace procedure P_AnnotateFeatures (
		IN iProfileAuditID BIGINT,
		IN dwAuditID BIGINT
	)
	LANGUAGE SQLSCRIPT 
	SQL SECURITY INVOKER
	AS 
BEGIN


 featWithGene = select
	 feat.DWAuditID,
	 feat.ReferenceID,
	 feat.FeatureID,
	 feat.ChromosomeIndex,
	 feat.Class,
	 feat.FeatureName,
	 feat.beginregion,
	 feat.endregion,
	 feat.Strand,
	 feat.Frame,
	 feat.Score,
	 feat.ParentID,
	 gene.FeatureID as GENE 
from Features as feat 
inner join (select
	 FeatureID,
	 ChromosomeIndex,
	 beginregion,
	 endregion 
	from Features 
	where Class = 'mRNA' 
	and DWAuditID = dwAuditID) as gene on (feat.ChromosomeIndex = gene.ChromosomeIndex 
	and feat.ParentID=gene.FeatureID) 
where feat.DWAuditID = dwAuditID 
;
exons = select
	 featExon.DWAuditID,
	 featExon.ReferenceID,
	 featExon.FeatureID,
	 featExon.ChromosomeIndex,
	 featExon.Class,
	 featExon.FeatureName,
	 featExon.beginregion,
	 featExon.endregion,
	 featExon.Strand,
	 featExon.Frame,
	 featExon.Score,
	 featExon.ParentID,
	 featExon.GENE,
	 ROW_NUMBER() over (partition by featExon.ChromosomeIndex,
	 featExon.GENE 
	Order by featExon.beginregion) AS Rank 
from :featWithGene as featExon 
where featExon.Class = 'exon' 
order by featExon.ChromosomeIndex,
	 featExon.GENE,
	 Rank asc 
;
cds = select
	 featCDS.DWAuditID,
	 featCDS.ReferenceID,
	 featCDS.FeatureID,
	 featCDS.ChromosomeIndex,
	 featCDS.Class,
	 featCDS.FeatureName,
	 featCDS.beginregion,
	 featCDS.endregion,
	 featCDS.Strand,
	 featCDS.Frame,
	 featCDS.Score,
	 featCDS.ParentID,
	 featCDS.GENE,
	 ROW_NUMBER() over (partition by featCDS.ChromosomeIndex,
	 featCDS.GENE 
	Order by featCDS.beginregion) AS Rank 
from :featWithGene as featCDS 
where featCDS.Class = 'CDS' 
order by featCDS.ChromosomeIndex,
	 featCDS.GENE,
	 Rank asc 
;

--Annotate 5'Prime and 3'Prime UTR
 -- 5'Prime UTR when the first CDS is within first exon
insert 
into FeaturesAnnotation (DWAuditID,
	 ReferenceID,
	 ChromosomeIndex,
	 beginregion,
	 endregion,
	 FeatureID,
	 Class,
	 FeatureName,
	 Strand,
	-- Frame,
	 Score,
	 ParentID,
	 Description,
	 Sequence, Rank, PrePost)(select
	 exon.DWAuditID,
	 exon.ReferenceID,
	 exon.ChromosomeIndex,
	  exon.beginregion as beginregion,
	 (cds.beginregion-1) as endregion,
	case when exon.Strand='+'  then ('five_prime_UTR' || exon.FeatureID)
	else ('three_prime_UTR' || exon.FeatureID) end AS FeatureID,
	case when exon.Strand='+'  then 'five_prime_UTR' else 'three_prime_UTR' end,
	 null,
	 exon.Strand,
--	 exon.Frame,
	 exon.Score,
	 exon.FeatureID,
	case when exon.Strand='+'  then 'five_prime_UTR' else 'three_prime_UTR' end,
	null, null, null
	from :exons as exon 
	INNER JOIN :cds as cds on (exon.GENE = cds.GENE 
		and exon.ChromosomeIndex = cds.ChromosomeIndex 
		and cds.Rank =1 
		--and cds.beginregion != exon.beginregion 
		and cds.beginregion between exon.beginregion 
		and exon.endregion )) 
;

-- 5'Prime UTR when the first CDS is not within first exon this excludes the 5'Prime which is contained in the first cds
-- All exons that appear before first cds are marked as 5'Prime UTRs
insert 
into FeaturesAnnotation (DWAuditID,
	 ReferenceID,
	 ChromosomeIndex,
	 beginregion,
	 endregion,
	 FeatureID,
	 Class,
	 FeatureName,
	 Strand,
--	 Frame,
	 Score,
	 ParentID,
	 Description,
	 Sequence, Rank, PrePost)(select
	 exon.DWAuditID,
	 exon.ReferenceID,
	 exon.ChromosomeIndex,
	 exon.beginregion,
	 exon.endregion,
	case when exon.Strand='+' then ('five_prime_UTR' || exon.FeatureID)
	else ('three_prime_UTR' || exon.FeatureID) end ,
case when exon.Strand='+' then 'five_prime_UTR'
else 'three_prime_UTR' end,
	 null,
	 exon.Strand,
	 --exon.Frame,
	 exon.Score,
	 exon.FeatureID,
case when exon.Strand='+' then 'five_prime_UTR'
else 'three_prime_UTR' end,
NULL, NULL, NULL
	from :exons as exon 
	INNER JOIN :cds as cds on (exon.GENE = cds.GENE 
		and exon.ChromosomeIndex=cds.ChromosomeIndex 
		and (select
	 beginregion 
			from :cds as innerCDS 
			where innerCDS.GENE=exon.GENE 
			and innerCDS.ChromosomeIndex=exon.ChromosomeIndex 
			and innerCDS.Rank=1 
			and cds.Rank=1)> exon.endregion -- and cds.beginregion > exon.endregion 
 
		and cds.beginregion != exon.beginregion) ) 
;
-- 3'Prime UTR when the last CDS is  within exon
insert 
into FeaturesAnnotation (DWAuditID,
	 ReferenceID,
	 ChromosomeIndex,
	 beginregion,
	 endregion,
	 FeatureID,
	 Class,
	 FeatureName,
	 Strand,
	-- Frame,
	 Score,
	 ParentID,
	 Description,
	 Sequence, Rank, PrePost) (select
	 exon.DWAuditID,
	 exon.ReferenceID,
	 exon.ChromosomeIndex,
	 cds.endregion+1,
	 (exon.endregion),
case when exon.Strand='+' then ('three_prime_UTR' || exon.FeatureID)
else ('five_prime_UTR' || exon.FeatureID) end ,
	case when exon.Strand='+' then 'three_prime_UTR'
	else 'five_prime_UTR' end,
	 null,
	 exon.Strand,
--	 exon.Frame,
	 exon.Score,
	 exon.ParentID,
case when exon.Strand='+' then 'three_prime_UTR' 
else 'five_prime_UTR' end,
NULL, NULL, NULL 
	from :exons as exon 
	INNER JOIN :cds as cds on (cds.endregion != exon.endregion 
		and exon.GENE = cds.GENE 
		and exon.ChromosomeIndex = cds.ChromosomeIndex 
		and (select
	 max(cdsSecondInner.beginregion) 
			from :cds as cdsSecondInner 
			where cdsSecondInner.GENE = exon.GENE 
			and cdsSecondInner.ChromosomeIndex = exon.ChromosomeIndex 
			and cds.Rank = (select
	 max (Rank) 
				from :cds as innerCDS 
				where innerCDS.GENE = exon.GENE 
				and innerCDS.ChromosomeIndex = exon.ChromosomeIndex)) between exon.beginregion 
		and exon.endregion ) ) 
;
 -- 3'Prime UTR after the last CDS. All exons after last CDS are marked as 3'Prime
insert 
into FeaturesAnnotation (DWAuditID,
	 ReferenceID,
	 ChromosomeIndex,
	 beginregion,
	 endregion,
	 FeatureID,
	 Class,
	 FeatureName,
	 Strand,
--	 Frame,
	 Score,
	 ParentID,
	 Description,
	 Sequence, Rank, PrePost)(select
	 distinct exon.DWAuditID,
	 exon.ReferenceID,
	 exon.ChromosomeIndex,
	 exon.beginregion,
	 exon.endregion,
	 case when exon.Strand='+' then ('three_prime_UTR' || exon.FeatureID)
	 else ('five_prime_UTR' || exon.FeatureID) end,
	 case when exon.Strand='+' then 'three_prime_UTR'
	 else 'five_prime_UTR' end ,
	 null,
	 exon.Strand,
--	 exon.Frame,
	 exon.Score,
	 exon.FeatureID,
	 case when exon.Strand='+' then 'three_prime_UTR' 
	 else 'five_prime_UTR' end,
NULL, NULL, NULL
	from :exons as exon 
	INNER JOIN :cds as cds on (exon.GENE = cds.GENE 
		and exon.beginregion > (select
	 max(innerCDS.endregion ) 
			from :cds as innerCDS 
			where innerCDS.GENE = exon.GENE 
			and innerCDS.ChromosomeIndex = exon.ChromosomeIndex) ) ) 
;


 --Annotate introns
introns = select
	 T1.DWAuditID,
	 T1.ReferenceID,
	 T1.ChromosomeIndex,
	 T1.endregion+4 as beginregion,
	 T2.beginregion-4 as endregion,
	 T1.GENE||'intron'||T1.Rank AS FeatureID,
	 'intron' AS Class,
	 T1.GENE||'intron'||T1.Rank AS Name,
	 T1.Strand,
--	 T1.Frame,
	 T1.Score,
	 T1.ParentID AS ParentID,
	 'intron' AS Description 
from :exons as T1 
INNER JOIN :exons as T2 on (T1.endregion < T2.endregion 
	and T1.Rank =T2.Rank-1 
	and T1.ChromosomeIndex=T2.ChromosomeIndex 
	and T1.GENE=T2.GENE 
	and T1.Rank <T2.Rank) 
order by T1.GENE 
;
insert 
into FeaturesAnnotation (DWAuditID,
	 ReferenceID,
	 ChromosomeIndex,
	 beginregion,
	 endregion,
	 FeatureID,
	 Class,
	 FeatureName,
	 Strand,
--	 Frame,
	 Score,
	 ParentID,
	 Description,
	 Sequence, Rank, PrePost) (select
	 introns.DWAuditID,
	 introns.ReferenceID,
	 introns.ChromosomeIndex,
	 introns.beginregion,
	 introns.endregion,
	 introns.FeatureID,
	 introns.Class,
	 null,
	 introns.Strand,
	-- introns.Frame,
	 introns.Score,
	 introns.ParentID,
	 introns.Description,
NULL, NULL, NULL 
	from :introns as introns 
	where introns.beginregion < introns.endregion) 
;


 --Annotate trans_splice_donor_site
insert 
into FeaturesAnnotation (DWAuditID,
	 ReferenceID,
	 ChromosomeIndex,
	 beginregion,
	 endregion,
	 FeatureID,
	 Class,
	 FeatureName,
	 Strand,
	 --Frame,
	 Score,
	 ParentID,
	 Description,
	 Sequence, Rank, PrePost) (select
	 introns.DWAuditID,
	 introns.ReferenceID,
	 introns.ChromosomeIndex,
	 introns.beginregion-3,
	 introns.beginregion-1,
	 introns.FeatureID ||'trans_splice_donor_site',
	 'trans_splice_donor_site',
	 null,
	 introns.Strand,
	-- introns.Frame,
	 introns.Score,
	 introns.ParentID,
	 'trans_splice_donor_site',
NULL, NULL, NULL 
	from :introns as introns) 
;


 --Annotate trans_splice_acceptor_site
insert 
into FeaturesAnnotation (DWAuditID,
	 ReferenceID,
	 ChromosomeIndex,
	 beginregion,
	 endregion,
	 FeatureID,
	 Class,
	 FeatureName,
	 Strand,
	-- Frame,
	 Score,
	 ParentID,
	 Description,
	 Sequence, Rank, PrePost) (select
	 introns.DWAuditID,
	 introns.ReferenceID,
	 introns.ChromosomeIndex,
	 introns.endregion+1,
	 introns.endregion+3,
	 introns.FeatureID ||'trans_splice_acceptor_site',
	 'trans_splice_acceptor_site',
	 null,
	 introns.Strand,
--	 introns.Frame,
	 introns.Score,
	 introns.ParentID,
	 'trans_splice_acceptor_site',
NULL, NULL, NULL 
	from :introns as introns) 
;

 --Annotate intergenic regions
intergenic_region = select
	 feat.DWAuditID,
	 feat.ReferenceID,
	 feat.FeatureID,
	 feat.ChromosomeIndex,
	 feat.Class,
	 feat.FeatureName,
	 feat.beginregion,
	 feat.endregion,
	 feat.Strand,
	-- feat.Frame,
	 feat.Score,
	 feat.ParentID,
	 ROW_NUMBER() over (partition by feat.ChromosomeIndex 
	Order by feat.beginregion) AS Rank 
from Features as feat 
where feat.Class='gene' 
and feat.DWAuditID = dwAuditID 
;
 insert 
into FeaturesAnnotation (DWAuditID,
	 ReferenceID,
	 ChromosomeIndex,
	 beginregion,
	 endregion,
	 FeatureID,
	 Class,
	 FeatureName,
	 Strand,
	-- Frame,
	 Score,
	 ParentID,
	 Description,
	 Sequence, Rank, PrePost) (select
	 T1.DWAuditID,
	 T1.ReferenceID,
	 T1.ChromosomeIndex,
	 T1.endregion+1,
	 T2.beginregion-1,
	 T1.FeatureID||'intergenic_region'||T1.Rank,
	 'intergenic_region',
	 null,
	 T1.Strand,
--	 T1.Frame,
	 T1.Score,
	 T1.ParentID,
	 'intergenic_region',
NULL, NULL, NULL 
	from :intergenic_region as T1 
	INNER JOIN :intergenic_region as T2 on (T1.Rank =T2.Rank-1 
		and T1.ChromosomeIndex=T2.ChromosomeIndex) 
	and T2.beginregion > T1.endregion+1 
	order by T1.ChromosomeIndex) 
;


 --Annotate start and stop codons
cdsGroup = select
	 feat.DWAuditID,
	 feat.ReferenceID,
	 feat.FeatureID,
	 feat.ChromosomeIndex,
	 feat.Class,
	 feat.FeatureName,
	 feat.beginregion,
	 feat.endregion,
	 feat.Strand,
	-- feat.Frame,
	 feat.Score,
	 feat.ParentID,
	case when feat.Strand = '+' then
	  ROW_NUMBER() over (partition by feat.ChromosomeIndex,
	 feat.FeatureName 
	Order by feat.beginregion) 
else
 ROW_NUMBER() over (partition by feat.ChromosomeIndex,
feat.FeatureName 
Order by feat.beginregion desc) end
	AS Rank,	
	 feat.Description 
from Features as feat 
where Class='CDS' 
and feat.FeatureName is not null 
and TRIM(COALESCE(feat.FeatureName,'')) != '' 
and feat.DWAuditID = :dwAuditID order by feat.FeatureName,feat.beginregion
;



insert into FeaturesAnnotation (DWAuditID,
	 ReferenceID,ChromosomeIndex,beginregion,endregion,FeatureID,Class,FeatureName,
	  Strand,
	  --Frame,
	  Score, ParentID, Description,Sequence,Rank,PrePost) (
	 select
	 cdsGroup.DWAuditID,
	 cdsGroup.ReferenceID,
	 cdsGroup.ChromosomeIndex,
	 case when cdsGroup.Strand = '+' then
	 cdsGroup.beginregion else 
	 cdsGroup.endregion-2 end as beginregion ,
	 case when cdsGroup.Strand = '+' then
	 cdsGroup.beginregion +2
	 else 
	 	 cdsGroup.endregion end
	  as endregion,
	'start_codon_' ||cdsGroup.FeatureID ,
     'start_codon' ,
	 cdsGroup.FeatureName,
	 cdsGroup.Strand,
	-- cdsGroup.Frame,
	 cdsGroup.Score,
	 cdsGroup.FeatureName,
	 'start_codon' ,
	'' AS Sequence,
	0 AS Rank,
	NULL AS PrePost
	from :cdsGroup as cdsGroup 
	where cdsGroup.FeatureName is not null 
	and TRIM(COALESCE(cdsGroup.FeatureName,
	 '')) != '' 
	and cdsGroup.Rank = 1) 
;


insert 
into FeaturesAnnotation (DWAuditID,
	 ReferenceID,
	 ChromosomeIndex,
	 beginregion,
	 endregion,
	 FeatureID,
	 Class,
	 FeatureName,
	 Strand,
--	 Frame,
	 Score,
	 ParentID,
	 Description,
	 Sequence,Rank,PrePost) (select
	 cdsGroup.DWAuditID,
	 cdsGroup.ReferenceID,
	 cdsGroup.ChromosomeIndex,
	 case when cdsGroup.Strand = '+'  then
	 cdsGroup.endregion-2
	 else 	 cdsGroup.beginregion end as beginregion,
	 case when cdsGroup.Strand = '+'  then
	 cdsGroup.endregion
	 else cdsGroup.beginregion+2 end as endregion,
	 'stop_codon_' ||cdsGroup.FeatureID ,
	'stop_codon' ,
	 cdsGroup.FeatureName,
	 cdsGroup.Strand,
--	 cdsGroup.Frame,
	 cdsGroup.Score,
	 cdsGroup.FeatureName,
	 'stop_codon' ,
	'' AS Sequence,
	(cdsGroup.Rank+1) AS Rank,
	NULL AS PrePost
	from :cdsGroup as cdsGroup 
	where cdsGroup.FeatureName is not null 
	and TRIM(COALESCE(cdsGroup.FeatureName,
	 '')) != '' 
	and cdsGroup.Rank =(select
	 max(cdsGroupInner.Rank) 
		from :cdsGroup as cdsGroupInner 
		where cdsGroup.FeatureName = cdsGroupInner.FeatureName 
		and cdsGroup.ChromosomeIndex = cdsGroupInner.ChromosomeIndex 
		group by cdsGroupInner.FeatureName)) 
;

 --Annotate CDS
 insert --for in-between cds eg cds 2, cds3 and cds4 in a cds1-cds5 range of CDS's
into FeaturesAnnotation (DWAuditID,
	 ReferenceID,
	 ChromosomeIndex,
	 beginregion,
	 endregion,
	 FeatureID,
	 Class,
	 FeatureName,
	 Strand,
--	 Frame,
	 Score,
	 ParentID,
	 Description,
	  Sequence,Rank,PrePost) (select
	 cdsGroup.DWAuditID,
	 cdsGroup.ReferenceID,
	 cdsGroup.ChromosomeIndex,
	 cdsGroup.beginregion,
	 cdsGroup.endregion,
	 cdsGroup.FeatureID,
	 'CDS_region',
	 cdsGroup.FeatureName,
	 cdsGroup.Strand,
--	 cdsGroup.Frame,
	 cdsGroup.Score,
	 cdsGroup.ParentID,
	 cdsGroup.Description,
	 '' AS Sequence,
	  cdsGroup.Rank AS Rank,
	  NULL AS PrePost
	from :cdsGroup as cdsGroup 
	where cdsGroup.FeatureName is not null 
	and TRIM(COALESCE(cdsGroup.FeatureName,
	 '')) != '' -- and cdsGroup.endregion-cdsGroup.beginregion >3 
 
	and cdsGroup.Rank >(select
	 min(cdsGroupMinInner.Rank) 
		from :cdsGroup as cdsGroupMinInner 
		where cdsGroup.FeatureName = cdsGroupMinInner.FeatureName 
		and cdsGroup.ChromosomeIndex = cdsGroupMinInner.ChromosomeIndex 
		group by cdsGroupMinInner.FeatureName) 
	and cdsGroup.Rank < (select
	 max(cdsGroupInner.Rank) 
		from :cdsGroup as cdsGroupInner 
		where cdsGroup.FeatureName = cdsGroupInner.FeatureName 
		and cdsGroup.ChromosomeIndex = cdsGroupInner.ChromosomeIndex 
		group by cdsGroupInner.FeatureName) ) 
;


insert -- for cds1 in a cds-range  whose length > 1 and cds1 is not the start codon i.e length =3 
into FeaturesAnnotation (DWAuditID,
	 ReferenceID,
	 ChromosomeIndex,
	 beginregion,
	 endregion,
	 FeatureID,
	 Class,
	 FeatureName,
	 Strand,
--	 Frame,
	 Score,
	 ParentID,
	 Description,
 Sequence,Rank,PrePost) (select
	 cdsGroup.DWAuditID,
	 cdsGroup.ReferenceID,
	 cdsGroup.ChromosomeIndex,
case when cdsGroup.Strand='+' then
	 cdsGroup.beginregion+3 
	 else cdsGroup.beginregion
	 end as beginregion,
	 case when cdsGroup.Strand='+' then
	 cdsGroup.endregion
	 else cdsGroup.endregion -3  end
	 as endregion,
	 cdsGroup.FeatureID,
	 'CDS_region',
	 cdsGroup.FeatureName,
	 cdsGroup.Strand,
--	 cdsGroup.Frame,
	 cdsGroup.Score,
	 cdsGroup.ParentID,
	 cdsGroup.Description,
	 '' AS Sequence,
	 cdsGroup.Rank AS Rank,
	 NULL AS PrePost 
	from :cdsGroup as cdsGroup 
	where cdsGroup.FeatureName is not null 
	and TRIM(COALESCE(cdsGroup.FeatureName,
	 '')) != '' 
	and cdsGroup.Rank = 1 
	and ( cdsGroup.endregion-cdsGroup.beginregion +1 ) >3 
	and (select
	 max(cdsGroupInner.Rank) 
		from :cdsGroup as cdsGroupInner 
		where cdsGroup.FeatureName = cdsGroupInner.FeatureName 
		and cdsGroup.ChromosomeIndex = cdsGroupInner.ChromosomeIndex 
		group by cdsGroupInner.FeatureName) >1) 
;

 insert -- for cds1 in a cds-range  whose length = 1 and cds1 is not the start codon i.e length =3 
into FeaturesAnnotation (DWAuditID,
	 ReferenceID,
	 ChromosomeIndex,
	 beginregion,
	 endregion,
	 FeatureID,
	 Class,
	 FeatureName,
	 Strand,
--	 Frame,
	 Score,
	 ParentID,
	 Description,
 Sequence,Rank,PrePost) (select
	 cdsGroup.DWAuditID,
	 cdsGroup.ReferenceID,
	 cdsGroup.ChromosomeIndex,
	 cdsGroup.beginregion+3,
	 cdsGroup.endregion-3,
	 cdsGroup.FeatureID,
	 'CDS_region',
	 cdsGroup.FeatureName,
	 cdsGroup.Strand,
--	 cdsGroup.Frame,
	 cdsGroup.Score,
	 cdsGroup.ParentID,
	 cdsGroup.Description, 
	  '' AS Sequence,
	 	 cdsGroup.Rank AS Rank,
	 	 NULL AS PrePost
	from :cdsGroup as cdsGroup 
	where cdsGroup.FeatureName is not null 
	and TRIM(COALESCE(cdsGroup.FeatureName,
	 '')) != '' 
	and cdsGroup.Rank = 1 
	and ( cdsGroup.endregion-cdsGroup.beginregion +1 )>3 
	and (select
	 max(cdsGroupInner.Rank) 
		from :cdsGroup as cdsGroupInner 
		where cdsGroup.FeatureName = cdsGroupInner.FeatureName 
		and cdsGroup.ChromosomeIndex = cdsGroupInner.ChromosomeIndex 
		group by cdsGroupInner.FeatureName) =1) 
;

-- for last cds eg cds 5 in a cds1-cds5 range of CDS's
 insert 
into FeaturesAnnotation (DWAuditID,
	 ReferenceID,
	 ChromosomeIndex,
	 beginregion,
	 endregion,
	 FeatureID,
	 Class,
	 FeatureName,
	 Strand,
--	 Frame,
	 Score,
	 ParentID,
	 Description,Sequence,Rank,PrePost) (select
	 cdsGroup.DWAuditID,
	 cdsGroup.ReferenceID,
	 cdsGroup.ChromosomeIndex,
case when cdsGroup.Strand='+' then
	 cdsGroup.beginregion 
	 else cdsGroup.beginregion+3 end  as beginregion,
case when cdsGroup.Strand='+' then
	 cdsGroup.endregion-3
	 else cdsGroup.endregion end as endregion,
	 cdsGroup.FeatureID,
	 'CDS_region',
	 cdsGroup.FeatureName,
	 cdsGroup.Strand,
--	 cdsGroup.Frame,
	 cdsGroup.Score,
	 cdsGroup.ParentID,
	 cdsGroup.Description, 
	 '' AS Sequence,
     cdsGroup.Rank AS Rank,
     NULL AS PrePost
	from :cdsGroup as cdsGroup 
	where cdsGroup.FeatureName is not null 
	and TRIM(COALESCE(cdsGroup.FeatureName,
	 '')) != '' 
	and ( cdsGroup.endregion-cdsGroup.beginregion +1 ) >3 
	and cdsGroup.Rank >1 
	and cdsGroup.Rank =(select
	 max(cdsGroupInner.Rank) 
		from :cdsGroup as cdsGroupInner 
		where cdsGroup.FeatureName = cdsGroupInner.FeatureName 
		and cdsGroup.ChromosomeIndex = cdsGroupInner.ChromosomeIndex 
		group by cdsGroupInner.FeatureName)) 
;


--Rank correction for cds rank and stop codon
update FeaturesAnnotation  s1 set s1.Rank=(select s1.Rank -(s2.minRank-1) from  
(select FeatureName,min(Rank) as minRank from FeaturesAnnotation  where ChromosomeIndex=s1.ChromosomeIndex 
and Class ='CDS_region' group by FeatureName ) as s2
where s1.FeatureName=s2.FeatureName )
where s1.Class in ('CDS_region','stop_codon') and DWAuditID=:dwAuditID;


--update cds_pos column
update FeaturesAnnotation  t1 set t1.CDSPosition=
( select sum(ABS(endregion-beginregion)+1) from  FeaturesAnnotation  t2 where t2.Rank < t1.Rank
and t2.FeatureName=t1.FeatureName and  t2.ChromosomeIndex= t1.ChromosomeIndex and t2.DWAuditID=t1.DWAuditID ) where --t1.Strand='+' and  
t1.DWAuditID=:dwAuditID ;

--update where ever start codon cds_pos =0
update FeaturesAnnotation  set CDSPosition=0 where Rank=0 and 
DWAuditID=:dwAuditID ;



END;


create or replace procedure P_MutationData(
		IN sample_list SampleList,
		IN reference_id NVARCHAR(255), 
		IN chromosome_index INTEGER, 
		IN begin_position INTEGER, 
		IN end_position INTEGER, 
		OUT mutation_data MutationData,
		OUT affected_gene AffectedGene
	)
	LANGUAGE SQLSCRIPT
	SQL SECURITY INVOKER
	READS SQL DATA
AS
BEGIN
	DECLARE sample_count INTEGER;

	SELECT COUNT( * )	INTO sample_count FROM :sample_list;
  
	all_mutation = SELECT 
            VariantAnnotations.MutationType AS MutationType,
            COUNT( DISTINCT Samples.SampleIndex ) AS SampleCount,
            VariantAnnotations.GeneName AS GeneName
	    FROM :sample_list AS Samples
            JOIN Genotypes AS Genotypes
                ON Genotypes.SampleIndex = Samples.SampleIndex
            JOIN  VariantAnnotations AS VariantAnnotations
                ON Genotypes.DWAuditID = VariantAnnotations.DWAuditID
                AND Genotypes.VariantIndex = VariantAnnotations.VariantIndex
		WHERE VariantAnnotations.ChromosomeIndex = :chromosome_index
		    AND VariantAnnotations.Position < :end_position
            AND VariantAnnotations.Position >= :begin_position
		GROUP BY VariantAnnotations.GeneName,
		    VariantAnnotations.Position,
		    VariantAnnotations.MutationType
		ORDER BY GeneName NULLS LAST;
		
    affected_gene_list = SELECT CASE WHEN GeneName IS NULL THEN 'intergenic' ELSE GeneName END AS GeneName, 
	        AVG( SampleCount ) / :sample_count * 100 AS Percent
		FROM :all_mutation
		GROUP BY GeneName
		ORDER BY GeneName ASC;
		
	affected_gene = SELECT "affected_gene_list".GeneName, features.Description, "affected_gene_list".Percent
	    FROM :affected_gene_list AS "affected_gene_list"
	    LEFT OUTER JOIN Features AS features
	    ON "affected_gene_list".GeneName = features.FeatureName;
	 
 	mutation_per_gene = SELECT CASE WHEN GeneName IS NULL THEN 'intergenic' ELSE GeneName END AS GeneName, MutationType, COUNT ( * ) AS Count
    	FROM :all_mutation 
    	GROUP BY GeneName, 
    	    MutationType
    	ORDER BY GeneName;
	
    totalMutationPerGene = SELECT GeneName, SUM( Count ) AS Count
    	FROM :mutation_per_gene
    	GROUP BY GeneName
    	ORDER BY GeneName;
	    
	mutation_data = SELECT "mutation_per_gene".GeneName, "mutation_per_gene".MutationType, "mutation_per_gene".Count / "total_mutation_per_gene".Count AS Percent
            FROM :mutation_per_gene AS "mutation_per_gene"
        	     JOIN :totalMutationPerGene AS "total_mutation_per_gene"
        	      ON "mutation_per_gene".GeneName = "total_mutation_per_gene".GeneName
        	GROUP BY "mutation_per_gene".GeneName,
        		"mutation_per_gene".MutationType,
        		"mutation_per_gene".Count,
        		"total_mutation_per_gene".Count
        	ORDER BY "mutation_per_gene".GeneName,
        	    "mutation_per_gene".MutationType;
        	    
END;



create or replace FUNCTION StripNullBytes ( input NVARCHAR(5000) )
RETURNS output NVARCHAR(5000)
LANGUAGE SQLScript AS
BEGIN
      DECLARE buffer NVARCHAR(5000) := BINTOHEX( TO_BINARY( input ) );
      IF :input IS NULL THEN
        output := NULL;
      ELSE
          output := '';
          WHILE LENGTH( :buffer ) > 1 DO
                IF SUBSTRING( :buffer, 1, 2 ) <> '00' THEN
                      output := :output || SUBSTRING( :buffer, 1, 2 );
                END IF;
                buffer := SUBSTRING( :buffer, 3 );
          END WHILE;
          output := BINTOSTR( HEXTOBIN( :output ) );
    END IF;
END;


