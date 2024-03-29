package legacy.health.genomics.vcf.parser.datamodel;

import legacy.health.genomics.vcf.parser.exceptions.DatalineParseException;
import legacy.health.genomics.vcf.parser.utils.StringUtils;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;

public class InfoField extends  VCFDataField{
    private String id;
    private String number;
    private EPrimitiveType type;
    private String description;
    private String source; //Recommended
    private String version; //Recommended
    public enum Number{
        A,R,G
    }

    private InfoField() {

    }



    public static InfoField getFromValueMapInfo(Map<String,String> valueMap) {
        InfoField field = new InfoField();
        field.setId(valueMap.get("id"));
        field.setAlias(valueMap.get("id"));
        String numberTypeString = valueMap.get("number");

        switch (numberTypeString.toLowerCase(Locale.ENGLISH)){

            case "a" :
                field.setNumber(InfoField.Number.A.name());
                break;
            case "r" :
                field.setNumber(InfoField.Number.R.name());
                break;
            case "g" :
                field.setNumber(InfoField.Number.G.name());
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
                case "flag":
                    field.setType(EPrimitiveType.Flag);
                    break;
                case "character":
                    field.setType(EPrimitiveType.Character);
                    break;
                case "string":
                    field.setType(EPrimitiveType.String);
                    break;
                default:
                    throw new UnsupportedOperationException("Unknown type in Info field" + typeString); //TODO: improve error reporting: Prevent Log forging via Typestring, add additional information about the error location, do throw an own exception class
            }
        field.setDescription(valueMap.get("description"));
        field.setSource(valueMap.get("source"));
        field.setVersion(valueMap.get("version"));

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

    public String getSource() {
        return source;
    }

    private void setSource(String source) {
        this.source = source;
    }

    public String getVersion() {
        return version;
    }

    private void setVersion(String version) {
        this.version = version;
    }

    public void verifyValues(List<String> values, int alleleCount) throws DatalineParseException {
        StringUtils.verifyType(this.getId(),this.getType(),values);
        if(Objects.equals(getNumber(), Number.A.name()))
        {
            if(values.size() != alleleCount)
            {
                throw new DatalineParseException("Invalid count for Info element "+getId()+" expected A=" + alleleCount + " was "+ values.size());
            }
        } else if (Objects.equals(getNumber(), Number.R.name())) {
            if(values.size() != alleleCount+1)
            {
                throw new DatalineParseException("Invalid count for Info element "+getId()+"expected R=" + alleleCount+1 + " was "+ values.size());
            }
        }else {
            if(!getNumber().equals(".") && !getNumber().equals("G") &&  Integer.parseInt(getNumber()) != values.size())
            {
                throw new DatalineParseException("Invalid count for Info element "+getId()+" expected " + getNumber() + " was "+ values.size());
            }
        }
    }

}
