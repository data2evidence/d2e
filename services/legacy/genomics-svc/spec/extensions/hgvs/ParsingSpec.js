/*global jasmine, describe, beforeOnce, beforeEach, afterOnce, xit, it, expect, spyOn*/

var hgvs = require(__base + "hgvs");

describe("Parse HGVS", function () {

    beforeEach(initDefaultContext);

    afterEach(cleanUp);

    it("Plain features", async function () {
        expect(await hgvs.locate(context, "GRCh37", "EGFR")).toEqual([{ chromosomeIndex: 6, begin: 55086724, end: 55275031 }]);
        expect(await hgvs.locate(context, "GRCh37", "TP53")).toEqual([{ chromosomeIndex: 16, begin: 7571719, end: 7590868 }]);
        expect(await hgvs.locate(context, "GRCh37", "BRAF")).toEqual([{ chromosomeIndex: 6, begin: 140433811, end: 140624564 }]);
        expect(await hgvs.locate(context, "GRCh37", "ERBB2")).toEqual([{ chromosomeIndex: 16, begin: 37844392, end: 37884915 }]);
        expect(await hgvs.locate(context, "GRCh37", "BRCA1")).toEqual([{ chromosomeIndex: 16, begin: 41196311, end: 41277500 }]);
    });
    
    it("Plain chromosomes", async function () {
        expect(await hgvs.locate(context, "GRCh37", "1")).toEqual([{ chromosomeIndex: 0, begin: 0, end: 249250621 }]);
        expect(await hgvs.locate(context, "GRCh37", "2")).toEqual([{ chromosomeIndex: 1, begin: 0, end: 243199373 }]);
        expect(await hgvs.locate(context, "GRCh37", "22")).toEqual([{ chromosomeIndex: 21, begin: 0, end: 51304566 }]);
        expect(await hgvs.locate(context, "GRCh37", "x")).toEqual([{ chromosomeIndex: 22, begin: 0, end: 155270560 }]);
        expect(await hgvs.locate(context, "GRCh37", "X")).toEqual([{ chromosomeIndex: 22, begin: 0, end: 155270560 }]);
        expect(await hgvs.locate(context, "GRCh37", "Y")).toEqual([{ chromosomeIndex: 23, begin: 0, end: 59373566 }]);
        expect(await hgvs.locate(context, "GRCh37", "chr22")).toEqual([{ chromosomeIndex: 21, begin: 0, end: 51304566 }]);
        expect(await hgvs.locate(context, "GRCh37", "ChRy")).toEqual([{ chromosomeIndex: 23, begin: 0, end: 59373566 }]);
    });

    it("Chromosome positions", async function () {
        expect(await hgvs.locate(context, "GRCh37", "chr1:1")).toEqual([{ chromosomeIndex: 0, begin: 0, end: 1 }]);
        expect(await hgvs.locate(context, "GRCh37", "22:1000")).toEqual([{ chromosomeIndex: 21, begin: 999, end: 1000 }]);
        expect(await hgvs.locate(context, "GRCh37", "Y:1000")).toEqual([{ chromosomeIndex: 23, begin: 999, end: 1000 }]);
        expect(await hgvs.locate(context, "GRCh37", "cHrY:1000")).toEqual([{ chromosomeIndex: 23, begin: 999, end: 1000 }]);

        expect(await hgvs.locate(context, "GRCh37", "chr1:g.1N>N")).toEqual([{ chromosomeIndex: 0, begin: 0, end: 1, referenceAllele: "N", alternativeAllele: "N" }]);
        expect(await hgvs.locate(context, "GRCh37", "22:g.1000N>N")).toEqual([{ chromosomeIndex: 21, begin: 999, end: 1000, referenceAllele: "N", alternativeAllele: "N" }]);
        expect(await hgvs.locate(context, "GRCh37", "Y:g.1000N>N")).toEqual([{ chromosomeIndex: 23, begin: 999, end: 1000, referenceAllele: "N", alternativeAllele: "N" }]);
        expect(await hgvs.locate(context, "GRCh37", "cHrY:g.1000N>N")).toEqual([{ chromosomeIndex: 23, begin: 999, end: 1000, referenceAllele: "N", alternativeAllele: "N" }]);
    });

    it("Chromosome ranges", async function () {
        expect(await hgvs.locate(context, "GRCh37", "1:500-1000")).toEqual([{ chromosomeIndex: 0, begin: 499, end: 1000 }]);
        expect(await hgvs.locate(context, "GRCh37", "chr22:500_1000")).toEqual([{ chromosomeIndex: 21, begin: 499, end: 1000 }]);
        expect(await hgvs.locate(context, "GRCh37", "22:500..1000")).toEqual([{ chromosomeIndex: 21, begin: 499, end: 1000 }]);
        expect(await hgvs.locate(context, "GRCh37", "chr22:500...1000")).toEqual([{ chromosomeIndex: 21, begin: 499, end: 1000 }]);

        expect(await hgvs.locate(context, "GRCh37", "chr22:g.500_1000del")).toEqual([{ chromosomeIndex: 21, begin: 499, end: 1000, alternativeAllele: "" }]);
        expect(await hgvs.locate(context, "GRCh37", "chr22:g.500_1000delinsNNN")).toEqual([{ chromosomeIndex: 21, begin: 499, end: 1000, alternativeAllele: "NNN" }]);
        expect(await hgvs.locate(context, "GRCh37", "chr22:g.500_501insNNN")).toEqual([{ chromosomeIndex: 21, begin: 499, end: 501, referenceAllele: "", alternativeAllele: "NNN" }]);
    });

    it("CDS notation", async function () {
        expect(await hgvs.locate(context, "GRCh37", "BRAF:1799")).toEqual([{ chromosomeIndex: 6, begin: 140453135, end: 140453136, canonical: true }]);
        expect(await hgvs.locate(context, "GRCh37", "BRAF:1799T>A")).toEqual([{ chromosomeIndex: 6, begin: 140453135, end: 140453136, referenceAllele: "A", alternativeAllele: "T", canonical: true }]);
        expect(await hgvs.locate(context, "GRCh37", "BRAF:c.1799T>A")).toEqual([{ chromosomeIndex: 6, begin: 140453135, end: 140453136, referenceAllele: "A", alternativeAllele: "T", canonical: true }]);

        expect(await hgvs.locate(context, "GRCh37", "NM_004333.4:1799")).toEqual([{ chromosomeIndex: 6, begin: 140453135, end: 140453136, canonical: true }]);
        expect(await hgvs.locate(context, "GRCh37", "NM_004333.4:1799T>A")).toEqual([{ chromosomeIndex: 6, begin: 140453135, end: 140453136, referenceAllele: "A", alternativeAllele: "T", canonical: true }]);
        expect(await hgvs.locate(context, "GRCh37", "NM_004333.4:c.1799T>A")).toEqual([{ chromosomeIndex: 6, begin: 140453135, end: 140453136, referenceAllele: "A", alternativeAllele: "T", canonical: true }]);

        expect(await hgvs.locate(context, "GRCh37", "NP_004324.2:1799")).toEqual([{ chromosomeIndex: 6, begin: 140453135, end: 140453136, canonical: true }]);
        expect(await hgvs.locate(context, "GRCh37", "NP_004324.2:1799T>A")).toEqual([{ chromosomeIndex: 6, begin: 140453135, end: 140453136, referenceAllele: "A", alternativeAllele: "T", canonical: true }]);
        expect(await hgvs.locate(context, "GRCh37", "NP_004324.2:c.1799T>A")).toEqual([{ chromosomeIndex: 6, begin: 140453135, end: 140453136, referenceAllele: "A", alternativeAllele: "T", canonical: true }]);

        expect((await hgvs.locate(context, "GRCh37", "TP53:818")).filter(function (location) { return location.canonical; })).toEqual([{ chromosomeIndex: 16, begin: 7577119, end: 7577120, canonical: true }]);
        expect((await hgvs.locate(context, "GRCh37", "TP53:818G>A")).filter(function (location) { return location.canonical; })).toEqual([{ chromosomeIndex: 16, begin: 7577119, end: 7577120, referenceAllele: "C", alternativeAllele: "T", canonical: true }]);
        expect((await hgvs.locate(context, "GRCh37", "TP53:c.818G>A")).filter(function (location) { return location.canonical; })).toEqual([{ chromosomeIndex: 16, begin: 7577119, end: 7577120, referenceAllele: "C", alternativeAllele: "T", canonical: true }]);

        expect((await hgvs.locate(context, "GRCh37", "EGFR:2573")).filter(function (location) { return location.canonical; })).toEqual([{ chromosomeIndex: 6, begin: 55259514, end: 55259515, canonical: true }]);
        expect((await hgvs.locate(context, "GRCh37", "EGFR:2573T>G")).filter(function (location) { return location.canonical; })).toEqual([{ chromosomeIndex: 6, begin: 55259514, end: 55259515, referenceAllele: "T", alternativeAllele: "G", canonical: true }]);
        expect((await hgvs.locate(context, "GRCh37", "EGFR:c.2573T>G")).filter(function (location) { return location.canonical; })).toEqual([{ chromosomeIndex: 6, begin: 55259514, end: 55259515, referenceAllele: "T", alternativeAllele: "G", canonical: true }]);
    });

    it("Protein notation", async function () {
        expect(await hgvs.locate(context, "GRCh37", "BRAF:V600E")).toEqual([{ chromosomeIndex: 6, begin: 140453134, end: 140453137, referenceAminoAcid: "V", alternativeAminoAcid: "E", canonical: true }]);
        expect(await hgvs.locate(context, "GRCh37", "BRAF:Val600Glu")).toEqual([{ chromosomeIndex: 6, begin: 140453134, end: 140453137, referenceAminoAcid: "V", alternativeAminoAcid: "E", canonical: true }]);
        expect(await hgvs.locate(context, "GRCh37", "BRAF:p.V600E")).toEqual([{ chromosomeIndex: 6, begin: 140453134, end: 140453137, referenceAminoAcid: "V", alternativeAminoAcid: "E", canonical: true }]);
        expect(await hgvs.locate(context, "GRCh37", "BRAF:p.Val600Glu")).toEqual([{ chromosomeIndex: 6, begin: 140453134, end: 140453137, referenceAminoAcid: "V", alternativeAminoAcid: "E", canonical: true }]);

        expect(await hgvs.locate(context, "GRCh37", "NM_004333.4:V600E")).toEqual([{ chromosomeIndex: 6, begin: 140453134, end: 140453137, referenceAminoAcid: "V", alternativeAminoAcid: "E", canonical: true }]);
        expect(await hgvs.locate(context, "GRCh37", "NM_004333.4:Val600Glu")).toEqual([{ chromosomeIndex: 6, begin: 140453134, end: 140453137, referenceAminoAcid: "V", alternativeAminoAcid: "E", canonical: true }]);
        expect(await hgvs.locate(context, "GRCh37", "NM_004333.4:p.V600E")).toEqual([{ chromosomeIndex: 6, begin: 140453134, end: 140453137, referenceAminoAcid: "V", alternativeAminoAcid: "E", canonical: true }]);
        expect(await hgvs.locate(context, "GRCh37", "NM_004333.4:p.Val600Glu")).toEqual([{ chromosomeIndex: 6, begin: 140453134, end: 140453137, referenceAminoAcid: "V", alternativeAminoAcid: "E", canonical: true }]);

        expect(await hgvs.locate(context, "GRCh37", "NP_004324.2:V600E")).toEqual([{ chromosomeIndex: 6, begin: 140453134, end: 140453137, referenceAminoAcid: "V", alternativeAminoAcid: "E", canonical: true }]);
        expect(await hgvs.locate(context, "GRCh37", "NP_004324.2:Val600Glu")).toEqual([{ chromosomeIndex: 6, begin: 140453134, end: 140453137, referenceAminoAcid: "V", alternativeAminoAcid: "E", canonical: true }]);
        expect(await hgvs.locate(context, "GRCh37", "NP_004324.2:p.V600E")).toEqual([{ chromosomeIndex: 6, begin: 140453134, end: 140453137, referenceAminoAcid: "V", alternativeAminoAcid: "E", canonical: true }]);
        expect(await hgvs.locate(context, "GRCh37", "NP_004324.2:p.Val600Glu")).toEqual([{ chromosomeIndex: 6, begin: 140453134, end: 140453137, referenceAminoAcid: "V", alternativeAminoAcid: "E", canonical: true }]);

        expect((await hgvs.locate(context, "GRCh37", "TP53:R273H")).filter(function (location) { return location.canonical; })).toEqual([{ chromosomeIndex: 16, begin: 7577118, end: 7577121, referenceAminoAcid: "R", alternativeAminoAcid: "H", canonical: true }]);
        expect((await hgvs.locate(context, "GRCh37", "TP53:Arg273His")).filter(function (location) { return location.canonical; })).toEqual([{ chromosomeIndex: 16, begin: 7577118, end: 7577121, referenceAminoAcid: "R", alternativeAminoAcid: "H", canonical: true }]);
        expect((await hgvs.locate(context, "GRCh37", "TP53:p.R273H")).filter(function (location) { return location.canonical; })).toEqual([{ chromosomeIndex: 16, begin: 7577118, end: 7577121, referenceAminoAcid: "R", alternativeAminoAcid: "H", canonical: true }]);
        expect((await hgvs.locate(context, "GRCh37", "TP53:p.Arg273His")).filter(function (location) { return location.canonical; })).toEqual([{ chromosomeIndex: 16, begin: 7577118, end: 7577121, referenceAminoAcid: "R", alternativeAminoAcid: "H", canonical: true }]);

        expect((await hgvs.locate(context, "GRCh37", "EGFR:L858R")).filter(function (location) { return location.canonical; })).toEqual([{ chromosomeIndex: 6, begin: 55259513, end: 55259516, referenceAminoAcid: "L", alternativeAminoAcid: "R", canonical: true }]);
        expect((await hgvs.locate(context, "GRCh37", "EGFR:Leu858Arg")).filter(function (location) { return location.canonical; })).toEqual([{ chromosomeIndex: 6, begin: 55259513, end: 55259516, referenceAminoAcid: "L", alternativeAminoAcid: "R", canonical: true }]);
        expect((await hgvs.locate(context, "GRCh37", "EGFR:p.L858R")).filter(function (location) { return location.canonical; })).toEqual([{ chromosomeIndex: 6, begin: 55259513, end: 55259516, referenceAminoAcid: "L", alternativeAminoAcid: "R", canonical: true }]);
        expect((await hgvs.locate(context, "GRCh37", "EGFR:p.Leu858Arg")).filter(function (location) { return location.canonical; })).toEqual([{ chromosomeIndex: 6, begin: 55259513, end: 55259516, referenceAminoAcid: "L", alternativeAminoAcid: "R", canonical: true }]);
    });
});
