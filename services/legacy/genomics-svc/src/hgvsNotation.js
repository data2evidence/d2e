( function ( exports ) {

"use strict";

var error = require(__base + "error");

function Generator(context) {
	if (!context) {
		throw new error.BioInfError("error.Internal", [], "Connection undefined.");
	}
	this.context = context;
}

Generator.prototype = Object.create(Object.prototype);

Generator.prototype.getVariantDetails = async function(parameters) {
	var sReferenceID, iChromosomeIndex, iPosition, aSampleIndex = [];
	if (this.validateNotationParams(parameters)) {
		sReferenceID = parameters.reference;
		iChromosomeIndex = parameters.chrom;
		iPosition = parameters.position;
		aSampleIndex = parameters.sampleIdx;
	}

	var dwAuditIDTableName = await this.getDWAuditID(aSampleIndex);
	var oOutEntry = await this.getVariantDetailsByPosition(dwAuditIDTableName, iChromosomeIndex, iPosition, sReferenceID);
	return oOutEntry;

};

Generator.prototype.getDWAuditID = async function(sampleList) {
	const sampleListTableName = await this.context.createTemporarySampleTable();
	await this.context.connection.executeBulkUpdate('INSERT INTO "' + sampleListTableName + '" ("SampleIndex") VALUES (?)', Array.isArray(sampleList) ? sampleList.map(sampleIndex => [sampleIndex]) : [[sampleList]]);
	const dwAuditIDTableName = await this.context.createTemporaryDWAuditIDTable();
	const count = await this.context.connection.executeUpdate('INSERT INTO "' + dwAuditIDTableName + '" SELECT DISTINCT "DWAuditID" FROM "hc.hph.genomics.db.models::SNV.Genotypes" WHERE "SampleIndex" IN (SELECT "SampleIndex" FROM "' + sampleListTableName + '")');
	await this.context.connection.executeQuery('DROP TABLE "' + sampleListTableName + '"');
	if (count && count !== 0) {
		return dwAuditIDTableName;
	} else {
		throw new error.BioInfError("error.Internal", [], "Invalid sample index.");
	}
};

Generator.prototype.getVariantDetailsByPosition = async function(DWAuditIDs, chromosomeIndex, position, sRefGenome) {

	var aResult = [],aVariantIDOut=[],i;
	var fVariantProc = await this.context.connection.loadProcedure("hc.hph.genomics.db.procedures.vb::GetVariantDetails");
	var aRes = await fVariantProc(DWAuditIDs, chromosomeIndex, position, sRefGenome);
	aVariantIDOut = aRes.VARIANTIDOUT;
	aResult = aRes.RESULTOUT;
	var outResult = {};

	if (aResult && (aResult.length > 0)) {
		outResult.alleles = [];
		outResult.ChromosomeIndex = chromosomeIndex;
		outResult.Position = position;
		outResult.Reference = sRefGenome;
		outResult.DWAuditID = (await this.context.connection.executeQuery('SELECT "DWAuditID" FROM "' + DWAuditIDs + '"')).map(row => row.DWAuditID);
		//outResult.RunAuditID=parseInt(aResult[0].RunAuditID,10);
		for (i = 0; i < aResult.length; i++) {
			var oRow = JSON.parse(JSON.stringify(aResult[i]));
			oRow.hgvs = {};
			oRow.prefix = 'non-coding';

			if ((oRow.Region === 'CDS_region') || (oRow.Region === 'start_codon') || (oRow.Region === 'stop_codon')) { //|| (oRow.Region === 'five_prime_UTR') || (oRow.Region === 'three_prime_UTR') 
				oRow.prefix = 'coding';
				 oRow.CDSPosition= parseInt(oRow.CDSPosition, 10);
			}

			oRow = this.getPostionInfoByAlteration(oRow);
            oRow.VariantIdList=aVariantIDOut; 
			delete oRow.ChromosomeIndex;
			delete oRow.Position;
			delete oRow.DWAuditID;
			delete oRow.AlleleIndex;
			//delete oRow.RunAuditID;
			delete oRow.prefix;
			outResult.alleles.push(oRow);
		}
	}
	return outResult;
};

Generator.prototype.delinsNotation = function(oEntry) {
	var cdsPos, refLength;
	refLength = oEntry['CDSAllele.Reference'].length;
	oEntry.hgvs.recommendation = "indelFull";
	oEntry.hgvs.genomic = 'g.' + (oEntry.Position + 1);
	if (refLength > 1) {
		oEntry.hgvs.genomic += '_' + (oEntry.Position + 1 + (refLength - 1));
	}
	oEntry.hgvs.genomic += "delins" + oEntry['Allele.Alternative'];
	if (oEntry.prefix === 'coding') {
		cdsPos = parseInt(oEntry.CDSPosition, 10);
		oEntry.hgvs.coding = 'c.' + (cdsPos + 1);

		if (refLength > 1) {
			oEntry.hgvs.coding += '_' + (cdsPos + 1 + (refLength - 1));
		}
		oEntry.hgvs.coding += "delins" + oEntry['CDSAllele.Alternative'];
	}
	return oEntry;
};

Generator.prototype.insertionNotation = function(oEntry, bFlag) {

	var opType = 'ins',	diffLen, cdsPos;
    var refLen = oEntry['CDSAllele.Reference'].length;
    var altLen = oEntry['CDSAllele.Alternative'].length;
	//oEntry.hgvs.recommendation = 'insVariant';
//A || AT
    var start = ( oEntry.Position + 1); 
    if (refLen < altLen) {
       
    	var offset = oEntry['CDSAllele.Alternative'].indexOf(oEntry['CDSAllele.Reference']);   
        if (offset === -1 || ( offset + 1 + refLen )< altLen ) {
            return this.delinsNotation(oEntry);
        } 
        var addSeq = oEntry['Allele.Alternative'].substr(offset+1);
        oEntry.hgvs.genomic = 'g.' + start;
        
        if ( addSeq === oEntry['Allele.Reference'] ) {
            opType='dup';
        }else{
            oEntry.hgvs.genomic += "_" +parseInt( start + addSeq.length ,10);
        } 
        oEntry.hgvs.genomic += opType + addSeq;
	    
	    if (oEntry.prefix === 'coding') {
	    	cdsPos = parseInt(oEntry.CDSPosition, 10);
			oEntry.hgvs.coding = 'c.' + (cdsPos + 1);
	            
	        if(opType === 'ins'){
	            oEntry.hgvs.coding +=  "_" + parseInt(cdsPos + 1 + addSeq.length ,10);
	        }
	        oEntry.hgvs.coding += opType + oEntry['CDSAllele.Alternative'].substr(offset+1);
	    }
	
	    oEntry.hgvs.recommendation = opType + 'Variant';
	}
	if (bFlag) {
		if (opType) {
			return [true, oEntry];
		} else {
			return [true, oEntry];
		}
	}
	return oEntry;
};

Generator.prototype.deletionNotation = function(oEntry, bFlag) {
	var diffLen, cdsPos;
	oEntry.hgvs.recommendation = 'delVariant';
	var refLength = oEntry['CDSAllele.Reference'].length;
	var altAllele = ( oEntry['CDSAllele.Alternative'] === '-' || oEntry['CDSAllele.Alternative'] === '' )? null : oEntry['CDSAllele.Alternative'];
    var altLength = (altAllele) ? altAllele.length : 0 ;
    var offset = oEntry['CDSAllele.Reference'].indexOf(altAllele);
	diffLen = refLength - altLength;
	
	if (  altLength !== 0  && ( offset !== 0 || ((offset + altLength + 1) < refLength) )   ) {
		return this.delinsNotation(oEntry);
	}

	oEntry.hgvs.genomic = 'g.' + (oEntry.Position + 1);
	if (diffLen > 1) {
		oEntry.hgvs.genomic = oEntry.hgvs.genomic + '_' + ((oEntry.Position + 1) + offset + diffLen);
	}
	oEntry.hgvs.genomic = oEntry.hgvs.genomic + 'del' + oEntry['Allele.Reference'].substr(offset + 1).toUpperCase();

	if (oEntry.prefix === 'coding') {
		cdsPos = parseInt(oEntry.CDSPosition, 10);
		oEntry.hgvs.coding = 'c.' + ((cdsPos + 1) + offset + 1);
		if (diffLen > 1) {
			oEntry.hgvs.coding = oEntry.hgvs.coding + '_' + ((cdsPos + 1) + offset + diffLen);
		}
		oEntry.hgvs.coding = oEntry.hgvs.coding + 'del' + oEntry['CDSAllele.Reference'].substr(offset + 1).toUpperCase();
	}

	if (bFlag) {
		return [true, oEntry];
	}
	return oEntry;
};

Generator.prototype.getPostionInfoByAlteration = function(oEntry) {

	var cdsPos;
	switch (oEntry.SequenceAlteration) {

		case 'SNP':
			oEntry.hgvs.recommendation = 'subsVariant';
			oEntry.hgvs.genomic = 'g.' + (oEntry.Position + 1) + oEntry['Allele.Reference'] + '>' + oEntry['Allele.Alternative'];
			if (oEntry.prefix === 'coding') {

				cdsPos = parseInt(oEntry.CDSPosition, 10);
				oEntry.hgvs.coding = 'c.' + (cdsPos + 1) + oEntry['CDSAllele.Reference'] + '>' + oEntry['CDSAllele.Alternative'];
				oEntry.hgvs.protein = 'p.' + oEntry['AminoAcid3.Reference'] + (Math.floor(cdsPos / 3) + 1) + oEntry['AminoAcid3.Alternative'];

			}

			break;
        case 'MNP' : 
            //here the length of ref and alt are same 
           oEntry = this.delinsNotation(oEntry);
            
            
            break; 
		case 'MIXED':
        
			var isInsertion = this.insertionNotation(oEntry, true);
			if (isInsertion[0]) {
				oEntry = isInsertion[1];
			} else {
				var isDeletion = this.deletionNotation(oEntry, true);
				if (isDeletion[0]) {
					oEntry = isDeletion[1];
				}
			}
			break;

		case 'DEL':

			oEntry = this.deletionNotation(oEntry);

			break;

		case 'INS':

			oEntry = this.insertionNotation(oEntry);

			break;
		case null:
		case '' :    
			if (oEntry['Allele.Reference'] && oEntry['Allele.Alternative']) {
				var sSeqAlt = this.calculateSeqAlt(oEntry['Allele.Reference'], oEntry['Allele.Alternative']);
				oEntry.SequenceAlteration = sSeqAlt;
				if (sSeqAlt) {
					this.getPostionInfoByAlteration(oEntry);
				}
			}
			break;

		default:
			oEntry = oEntry;

	}

	return oEntry;
};

Generator.prototype.validateNotationParams = function(parameters) {
	//validate 4 params 

	if (parameters.reference === undefined) {
		throw new error.BioInfError("error.MissingRequestParameter", ["reference"]);
	}
	var chromosomeIndex = parseInt(parameters.chrom, 10);

	if (isNaN(chromosomeIndex) || (chromosomeIndex < 0)) {
		throw new error.BioInfError("error.MissingRequestParameter", ["chrom"]);
	}
	var iSampleIndex = parseInt(parameters.aSampleIdx, 10);
	var iSampleIndex;
	for (var j = 0; j < parameters.aSampleIndex; j++) {
		iSampleIndex = parameters.aSampleIndex[j];
		if (isNaN(iSampleIndex) || (iSampleIndex < 0)) {
			throw new error.BioInfError("error.MissingRequestParameter", ["iSampleIndex"]);
		}
	}

	var pos = parseInt(parameters.position, 10);

	if (pos === undefined) {
		throw new error.BioInfError("error.MissingRequestParameter", ["pos"]);
	}
	if (isNaN(pos) || (pos < 0)) {
		throw new error.BioInfError("error.MissingRequestParameter", ["pos"]);
	}

	return true;
};

Generator.prototype.calculateSeqAlt = function(refAllele, altAllele) {
	var refLength = refAllele.length;
	var altLength = altAllele.length;
	var out = null;
	if (altAllele === '-' || altAllele === ''){
	    out ='DEL';
	} else if (refLength === altLength) {
		out = refLength === 1 ? 'SNP' : 'MNP';
	} else if (refLength > altLength) {
		out = (refAllele.startsWith(altAllele) || refAllele.endsWith(altAllele) )  ? 'DEL' : 'MIXED';
	} else if (refLength < altLength) {
		out = (altAllele.startsWith(refAllele) || altAllele.endsWith(refAllele) ) ? 'INS' : 'MIXED';
	}
	return out;
};

Generator.prototype.getVariantDetailsForPopOver=function(oOut){
    var result={alleles:[]};
    var aAlleles=[];

    aAlleles = (oOut.alleles)? oOut.alleles:aAlleles;
    var oItem={},idxObj={refAlleles:{},altAlleles:{}};
    for(var i = 0; i < aAlleles.length;i++){
        oItem = aAlleles[i];
        
        if(!idxObj.refAlleles[oItem['Allele.Reference']]){
            idxObj.refAlleles[oItem['Allele.Reference']]={
            VariantIdList : oItem.VariantIdList,
            sequence : oItem['Allele.Reference'],
			type : "reference",
			aminoAcids : [],
			aminoAcidsObj:{}
            };
        }//chk if aa array has this aa entry
         var oThisRefObj = idxObj.refAlleles[oItem['Allele.Reference']];
           if(oItem['AminoAcid1.Reference']){
                oThisRefObj.aminoAcidsObj[oItem['AminoAcid3.Reference']]={
			        sequence1Char : oItem['AminoAcid1.Reference'],
				    sequence3Char : oItem['AminoAcid3.Reference'],
				    type : "reference"
			    };
            }
        var sType;
        if((!idxObj.altAlleles[oItem['Allele.Alternative']]) && oItem.SequenceAlteration ){
            sType =( oItem.hgvs && oItem.hgvs.recommendation)?oItem.hgvs.recommendation:oItem.SequenceAlteration;
            idxObj.altAlleles[oItem['Allele.Alternative']]={
            sequence : oItem['Allele.Alternative'],
			type: sType ,
			transcriptAnnotationsObj:{},
			transcriptAnnotations:[],
			aminoAcidsObj : {},
			aminoAcids:[],
			VariantIdList:oItem.VariantIdList
			
            };
        }
        var oThisAlt = {};
        oThisAlt=idxObj.altAlleles[oItem['Allele.Alternative']];
            
            //chk for trans and AA 
        if (oItem.hgvs && oItem.hgvs.coding && oItem.Transcript && oItem.GeneName){
            //construct notation
            var tVal= oItem.Transcript + "(" + oItem.GeneName  + ")" + ":" + oItem.hgvs.coding;
            oThisAlt.transcriptAnnotationsObj[tVal]={};
            if(oItem['AminoAcid3.Alternative']){
             var aaType=oItem['AminoAcid3.Alternative'] + "_" + oItem.MutationType;
                if(!oThisAlt.aminoAcidsObj[aaType]){ 
                 	oThisAlt.aminoAcidsObj[aaType]={
                 	sequence1Char : oItem['AminoAcid1.Alternative'],
					sequence3Char : oItem['AminoAcid3.Alternative'],
					type : oItem.MutationType,
					proteinAnnotationsObj : {},
					proteinAnnotations : [],
                    VariantIdList : oItem.VariantIdList
                  };
                 }
            var oThisAltAA= oThisAlt.aminoAcidsObj[aaType];    
        
                if (oItem.Protein && oItem.hgvs.protein  ){    
                    var pVal= oItem.Protein + "(" + oItem.GeneName  + ")" + ":" + oItem.hgvs.protein;
                    //now chk AA 
                    oThisAltAA.proteinAnnotationsObj[pVal]={};
                }    
            }  
        }
      }
    
    var idx,aIdx,oRefObj={};
    for ( idx in idxObj.refAlleles ){
        oRefObj = idxObj.refAlleles[idx];
            for ( aIdx in oRefObj.aminoAcidsObj ){
                oRefObj.aminoAcids.push( oRefObj.aminoAcidsObj[aIdx]);
            }
        delete oRefObj.aminoAcidsObj; 
        
        result.alleles.push(oRefObj);
    }
    var oAltObj={},oAAObj={},aIdx;
    for ( idx in idxObj.altAlleles ){
        oAltObj = idxObj.altAlleles[idx];
        oAltObj.transcriptAnnotations = Object.keys(oAltObj.transcriptAnnotationsObj);
        delete oAltObj.transcriptAnnotationsObj; 
        for( aIdx in oAltObj.aminoAcidsObj ){
              oAAObj=oAltObj.aminoAcidsObj[aIdx];
              oAAObj.proteinAnnotations= Object.keys(oAAObj.proteinAnnotationsObj);   
              delete oAAObj.proteinAnnotationsObj;
        oAltObj.aminoAcids.push(oAAObj);
         }
       
        delete oAltObj.aminoAcidsObj; 
        result.alleles.push(oAltObj);
    }
    
    return result;
};

// public API - everything in exports will be accessible from other libraries

exports.Generator = Generator;

} )( module.exports );