function getTestData() {
	var demoData = [{
			"testCase": 'tests the deletion use case for intron',
			"result": {
				"alleles": [
					{
						"VariantIndex": 51467,
						"GeneName": null,
						"Region": "intron",
						"SequenceAlteration": "DEL",
						"AminoAcid1.Reference": null,
						"AminoAcid1.Alternative": null,
						"MutationType": null,
						"CDSPosition": null,
						"Transcript": null,
						"Protein": null,
						"ExonRank": null,
						"Allele.Reference": "CT",
						"Allele.Alternative": "C",
						"CDSAllele.Reference": "CT",
						"CDSAllele.Alternative": "C",
						"AminoAcid3.Reference": null,
						"AminoAcid3.Alternative": null,
						"hgvs": {
							"recommendation": "delVariant",
							"genomic": "g.21898354delT"
						},
						"VariantIdList": [{
							"VariantIndex": 51467,
							"VariantID": "rs7108757,rs7395065,rs2032642"
                        }]

                }
            ],
				"ChromosomeIndex": 23,
				"Position": 21898353,
				"Reference": "GRCh37",
				"DWAuditID": [-100]

			}

        },
		{
			"testCase": 'tests the substitution use case for CDS region',
			"result": {
				"alleles": [
					{
						"VariantIndex": 1945,
						"GeneName": "PHRF1",
						"Region": "CDS_region",
						"SequenceAlteration": "SNP",
						"AminoAcid1.Reference": "G",
						"AminoAcid1.Alternative": "C",
						"MutationType": "missense_variant",
						"CDSPosition": 2436,
						"Transcript": "XM_005253029.1",
						"Protein": "XP_005253086.1",
						"ExonRank": null,
						"Allele.Reference": "C",
						"Allele.Alternative": "T",
						"CDSAllele.Reference": "C",
						"CDSAllele.Alternative": "T",
						"AminoAcid3.Reference": "Gly",
						"AminoAcid3.Alternative": "Cys",
						"hgvs": {
							"recommendation": "subsVariant",
							"genomic": "g.608013C>T",
							"coding": "c.2437C>T",
							"protein": "p.Gly813Cys"
						},
						"VariantIdList": [{
							"VariantIndex": 1945,
							"VariantID": "rs001945,rs00891945"
                        }]
        }
      ],
				"ChromosomeIndex": 10,
				"Position": 608012,
				"Reference": "GRCh37",
				"DWAuditID": [-100]
			}

},
		{
			"testCase": 'tests the insertion use case for CDS region',
			"result": {
				"alleles": [{
					"VariantIndex": 31726,
					"GeneName": "NLGN4Y",
					"Region": "CDS_region",
					"SequenceAlteration": "INS",
					"AminoAcid1.Reference": "N",
					"AminoAcid1.Alternative": null,
					"MutationType": null,
					"CDSPosition": 760,
					"Transcript": "NM_001164238.1",
					"Protein": "NP_001157710.1",
					"ExonRank": null,
					"Allele.Reference": "A",
					"Allele.Alternative": "AT",
					"CDSAllele.Reference": "A",
					"CDSAllele.Alternative": "AT",
					"AminoAcid3.Reference": "Asn",
					"AminoAcid3.Alternative": null,
					"hgvs": {
						"genomic": "g.16845407_16845408insT",
						"coding": "c.761_762insT",
						"recommendation": "insVariant"

					},
					"VariantIdList": [{
						"VariantIndex": 31726,
						"VariantID": "rs0031726,rs008931726"
                        }]
                 }],
				"ChromosomeIndex": 23,
				"Position": 16845406,
				"Reference": "GRCh37",
				"DWAuditID": [-100]
			}

		}

			];
	return demoData;
}

module.exports.getTestData = getTestData;