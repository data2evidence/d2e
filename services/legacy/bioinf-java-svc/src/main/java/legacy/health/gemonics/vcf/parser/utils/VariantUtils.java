package legacy.health.genomics.vcf.parser.utils;

import java.util.LinkedList;
import java.util.List;

/**
 * Created by D058991 on 24.02.2018.
 */
public class VariantUtils {

    public static int inferChromosomeIndex(String chromInput) throws Exception {
        String chrom = chromInput.trim();
        if (chrom.chars().allMatch( Character::isDigit )) {
            return Integer.parseInt(chrom) - 1;
        }
        else if(chrom.equals("X")) {
            return 22;
        }
        else if(chrom.equals("Y")) {
            return 23;
        }
        else if(chrom.contains("chromosome")) {
            chrom = chrom.replace("chromosome","").trim();
            if (chrom.chars().allMatch( Character::isDigit )) {
                return Integer.parseInt(chrom) - 1;
            }
        }
        else if(chrom.contains("chr")) {
            chrom = chrom.replace("chr","").trim();
            if (chrom.chars().allMatch( Character::isDigit )) {
                return Integer.parseInt(chrom) - 1;
            }
        }
        throw new Exception("Unable to map Chromosome "+ chrom + " to a chrom index");
    }

    public static List<Integer> parseGTField(String gtValue) {
        List<Integer> ret = new LinkedList<>();
        int start = 0;
        for(int cur = 0; cur < gtValue.length(); ++cur) {
            char curChar = gtValue.charAt(cur);
            if("/|".indexOf(curChar)!=-1){
                if (gtValue.charAt(cur-1)=='.') {
                    ret.add(-1);
                } else {
                    ret.add(Integer.parseInt(gtValue.substring(start, cur)));
                }
                start = cur+1;
            }
        }
        if(start < gtValue.length()) {
            if (gtValue.charAt(start)=='.') {
                ret.add(-1);
            } else {
                ret.add(Integer.parseInt(gtValue.substring(start, gtValue.length())));
            }
        }

        return ret;
    }
}
