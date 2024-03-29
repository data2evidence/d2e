package legacy.health.genomics.vcf.parser.utils;

import legacy.health.genomics.vcf.parser.datamodel.EPrimitiveType;
import legacy.health.genomics.vcf.parser.exceptions.DatalineParseException;

import java.util.List;

public class StringUtils {

    public static String escapeQuoteAndBackslash(String toEscape) {
        return toEscape.replace("\"", "\\\"").replace("\\", "\\\\");
    }

    @SuppressWarnings("ResultOfMethodCallIgnored")
    public static void verifyType(String key, EPrimitiveType type, List<String> infoValues) throws DatalineParseException {
        switch (type) {
            case Integer:
                for (String infoValue : infoValues) {
                    try {
                        if (infoValue.equals(".") || infoValue.isEmpty()) {
                            continue;
                        }
                        Integer.parseInt(infoValue);
                    } catch (NumberFormatException nfe) {
                        throw new DatalineParseException("Field '" + key + "' is of type Integer but contains an unparseable integer");
                    }
                }
                break;
            case Float:
                for (String infoValue : infoValues) {
                    try {
                        if (infoValue.equals(".") || infoValue.isEmpty()) {
                            continue;
                        }
                        Double.parseDouble(infoValue);
                    } catch (NumberFormatException nfe) {
                        throw new DatalineParseException("Field '" + key + "' is of type Float but contains an unparseable float");
                    }
                }
                break;
            case Flag:
                if (!infoValues.isEmpty()) {
                    throw new DatalineParseException("Field '" + key + "' is of type Flag but contains values");
                }
                break;
            case Character:
                for (String infoValue : infoValues) {
                    if (infoValue.length() > 1) {
                        throw new DatalineParseException("Field '" + key + "' is of type Character but isn't a single character");
                    }
                }
                break;
            case String:
            default:
                break;

        }


    }

	public static StringBuilder removeQuoting(StringBuilder value) {
		if (value.length() > 0) {
			if (value.charAt(value.length() - 1) == '"') {
				value.deleteCharAt(value.length() - 1);
			}
			if (value.charAt(0) == '"') {
				value.deleteCharAt(0);
			}
		}
		return value;
	}
}