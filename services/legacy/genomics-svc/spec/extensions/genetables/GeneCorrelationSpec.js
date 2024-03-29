/*global jasmine, describe, beforeOnce, beforeEach, afterOnce, xit, it, expect, spyOn*/

let error = require(__base + "error");
let GeneCorrelation = require(__base + "extensions/genetables/GeneCorrelation");

describe("Gene Correlation Test", function () {

    beforeEach(initDefaultContext);

    afterEach(cleanUp);

    it("Get Gene Correlation data - missing parameter : reference", async function () {
        try {
            await context.getExtension('genetables.GeneCorrelation.getGeneCorrelation')({});
            expect(false).toBeTruthy();
        } catch (exception) {
            expect(exception).toEqual(jasmine.any(error.BioInfError));
            expect(exception.errorCode).toBe("error.MissingRequestParameter");
            expect(exception.parameters).toEqual(['reference']);
        }
    });

    it("Get Gene Correlation data - missing parameter : dataset", async function () {
        try {
            await context.getExtension('genetables.GeneCorrelation.getGeneCorrelation')({ reference: "GRCh37" });
            expect(false).toBeTruthy();
        } catch (exception) {
            expect(exception).toEqual(jasmine.any(error.BioInfError));
            expect(exception.errorCode).toBe("error.MissingRequestParameter");
            expect(exception.parameters).toEqual(['dataset']);
        }
    });

    it("FisherTest Testing", async function () {
        var ftObj = new GeneCorrelation.FishersExactTest([[3, 15], [37, 45]]);
        expect(ftObj.tableProbability()).toBeCloseTo(0.01714, 5);
        expect(ftObj.leftTailedProbability()).toBeCloseTo(0.02148, 5);
        expect(ftObj.rightTailedProbability()).toBeCloseTo(0.99566, 5);
        expect(ftObj.twoTailedProbability()).toBeCloseTo(0.03316, 5);
        expect(ftObj.logOddsRatio()).toBeCloseTo(-1.41369, 5);
        expect(ftObj.logRiskRatio()).toBeCloseTo(-0.99596, 5);
    });

    it("benjaminiHochbergFDR", async function () {
        var pValues = [0.11, 0.31, 0.01, 0.81, 0.41, 0.21, 0.51, 0.91, 0.61, 0.71].sort();
        var qValues = [0.1, 0.55, 0.7, 0.775, 0.82, 0.85, 0.8714285714285714, 0.8875, 0.9, 0.91];
        var result = GeneCorrelation.MathUtils.benjaminiHochbergFDR(pValues)
        expect(result.length).toBe(qValues.length);
        for (let index in result) {
            expect(result[index]).toBeCloseTo(qValues[index], 5);
        }
    });

    it("Multiple Test", async function () {
        var testTables = [[[0, 88], [8, 312]],
        [[6, 82], [29, 291]],
        [[0, 8], [35, 365]]];

        var calculationResults = [];
        var pValueResults = [];
        for (var i = 0; i < testTables.length; i++) {
            let fisherTest = new GeneCorrelation.FishersExactTest(testTables[i]);
            let result = Math.min(fisherTest.leftTailedProbability(), fisherTest.rightTailedProbability());
            let logOR = fisherTest.logOddsRatio();

            calculationResults.push([result, logOR]);
            pValueResults.push(result);
        }

        var resultTable = [[0.14047731556521037, -1.4350845252893227],
        [0.33651634019267235, -0.3089323408511797],
        [0.4847929256880799, -0.34774324594969097]];
        var resultAdjustedPValues = [0.4214319466956311, 0.4847929256880799, 0.4847929256880799];
        var resultBonferroniPValues = [0.4214319466956311, 1, 1];

        pValueResults.sort();
        var adjustedPValues = GeneCorrelation.MathUtils.benjaminiHochbergFDR(pValueResults);
        var bonferroniPValues = GeneCorrelation.MathUtils.bonferroniAdjustment(pValueResults);

        expect(calculationResults.length).toBe(resultTable.length);
        for (let index in calculationResults) {
            expect(calculationResults[index].length).toBe(2);
            expect(calculationResults[index][0]).toBeCloseTo(resultTable[index][0], 5);
            expect(calculationResults[index][1]).toBeCloseTo(resultTable[index][1], 5);
        }
        expect(adjustedPValues.length).toBe(resultAdjustedPValues.length);
        for (let index in adjustedPValues) {
            expect(adjustedPValues[index]).toBeCloseTo(resultAdjustedPValues[index], 5);
        }
        expect(bonferroniPValues.length).toBe(resultBonferroniPValues.length);
        for (let index in bonferroniPValues) {
            expect(bonferroniPValues[index]).toBeCloseTo(resultBonferroniPValues[index], 5);
        }
    });

});
