package legacy.health.genomics.vcf.parser.datamodel;

import legacy.health.genomics.vcf.parser.exceptions.DatalineParseException;
import legacy.health.genomics.vcf.parser.utils.StringUtils;

import java.util.ArrayList;
import java.util.Locale;
import java.util.Map;

public class FormatField extends VCFDataField{
    private String id;
    private String number;
    private EPrimitiveType type;
    private String description;

    private FormatField() {
    }


    public void verifyValues(ArrayList<String> sampleValues, int numberOfAlternatives, String genotypeString) throws DatalineParseException {
        switch (getNumber()) {
            case "A":
                if(!(numberOfAlternatives == sampleValues.size() || (sampleValues.size()==1) && sampleValues.get(0).equals("."))){
                    throw new DatalineParseException("Sample-field '" + getId() + "' does not match the number of values in the meta-information. Expected: A="+numberOfAlternatives + " Got: "+sampleValues.size());
                }
                break;
            case "R":
                if(!(numberOfAlternatives+1 == sampleValues.size() || (sampleValues.size()==1) && sampleValues.get(0).equals("."))){
                    throw new DatalineParseException("Sample-field '" + getId() + "' does not match the number of values in the meta-information. Expected: R="+numberOfAlternatives+1 + " Got: "+sampleValues.size());
                }
                break;
            case "G":
            case ".":
                break;
            default:
                try {
                    if (!(Integer.parseInt(getNumber()) == sampleValues.size())) {
                        throw new DatalineParseException("Sample-field '" + getId() + "' does not match the number of values in the meta-information. Expected: X="+getNumber() + " Got: "+sampleValues.size());
                    }
                } catch (NumberFormatException e) {
                    throw new DatalineParseException((e.getMessage()));
                }
                break;

        }
        StringUtils.verifyType(getId(),getType(),sampleValues);
    }

    public enum Number{
        A,R,G
    }


    public static FormatField getFromValueMapFormat(Map<String,String> valueMap) {

        FormatField field = new FormatField();
        field.setId(valueMap.get("id"));
        field.setAlias(valueMap.get("id"));

        String numberTypeString = valueMap.get("number");

        switch (numberTypeString.toLowerCase(Locale.ENGLISH)){

            case "a" :
                field.setNumber(FormatField.Number.A.name());
                break;
            case "r" :
                field.setNumber(FormatField.Number.R.name());
                break;
            case "g" :
                field.setNumber(FormatField.Number.G.name());
                break;
            case "." :
                field.setNumber(numberTypeString);
                break;
            default:
                boolean isNumeric = numberTypeString.chars().allMatch( Character::isDigit );
                if (!isNumeric) {
                    throw new IllegalStateException("Unknown number value " + numberTypeString.toLowerCase(Locale.ENGLISH));
                } else {
                    field.setNumber(numberTypeString);
                }
        }

        String typeString = valueMap.get("type");
        switch(typeString.toLowerCase(Locale.ENGLISH)) {
            case "integer" :
                field.setType(EPrimitiveType.Integer);
                break;
            case "float":
                field.setType(EPrimitiveType.Float);
                break;
            case "character":
                field.setType(EPrimitiveType.Character);
                break;
            case "string":
                field.setType(EPrimitiveType.String);
                break;
            default:
                throw new IllegalStateException("Unknown enumeration value " + typeString.toLowerCase(Locale.ENGLISH));
        }
        field.setDescription(valueMap.get("description"));

        return field;
    }

    public String getId() {
        return id;
    }

    private void setId(String id) {
        this.id = id;
    }

    public String getNumber() {
        return number;
    }

    private void setNumber(String number) {
        this.number = number;
    }

    public EPrimitiveType getType() {
        return type;
    }

    private void setType(EPrimitiveType type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    private void setDescription(String description) {
        this.description = description;
    }
}
