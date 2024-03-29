package legacy.health.genomics.vcf.parser;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import legacy.health.genomics.vcf.parser.datamodel.*;
import legacy.health.genomics.vcf.parser.exceptions.DataLineParserException;
import legacy.health.genomics.vcf.parser.inputmodels.DataParserStateMachine;
import legacy.health.genomics.vcf.parser.inputmodels.HeaderLine;
import legacy.health.genomics.vcf.parser.inputmodels.HeaderParserStateMachine;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;


import java.util.*;

class DatalineParserTest {
    private DataParserStateMachine datalineParser;

    @BeforeEach
    void setUp() throws Exception {
        VCFStructureDefinition def = new VCFStructureDefinition(new HeaderParserStateMachine());
        def.addHeaderLine(HeaderLine.getFromString("##INFO=<ID=NS,Number=1,Type=Integer,Description=\"Number of Samples With Data\">"));
        def.addHeaderLine(HeaderLine.getFromString("##INFO=<ID=DP,Number=1,Type=Integer,Description=\"Total Depth\">"));
        def.addHeaderLine(HeaderLine.getFromString("##INFO=<ID=AF,Number=A,Type=Float,Description=\"Allele Frequency\">"));
        def.addHeaderLine(HeaderLine.getFromString("##INFO=<ID=AA,Number=1,Type=String,Description=\"Ancestral Allele\">"));
        def.addHeaderLine(HeaderLine.getFromString("##INFO=<ID=DB,Number=0,Type=Flag,Description=\"dbSNP membership, build 129\">"));
        def.addHeaderLine(HeaderLine.getFromString("##INFO=<ID=H2,Number=0,Type=Flag,Description=\"HapMap2 membership\">"));
        def.addHeaderLine(HeaderLine.getFromString("##INFO=<ID=SVTYPE,Number=1,Type=String,Description=\"Type of structural variant\">"));
        def.addHeaderLine(HeaderLine.getFromString("##INFO=<ID=END,Number=1,Type=Integer,Description=\"End position of the variant described in this record\">"));
        def.addHeaderLine(HeaderLine.getFromString("##INFO=<ID=SVLEN,Number=.,Type=Integer,Description=\"Difference in length between REF and ALT alleles\">"));
        def.addHeaderLine(HeaderLine.getFromString("##INFO=<ID=CIPOS,Number=2,Type=Integer,Description=\"Confidence interval around POS for imprecise variants\">"));
        def.addHeaderLine(HeaderLine.getFromString("##INFO=<ID=CSQ,Number=1,Type=String,Description=\"Confidence interval around POS for imprecise variants\">"));

        def.addHeaderLine(HeaderLine.getFromString("##FILTER=<ID=q10,Description=\"Quality below 10\">"));
        def.addHeaderLine(HeaderLine.getFromString("##FILTER=<ID=s50,Description=\"Less than 50% of samples have data\">"));
        def.addHeaderLine(HeaderLine.getFromString("##FORMAT=<ID=GT,Number=1,Type=String,Description=\"Genotype\">"));
        def.addHeaderLine(HeaderLine.getFromString("##FORMAT=<ID=GQ,Number=1,Type=Integer,Description=\"Genotype Quality\">"));
        def.addHeaderLine(HeaderLine.getFromString("##FORMAT=<ID=DP,Number=1,Type=Integer,Description=\"Read Depth\">"));
        def.addHeaderLine(HeaderLine.getFromString("##FORMAT=<ID=HQ,Number=2,Type=Integer,Description=\"Haplotype Quality\">"));
        def.addHeaderLine(HeaderLine.getFromString("##FORMAT=<ID=HQ,Number=2,Type=Integer,Description=\"Haplotype Quality\">"));
        def.addHeaderLine(HeaderLine.getFromString("##FORMAT=<ID=HQ,Number=2,Type=Integer,Description=\"Haplotype Quality\">"));

        datalineParser = new DataParserStateMachine(def);
    }

    @Test
    void spec43Example1Line1() throws Exception {
        Dataline dataline = datalineParser.parseDataline("20	14370	rs6054257	G	A	29	PASS	NS=3;DP=14;AF=0.5;DB;H2	GT:GQ:DP:HQ	0|0:48:1:51,51	1|0:48:8:51,51	1/1:43:5:.,.",1);
        assertEquals("20", dataline.getChrom());
        assertEquals(new Long(14370), dataline.getPos());
        assertEquals(Collections.singletonList("rs6054257"), dataline.getId());
        assertEquals("G", dataline.getRef());
        assertEquals(Collections.singletonList("A"), dataline.getAlt());
        assertEquals(new Double(29), dataline.getQual());
        assertEquals(new HashSet<String>(Collections.singletonList("PASS")), dataline.getFilter());

        assertEquals(5, dataline.getInfo().size());

        assertEquals(Collections.singletonList("3"), dataline.getInfo().get("NS").getValues());
        assertEquals(Collections.singletonList("14"), dataline.getInfo().get("DP").getValues());
        assertEquals(Collections.singletonList("0.5"), dataline.getInfo().get("AF").getValues());
        assertEquals(new ArrayList<String>(), dataline.getInfo().get("DB").getValues());
        assertEquals(new ArrayList<String>(), dataline.getInfo().get("H2").getValues());

        assertEquals("GT", dataline.getFormatField(0));
        assertEquals("GQ", dataline.getFormatField(1));
        assertEquals("DP", dataline.getFormatField(2));
        assertEquals("HQ", dataline.getFormatField(3));
        assertEquals(4, dataline.getFormat().size());

        Integer GT = dataline.getFormat().get("GT");
        Integer GQ = dataline.getFormat().get("GQ");
        Integer DP = dataline.getFormat().get("DP");
        Integer HQ = dataline.getFormat().get("HQ");

        assertEquals(new Integer(0), GT);
        assertEquals(new Integer(1), GQ);
        assertEquals(new Integer(2), DP);
        assertEquals(new Integer(3), HQ);

        // Read Samples
        assertEquals(3, dataline.getSamples().size());
        List<List<String>> sample0 = dataline.getSample(0);
        List<List<String>> sample1 = dataline.getSample(1);
        List<List<String>> sample2 = dataline.getSample(2);
        assertEquals(4, sample0.size());

        assertEquals(Collections.singletonList("0|0"), sample0.get(GT));
        assertEquals(Collections.singletonList("48"), sample0.get(GQ));
        assertEquals(Collections.singletonList("1"), sample0.get(DP));
        assertEquals(Arrays.asList("51", "51"), sample0.get(HQ));
        assertEquals(4, sample1.size());
        assertEquals(Collections.singletonList("1|0"), sample1.get(GT));
        assertEquals(Collections.singletonList("48"), sample1.get(GQ));
        assertEquals(Collections.singletonList("8"), sample1.get(DP));
        assertEquals(Arrays.asList("51", "51"), sample1.get(HQ));
        assertEquals(4, sample2.size());
        assertEquals(Collections.singletonList("1/1"), sample2.get(GT));
        assertEquals(Collections.singletonList("43"), sample2.get(GQ));
        assertEquals(Collections.singletonList("5"), sample2.get(DP));
        assertEquals(Arrays.asList(".", "."), sample2.get(HQ));


    }

    @Test
    void spec43Example1Line2() throws Exception {
        Dataline dataline = datalineParser.parseDataline("20	17330	.	T	A	3	q10	NS=3;DP=11;AF=0.017	GT:GQ:DP:HQ	0|0:49:3:58,50	0|1:3:5:65,3	0/0:41:3",1);
        assertEquals("20", dataline.getChrom());
        assertEquals(new Long(17330), dataline.getPos());
        assertEquals(Collections.singletonList("."), dataline.getId());
        assertEquals("T", dataline.getRef());
        assertEquals(Collections.singletonList("A"), dataline.getAlt());
        assertEquals(new Double(3), dataline.getQual());
        assertEquals(new HashSet<String>(Collections.singletonList("q10")), dataline.getFilter());

        assertEquals(3, dataline.getInfo().size());
        assertEquals(Collections.singletonList("3"), dataline.getInfo().get("NS").getValues());
        assertEquals(Collections.singletonList("11"), dataline.getInfo().get("DP").getValues());
        assertEquals(Collections.singletonList("0.017"), dataline.getInfo().get("AF").getValues());


        assertEquals("GT", dataline.getFormatField(0));
        assertEquals("GQ", dataline.getFormatField(1));
        assertEquals("DP", dataline.getFormatField(2));
        assertEquals("HQ", dataline.getFormatField(3));
        assertEquals(4, dataline.getFormat().size());

        Integer GT = dataline.getFormat().get("GT");
        Integer GQ = dataline.getFormat().get("GQ");
        Integer DP = dataline.getFormat().get("DP");
        Integer HQ = dataline.getFormat().get("HQ");

        assertEquals(new Integer(0), GT);
        assertEquals(new Integer(1), GQ);
        assertEquals(new Integer(2), DP);
        assertEquals(new Integer(3), HQ);

        // Read Samples
        assertEquals(3, dataline.getSamples().size());
        List<List<String>> sample0 = dataline.getSample(0);
        List<List<String>> sample1 = dataline.getSample(1);
        List<List<String>> sample2 = dataline.getSample(2);
        assertEquals(4, sample0.size());

        assertEquals(Collections.singletonList("0|0"), sample0.get(GT));
        assertEquals(Collections.singletonList("49"), sample0.get(GQ));
        assertEquals(Collections.singletonList("3"), sample0.get(DP));
        assertEquals(Arrays.asList("58", "50"), sample0.get(HQ));
        assertEquals(4, sample1.size());
        assertEquals(Collections.singletonList("0|1"), sample1.get(GT));
        assertEquals(Collections.singletonList("3"), sample1.get(GQ));
        assertEquals(Collections.singletonList("5"), sample1.get(DP));
        assertEquals(Arrays.asList("65", "3"), sample1.get(HQ));
        assertEquals(3, sample2.size());
        assertEquals(Collections.singletonList("0/0"), sample2.get(GT));
        assertEquals(Collections.singletonList("41"), sample2.get(GQ));
        assertEquals(Collections.singletonList("3"), sample2.get(DP));

    }

    @Test
    void spec43Example1Line3() throws Exception {
        Dataline dataline = datalineParser.parseDataline("20	1110696	rs6040355	A	G,T	67	PASS	NS=2;DP=10;AF=0.333,0.667;AA=T;DB	GT:GQ:DP:HQ	1|2:21:6:23,27	2|1:2:0:18,2	2/2:35:4",1);
        assertEquals("20", dataline.getChrom());
        assertEquals(new Long(1110696), dataline.getPos());
        assertEquals(Collections.singletonList("rs6040355"), dataline.getId());
        assertEquals("A", dataline.getRef());
        assertEquals(Arrays.asList("G", "T"), dataline.getAlt());
        assertEquals(new Double(67), dataline.getQual());
        assertEquals(new HashSet<String>(Collections.singletonList("PASS")), dataline.getFilter());

        assertEquals(5, dataline.getInfo().size());
        assertEquals(Collections.singletonList("2"), dataline.getInfo().get("NS").getValues());
        assertEquals(Collections.singletonList("10"), dataline.getInfo().get("DP").getValues());
        assertEquals(Arrays.asList("0.333", "0.667"), dataline.getInfo().get("AF").getValues());
        assertEquals(Collections.singletonList("T"), dataline.getInfo().get("AA").getValues());
        assertEquals(new ArrayList<String>(), dataline.getInfo().get("DB").getValues());

        assertEquals("GT", dataline.getFormatField(0));
        assertEquals("GQ", dataline.getFormatField(1));
        assertEquals("DP", dataline.getFormatField(2));
        assertEquals("HQ", dataline.getFormatField(3));
        assertEquals(4, dataline.getFormat().size());

        Integer GT = dataline.getFormat().get("GT");
        Integer GQ = dataline.getFormat().get("GQ");
        Integer DP = dataline.getFormat().get("DP");
        Integer HQ = dataline.getFormat().get("HQ");

        assertEquals(new Integer(0), GT);
        assertEquals(new Integer(1), GQ);
        assertEquals(new Integer(2), DP);
        assertEquals(new Integer(3), HQ);

        // Read Samples
        assertEquals(3, dataline.getSamples().size());
        List<List<String>> sample0 = dataline.getSample(0);
        List<List<String>> sample1 = dataline.getSample(1);
        List<List<String>> sample2 = dataline.getSample(2);
        assertEquals(4, sample0.size());

        assertEquals(Collections.singletonList("1|2"), sample0.get(GT));
        assertEquals(Collections.singletonList("21"), sample0.get(GQ));
        assertEquals(Collections.singletonList("6"), sample0.get(DP));
        assertEquals(Arrays.asList("23", "27"), sample0.get(HQ));
        assertEquals(4, sample1.size());
        assertEquals(Collections.singletonList("2|1"), sample1.get(GT));
        assertEquals(Collections.singletonList("2"), sample1.get(GQ));
        assertEquals(Collections.singletonList("0"), sample1.get(DP));
        assertEquals(Arrays.asList("18", "2"), sample1.get(HQ));
        assertEquals(3, sample2.size());
        assertEquals(Collections.singletonList("2/2"), sample2.get(GT));
        assertEquals(Collections.singletonList("35"), sample2.get(GQ));
        assertEquals(Collections.singletonList("4"), sample2.get(DP));

    }

    @Test
    void spec43Example1Line4() throws Exception {
        Dataline dataline = datalineParser.parseDataline("20	1230237	.	T	.	47	PASS	NS=3;DP=13;AA=T	GT:GQ:DP:HQ	0|0:54:7:56,60	0|0:48:4:51,51	0/0:61:2",1);
        assertEquals("20", dataline.getChrom());
        assertEquals(new Long(1230237), dataline.getPos());
        assertEquals(Collections.singletonList("."), dataline.getId());
        assertEquals("T", dataline.getRef());
        assertEquals(Collections.singletonList("."), dataline.getAlt());
        assertEquals(new Double(47), dataline.getQual());
        assertEquals(new HashSet<String>(Collections.singletonList("PASS")), dataline.getFilter());

        assertEquals(3, dataline.getInfo().size());
        assertEquals(Collections.singletonList("3"), dataline.getInfo().get("NS").getValues());
        assertEquals(Collections.singletonList("13"), dataline.getInfo().get("DP").getValues());
        assertEquals(Collections.singletonList("T"), dataline.getInfo().get("AA").getValues());

        assertEquals("GT", dataline.getFormatField(0));
        assertEquals("GQ", dataline.getFormatField(1));
        assertEquals("DP", dataline.getFormatField(2));
        assertEquals("HQ", dataline.getFormatField(3));
        assertEquals(4, dataline.getFormat().size());

        Integer GT = dataline.getFormat().get("GT");
        Integer GQ = dataline.getFormat().get("GQ");
        Integer DP = dataline.getFormat().get("DP");
        Integer HQ = dataline.getFormat().get("HQ");

        assertEquals(new Integer(0), GT);
        assertEquals(new Integer(1), GQ);
        assertEquals(new Integer(2), DP);
        assertEquals(new Integer(3), HQ);

        // Read Samples
        assertEquals(3, dataline.getSamples().size());
        List<List<String>> sample0 = dataline.getSample(0);
        List<List<String>> sample1 = dataline.getSample(1);
        List<List<String>> sample2 = dataline.getSample(2);
        assertEquals(4, sample0.size());

        assertEquals(Collections.singletonList("0|0"), sample0.get(GT));
        assertEquals(Collections.singletonList("54"), sample0.get(GQ));
        assertEquals(Collections.singletonList("7"), sample0.get(DP));
        assertEquals(Arrays.asList("56", "60"), sample0.get(HQ));
        assertEquals(4, sample1.size());
        assertEquals(Collections.singletonList("0|0"), sample1.get(GT));
        assertEquals(Collections.singletonList("48"), sample1.get(GQ));
        assertEquals(Collections.singletonList("4"), sample1.get(DP));
        assertEquals(Arrays.asList("51", "51"), sample1.get(HQ));
        assertEquals(3, sample2.size());
        assertEquals(Collections.singletonList("0/0"), sample2.get(GT));
        assertEquals(Collections.singletonList("61"), sample2.get(GQ));
        assertEquals(Collections.singletonList("2"), sample2.get(DP));

    }

    @Test
    void spec43Example1Line5() throws Exception {
        Dataline dataline = datalineParser.parseDataline("20	1234567	microsat1	GTC	G,GTCT	50	PASS	NS=3;DP=9;AA=G	GT:GQ:DP	0/1:35:4	0/2:17:2	1/1:40:3",1);
        assertEquals("20", dataline.getChrom());
        assertEquals(new Long(1234567), dataline.getPos());
        assertEquals(Collections.singletonList("microsat1"), dataline.getId());
        assertEquals("GTC", dataline.getRef());
        assertEquals(Arrays.asList("G", "GTCT"), dataline.getAlt());
        assertEquals(new Double(50), dataline.getQual());
        assertEquals(new HashSet<String>(Collections.singletonList("PASS")), dataline.getFilter());

        assertEquals(3, dataline.getInfo().size());
        assertEquals(Collections.singletonList("3"), dataline.getInfo().get("NS").getValues());
        assertEquals(Collections.singletonList("9"), dataline.getInfo().get("DP").getValues());
        assertEquals(Collections.singletonList("G"), dataline.getInfo().get("AA").getValues());

        assertEquals("GT", dataline.getFormatField(0));
        assertEquals("GQ", dataline.getFormatField(1));
        assertEquals("DP", dataline.getFormatField(2));
        assertEquals(3, dataline.getFormat().size());

        Integer GT = dataline.getFormat().get("GT");
        Integer GQ = dataline.getFormat().get("GQ");
        Integer DP = dataline.getFormat().get("DP");

        assertEquals(new Integer(0), GT);
        assertEquals(new Integer(1), GQ);
        assertEquals(new Integer(2), DP);


        // Read Samples
        assertEquals(3, dataline.getSamples().size());
        List<List<String>> sample0 = dataline.getSample(0);
        List<List<String>> sample1 = dataline.getSample(1);
        List<List<String>> sample2 = dataline.getSample(2);
        assertEquals(3, sample0.size());

        assertEquals(Collections.singletonList("0/1"), sample0.get(GT));
        assertEquals(Collections.singletonList("35"), sample0.get(GQ));
        assertEquals(Collections.singletonList("4"), sample0.get(DP));

        assertEquals(3, sample1.size());
        assertEquals(Collections.singletonList("0/2"), sample1.get(GT));
        assertEquals(Collections.singletonList("17"), sample1.get(GQ));
        assertEquals(Collections.singletonList("2"), sample1.get(DP));
        assertEquals(3, sample2.size());
        assertEquals(Collections.singletonList("1/1"), sample2.get(GT));
        assertEquals(Collections.singletonList("40"), sample2.get(GQ));
        assertEquals(Collections.singletonList("3"), sample2.get(DP));

    }


    @Test
    void spec43Example2Line4() throws Exception {
        Dataline dataline = datalineParser.parseDataline("3	9425916	.	C	<INS:ME:L1>	23	PASS	SVTYPE=INS;END=9425916;SVLEN=6027;CIPOS=-16,22	GT:GQ	1/1:15",1);
        assertEquals("3", dataline.getChrom());
        assertEquals(new Long(9425916), dataline.getPos());
        assertEquals(Collections.singletonList("."), dataline.getId());
        assertEquals("C", dataline.getRef());
        assertEquals(Collections.singletonList("<INS:ME:L1>"), dataline.getAlt());
        assertEquals(new Double(23), dataline.getQual());
        assertEquals(new HashSet<String>(Collections.singletonList("PASS")), dataline.getFilter());

        assertEquals(4, dataline.getInfo().size());
        assertEquals(Collections.singletonList("INS"), dataline.getInfo().get("SVTYPE").getValues());
        assertEquals(Collections.singletonList("9425916"), dataline.getInfo().get("END").getValues());
        assertEquals(Collections.singletonList("6027"), dataline.getInfo().get("SVLEN").getValues());
        assertEquals(Arrays.asList("-16", "22"), dataline.getInfo().get("CIPOS").getValues());


        assertEquals("GT", dataline.getFormatField(0));
        assertEquals("GQ", dataline.getFormatField(1));
        assertEquals(2, dataline.getFormat().size());

        Integer GT = dataline.getFormat().get("GT");
        Integer GQ = dataline.getFormat().get("GQ");

        assertEquals(new Integer(0), GT);
        assertEquals(new Integer(1), GQ);

        // Read Samples
        assertEquals(1, dataline.getSamples().size());
        List<List<String>> sample0 = dataline.getSample(0);
        assertEquals(2, sample0.size());

        assertEquals(Collections.singletonList("1/1"), sample0.get(GT));
        assertEquals(Collections.singletonList("15"), sample0.get(GQ));
    }


    @Test
    void testDatalineParserWithMissingValues() throws Exception {
        Dataline dataline = datalineParser.parseDataline("20	1235237	.	T	.	.	.	.	GT	0/0	0|0	./.\n",1);
        assertEquals("20", dataline.getChrom());
        assertEquals(new Long(1235237), dataline.getPos());
        assertEquals(Collections.singletonList("."), dataline.getId());
        assertEquals("T", dataline.getRef());
        assertEquals(Collections.singletonList("."), dataline.getAlt());
        assertNull(dataline.getQual());
        assertEquals(new HashSet<String>(Collections.singletonList(".")), dataline.getFilter());

        assertEquals(0, dataline.getInfo().size());


        assertEquals("GT", dataline.getFormatField(0));
        assertEquals(1, dataline.getFormat().size());

        Integer GT = dataline.getFormat().get("GT");

        assertEquals(new Integer(0), GT);

        // Read Samples
        assertEquals(3, dataline.getSamples().size());
        List<List<String>> sample0 = dataline.getSample(0);
        List<List<String>> sample1 = dataline.getSample(1);
        List<List<String>> sample2 = dataline.getSample(2);
        assertEquals(1, sample0.size());
        assertEquals(Collections.singletonList("0/0"), sample0.get(GT));
        assertEquals(1, sample1.size());
        assertEquals(Collections.singletonList("0|0"), sample1.get(GT));
        assertEquals(1, sample2.size());
        assertEquals(Collections.singletonList("./."), sample2.get(GT));

    }

    @Test
    void testDatalineParserWithSeparatorAtEndOfFields() throws Exception {
        Dataline dataline = datalineParser.parseDataline("20\t14370\trs6054257;\tG\tA,\t29\tPASS;\tNS=3;DP=14;AF=0.5;DB;H2;\tGT:GQ:DP:HQ:\t0|0:48:1:51,51\t1|0:48:8:51,51:\t1/1:43:5:.,.\n",1);
        assertEquals("20", dataline.getChrom());
        assertEquals(new Long(14370), dataline.getPos());
        assertEquals(Collections.singletonList("rs6054257"), dataline.getId());
        assertEquals("G", dataline.getRef());
        assertEquals(Collections.singletonList("A"), dataline.getAlt());
        assertEquals(new Double(29), dataline.getQual());
        assertEquals(new HashSet<String>(Collections.singletonList("PASS")), dataline.getFilter());

        assertEquals(5, dataline.getInfo().size());
        assertEquals(Collections.singletonList("3"), dataline.getInfo().get("NS").getValues());
        assertEquals(Collections.singletonList("14"), dataline.getInfo().get("DP").getValues());
        assertEquals(Collections.singletonList("0.5"), dataline.getInfo().get("AF").getValues());
        assertEquals(new ArrayList<String>(), dataline.getInfo().get("DB").getValues());
        assertEquals(new ArrayList<String>(), dataline.getInfo().get("H2").getValues());

        assertEquals("GT", dataline.getFormatField(0));
        assertEquals("GQ", dataline.getFormatField(1));
        assertEquals("DP", dataline.getFormatField(2));
        assertEquals("HQ", dataline.getFormatField(3));
        assertEquals(4, dataline.getFormat().size());

        Integer GT = dataline.getFormat().get("GT");
        Integer GQ = dataline.getFormat().get("GQ");
        Integer DP = dataline.getFormat().get("DP");
        Integer HQ = dataline.getFormat().get("HQ");

        assertEquals(new Integer(0), GT);
        assertEquals(new Integer(1), GQ);
        assertEquals(new Integer(2), DP);
        assertEquals(new Integer(3), HQ);

        // Read Samples
        assertEquals(3, dataline.getSamples().size());
        List<List<String>> sample0 = dataline.getSample(0);
        List<List<String>> sample1 = dataline.getSample(1);
        List<List<String>> sample2 = dataline.getSample(2);
        assertEquals(4, sample0.size());

        assertEquals(Collections.singletonList("0|0"), sample0.get(GT));
        assertEquals(Collections.singletonList("48"), sample0.get(GQ));
        assertEquals(Collections.singletonList("1"), sample0.get(DP));
        assertEquals(Arrays.asList("51", "51"), sample0.get(HQ));
        assertEquals(4, sample1.size());
        assertEquals(Collections.singletonList("1|0"), sample1.get(GT));
        assertEquals(Collections.singletonList("48"), sample1.get(GQ));
        assertEquals(Collections.singletonList("8"), sample1.get(DP));
        assertEquals(Arrays.asList("51", "51"), sample1.get(HQ));
        assertEquals(4, sample2.size());
        assertEquals(Collections.singletonList("1/1"), sample2.get(GT));
        assertEquals(Collections.singletonList("43"), sample2.get(GQ));
        assertEquals(Collections.singletonList("5"), sample2.get(DP));
        assertEquals(Arrays.asList(".", "."), sample2.get(HQ));

    }

    @Test
    void testDatalineParserWithMultipleSeparators() throws Exception {
        Dataline dataline = datalineParser.parseDataline("20\t14370\trs6054257;;\tG\tA,,\t29\tPASS;\tNS=3;;;DP=14;;AF=0.5;;DB;H2;;\tGT::GQ:DP::HQ:::\t0|0:48:1:51,51\t1|0:48:8:51,51:\t1/1:43:5:.,.\n",1);
        assertEquals("20", dataline.getChrom());
        assertEquals(new Long(14370), dataline.getPos());
        assertEquals(Collections.singletonList("rs6054257"), dataline.getId());
        assertEquals("G", dataline.getRef());
        assertEquals(Collections.singletonList("A"), dataline.getAlt());
        assertEquals(new Double(29), dataline.getQual());
        assertEquals(new HashSet<String>(Collections.singletonList("PASS")), dataline.getFilter());

        assertEquals(5, dataline.getInfo().size());
        assertEquals(Collections.singletonList("3"), dataline.getInfo().get("NS").getValues());
        assertEquals(Collections.singletonList("14"), dataline.getInfo().get("DP").getValues());
        assertEquals(Collections.singletonList("0.5"), dataline.getInfo().get("AF").getValues());
        assertEquals(new ArrayList<String>(), dataline.getInfo().get("DB").getValues());
        assertEquals(new ArrayList<String>(), dataline.getInfo().get("H2").getValues());

        assertEquals("GT", dataline.getFormatField(0));
        assertEquals("GQ", dataline.getFormatField(1));
        assertEquals("DP", dataline.getFormatField(2));
        assertEquals("HQ", dataline.getFormatField(3));
        assertEquals(4, dataline.getFormat().size());

        Integer GT = dataline.getFormat().get("GT");
        Integer GQ = dataline.getFormat().get("GQ");
        Integer DP = dataline.getFormat().get("DP");
        Integer HQ = dataline.getFormat().get("HQ");

        assertEquals(new Integer(0), GT);
        assertEquals(new Integer(1), GQ);
        assertEquals(new Integer(2), DP);
        assertEquals(new Integer(3), HQ);

        // Read Samples
        assertEquals(3, dataline.getSamples().size());
        List<List<String>> sample0 = dataline.getSample(0);
        List<List<String>> sample1 = dataline.getSample(1);
        List<List<String>> sample2 = dataline.getSample(2);
        assertEquals(4, sample0.size());

        assertEquals(Collections.singletonList("0|0"), sample0.get(GT));
        assertEquals(Collections.singletonList("48"), sample0.get(GQ));
        assertEquals(Collections.singletonList("1"), sample0.get(DP));
        assertEquals(Arrays.asList("51", "51"), sample0.get(HQ));
        assertEquals(4, sample1.size());
        assertEquals(Collections.singletonList("1|0"), sample1.get(GT));
        assertEquals(Collections.singletonList("48"), sample1.get(GQ));
        assertEquals(Collections.singletonList("8"), sample1.get(DP));
        assertEquals(Arrays.asList("51", "51"), sample1.get(HQ));
        assertEquals(4, sample2.size());
        assertEquals(Collections.singletonList("1/1"), sample2.get(GT));
        assertEquals(Collections.singletonList("43"), sample2.get(GQ));
        assertEquals(Collections.singletonList("5"), sample2.get(DP));
        assertEquals(Arrays.asList(".", "."), sample2.get(HQ));

    }

    @Test
    void testDatalineParserWithSeparatorAtEndOfFieldsWithMultipleValues() throws Exception {
        Dataline dataline = datalineParser.parseDataline("20\t14370\trs6054257;COSM123;\tG\tA,C,\t29\tq10;s50;\tNS=3;DP=14;AF=0.5,0.5;DB;H2;\tGT:GQ:DP:HQ:\t0|0:48:1:51,51\t1|0:48:8:51,51:\t1/1:43:5:.,.\n",1);
        assertEquals("20", dataline.getChrom());
        assertEquals(new Long(14370), dataline.getPos());
        assertEquals(Arrays.asList("rs6054257","COSM123"), dataline.getId());
        assertEquals("G", dataline.getRef());
        assertEquals(Arrays.asList("A","C"), dataline.getAlt());
        assertEquals(new Double(29), dataline.getQual());
        assertEquals(new HashSet<String>(Arrays.asList("q10","s50")), dataline.getFilter());

        assertEquals(5, dataline.getInfo().size());
        assertEquals(Collections.singletonList("3"), dataline.getInfo().get("NS").getValues());
        assertEquals(Collections.singletonList("14"), dataline.getInfo().get("DP").getValues());
        assertEquals(Arrays.asList("0.5","0.5"), dataline.getInfo().get("AF").getValues());
        assertEquals(new ArrayList<String>(), dataline.getInfo().get("DB").getValues());
        assertEquals(new ArrayList<String>(), dataline.getInfo().get("H2").getValues());

        assertEquals("GT", dataline.getFormatField(0));
        assertEquals("GQ", dataline.getFormatField(1));
        assertEquals("DP", dataline.getFormatField(2));
        assertEquals("HQ", dataline.getFormatField(3));
        assertEquals(4, dataline.getFormat().size());

        Integer GT = dataline.getFormat().get("GT");
        Integer GQ = dataline.getFormat().get("GQ");
        Integer DP = dataline.getFormat().get("DP");
        Integer HQ = dataline.getFormat().get("HQ");

        assertEquals(new Integer(0), GT);
        assertEquals(new Integer(1), GQ);
        assertEquals(new Integer(2), DP);
        assertEquals(new Integer(3), HQ);

        // Read Samples
        assertEquals(3, dataline.getSamples().size());
        List<List<String>> sample0 = dataline.getSample(0);
        List<List<String>> sample1 = dataline.getSample(1);
        List<List<String>> sample2 = dataline.getSample(2);
        assertEquals(4, sample0.size());

        assertEquals(Collections.singletonList("0|0"), sample0.get(GT));
        assertEquals(Collections.singletonList("48"), sample0.get(GQ));
        assertEquals(Collections.singletonList("1"), sample0.get(DP));
        assertEquals(Arrays.asList("51", "51"), sample0.get(HQ));
        assertEquals(4, sample1.size());
        assertEquals(Collections.singletonList("1|0"), sample1.get(GT));
        assertEquals(Collections.singletonList("48"), sample1.get(GQ));
        assertEquals(Collections.singletonList("8"), sample1.get(DP));
        assertEquals(Arrays.asList("51", "51"), sample1.get(HQ));
        assertEquals(4, sample2.size());
        assertEquals(Collections.singletonList("1/1"), sample2.get(GT));
        assertEquals(Collections.singletonList("43"), sample2.get(GQ));
        assertEquals(Collections.singletonList("5"), sample2.get(DP));
        assertEquals(Arrays.asList(".", "."), sample2.get(HQ));


    }

    @Test
    void throwsExceptionWhenNegativeNumbersAreGiven() {
        assertThrows(DataLineParserException.class,
            () -> datalineParser.parseDataline("20\t14370\trs6054257;COSM123;\tG\tA,C,\t29\tq10;s50;\tNS=3;DP=14;AF=0.5;DB;H2;\tGT:GQ:DP:HQ:\t0|0:48:1:51,51\t1|0:48:8:51,51:\t1/1:43:5:.,.\n",1),
            "AF expected A=2 was 1");
    }

    @Test
    void testDatalineParserWithWrongHQType() {

        assertThrows(DataLineParserException.class,
                () ->  datalineParser.parseDataline("20\t17330\t.\tT\tA\t3\tq10\tNS=3;DP=11;AF=0.017\tGT:GQ:DP:HQ\t0|0:A:A:A,A\t0|1:3:5:65,3\t0/0:41:3\n",1),
                "Field 'GQ' is of type Integer but contains an unparseable integer");
    }

    @Test
    void testDatalineParserWithTooManyAFs() {
        assertThrows(DataLineParserException.class,
                () ->  datalineParser.parseDataline("20\t14370\trs6054257\tG\tA\t29\tPASS\tNS=3;DP=14;CSQ=A|G|protein_coding|2/8||ENST00000419219.1:c.251A>G|ENSP00000404426.1:p.Asn84Ser|260;AF=0.5,0.1,0.1,0.1,0.1;DB;H2\tGT:GQ:DP:HQ\t0|0:48:1:51,51\t1|0:48:8:51,51\t1/1:43:5:.,.\n",1),
                "Invalid count for Info element AF expected A=1 was 5");
    }

    //What is the meaning of A|A in the GT field?
    @Test
    void testDatalineParserWithWrongHQTypeAndInvalidGTField() {
        assertThrows(DataLineParserException.class,
                () -> datalineParser.parseDataline("20\t17330\t.\tT\tA\t3\tq10\tNS=3;DP=11;AF=0.017\tGT:GQ:DP:HQ\tA|A:A:A:A,A\t0|1:3:5:65,3\t0/0:41:3\n",1),
                "Field 'GQ' is of type Integer but contains an unparseable integer");
    }

    @Test
    void testDatalineParserWithConversionErrorInQualField() {
        assertThrows(DataLineParserException.class,
                () -> datalineParser.parseDataline("20\t1110696\trs6040355\tA\tG,T\tX\tPASS\tNS=2;DP=10;AF=0.333,0.667;AA=T;DB\tGT:GQ:DP:HQ:XI:XF:XS\t1|2:21:6:23,27:1:1:1\t2|1:2:0:18,2:1:1:1\t2/2:35:4:1:1:1",1),
                "Invalid character for Qual: X");
    }

    @Test
    void testDatalineParserWithLongInfoField() throws Exception {
        Dataline dataline = datalineParser.parseDataline("20\t14370\trs6054257\tG\tA\t29\tPASS\tNS=3;DP=14;CSQ=A|G|protein_coding|2/8||ENST00000419219.1:c.251A>G|ENSP00000404426.1:p.Asn84Ser|260;AF=0.5;DB;H2\tGT:GQ:DP:HQ\t0|0:48:1:51,51\t1|0:48:8:51,51\t1/1:43:5:.,.\n",1);
        assertEquals("20", dataline.getChrom());
        assertEquals(new Long(14370), dataline.getPos());
        assertEquals(Collections.singletonList("rs6054257"), dataline.getId());
        assertEquals("G", dataline.getRef());
        assertEquals(Collections.singletonList("A"), dataline.getAlt());
        assertEquals(new Double(29), dataline.getQual());
        assertEquals(new HashSet<String>(Collections.singletonList("PASS")), dataline.getFilter());

        assertEquals(6, dataline.getInfo().size());
        assertEquals(Collections.singletonList("3"), dataline.getInfo().get("NS").getValues());
        assertEquals(Collections.singletonList("14"), dataline.getInfo().get("DP").getValues());
        assertEquals(Collections.singletonList("A|G|protein_coding|2/8||ENST00000419219.1:c.251A>G|ENSP00000404426.1:p.Asn84Ser|260"), dataline.getInfo().get("CSQ").getValues());
        assertEquals(Collections.singletonList("0.5"), dataline.getInfo().get("AF").getValues());
        assertEquals(new ArrayList<String>(), dataline.getInfo().get("DB").getValues());
        assertEquals(new ArrayList<String>(), dataline.getInfo().get("H2").getValues());

        assertEquals("GT", dataline.getFormatField(0));
        assertEquals("GQ", dataline.getFormatField(1));
        assertEquals("DP", dataline.getFormatField(2));
        assertEquals("HQ", dataline.getFormatField(3));
        assertEquals(4, dataline.getFormat().size());

        Integer GT = dataline.getFormat().get("GT");
        Integer GQ = dataline.getFormat().get("GQ");
        Integer DP = dataline.getFormat().get("DP");
        Integer HQ = dataline.getFormat().get("HQ");

        assertEquals(new Integer(0), GT);
        assertEquals(new Integer(1), GQ);
        assertEquals(new Integer(2), DP);
        assertEquals(new Integer(3), HQ);

        // Read Samples
        assertEquals(3, dataline.getSamples().size());
        List<List<String>> sample0 = dataline.getSample(0);
        List<List<String>> sample1 = dataline.getSample(1);
        List<List<String>> sample2 = dataline.getSample(2);
        assertEquals(4, sample0.size());

        assertEquals(Collections.singletonList("0|0"), sample0.get(GT));
        assertEquals(Collections.singletonList("48"), sample0.get(GQ));
        assertEquals(Collections.singletonList("1"), sample0.get(DP));
        assertEquals(Arrays.asList("51", "51"), sample0.get(HQ));
        assertEquals(4, sample1.size());
        assertEquals(Collections.singletonList("1|0"), sample1.get(GT));
        assertEquals(Collections.singletonList("48"), sample1.get(GQ));
        assertEquals(Collections.singletonList("8"), sample1.get(DP));
        assertEquals(Arrays.asList("51", "51"), sample1.get(HQ));
        assertEquals(4, sample2.size());
        assertEquals(Collections.singletonList("1/1"), sample2.get(GT));
        assertEquals(Collections.singletonList("43"), sample2.get(GQ));
        assertEquals(Collections.singletonList("5"), sample2.get(DP));
        assertEquals(Arrays.asList(".", "."), sample2.get(HQ));

    }


    @Test
    void testDatalineParserWithLongInfoFieldAndQuotedValues() throws Exception {
        Dataline dataline = datalineParser.parseDataline("20\t\"14370\"\t\"rs6054257\"\t\"G\"\tA\t29\t\"PASS\"\tNS=3;\"DP\"=14;\"CSQ\"=\"A|G|protein_coding|2/8||ENST00000419219.1:c.251A>G|ENSP00000404426.1:p.Asn84Ser|260\";AF=\"0.5\";DB;H2\tGT:GQ:DP:HQ\t\"0|0\":48:1:51,51\t1|0:48:8:51,51\t1/1:43:5:.,.\n",1);
        assertEquals("20", dataline.getChrom());
        assertEquals(new Long(14370), dataline.getPos());
        assertEquals(Collections.singletonList("rs6054257"), dataline.getId());
        assertEquals("G", dataline.getRef());
        assertEquals(Collections.singletonList("A"), dataline.getAlt());
        assertEquals(new Double(29), dataline.getQual());
        assertEquals(new HashSet<String>(Collections.singletonList("PASS")), dataline.getFilter());

        assertEquals(6, dataline.getInfo().size());
        assertEquals(Collections.singletonList("3"), dataline.getInfo().get("NS").getValues());
        assertEquals(Collections.singletonList("14"), dataline.getInfo().get("DP").getValues());
        assertEquals(Collections.singletonList("A|G|protein_coding|2/8||ENST00000419219.1:c.251A>G|ENSP00000404426.1:p.Asn84Ser|260"), dataline.getInfo().get("CSQ").getValues());
        assertEquals(Collections.singletonList("0.5"), dataline.getInfo().get("AF").getValues());
        assertEquals(new ArrayList<String>(), dataline.getInfo().get("DB").getValues());
        assertEquals(new ArrayList<String>(), dataline.getInfo().get("H2").getValues());

        assertEquals("GT", dataline.getFormatField(0));
        assertEquals("GQ", dataline.getFormatField(1));
        assertEquals("DP", dataline.getFormatField(2));
        assertEquals("HQ", dataline.getFormatField(3));
        assertEquals(4, dataline.getFormat().size());

        Integer GT = dataline.getFormat().get("GT");
        Integer GQ = dataline.getFormat().get("GQ");
        Integer DP = dataline.getFormat().get("DP");
        Integer HQ = dataline.getFormat().get("HQ");

        assertEquals(new Integer(0), GT);
        assertEquals(new Integer(1), GQ);
        assertEquals(new Integer(2), DP);
        assertEquals(new Integer(3), HQ);

        // Read Samples
        assertEquals(3, dataline.getSamples().size());
        List<List<String>> sample0 = dataline.getSample(0);
        List<List<String>> sample1 = dataline.getSample(1);
        List<List<String>> sample2 = dataline.getSample(2);
        assertEquals(4, sample0.size());

        assertEquals(Collections.singletonList("0|0"), sample0.get(GT));
        assertEquals(Collections.singletonList("48"), sample0.get(GQ));
        assertEquals(Collections.singletonList("1"), sample0.get(DP));
        assertEquals(Arrays.asList("51", "51"), sample0.get(HQ));
        assertEquals(4, sample1.size());
        assertEquals(Collections.singletonList("1|0"), sample1.get(GT));
        assertEquals(Collections.singletonList("48"), sample1.get(GQ));
        assertEquals(Collections.singletonList("8"), sample1.get(DP));
        assertEquals(Arrays.asList("51", "51"), sample1.get(HQ));
        assertEquals(4, sample2.size());
        assertEquals(Collections.singletonList("1/1"), sample2.get(GT));
        assertEquals(Collections.singletonList("43"), sample2.get(GQ));
        assertEquals(Collections.singletonList("5"), sample2.get(DP));
        assertEquals(Arrays.asList(".", "."), sample2.get(HQ));

    }



/*


    @Test
    public void testDatalineParserWithValidDatalines() throws Exception {
        assertEquals("20	14370	rs6054257	G	A	29.0	PASS	NS=3;DP=14;AF=0.5;DB;H2	GT:GQ:DP:HQ	0|0:48:1:51,51	1|0:48:8:51,51	1/1:43:5:.,.",
                datalineParser.parseDatalineToVCFString("20\t14370\trs6054257\tG\tA\t29\tPASS\tNS=3;DP=14;AF=0.5;DB;H2\tGT:GQ:DP:HQ\t0|0:48:1:51,51\t1|0:48:8:51,51\t1/1:43:5:.,.\n"));
        assertEquals("20	17330	.	T	A	3.0	q10	NS=3;DP=11;AF=0.017;TMP=A|BallaBSEP&A&2	GT:GQ:DP:HQ	0|0:49:3:58,50	0|1:3:5:65,3	0/0:41:3",
                datalineParser.parseDatalineToVCFString("20\t17330\t.\tT\tA\t3\tq10\tNS=3;DP=11;AF=0.017;TMP=A|BallaBSEP&A&2\tGT:GQ:DP:HQ\t0|0:49:3:58,50\t0|1:3:5:65,3\t0/0:41:3\n"));
        assertEquals("20	1110696	rs6040355	A	G,T	67.0	PASS	NS=2;DP=10;AF=0.333,0.667;ABC=X|,G|G,|X;ZZZ=F,,D;AA=T;DB	GT:GQ:DP:HQ:XI:XF:XFlag:XS	1|2:21:6:23,27:1,2,3:1,2,3:XFlag,.,XFlag:1,2,3	2|1:2:0:18,2:1,2:1,2:.,.:1,2	2/2:35:4",
                datalineParser.parseDatalineToVCFString("20\t1110696\trs6040355\tA\tG,T\t67\tPASS\tNS=2;DP=10;AF=0.333,0.667;ABC=X|,G|G,|X;ZZZ=F,,D;AA=T;DB\tGT:GQ:DP:HQ:XI:XF:XFlag:XS\t1|2:21:6:23,27:1,2,3:1,2,3:XFlag,.,XFlag:1,2,3\t2|1:2:0:18,2:1,2:1,2:.,.:1,2\t2/2:35:4\n"));
    }
*/

}
