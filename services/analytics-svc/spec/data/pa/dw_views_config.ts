export const dw_views_config = {
  patient: {
    conditions: {
      acme: {
        interactions: {
          priDiag: {
            name: "Primary Tumor Diagnosis",
            defaultFilter: "@INTERACTION.\"InteractionTypeValue\" = 'ACME_M03'",
            defaultFilterKey: "ACME_M03",
            order: 4,
            parentInteraction: [],
            parentInteractionLabel: "parent",
            attributes: {
              icd_10: {
                name: "ICD-10-CM Code",
                type: "text",
                expression: 'LEFT(@CODE."Value",3)',
                defaultFilter: "@CODE.\"AttributeValue\" = 'ICD_10'",
                referenceFilter: `@REF.\"VocabularyID\" = 'ots.ICD.ICD10GM'
                                                    AND (LENGTH(@REF.\"Code\")=3 OR (LENGTH(@REF.\"Code\")=5
                                                    AND @REF.\"Code\" LIKE '%.-'))`,
                referenceExpression: 'LEFT(@REF."Code",3)',
                order: 1,
              },
              icd: {
                name: "ICD-10-CM Code",
                type: "text",
                expression: 'LEFT(@CODE."Value",3)',
                defaultFilter: "@CODE.\"AttributeValue\" = 'ICD_10'",
                referenceFilter: `@REF.\"VocabularyID\" = 'ots.ICD.ICD10GM' AND (LENGTH(@REF.\"Code\")=3
                                                    OR (LENGTH(@REF.\"Code\")=5 AND @REF.\"Code\" LIKE '%.-'))`,
                referenceExpression: 'LEFT(@REF."Code",3)',
                order: 1,
              },
              icd_10_smoker: {
                name: "ICD-10-CM Code AND Smoker",
                type: "text",
                expression: `CONCAT(LEFT(@CODE."Value",3), @OBS."ObsCharValue") `,
                defaultFilter: `@CODE."AttributeValue" = 'ICD_10' AND @OBS."ObsType" = 'SMOKER'`,
                referenceFilter: `@REF.\"VocabularyID\" = 'ots.ICD.ICD10GM' AND (LENGTH(@REF.\"Code\")=3
                                                    OR (LENGTH(@REF.\"Code\")=5 AND @REF.\"Code\" LIKE '%.-'))`,
                referenceExpression: 'LEFT(@REF."Code",3)',
                order: 1,
              },
              icd_9: {
                name: "ICD-9-CM Code",
                type: "text",
                expression: 'LEFT(@CODE."Value",3)',
                defaultFilter: "@CODE.\"AttributeValue\" = 'ICD_9'",
                order: 2,
              },
              age: {
                name: "Age at Diagnosis",
                type: "num",
                expression:
                  'FLOOR(DAYS_BETWEEN(@PATIENT."BirthDate",@INTERACTION."PeriodEnd") / 365)',
                defaultFilter:
                  '@PATIENT."BirthDate" <= @INTERACTION."PeriodEnd"',
                order: 3,
              },
              nsclc: {
                name: "Lung Cancer Subtype",
                type: "text",
                expression: '@CODE."Value"',
                eavExpressionKey: "LC_TYPE",
                defaultFilter: "@CODE.\"AttributeValue\" = 'LC_TYPE'",
                order: 4,
              },
              freetextDiag: {
                name: "Diagnosis Free Text",
                type: "freetext",
                expression: '@TEXT."Value"',
                defaultFilter: "@TEXT.\"Attribute\" = 'INTERACTIONS_FREETEXT'",
                order: 5,
                fuzziness: 0.8,
              },
              histology: {
                name: "Histology",
                type: "text",
                expression: '@CODE."Value"',
                eavExpressionKey: "Histology",
                defaultFilter: "@CODE.\"AttributeValue\" = 'Histology'",
                order: 6,
              },
              tcgaCode: {
                name: "Cancer Abbreviation",
                type: "text",
                expression: '@CODE."Value"',
                eavExpressionKey: "TCGA_CODE",
                defaultFilter: "@CODE.\"AttributeValue\" = 'TCGA_CODE'",
                order: 7,
              },
              tcgaCancer: {
                name: "Cancer Type",
                type: "text",
                expression: '@CODE."Value"',
                eavExpressionKey: "TCGA_CANCER",
                defaultFilter: "@CODE.\"AttributeValue\" = 'TCGA_CANCER'",
                order: 8,
              },
            },
          },
          biobank: {
            name: "Biobank",
            defaultFilter: "@INTERACTION.\"InteractionTypeValue\" = 'BIOBANK'",
            defaultFilterKey: "BIOBANK",
            order: 5,
            parentInteraction: [],
            parentInteractionLabel: "parent",
            attributes: {
              status: {
                name: "Sample Status",
                type: "text",
                expression: '@CODE."Value"',
                defaultFilter: "@CODE.\"AttributeValue\" = 'BIOBANK_STATUS'",
                order: 1,
              },
              tType: {
                name: "Tissue / Liquid Type",
                type: "text",
                expression: '@CODE."Value"',
                defaultFilter: "@CODE.\"AttributeValue\" = 'BIOBANK_TYPE'",
                order: 2,
              },
            },
          },
          chemo: {
            name: "Chemotherapy",
            defaultFilter:
              "@INTERACTION.\"InteractionTypeValue\" = 'ACME_M07_CHEMO'",
            defaultFilterKey: "ACME_M07_CHEMO",
            order: 6,
            parentInteraction: ["patient.conditions.acme.interactions.priDiag"],
            parentInteractionLabel: "parent",
            attributes: {
              interactionCount: {
                name: "Interaction Count",
                type: "num",
                measureExpression:
                  'COUNT(DISTINCT(@INTERACTION."InteractionID"))',
                order: 1,
              },
              chemo_ops: {
                name: "OPS Code",
                type: "text",
                expression: '@CODE."Value"',
                defaultFilter: "@CODE.\"AttributeValue\" = 'CHEMO_OPS'",
                order: 2,
              },
              chemo_prot: {
                name: "Protocol",
                type: "text",
                expression: '@CODE."Value"',
                defaultFilter: "@CODE.\"AttributeValue\" = 'CHEMO_PROT'",
                order: 3,
              },
              interactionsPerPatient: {
                name: "Interactions per Patient",
                type: "num",
                measureExpression:
                  'COUNT(DISTINCT(@INTERACTION."InteractionID")) / COUNT(DISTINCT(@PATIENT."PatientID"))',
                order: 4,
              },
            },
          },
          radio: {
            name: "Radiotherapy",
            defaultFilter:
              "@INTERACTION.\"InteractionTypeValue\" = 'ACME_M07_RADIO'",
            defaultFilterKey: "ACME_M07_RADIO",
            order: 7,
            parentInteraction: [],
            parentInteractionLabel: "parent",
            attributes: {
              radio_dosage: {
                name: "Radio Dosage (Gy)",
                type: "num",
                expression: '@MEASURE."Value"',
                defaultFilter:
                  "@MEASURE.\"AttributeValue\" = 'DOSAGE' AND @MEASURE.\"Unit\" = 'Gy'",
                order: 1,
              },
              radio_ops: {
                name: "OPS Code",
                type: "text",
                expression: '@CODE."Value"',
                defaultFilter: "@CODE.\"AttributeValue\" = 'RADIO_OPS'",
                order: 2,
              },
            },
          },
          surgery: {
            name: "Surgery",
            defaultFilter:
              "@INTERACTION.\"InteractionTypeValue\" = 'ACME_M07_SURGERY'",
            defaultFilterKey: "ACME_M07_SURGERY",
            order: 8,
            parentInteraction: [],
            parentInteractionLabel: "parent",
            attributes: {
              exist: {
                name: "Exist",
                type: "text",
                expression:
                  "CASE WHEN @INTERACTION.\"InteractionID\" IS NULL THEN NULL ELSE 'YES' END",
                order: 1,
              },
              surgery_ops: {
                name: "OPS Code",
                type: "text",
                expression: '@CODE."Value"',
                defaultFilter: "@CODE.\"AttributeValue\" = 'SURGERY_OPS'",
                order: 2,
              },
            },
          },
          tnm: {
            name: "TNM Classification",
            defaultFilter:
              "@INTERACTION.\"InteractionTypeValue\" = 'ACME_M03TS'",
            defaultFilterKey: "ACME_M03TS",
            order: 9,
            parentInteraction: [],
            parentInteractionLabel: "parent",
            attributes: {
              tnmM: {
                name: "M-Component",
                type: "text",
                expression: "'M' || @CODE.\"Value\"",
                defaultFilter: "@CODE.\"AttributeValue\" = 'TNM_M'",
                order: 1,
              },
              tnmN: {
                name: "N-Component",
                type: "text",
                expression: "'N' || @CODE.\"Value\"",
                defaultFilter: "@CODE.\"AttributeValue\" = 'TNM_N'",
                order: 2,
              },
              tnmT: {
                name: "T-Component",
                type: "text",
                expression: "'T' || @CODE.\"Value\"",
                defaultFilter: "@CODE.\"AttributeValue\" = 'TNM_T'",
                order: 3,
              },
            },
          },
        },
        name: "acme",
      },
    },
    interactions: {
      vStatus: {
        name: "Vital Status",
        defaultFilter: "@INTERACTION.\"InteractionTypeValue\" = 'ACME_M16'",
        defaultFilterKey: "ACME_M16",
        order: 3,
        parentInteraction: [],
        parentInteractionLabel: "parent",
        attributes: {
          age: {
            name: "Age at Last Contact",
            type: "num",
            expression:
              'FLOOR(DAYS_BETWEEN(@PATIENT."BirthDate",@INTERACTION."PeriodEnd") / 365)',
            defaultFilter: '@PATIENT."BirthDate" <= @INTERACTION."PeriodEnd"',
            order: 0,
          },
          status: {
            name: "Vital Status",
            type: "text",
            expression: '@CODE."Value"',
            defaultFilter: "@CODE.\"AttributeValue\" = 'VITALSTATUS'",
            order: 1,
          },
          year: {
            name: "Year of Last Contact",
            type: "num",
            expression: 'YEAR(@INTERACTION."PeriodStart")',
            order: 2,
          },
        },
      },
      ga_sample: {
        name: "Genome Sequencing",
        defaultFilter: "@INTERACTION.\"InteractionTypeValue\" = 'Genomic'",
        defaultFilterKey: "Genomic",
        order: 1,
        parentInteraction: [],
        parentInteractionLabel: "parent",
        attributes: {
          sample_id: {
            name: "Sample Id",
            type: "text",
            expression: '@CODE."Value"',
            eavExpressionKey: "SampleIndex",
            defaultFilter: "@CODE.\"AttributeValue\" = 'SampleIndex'",
            order: 1,
            annotations: ["genomics_sample_id"],
          },
          reference_id: {
            name: "Genome Reference",
            type: "text",
            expression: '@CODE."Value"',
            eavExpressionKey: "ReferenceGenome",
            defaultFilter: "@CODE.\"AttributeValue\" = 'ReferenceGenome'",
            order: 2,
          },
          sample_class: {
            name: "Sample Class",
            type: "text",
            expression: '@CODE."Value"',
            eavExpressionKey: "SampleClass",
            defaultFilter: "@CODE.\"AttributeValue\" = 'SampleClass'",
            order: 3,
          },
        },
      },
      ga_mutation: {
        name: "Genetic Variant",
        defaultFilter: "1=1",
        order: 2,
        from: {
          "@INTERACTION":
            '"legacy.genomics.db.models::MRI.VariantInteractions"',
        },
        parentInteraction: [],
        parentInteractionLabel: "parent",
        attributes: {
          location: {
            name: "Location",
            type: "num",
            expression: "@INTERACTION.POSITION_START",
            relationExpressionKey: "POSITION_START",
            order: 1,
            annotations: ["genomics_variant_location"],
          },
          gene: {
            name: "Gene",
            type: "text",
            expression: "@INTERACTION.GENE_NAME",
            relationExpressionKey: "GENE_NAME",
            order: 2,
          },
          region: {
            name: "Region",
            type: "text",
            expression: "@INTERACTION.REGION",
            relationExpressionKey: "REGION",
            order: 3,
          },
          variant_type: {
            name: "Variant Type",
            type: "text",
            expression: "@INTERACTION.VARIANT_TYPE",
            relationExpressionKey: "VARIANT_TYPE",
            order: 4,
          },
          seq_alteration: {
            name: "Sequence Alteration",
            type: "text",
            expression: "@INTERACTION.SEQUENCE_ALTERATION",
            relationExpressionKey: "SEQUENCE_ALTERATION",
            order: 5,
          },
          aa_ref: {
            name: "Amino Acid Reference",
            type: "text",
            expression: "@INTERACTION.AA_REF",
            relationExpressionKey: "AA_REF",
            order: 6,
          },
          aa_alt: {
            name: "Amino Acid",
            type: "text",
            expression: "@INTERACTION.AA_ALT",
            relationExpressionKey: "AA_ALT",
            order: 7,
          },
        },
      },
    },
    attributes: {
      pid: {
        name: "Patient ID",
        type: "text",
        expression: '@PATIENT."PatientID"',
        order: 1,
      },
      smoker: {
        name: "Smoker",
        type: "text",
        expression: '@OBS."ObsCharValue"',
        defaultFilter: "@OBS.\"ObsType\"= 'SMOKER'",
        referenceFilter: "@REF.\"VocabularyID\"='mri.CAT.YES-NO'",
        referenceExpression: '@REF."Code"',
        order: 2,
      },
      pcount: {
        name: "Patient Count",
        type: "num",
        measureExpression: 'COUNT(DISTINCT(@PATIENT."PatientID"))',
        order: 3,
      },
      nationality: {
        name: "Nationality",
        type: "text",
        expression: '@PATIENT."NationalityValue"',
        order: 4,
      },
      cohort: {
        name: "Cohort",
        type: "text",
        expression: '@OBS."OBS_CHAR_VAL"',
        defaultFilter: '@OBS."OBS_CHAR_VAL"=@OBS."OBS_CHAR_VAL"',
        order: 5,
        from: {
          "@OBS": '"pa.db::CollectionsAsObservation"',
        },
      },
      firstName: {
        name: "First name",
        type: "text",
        expression: '@PATIENT."GivenName"',
        order: 6,
      },
      lastName: {
        name: "Last name",
        type: "text",
        expression: '@PATIENT."FamilyName"',
        order: 7,
      },
      street: {
        name: "Street",
        type: "text",
        expression: '@PATIENT."StreetName"',
        order: 8,
      },
      city: {
        name: "City",
        type: "text",
        expression: '@PATIENT."City"',
        order: 9,
      },
      zipcode: {
        name: "ZIP Code",
        type: "text",
        expression: '@PATIENT."PostalCode"',
        order: 10,
      },
      region: {
        name: "Region",
        type: "text",
        expression: '@PATIENT."State"',
        order: 11,
      },
      country: {
        name: "Country",
        type: "text",
        expression: '@PATIENT."CountryValue"',
        order: 12,
      },
      gender: {
        name: "Gender",
        type: "text",
        expression: '@PATIENT."GenderValue"',
        referenceFilter: "@REF.\"VocabularyID\"='mri.CAT.GENDER'",
        referenceExpression: '@REF."Code"',
        order: 13,
      },
      monthOfBirth: {
        name: "Month of Birth",
        type: "num",
        expression: 'MONTH(@PATIENT."BirthDate")',
        order: 14,
      },
      yearOfBirth: {
        name: "Year of Birth",
        type: "num",
        expression: 'YEAR(@PATIENT."BirthDate")',
        order: 15,
      },
      dateOfBirth: {
        name: "Date of Birth",
        type: "time",
        expression: '@PATIENT."BirthDate"',
        order: 16,
      },
      dateOfDeath: {
        name: "Date of Death",
        type: "time",
        expression: '@PATIENT."DeceasedDate"',
        order: 17,
      },
      maritalStatus: {
        name: "Marital Status",
        type: "text",
        expression: '@PATIENT."MaritalStatusValue"',
        order: 18,
      },
      title: {
        name: "Title",
        type: "text",
        expression: '@PATIENT."TitleValue"',
        order: 19,
      },
      biomarker: {
        name: "Biomarker Type",
        type: "text",
        expression: '@OBS."ObsCharValue"',
        defaultFilter: "@OBS.\"ObsType\"= 'BIOMARKER'",
        order: 20,
      },
      packYearsSmoked: {
        name: "Pack-Years Smoked",
        type: "num",
        expression: '@OBS."ObsNumValue"',
        defaultFilter: "@OBS.\"ObsType\"= 'PACK_YEARS_SMOKED'",
        order: 21,
      },
      smokingOnset: {
        name: "Smoking Onset Year",
        type: "num",
        expression: '@OBS."ObsNumValue"',
        defaultFilter: "@OBS.\"ObsType\"= 'SMOKING_ONSET'",
        order: 22,
      },
      smokingOnsetAge: {
        name: "Smoking Onset Age",
        type: "num",
        expression: '@OBS."ObsNumValue"',
        defaultFilter: "@OBS.\"ObsType\"= 'SMOKING_ONSET_AGE'",
        order: 23,
      },
      smokingStopped: {
        name: "Smoking Stopped Year",
        type: "num",
        expression: '@OBS."ObsNumValue"',
        defaultFilter: "@OBS.\"ObsType\"= 'SMOKING_STOPPED'",
        order: 24,
      },
      dwSource: {
        name: "DW Source",
        type: "text",
        expression: '@PATIENT."Source"',
        order: 25,
      },
      calYear: {
        name: "Start Year",
        type: "num",
        expression: 'YEAR(@INTERACTION."PeriodStart")',
        order: 26,
        isDefault: true,
      },
      calMonth: {
        name: "Start Month",
        type: "num",
        expression: 'MONTH(@INTERACTION."PeriodStart")',
        referenceFilter: "@REF.\"VocabularyID\"='mri.CAT.MONTHS'",
        referenceExpression: '@REF."Code"',
        order: 27,
        isDefault: true,
      },
      start: {
        name: "Start Date",
        type: "time",
        expression: 'TO_DATE(@INTERACTION."PeriodStart")',
        order: 28,
        isDefault: true,
      },
      end: {
        name: "End Date",
        type: "time",
        expression: 'TO_DATE(@INTERACTION."PeriodEnd")',
        order: 29,
        isDefault: true,
      },
      startdatetime: {
        name: "Start Date/Time",
        type: "datetime",
        expression: '@INTERACTION."PeriodStart"',
        order: 30,
        isDefault: true,
      },
    },
  },
  chartOptions: {
    initialAttributes: {
      measures: ["patient.attributes.pcount"],
      categories: [
        "patient.conditions.acme.interactions.priDiag.attributes.icd_10",
      ],
    },
    initialChart: "stacked",
    stacked: {
      visible: true,
      downloadEnabled: true,
      pdfDownloadEnabled: true,
      collectionEnabled: true,
      beginVisible: true,
      fillMissingValuesEnabled: true,
      enabled: true,
    },
    boxplot: {
      visible: true,
      downloadEnabled: true,
      pdfDownloadEnabled: true,
      collectionEnabled: true,
      beginVisible: true,
      fillMissingValuesEnabled: true,
      enabled: true,
    },
    km: {
      visible: true,
      enabled: true,
      downloadEnabled: true,
      pdfDownloadEnabled: true,
      collectionEnabled: true,
      beginVisible: true,
      confidenceInterval: 1.95996398454,
      selectedInteractions: [
        {
          defaultFilter: "@INTERACTION.\"InteractionTypeValue\" = 'ACME_M03'",
          name: "Primary Tumor Diagnosis",
        },
        {
          defaultFilter: "@INTERACTION.\"InteractionTypeValue\" = 'ACME_M03TS'",
          name: "TNM Classification",
        },
        {
          defaultFilter:
            "@INTERACTION.\"InteractionTypeValue\" = 'ACME_M07_RADIO'",
          name: "Radiotherapy",
        },
        {
          defaultFilter:
            "@INTERACTION.\"InteractionTypeValue\" = 'ACME_M07_CHEMO'",
          name: "Chemotherapy",
        },
        {
          defaultFilter:
            "@INTERACTION.\"InteractionTypeValue\" = 'ACME_M07_SURGERY'",
          name: "Surgery",
        },
        {
          defaultFilter: "@INTERACTION.\"InteractionTypeValue\" = 'Genomic'",
          name: "Genome Sequencing",
        },
        {
          defaultFilter: "@INTERACTION.\"InteractionTypeValue\" = 'ACME_M16'",
          name: "Vital Status",
        },
        {
          defaultFilter: "@INTERACTION.\"InteractionTypeValue\" = 'BIOBANK'",
          name: "Biobank",
        },
      ],
    },
    list: {
      visible: true,
      downloadEnabled: true,
      pdfDownloadEnabled: true,
      collectionEnabled: true,
      beginVisible: true,
      pageSize: 20,
      enabled: true,
    },
    vb: {
      visible: true,
      referenceName: "GRCh37",
      enabled: true,
    },
    minCohortSize: 1,
  },
  configInformations: {
    note: "",
  },
  panelOptions: {
    afp: {
      visible: true,
      enabled: true,
    },
  },
};
