package legacy.health.genomics.vcf.parser;

import legacy.health.genomics.vcf.parser.datamodel.HeaderField;
import legacy.health.genomics.vcf.parser.datamodel.VCFStructureDefinition;
import legacy.health.genomics.vcf.parser.exceptions.HeaderParseException;
import legacy.health.genomics.vcf.parser.inputmodels.HeaderLine;
import legacy.health.genomics.vcf.parser.inputmodels.HeaderParserStateMachine;

import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.HashSet;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;


class HeaderParserStateMachineTest {

    private final HeaderParserStateMachine parser = new HeaderParserStateMachine();

    private HeaderLine getHeaderLine(String line) throws Exception {
        HeaderLine h = new HeaderLine();
        h.setValue(line);
        return parser.parseLine(h);
    }




    @Test
    void parseLineVCFExampleWithWhiteSpacesWithQuotes2() throws Exception {
        HeaderLine result = getHeaderLine(" <  \" ID \" = \" NS\" , \" Number \" = \"1\" , \"Ty\\\"pe\" = \" Integer \" , \" Description \" = \"Number of Samples With Data\" > ");
        assertEquals(result.getValueForKey(" ID ")," NS");
        assertEquals(result.getValueForKey(" Number "),"1");
        assertEquals(result.getValueForKey("Ty\\\"pe")," Integer ");
        assertEquals(result.getValueForKey(" Description "),"Number of Samples With Data");
        assertEquals(result.getValuePair().size(),4);
    }

    @Test
    void parseLineVCFExampleWithWhiteSpacesWithQuotes() throws Exception {
        HeaderLine result = getHeaderLine(" <  \"ID\" = \"NS\" , \"Number\" = \"1\" , \"Type\" = \"Integer\" , \"Description\" = \"Number of Samples With Data\" > ");
        assertEquals(result.getValueForKey("ID"),"NS");
        assertEquals(result.getValueForKey("Number"),"1");
        assertEquals(result.getValueForKey("Type"),"Integer");
        assertEquals(result.getValueForKey("Description"),"Number of Samples With Data");
        assertEquals(result.getValuePair().size(),4);
    }

    @Test
    void parseLineVCFExampleWithWhiteOutSpacesWithQuotes() throws Exception {
        HeaderLine result = getHeaderLine(" <\"ID\"=\"NS\",\"Number\"=\"1\",\"Type\"=\"Integer\",\"Description\"=\"Number of Samples With Data\">");
        assertEquals(result.getValueForKey("ID"),"NS");
        assertEquals(result.getValueForKey("Number"),"1");
        assertEquals(result.getValueForKey("Type"),"Integer");
        assertEquals(result.getValueForKey("Description"),"Number of Samples With Data");
        assertEquals(result.getValuePair().size(),4);
    }

    @Test
    void parseLineVCFExampleWithWhiteSpacesWithoutQuotes() throws Exception {
        HeaderLine result = getHeaderLine(" < ID = NS , Number = 1 , Type = Integer , Description = \" Number of Samples With Data \" > ");
        assertEquals(result.getValueForKey("ID"),"NS");
        assertEquals(result.getValueForKey("Number"),"1");
        assertEquals(result.getValueForKey("Type"),"Integer");
        assertEquals(result.getValueForKey("Description")," Number of Samples With Data ");
        assertEquals(result.getValuePair().size(),4);
    }

    @Test
    void parseLineVCFExampleWithoutWhiteSpacesWithoutQuotes() throws Exception {
        HeaderLine result = getHeaderLine("<ID=NS,Number=1,Type=Integer,Description=\"Number of Samples With Data\">");
        assertEquals(result.getValueForKey("ID"),"NS");
        assertEquals(result.getValueForKey("Number"),"1");
        assertEquals(result.getValueForKey("Type"),"Integer");
        assertEquals(result.getValueForKey("Description"),"Number of Samples With Data");
        assertEquals(result.getValuePair().size(),4);
    }

    @Test
    void parseLineVCFExampleWithoutWhiteSpacesWithoutQuotesEndWithUnquoted() throws Exception {
        HeaderLine result = getHeaderLine("<ID=NS,Number=1,Type=Integer,Description=A>");
        assertEquals(result.getValueForKey("ID"),"NS");
        assertEquals(result.getValueForKey("Number"),"1");
        assertEquals(result.getValueForKey("Type"),"Integer");
        assertEquals(result.getValueForKey("Description"),"A");
        assertEquals(result.getValuePair().size(),4);
    }

    @Test
    void parseLineVCFExamplePedigree() throws Exception {
        //HeaderLine result = getHeaderLine
        HeaderLine result =  HeaderLine.getFromString("##PEDIGREE=<ID=SampleID,Name_1=Ancestor_1,Name_I=Ancestor_I,Name_N=Ancestor_N>");
        VCFStructureDefinition def = new VCFStructureDefinition(parser);
        def.addHeaderLine(result);
        assertEquals(result.getValueForKey("ID"),"SampleID");
        assertEquals(result.getValueForKey("Name_1"),"Ancestor_1");
        assertEquals(result.getValueForKey("Name_I"),"Ancestor_I");
        assertEquals(result.getValueForKey("Name_N"),"Ancestor_N");
        assertEquals(result.getValuePair().size(),4);

        assertEquals(def.getPedigree().size(),1);
        assertEquals(def.getPedigree().get(0).getId(),"SampleID");
        assertEquals(def.getPedigree().get(0).getAncestors().size(),3);
        assertEquals(def.getPedigree().get(0).getAncestors().get("name_1"),"Ancestor_1");
        assertEquals(def.getPedigree().get(0).getAncestors().get("name_i"),"Ancestor_I");
        assertEquals(def.getPedigree().get(0).getAncestors().get("name_n"),"Ancestor_N");

    }

    @Test
    void parseLineVCFExampleSample() throws Exception {
        //HeaderLine result = getHeaderLine
        HeaderLine result =  HeaderLine.getFromString("##SAMPLE=<ID=Sample2,Assay=Exome,Ethnicity=CEU,Disease=Cancer,Tissue=Breast,Description=\"European patient exome from breast cancer\">\n");
        VCFStructureDefinition def = new VCFStructureDefinition(parser);
        def.addHeaderLine(result);
        assertEquals(result.getValueForKey("ID"),"Sample2");
        assertEquals(result.getValueForKey("Assay"),"Exome");
        assertEquals(result.getValueForKey("Ethnicity"),"CEU");
        assertEquals(result.getValueForKey("Disease"),"Cancer");
        assertEquals(result.getValueForKey("Tissue"),"Breast");
        assertEquals(result.getValueForKey("Description"),"European patient exome from breast cancer");

        assertEquals(result.getValuePair().size(),6);

        assertEquals(def.getSample().size(),1);
        assertEquals(def.getSample().get(0).getId(),"Sample2");
        assertEquals(def.getSample().get(0).getAssay(),"Exome");
        assertEquals(def.getSample().get(0).getEthnicity(), "CEU");
        assertEquals(def.getSample().get(0).getTissue(),"Breast");
        assertEquals(def.getSample().get(0).getDisease(),"Cancer");
        assertEquals(def.getSample().get(0).getDescription(),"European patient exome from breast cancer");

    }

    @Test
    void parseLineVCFExampleContig() throws Exception {
        //HeaderLine result = getHeaderLine
        HeaderLine result =  HeaderLine.getFromString("##contig=<ID=20,length=62435964,assembly=B36,md5=f126cdf8a6e0c7f379d618ff66beb2da,species=\"Homo sapiens\",taxonomy=x, url=\"test\">\n");
        VCFStructureDefinition def = new VCFStructureDefinition(parser);
        def.addHeaderLine(result);
        assertEquals(result.getValueForKey("ID"),"20");
        assertEquals(result.getValueForKey("length"),"62435964");
        assertEquals(result.getValueForKey("assembly"),"B36");
        assertEquals(result.getValueForKey("md5"),"f126cdf8a6e0c7f379d618ff66beb2da");
        assertEquals(result.getValueForKey("species"),"Homo sapiens");
        assertEquals(result.getValueForKey("taxonomy"),"x");
        assertEquals(result.getValueForKey("url"),"test");

        assertEquals(result.getValuePair().size(),7);

        assertEquals(def.getContig().size(),1);
        assertEquals(def.getContig().get(0).getId(),"20");
        assertEquals(def.getContig().get(0).getLength(),new Long(62435964l));
        assertEquals(def.getContig().get(0).getAssembly(), "B36");
        assertEquals(def.getContig().get(0).getMd5(),"f126cdf8a6e0c7f379d618ff66beb2da");
        assertEquals(def.getContig().get(0).getSpecies(),"Homo sapiens");
        assertEquals(def.getContig().get(0).getTaxonomy(),"x");
        assertEquals(def.getContig().get(0).getUrl(),"test");
    }

    @Test
    void parseLineVCFExampleAlt() throws Exception {
        //HeaderLine result = getHeaderLine
        HeaderLine result =  HeaderLine.getFromString("##ALT=<ID=INS,Description=\"Insertion of novel sequence\">\n");
        VCFStructureDefinition def = new VCFStructureDefinition(parser);
        def.addHeaderLine(result);
        assertEquals(result.getValueForKey("ID"),"INS");
        assertEquals(result.getValueForKey("Description"),"Insertion of novel sequence");

        assertEquals(result.getValuePair().size(),2);

        assertEquals(def.getAlt().size(),1);
        assertEquals(def.getAlt().get(0).getId(),"INS");
        assertEquals(def.getAlt().get(0).getDescription(),"Insertion of novel sequence");

    }

    @Test
    void parseLineVCFExampleHeaderLine() throws Exception {
        //HeaderLine result = getHeaderLine
        HeaderLine result =  HeaderLine.getFromString("#CHROM POS ID REF ALT QUAL FILTER INFO FORMAT NA00001 NA00002 NA00003");
        VCFStructureDefinition def = new VCFStructureDefinition(parser);
        def.addHeaderLine(result);
        HeaderField header = def.getHeader();
        assertNotNull(header);
        assertEquals(new HashSet<String>(header.getSampleId()), new HashSet<String>(Arrays.asList("NA00001","NA00002","NA00003")));
        assertEquals(new HashSet<String>(header.getHeader()), new HashSet<String>(Arrays.asList("#CHROM","POS","ID","REF","ALT","QUAL","FILTER","INFO","FORMAT")));


    }

    @Test
    void parseLineVCFExampleFileFormat() throws Exception {
        //HeaderLine result = getHeaderLine
        HeaderLine result =  HeaderLine.getFromString("##fileformat=VCFv4.3");
        VCFStructureDefinition def = new VCFStructureDefinition(parser);
        def.addHeaderLine(result);
        assertEquals(def.getFileFormat(),"VCFv4.3");
    }

    @Test
    void parseLineVCFExampleSource() throws Exception {
        //HeaderLine result = getHeaderLine
        HeaderLine result =  HeaderLine.getFromString("##source=myImputationProgramV3.1");
        VCFStructureDefinition def = new VCFStructureDefinition(parser);
        def.addHeaderLine(result);
        assertEquals(def.getSource(),"myImputationProgramV3.1");
    }

    @Test
    void parseLineVCFExampleReference() throws Exception {
        //HeaderLine result = getHeaderLine
        HeaderLine result =  HeaderLine.getFromString("##reference=file:///seq/references/1000GenomesPilot-NCBI36.fasta");
        VCFStructureDefinition def = new VCFStructureDefinition(parser);
        def.addHeaderLine(result);
        assertEquals(def.getReference(),"file:///seq/references/1000GenomesPilot-NCBI36.fasta");
    }

    @Test
    void parseLineVCFExamplePhasing() throws Exception {
        //HeaderLine result = getHeaderLine
        HeaderLine result =  HeaderLine.getFromString("##phasing=partial");
        VCFStructureDefinition def = new VCFStructureDefinition(parser);
        def.addHeaderLine(result);
        assertEquals(def.getPhasing(),"partial");
    }

    @Test
    void parseLineVCFExamplePedigreeDB() throws Exception {
        //HeaderLine result = getHeaderLine
        HeaderLine result =  HeaderLine.getFromString("##pedigreeDB=http://lalal.lelel");
        VCFStructureDefinition def = new VCFStructureDefinition(parser);
        def.addHeaderLine(result);
        assertEquals(def.getPedigreeDB(),"http://lalal.lelel");
    }


    @Test
    void parseLineVCFExampleWithoutWhiteSpacesWithoutQuotesInvalidTokensAtTheEnd() throws Exception {
        boolean error = false;
        try {
            HeaderLine result = getHeaderLine("<ID=NS,Number=1,Type=Integer,Description=\"Number of Samples With Data\">BUMM");
        } catch (HeaderParseException e) {
            assertEquals(e.getPosition(),72);
            error = true;
        }
        assertTrue(error);
    }

    @Test
    void parseLineVCFExampleInvalidQuoteValue() throws Exception {
        boolean error = false;
        try {
            HeaderLine result = getHeaderLine("<ID=N\"S,Number=1,Type=Integer,Description=\"Number of Samples With Data\">BUMM");
        } catch (HeaderParseException e) {
            assertEquals(e.getPosition(),6);
            error = true;
        }
        assertTrue(error);
    }

    @Test
    void parseLineVCFExampleInvalidQuoteKey() throws Exception {
        boolean error = false;
        try {
            HeaderLine result = getHeaderLine("<I\"D=NS,Number=1,Type=Integer,Description=\"Number of Samples With Data\">BUMM");
        } catch (HeaderParseException e) {
            assertEquals(e.getPosition(),3);
            error = true;
        }
        assertTrue(error);
    }

    @Test
    void parseLineVCFExampleCharachterAfterQuotedKey() throws Exception {
        boolean error = false;
        try {
            HeaderLine result = getHeaderLine("<\"ID\"A=NS,Number=1,Type=Integer,Description=\"Number of Samples With Data\">BUMM");
        } catch (HeaderParseException e) {
            assertEquals(e.getPosition(),6);
            error = true;
        }
        assertTrue(error);
    }

    @Test
    void parseLineVCFExampleCharachterAfterQuotedValue() throws Exception {
        boolean error = false;
        try {
            HeaderLine result = getHeaderLine("<\"ID\"=\"NS\"A,Number=1,Type=Integer,Description=\"Number of Samples With Data\">");
        } catch (HeaderParseException e) {
            assertEquals(e.getPosition(),11);
            error = true;
        }
        assertTrue(error);
    }

    @Test
    void parseLineVCFExampleIncomplete() throws Exception {
        boolean error = false;
        try {
            HeaderLine result = getHeaderLine("<ID=NS,Number=");
        } catch (HeaderParseException e) {
            assertEquals(e.getPosition(),14);
            error = true;
        }
        assertTrue(error);
    }

    @Test
    void parseLineVCFExampleWithoutWhiteSpacesWithoutQuotesEscaped() throws Exception {
        HeaderLine result = getHeaderLine("<I\\\"D=N\\\"S,Number=1,Type=Integer,Description=\"Number of Samples With Data\">");
        assertEquals(result.getValueForKey("I\\\"D"),"N\\\"S");
        assertEquals(result.getValueForKey("Number"),"1");
        assertEquals(result.getValueForKey("Type"),"Integer");
        assertEquals(result.getValueForKey("Description"),"Number of Samples With Data");
        assertEquals(result.getValuePair().size(),4);
    }

    @Test
    void parseLineVCFExampleWithoutWhiteSpacesWithQuotesEscaped() throws Exception {
        HeaderLine result = getHeaderLine("<\"I\\\"D\"=\"N\\\"S\",Number=1,Type=Integer,Description=\"Number of Samples With Data\">");
        assertEquals(result.getValueForKey("I\\\"D"),"N\\\"S");
        assertEquals(result.getValueForKey("Number"),"1");
        assertEquals(result.getValueForKey("Type"),"Integer");
        assertEquals(result.getValueForKey("Description"),"Number of Samples With Data");
        assertEquals(result.getValuePair().size(),4);
    }

    @Test
    void parseNonKeyValueLine() throws Exception {
        HeaderLine result = getHeaderLine("Hallo");
        assertEquals(result.getValuePair().size(),0);

    }
}