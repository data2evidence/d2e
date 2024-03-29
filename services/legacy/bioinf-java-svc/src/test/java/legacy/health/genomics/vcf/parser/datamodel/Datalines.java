package legacy.health.genomics.vcf.parser.datamodel;

import java.util.Arrays;
import java.util.Collections;

import legacy.health.genomics.vcf.parser.datamodel.Dataline;
import legacy.health.genomics.vcf.parser.datamodel.DatalineInfoField;

public class Datalines {

    final static Dataline DL_VariantAllelesTestRowZeroAlternatives =  (new Dataline()
            .setChrom("chr20")
            .setPos(14370l)
            .addIdField(".")
            .setRef(".")
            .addAltField(".")
            .setQual(null)
            .addFilterField(".")
            .addInfoField(new DatalineInfoField("NS",Collections.singletonList(".")))
            .addInfoField(new DatalineInfoField("AF", Arrays.asList("0.333")))
            .addInfoField(new DatalineInfoField("AF2", Arrays.asList("0.333",".")))
            .addInfoField(new DatalineInfoField("AF3", Arrays.asList("0.33","0.33","0.33")))
            .addFormatField("GT",0)
            .addFormatField("GQ",1)
            .addFormatField("DP",2)
            .addSample(Arrays.asList(
                    Arrays.asList("0|0",".","1"),
                    Arrays.asList(".","49","3"),
                    Arrays.asList(".")
            )));

    final static Dataline DL_VariantAllelesTestRowOneAlternatives =  (new Dataline()
            .setChrom("chr20")
            .setPos(14370l)
            .addIdField(".")
            .setRef(".")
            .addAltField("G")
            .setQual(null)
            .addFilterField(".")
            .addInfoField(new DatalineInfoField("NS",Collections.singletonList(".")))
            .addInfoField(new DatalineInfoField("AF", Arrays.asList("0.333")))
            .addInfoField(new DatalineInfoField("AF2", Arrays.asList("0.333",".")))
            .addInfoField(new DatalineInfoField("AF3", Arrays.asList("0.33","0.33","0.33")))
            .addFormatField("GT",0)
            .addFormatField("GQ",1)
            .addFormatField("DP",2)
            .addSample(Arrays.asList(
                    Arrays.asList("0|0",".","1"),
                    Arrays.asList(".","49","3"),
                    Arrays.asList(".")
            )));

    final static Dataline DL_VariantAllelesTestRowThreeAlternatives =  (new Dataline()
            .setChrom("chr20")
            .setPos(14370l)
            .addIdField(".")
            .setRef(".")
            .addAltField("G").addAltField("F").addAltField("X")
            .setQual(null)
            .addFilterField(".")
            .addInfoField(new DatalineInfoField("NS",Collections.singletonList(".")))
            .addInfoField(new DatalineInfoField("AF", Arrays.asList("0.333")))
            .addInfoField(new DatalineInfoField("AF2", Arrays.asList("0.333",".")))
            .addInfoField(new DatalineInfoField("AF3", Arrays.asList("0.33","0.33","0.33")))
            .addFormatField("GT",0)
            .addFormatField("GQ",1)
            .addFormatField("DP",2)
            .addSample(Arrays.asList(
                    Arrays.asList("0|0",".","1"),
                    Arrays.asList(".","49","3"),
                    Arrays.asList(".")
            )));

    final static Dataline DL_VariantAllelesTestRowTwoAlternatives =  (new Dataline()
            .setChrom("chr20")
            .setPos(14370l)
            .addIdField(".")
            .setRef("A")
            .addAltField("G").addAltField("T")
            .setQual(null)
            .addFilterField(".")
            .addInfoField(new DatalineInfoField("AF", Arrays.asList("0.333")))
            .addInfoField(new DatalineInfoField("AF2", Arrays.asList("0.333",".")))
            .addInfoField(new DatalineInfoField("AF3", Arrays.asList("0.33","0.33","0.33")))
            .addFormatField("GT",0)
            .addFormatField("GQ",1)
            .addFormatField("DP",2)
            .addSample(Arrays.asList(
                    Arrays.asList("0|0",".","1"),
                    Arrays.asList(".","49","3"),
                    Arrays.asList(".")
            )));

    final static Dataline DL_With_MissingIDQualAltInfoFormatValues_2_alt_2_id_2samples =  (new Dataline()
            .setChrom("chr20")
            .setPos(14370l)
            .addIdField(".")
            .setRef(".")
            .addAltField("G").addAltField(".")
            .setQual(null)
            .addFilterField(".")
            .addInfoField(new DatalineInfoField("NS",Collections.singletonList(".")))
            .addInfoField(new DatalineInfoField("AF", Arrays.asList("0.333",".")))
            .addFormatField("GT",0)
            .addFormatField("GQ",1)
            .addFormatField("DP",2)
            .addSample(Arrays.asList(
                    Arrays.asList("0|0",".","1"),
                    Arrays.asList(".","49","3"),
                    Arrays.asList(".")
            )));


    final static Dataline DL_With_MissingIDQualAltInfoFormatValues_2_alt_2_id_2samples_many_multivalue_info =  (new Dataline()
            .setChrom("chr20")
            .setPos(14370l)
            .addIdField(".")
            .setRef(".")
            .addAltField("G").addAltField(".")
            .setQual(null)
            .addFilterField(".")
            .addInfoField(new DatalineInfoField("NS",Collections.singletonList(".")))
            .addInfoField(new DatalineInfoField("AF", Arrays.asList("0.333",".")))
            .addInfoField(new DatalineInfoField("MV1", Arrays.asList("0.333")))
            .addInfoField(new DatalineInfoField("MV2", Arrays.asList("0.333",".")))
            .addInfoField(new DatalineInfoField("MV3", Arrays.asList("0.333",".","0.6")))
            .addInfoField(new DatalineInfoField("MV4", Arrays.asList("0.333",".",".","0.6")))
            .addInfoField(new DatalineInfoField("MV5", Arrays.asList(".")))
            .addInfoField(new DatalineInfoField("MV6", Arrays.asList(".","0.6")))
            .addInfoField(new DatalineInfoField("MV7", Arrays.asList(".",null,".")))
            .addInfoField(new DatalineInfoField("MV8", Arrays.asList("0.333","0.7","0.6","0.7","0.7","0.7","0.7","0.6")))
            .addFormatField("GT",0)
            .addFormatField("GQ",1)
            .addFormatField("DP",2)
            .addSample(Arrays.asList(
                    Arrays.asList("0|0",".","1"),
                    Arrays.asList(".","49","3"),
                    Arrays.asList(".")
            )));

    final static Dataline DL_With_Valid_Info_Valid_Format_2_alt_2_id_2samples= (new Dataline()
            .setChrom("chr20")
            .setPos(14370l)
            .addIdField("Id1").addIdField("Id2")
            .setRef("A")
            .addAltField("G").addAltField("T")
            .setQual(44d)
            .addFilterField("PASS").addFilterField("s50")
            .addInfoField(new DatalineInfoField("NS",Collections.singletonList("3")))
            .addInfoField(new DatalineInfoField("AF", Arrays.asList("0.333","0.667")))
            .addFormatField("GT",0)
            .addFormatField("GQ",1)
            .addFormatField("DP",2)
            .addSample(Arrays.asList(Arrays.asList("0|0"),Arrays.asList("48"),Arrays.asList("1")))
            .addSample(Arrays.asList(Arrays.asList("1/."),Arrays.asList("49"),Arrays.asList("3")))
            .addSample(Arrays.asList(Arrays.asList("."),Arrays.asList("49"),Arrays.asList("3")))
            );

    final static Dataline DL_GenotypesTest_id_3samples_1 = (new Dataline()
            .setChrom("chr20")
            .setPos(14370l)
            .addIdField("Id1")
            .setRef("A")
            .addAltField("G").addAltField("T")
            .setQual(44d)
            .addFilterField("PASS").addFilterField("s50")
            .addInfoField(new DatalineInfoField("NS",Collections.singletonList("3")))
            .addInfoField(new DatalineInfoField("AF", Arrays.asList("0.333","0.667")))
            .addFormatField("GT",0)
            .addFormatField("GQ",1)
            .addFormatField("DP",2)
            .addFormatField("SP",3)
            .addSample(Arrays.asList(Arrays.asList("0|0"),Arrays.asList("48"),Arrays.asList(".","."), Arrays.asList(".")))
            .addSample(Arrays.asList(Arrays.asList("1|0"),Arrays.asList("49"),Arrays.asList("23","3"), Arrays.asList(".")))
            .addSample(Arrays.asList(Arrays.asList("1/1"),Arrays.asList("50"),Arrays.asList("."), Arrays.asList("3")))
            .addSample(Arrays.asList(Arrays.asList("."),Arrays.asList("50"),Arrays.asList("23"), Arrays.asList("3"))));


    final static Dataline DL_GenotypesTest_id_3samples = (new Dataline()
            .setChrom("chr20")
            .setPos(14370l)
            .addIdField("Id1")
            .setRef("A")
            .addAltField("G").addAltField("T")
            .setQual(44d)
            .addFilterField("PASS").addFilterField("s50")
            .addInfoField(new DatalineInfoField("NS",Collections.singletonList("3")))
            .addInfoField(new DatalineInfoField("AF", Arrays.asList("0.333","0.667")))
            .addFormatField("GT",0)
            .addFormatField("GQ",1)
            .addFormatField("DP",2)
            .addFormatField("SP",3)
            .addSample(Arrays.asList(Arrays.asList("0|0"),Arrays.asList("48"),Arrays.asList(".","."), Arrays.asList(".")))
            .addSample(Arrays.asList(Arrays.asList("1|0"),Arrays.asList("49"),Arrays.asList("23","3"), Arrays.asList("2","1")))
            .addSample(Arrays.asList(Arrays.asList("1/1"),Arrays.asList("50"),Arrays.asList("."), Arrays.asList("3","2","1")))
            .addSample(Arrays.asList(Arrays.asList("."),Arrays.asList("50"),Arrays.asList("23"), Arrays.asList("3"))));

    final static Dataline DL_GenotypesTest_id_3samplesTest2 = (new Dataline()
            .setChrom("chr20")
            .setPos(14370l)
            .addIdField("Id1")
            .setRef("A")
            .addAltField("G").addAltField("T")
            .setQual(44d)
            .addFilterField("PASS").addFilterField("s50")
            .addInfoField(new DatalineInfoField("NS",Collections.singletonList("3")))
            .addInfoField(new DatalineInfoField("AF", Arrays.asList("0.333","0.667")))
            .addFormatField("GT2",0)
            .addFormatField("GQ",1)
            .addFormatField("DP",2)
            .addFormatField("SP",3)
            .addFormatField("GP1",4)
            .addSample(Arrays.asList(Arrays.asList("0","0"),Arrays.asList("48"),Arrays.asList(".","."), Arrays.asList("."),Arrays.asList(".")))
            .addSample(Arrays.asList(Arrays.asList("1","0"),Arrays.asList("49","60"),Arrays.asList("23","3"), Arrays.asList("2","1"),Arrays.asList(".","1")))
            .addSample(Arrays.asList(Arrays.asList("1","1"),Arrays.asList("."),Arrays.asList("."), Arrays.asList("3","2","1"),Arrays.asList("1","2","3")))
            .addSample(Arrays.asList(Arrays.asList("."),Arrays.asList("50"),Arrays.asList("23"), Arrays.asList("3"))));

    final static Dataline DL_GenotypesTest_id_3missingGT= (new Dataline()
            .setChrom("chr20")
            .setPos(14370l)
            .addIdField("Id1")
            .setRef("A")
            .addAltField("G").addAltField("T")
            .setQual(44d)
            .addFilterField("PASS").addFilterField("s50")
            .addInfoField(new DatalineInfoField("NS",Collections.singletonList("3")))
            .addInfoField(new DatalineInfoField("AF", Arrays.asList("0.333","0.667")))
            .addFormatField("GQ",1)
            .addSample(Arrays.asList(Arrays.asList("48")))
            .addSample(Arrays.asList(Arrays.asList("49")))
            .addSample(Arrays.asList(Arrays.asList("50"))));


    final static Dataline DL_GenotypeAlleleTestWrongCounts= (new Dataline()
            .setChrom("chr20")
            .setPos(14370l)
            .addIdField("Id1")
            .setRef("A")
            .addAltField("G").addAltField("T")
            .setQual(44d)
            .addFilterField("PASS").addFilterField("s50")
            .addInfoField(new DatalineInfoField("NS",Collections.singletonList("3")))
            .addFormatField("GQ",0)
            .addFormatField("GQ1",1)
            .addSample(Arrays.asList(Arrays.asList("48","22","222","22","22","22"))));
}
