(function (exports) {

	"use strict";

	let error = require(__base + "error");
	let General = require(__base + "extensions/vb/General");
    let auditLib = require(__base + "auditLog");
	/*
	 * class FishersExactTest
	 *
	 *   ___ ___
	 *  | a | b |
	 *  |---|---|	Contingency Table 
	 *  | c | d |
	 *
	 *  table = [[a, b], [c, d]]
	 *
	 */
	class FishersExactTest {
		constructor(table) {
			this.table = table;
		}

		/*
		 * probability of getting exactly this table under the Null-Hypothesis
		 * H0: the table is distrbuted equally 
		 */
		tableProbability() {
			let a = this.table[0][0];
			let b = this.table[0][1];
			let c = this.table[1][0];
			let d = this.table[1][1];

			return MathUtils.hypergeometric_pmf(a, a + b, a + b + c + d, a + c);
		}

		oneTailedProbability() {
			if (this.table[0][0] * this.table[1][1] < this.table[0][1] * this.table[1][0]) {
				return this.leftTailedProbability();
			} else {
				return this.rightTailedProbability();
			}
		}

		leftTailedProbability() {
			let a = this.table[0][0];
			let b = this.table[0][1];
			let c = this.table[1][0];
			let d = this.table[1][1];

			let totalSum = a + b + c + d;
			let result = MathUtils.hypergeometric_pmf(a, a + b, totalSum, a + c);

			let mina = a - Math.min(a, d);
			while (a > mina) {
				a--;
				d--;
				b++;
				c++;
				result += MathUtils.hypergeometric_pmf(a, a + b, totalSum, a + c);
			}
			return result;
		}

		rightTailedProbability() {
			let a = this.table[0][0];
			let b = this.table[0][1];
			let c = this.table[1][0];
			let d = this.table[1][1];

			let totalSum = a + b + c + d;
			let result = MathUtils.hypergeometric_pmf(a, a + b, totalSum, a + c);

			let maxa = a + Math.min(b, c);
			while (a < maxa) {
				a++;
				d++;
				b--;
				c--;
				result += MathUtils.hypergeometric_pmf(a, a + b, totalSum, a + c);
			}
			return result;
		}

		twoTailedProbability() {
			let a = this.table[0][0];
			let b = this.table[0][1];
			let c = this.table[1][0];
			let d = this.table[1][1];

			let sumab = a + b;
			let sumac = a + c;
			let sumcd = c + d;
			let totalSum = a + b + c + d;

			let threshold = MathUtils.hypergeometric_pmf(a, sumab, totalSum, sumac);
			let result = 0;

			let mina = a - Math.min(a, d);
			let maxa = a + Math.min(b, c);

			for (var i = mina; i <= maxa; i++) {
				a = i;
				let pValue = MathUtils.hypergeometric_pmf(a, sumab, totalSum, sumac);
				if (pValue <= threshold) {
					result += pValue;
				}
			}

			return result;
		}

		logOddsRatio() {
			let a = this.table[0][0];
			let b = this.table[0][1];
			let c = this.table[1][0];
			let d = this.table[1][1];

			if (a === 0 || d === 0) {
				a += 0.5;
				d += 0.5;
				b -= 0.5;
				c -= 0.5;
			}
			if (b === 0 || c === 0) {
				b += 0.5;
				c += 0.5;
				a -= 0.5;
				d -= 0.5;
			}

			return Math.log((a / b) / (c / d));
		}

		logRiskRatio() {
			let a = this.table[0][0];
			let b = this.table[0][1];
			let c = this.table[1][0];
			let d = this.table[1][1];

			if (a === 0 || d === 0) {
				a += 0.5;
				d += 0.5;
				b -= 0.5;
				c -= 0.5;
			}
			if (b === 0 || c === 0) {
				b += 0.5;
				c += 0.5;
				a -= 0.5;
				d -= 0.5;
			}

			return Math.log((a / (a + b)) / (c / (c + d)));
		}
	}

	/*
	 * class MathUtils
	 * 
	 * contains Math functions that are static
	 */
	class MathUtils {
		/*
		 * requires a Sorted Array as Input
		 */
		static benjaminiHochbergFDR(pValuesSorted) {
			let n = pValuesSorted.length;
			let adjPValues = [];
			adjPValues.unshift(pValuesSorted[n - 1]);

			for (var i = n - 2; i >= 0; i--) {
				let adjP = Math.min(adjPValues[0], pValuesSorted[i] * (n / (i + 1)));
				adjPValues.unshift(adjP);
			}

			return adjPValues;
		}

		static bonferroniAdjustment(pValues) {
			let n = pValues.length;
			let adjPValues = [];

			for (var i = 0; i < n; i++) {
				let adjP = pValues[i] * n;
				adjPValues.push((adjP > 1) ? 1.0 : adjP);
			}

			return adjPValues;
		}

		/*
		 * hypergeometric probability mass function
		 *
		 * Given a population consisting of 'n' total elemnts and 'm' items of class M with 'm'<'n',
		 * this returns the propability of observing 'x' elements of class 'M' when sampling 'k' times
		 * without replacement from the entire population:
		 *
		 * 		p(x) = (choose(m, x) * choose(n-m, k-x)) / choose(n, k)
		 * 
		 * @param {Number} x
		 * @param {Number} m
		 * @param {Number} n
		 * @param {Number} k
		 * 
		 * @return {Number} p(x)
		 */
		static hypergeometric_pmf(x, m, n, k) {
			var p_log = MathUtils.log_binom(m, x) + MathUtils.log_binom(n - m, k - x) - MathUtils.log_binom(n, k);
			return Math.pow(10.0, p_log);
		}

		/*
		 * calculation of the binomial coefficient 
		 *
		 * 		choose(n, k) = n! / (k! * (n-k)!)
		 *
		 * @param {Number} n
		 * @param {Number} k
		 * @return {number} log10(n choose k)
		 */
		static log_binom(n, k) {
			// TODO: some checks here
			if (n === 0) return 1;
			if (k === 0) return 0;
			if (k > n) throw new Error("k must be smaller than n");
			return MathUtils.log_factorial(n) - MathUtils.log_factorial(k) - MathUtils.log_factorial(n - k);
		}

		/*
		 * factorial - optimized calculation
		 *
		 * @param {Number} x
		 * @return {Number} log10(x!)
		 */
		static log_factorial(x) {
			if (x > 10) {
				// stirling approx
				return x * Math.log10(x / Math.exp(1.0)) + 0.5 * Math.log10(2 * Math.PI * x) + Math.log10(1.0 + 1.0 / (12.0 * x));
			} else {
				let result = 0;
				for (var i = 2; i <= x; i++) {
					result += Math.log10(i);
				}
				return result;
			}
		}
	}

	/*
	 * take a look on each gene combination
	 * calculate values for contingency table 
	 * calculate p-values
	 */
	function calculateGenePValues(resultSet) {

		if (resultSet.OUTPUT_TABLE.length === 0) {
			return [];
		}

		var totalPatients = resultSet.OUTPUT_TABLE[0]["TotalPatients"];

		/*
		 * create an array of arrays with the patients for each gene
		 * [[GeneName, [pat1, pat2, ...]], [GeneName, [pat1, pat2,...]],  ...]
		 */
		var gene_effected_patients = [];
		var currentGene = "";
		for (var i in resultSet.OUTPUT_TABLE) {
			if (resultSet.OUTPUT_TABLE.hasOwnProperty(i)) {
				if (resultSet.OUTPUT_TABLE[i]["GeneName"] !== currentGene) {
					currentGene = resultSet.OUTPUT_TABLE[i]["GeneName"];
					gene_effected_patients.push([currentGene, []]);
				}
				gene_effected_patients[gene_effected_patients.length - 1][1].push(resultSet.OUTPUT_TABLE[i]["PatientDWID"]);
			}
		}

		var calculationResults = [];
		for (var i = 0; i < gene_effected_patients.length; i++) {
			for (var j = i + 1; j < gene_effected_patients.length; j++) {
				let arr1 = gene_effected_patients[i][1];			// patients with variants in first gene
				let arr2 = gene_effected_patients[j][1];			// patients with variants in second gene
				let intersection = arr1.filter(x => arr2.indexOf(x) > -1);
				let sumab = arr1.length;
				let sumac = arr2.length;

				let a = intersection.length;
				let b = sumab - a;
				let c = sumac - a;
				let d = (totalPatients - sumab) - c;

				let fisherTest = new FishersExactTest([[a, b], [c, d]]);
				let result = fisherTest.oneTailedProbability();	// calculate the pValue
				let logOR = fisherTest.logOddsRatio();
				let association = (logOR > 0) ? "co-occurrence" : "mutual exclusivity";

				calculationResults.push([[gene_effected_patients[i][0], gene_effected_patients[j][0]], a, b, c, d, result, logOR, association]);
			}
		}

		calculationResults.sort(compareSixthColumn);		// sort after pValue
		var columnPValues = calculationResults.map(function (value, index) { return value[5]; });
		var adjustedPValues = MathUtils.benjaminiHochbergFDR(columnPValues);
		var bonferroniPValues = MathUtils.bonferroniAdjustment(columnPValues);

		var pValues = [];
		/*for (var i = 0; i < calculationResults.length; i++) {
			let object = {
				genes: calculationResults[i][0],
				a: calculationResults[i][1],
				b: calculationResults[i][2],
				c: calculationResults[i][3],
				d: calculationResults[i][4],
				PValue: calculationResults[i][5],
				BHadjustedPValue: adjustedPValues[i],
				BonfAdjustedPValue: bonferroniPValues[i],
				LogOddsRatio: calculationResults[i][6],
				Association: calculationResults[i][7]
			}
			pValues.push(object);
		}*/
		for (var i = 0; i < calculationResults.length; i++) {
			let object = {
				geneA: calculationResults[i][0][0],
				geneB: calculationResults[i][0][1],
				pValue: calculationResults[i][5],
				BHadjustedPValue: adjustedPValues[i],
				BonfAdjustedPValue: bonferroniPValues[i],
				logOddsRatio: calculationResults[i][6],
				association: calculationResults[i][7]
			}
			pValues.push(object);
		}

		return pValues;
	}

	function compareSixthColumn(a, b) {
		if (a[5] === b[5]) {
			return 0;
		}
		else {
			return (a[5] < b[5]) ? -1 : 1;
		}
	}

	/*
	 * getGeneCorrelation()
	 * 
	 * calculates the p-values of the correlations of variants
	 */
	async function getGeneCorrelation(context, parameters) {
		var dbContent = {};
		var resultSet = {};

		if (!parameters.reference) {
			throw new error.BioInfError("error.MissingRequestParameter", ["reference"]);
		}
		if (!parameters.dataset) {
			throw new error.BioInfError("error.MissingRequestParameter", ["dataset"]);
		}

		// set current dataset as SampleList
		// oExtensions
		parameters.sampleListTableName = await context.setSamplesFromDataset(parameters.dataset);

		// try to get an annotationGrouping or a filterCardQuery
		var annotationGrouping = await General.getAnnotationGrouping(context, parameters);
		dbContent = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.genetables::GeneCorrelation");
		if (annotationGrouping) {
			resultSet = await dbContent(parameters.sampleListTableName, annotationGrouping.intermediateResults, parameters.reference);
		} else {
			if (parameters.filterCardQuery && parameters.filterCardQuery.instance && parameters.filterCardQuery.instance !== 'ALL') {
				var genomicFilterTable = await General.getGenomicFilterData(context, parameters);
				resultSet = await dbContent(parameters.sampleListTableName, genomicFilterTable.intermediateResults, parameters.reference);
			} else {
				throw new error.BioInfError("error.MissingRequestParameter", ["filterCardQuery"]);
			}
		}

		// log accessed attributes
		await auditLib.logAttributes(context, parameters.sampleListTableName, "GeneCorrelation", "Patient", [
			{name: "hc.hph.genomics.db.models::SNV.Variants.ChromosomeIndex", successful: true},
			{name: "hc.hph.genomics.db.models::SNV.Variants.Position", successful: true},
			{name: "hc.hph.genomics.db.models::SNV.Genotypes.ReferenceAlleleCount", successful: true},
			{name: "hc.hph.genomics.db.models::SNV.Genotypes.CopyNumber", successful: true}
		], false, parameters.annotationConfig ? parameters.annotationConfig.groupConfig : undefined );
		
		return calculateGenePValues(resultSet);
	}

	exports.MathUtils = MathUtils;
	exports.FishersExactTest = FishersExactTest;
	exports.api = {
		getGeneCorrelation: getGeneCorrelation
	};

})(module.exports);
