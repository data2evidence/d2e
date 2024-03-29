package legacy.health.genomics.vcf.parser.inputmodels;

import legacy.health.genomics.vcf.parser.datamodel.*;
import legacy.health.genomics.vcf.parser.exceptions.DataLineParserException;
import legacy.health.genomics.vcf.parser.exceptions.DatalineParseException;
import legacy.health.genomics.vcf.parser.utils.StringUtils;

import java.util.ArrayList;
import java.util.BitSet;
import java.util.List;

public class DataParserStateMachine implements IDataParser {
    private final VCFStructureDefinition vcfFormatDefinition;


    private final BitSet forbidden_chrom_chars = buildBitSet( ": ");
    private final BitSet forbidden_id_chars = buildBitSet( "; ");

    private BitSet buildBitSet(String matchString) {
        final BitSet bs = new BitSet();
        for (int i = 0; i < matchString.length(); i++)
            bs.set(matchString.charAt(i));
        return bs;
    }

    public DataParserStateMachine(VCFStructureDefinition def) {
        this.vcfFormatDefinition = def;
    }
    public enum DatalineParsingState {
        START,
        CHROM,
        POS,
        ID,
        ID_SEPARATOR,
        REF,
        ALT,
        ALT_SEPARATOR,
        QUAL,
        FILTER,
        FILTER_SEPARATOR,
        INFO_KEY,
        INFO_VALUE,
        INFO_VALUE_SEPARATOR,
        INFO_SEPARATOR,
        FORMAT,
        FORMAT_SEPARATOR,
        SAMPLE,
        SAMPLE_VALUE,
        SAMPLE_VALUE_SEPARATOR,
        SAMPLE_VALUES_SEPARATOR,
        SAMPLE_SEPARATOR,
        FINISHED,
        QUOTED, //TODO
        INVALID
    }


    private void addInfoField(String key, List<String> infoValues, Dataline dataline) throws DatalineParseException {
        InfoField infoField = vcfFormatDefinition.getInfoField(key);
        if(infoField == null) {
            return;
        }
        infoField.verifyValues(infoValues,dataline.getAlt().size());
        dataline.addInfoField(new DatalineInfoField(key, infoValues));
    }

    private void addSampleField(int sampleValueIndex, ArrayList<String> sampleValues, List<List<String>> sample, Dataline dataline) throws DatalineParseException //sample menge von samplevalues. i.e pars wzischen :
    {
        FormatField formatField = vcfFormatDefinition.getFormatField(dataline.getFormatField(sampleValueIndex));
        if(formatField == null) {
            return;
        }
        if(dataline.getFormat().containsKey("GT")) {
            int GT = dataline.getGTIdx();
            formatField.verifyValues(sampleValues, dataline.getAlt().size(), sampleValues.get(GT));
        }
        sample.add(sampleValues);
    }

    static class ParseState{
        DatalineParsingState currentState = DatalineParsingState.START;
        DatalineParsingState previousState = DatalineParsingState.START;
        final String line;
        String errorMsg;
        int index;
        ParseState(String line) {
            this.line= line;
            this.index = 0;
           //     System.out.println("New Line " + line);
        }
        void switchState(DatalineParsingState newState, String errorMessage) {
            //String label = "\"";
            if(errorMessage != null){
              //  label += errorMessage + " :";
                errorMsg = errorMessage;
            }
           // label +="Line["+index+"]='"+line.charAt(index)+"'\"";
           //System.out.println(currentState.name() +" -> " + newState +" [ label="+label +"]"); */
            this.previousState = this.currentState;
            this.currentState = newState;
        }
        void switchState(DatalineParsingState newState) {
            this.switchState(newState, null);
        }

    }

    @Override
    public Dataline parseDataline(String input, int line) throws DataLineParserException {
        StringBuilder key = new StringBuilder();
        StringBuilder value = new StringBuilder();
        Integer formatFieldIndex = 0;
        int sampleValuesIndex = 0;
        ArrayList<String> infoValues = new ArrayList<>();
        List<List<String>> sample = new ArrayList<>();
        ArrayList<String> sampleValues = new ArrayList<>();
        Dataline dataline = new Dataline();
        dataline.setSourceLine(line);
        ParseState parseState = new ParseState(input);
        for (; parseState.index < input.length(); parseState.index++) {
            char currentCharacter = input.charAt(parseState.index);
            switch (parseState.currentState) {
                case START:
                    if (currentCharacter == ' ' || currentCharacter == '\t') {
                        continue; // skip leading whitespaces
                    } else if (Character.isLetterOrDigit(currentCharacter) || currentCharacter == '.') {
                        value.setLength(0);
                        value.append(currentCharacter);
                        parseState.switchState(DatalineParsingState.CHROM);
                    }
                    else {
                        parseState.switchState(DatalineParsingState.INVALID);
                    }
                    break;
                case CHROM:
                    if (currentCharacter == '\t') {
                        dataline.setChrom(value.toString());
                        value.setLength(0);
                        parseState.switchState(DatalineParsingState.POS);
                    }else if (forbidden_chrom_chars.get(currentCharacter)) {
                        parseState.switchState(DatalineParsingState.INVALID);
                        continue; //stay in Chrom state
                    }
                    else {
                        value.append(currentCharacter);
                        continue;
                    }
                    break;
                case POS:
                    if (Character.isDigit(currentCharacter) || currentCharacter == '.' ||  currentCharacter == '"') {
                        value.append(currentCharacter);
                        continue;
                    }
                    else if (currentCharacter == '\t') {
                        if (value.length() > 0) {
                        	StringUtils.removeQuoting(value);
                        	if(value.charAt(value.length()-1) == '"') {
                                value.deleteCharAt(value.length() - 1);
                            }
                            if (value.toString().equals(".")) {
                                dataline.setPos(null);
                            }
                            else {
                                try {
                                    dataline.setPos(Long.parseLong(value.toString()));
                                }
                                catch (Exception e) {
                                    throw new DataLineParserException("Error reading position", line, parseState.index,e);
                                }
                            }
                        }
                        
                        value.setLength(0);
                        parseState.switchState(DatalineParsingState.ID);
                    }
                    else {
                        parseState.switchState(DatalineParsingState.INVALID);
                    }
                    break;
                case ID:
                    if (currentCharacter == ';') {
                        dataline.addIdField(StringUtils.removeQuoting(value).toString());
                        value.setLength(0);
                        parseState.switchState(DatalineParsingState.ID_SEPARATOR);
                    }else if (forbidden_id_chars.get(currentCharacter))
                    {
                        parseState.switchState(DatalineParsingState.INVALID);
                        continue;
                    }
                    else if (currentCharacter == '\t') {
                        dataline.addIdField(StringUtils.removeQuoting(value).toString());
                        value.setLength(0);
                        parseState.switchState(DatalineParsingState.REF);
                    }
                    else {
                        value.append(currentCharacter);
                        continue;
                    }
                    break;
                case ID_SEPARATOR:
                    if (Character.isLetterOrDigit(currentCharacter) || currentCharacter == '.') {
                        value.setLength(0);
                        value.append(currentCharacter);
                        parseState.switchState(DatalineParsingState.ID);
                    }
                    else if (currentCharacter == '\t') {
                        parseState.switchState(DatalineParsingState.REF);
                    }
                    //In case of repeated separators
                    else if (currentCharacter == ';') {
                        continue;
                    }
                    else {
                        parseState.switchState(DatalineParsingState.INVALID);
                    }
                    break;
                case REF:
                    if (Character.isLetter(currentCharacter) || currentCharacter == '.' || currentCharacter == '"') {
                        value.append(currentCharacter);
                    }
                    else if (currentCharacter == '\t') {
                        StringUtils.removeQuoting(value);
                        dataline.setRef(value.toString());
                        value.setLength(0);
                        parseState.switchState(DatalineParsingState.ALT);
                    }
                    else {
                        parseState.switchState(DatalineParsingState.INVALID);
                    }
                    break;
                case ALT:
                    if (currentCharacter == ',') {
                        dataline.addAltField(value.toString());
                        value.setLength(0);
                        parseState.switchState(DatalineParsingState.ALT_SEPARATOR);
                    }
                    else if (currentCharacter == '\t') {
                        dataline.addAltField(value.toString());
                        value.setLength(0);
                        parseState.switchState(DatalineParsingState.QUAL);
                    }
                    //TODO: Could be more specific and check that each character is one of A, C, G, T, N (case insensitive)
                    //TODO: What about complex rearrangements with breakends?
                    else{
                        value.append(currentCharacter);
                    }
                    break;
                case ALT_SEPARATOR:
                    if (currentCharacter == '\t') {
                        parseState.switchState(DatalineParsingState.QUAL);
                    }
                    //In case of repeated separators
                    else if (currentCharacter == ',') {
                        continue;
                    }
                    else {
                        value.append(currentCharacter);
                        parseState.switchState(DatalineParsingState.ALT);
                    }
                    break;
                case QUAL:
                    if (Character.isDigit(currentCharacter) || currentCharacter == '.') {
                        value.append(currentCharacter);
                    }
                    else if (currentCharacter == '\t') {
                        if (value.toString().equals(".")) {
                            dataline.setQual(null);
                        }
                        else {
                            try {
                                dataline.setQual(Double.parseDouble(value.toString()));
                            }
                            catch (Exception e) {
                                throw new DataLineParserException("Error reading quality", line, parseState.index,e);
                            }
                        }
                        value.setLength(0);
                        parseState.switchState(DatalineParsingState.FILTER);
                    }
                    else {
                        parseState.switchState(DatalineParsingState.INVALID, "Invalid character for Qual: "+ currentCharacter);
                    }
                    break;
                case FILTER:
                    if (currentCharacter == ';') {
                        dataline.addFilterField(StringUtils.removeQuoting(value).toString());
                        value.setLength(0);
                        parseState.switchState(DatalineParsingState.FILTER_SEPARATOR);
                    }
                    else if (currentCharacter == '\t') {
                        dataline.addFilterField(StringUtils.removeQuoting(value).toString());
                        value.setLength(0);
                        key.setLength(0);
                        parseState.switchState(DatalineParsingState.INFO_KEY);
                    }
                    else if (currentCharacter == ' ') {
                        parseState.switchState(DatalineParsingState.INVALID, "Unexpected Non Tab Whitespace");
                    } else {
                        value.append(currentCharacter);
                    }
                    break;
                case FILTER_SEPARATOR:
                    if (currentCharacter == '\t') {
                        parseState.switchState(DatalineParsingState.INFO_KEY);
                    }
                    else if (currentCharacter == ';') {
                        parseState.switchState(DatalineParsingState.FILTER_SEPARATOR);
                    }
                    else {
                        value.append(currentCharacter);
                        parseState.switchState(DatalineParsingState.FILTER);
                    }
                    break;
                case INFO_KEY:
                    if (currentCharacter == ';') {
                        try {
                            verifyInfoFieldNumberIsZero(key.toString(), dataline);
                        } catch (DatalineParseException e) {
                            throw new DataLineParserException("Error Info Key", line, parseState.index,e);
                        }
                        key.setLength(0);
                        parseState.switchState(DatalineParsingState.INFO_SEPARATOR);
                    }
                    else if (currentCharacter == '=') {
                        parseState.switchState(DatalineParsingState.INFO_VALUE);
                    }
                    else if (currentCharacter == '\t') {
                        if(!key.toString().equals(".")) {
                            dataline.addInfoField(new DatalineInfoField(StringUtils.removeQuoting(key).toString(), null));
                        }
                        key.setLength(0);
                        parseState.switchState(DatalineParsingState.FORMAT);
                    }
                    else {
                        key.append(currentCharacter);
                        continue;
                    }
                    break;
                case INFO_VALUE:
                    if (currentCharacter == ',') {
                        infoValues.add(StringUtils.removeQuoting(value).toString());
                        value.setLength(0);
                        parseState.switchState(DatalineParsingState.INFO_VALUE_SEPARATOR);
                    }
                    else if (currentCharacter == ';') {
                        infoValues.add(StringUtils.removeQuoting(value).toString());
                        try {
                            addInfoField(StringUtils.removeQuoting(key).toString(), infoValues, dataline);
                        } catch (DatalineParseException e) {
                            throw new DataLineParserException("Error Info Key", line, parseState.index,e);
                        }
                        key.setLength(0);
                        value.setLength(0);
                        infoValues = new ArrayList<>();
                        parseState.switchState(DatalineParsingState.INFO_SEPARATOR);
                    }
                    else if (currentCharacter == '\t') {
                        infoValues.add(StringUtils.removeQuoting(value).toString());
                        dataline.addInfoField(new DatalineInfoField(StringUtils.removeQuoting(key).toString(), infoValues));
                        key.setLength(0);
                        value.setLength(0);
                        infoValues = new ArrayList<>();
                        parseState.switchState(DatalineParsingState.FORMAT);
                    }
                    else {
                        value.append(currentCharacter);
                    }
                    break;
                case INFO_VALUE_SEPARATOR:
                    //TODO: I don't think multiple commas adjacent to each other are handled correctly
                    if (Character.isLetterOrDigit(currentCharacter) || ".|/()&_:<>-+?! ".indexOf(currentCharacter)!=-1) {
                        value.append(currentCharacter);
                        parseState.switchState(DatalineParsingState.INFO_VALUE);
                    }
                    else {
                        parseState.switchState(DatalineParsingState.INVALID);
                    }
                    break;
                case INFO_SEPARATOR:
                    if (Character.isLetterOrDigit(currentCharacter) || currentCharacter == '.' ||currentCharacter == '"') {
                        key.append(currentCharacter);
                        parseState.switchState(DatalineParsingState.INFO_KEY);
                    }
                    else if (currentCharacter == '\t') {
                        parseState.switchState(DatalineParsingState.FORMAT);
                         }
                    else if (currentCharacter == ';') {
                        continue;
                    }
                    else {
                        parseState.switchState(DatalineParsingState.INVALID);
                    }
                    break;
                case FORMAT:
                    if (currentCharacter == ':') {
                        dataline.addFormatField(value.toString(), formatFieldIndex++);
                        value.setLength(0);
                        parseState.switchState(DatalineParsingState.FORMAT_SEPARATOR);
                    }
                    else if (currentCharacter == '\t') {
                        dataline.addFormatField(value.toString(), formatFieldIndex++);
                        value.setLength(0);
                        sample = new ArrayList<>();
                        parseState.switchState(DatalineParsingState.SAMPLE);
                    }else
                    {
                        value.append(currentCharacter);
                    }
                    break;
                case FORMAT_SEPARATOR:
                    if (Character.isLetterOrDigit(currentCharacter) || currentCharacter == '.') {
                        value.append(currentCharacter);
                        parseState.switchState(DatalineParsingState.FORMAT);
                    }
                    else if (currentCharacter == '\t') {
                        parseState.switchState(DatalineParsingState.SAMPLE);
                    }
                    else if (currentCharacter == ':') {
                        continue;
                    }
                    else {
                        parseState.switchState(DatalineParsingState.INVALID);
                    }
                    break;
                case SAMPLE:
                    if (Character.isLetterOrDigit(currentCharacter) || "./|\"".indexOf(currentCharacter) != -1) {
                        value.append(currentCharacter);
                        parseState.switchState(DatalineParsingState.SAMPLE_VALUE);
                    }
                    else {
                        parseState.switchState(DatalineParsingState.INVALID);
                    }
                    break;
                case SAMPLE_VALUE:
                    if (Character.isLetterOrDigit(currentCharacter) || "./|\"".indexOf(currentCharacter) != -1) {
                        value.append(currentCharacter);
                    }
                    else if (currentCharacter == ',') {
                        sampleValues.add(StringUtils.removeQuoting(value).toString());
                        value.setLength(0);
                        parseState.switchState(DatalineParsingState.SAMPLE_VALUE_SEPARATOR);
                    }
                    else if (currentCharacter == ':') {
                        if (value.length() > 0) {//TODO it is assume the order of the header data is relevant, but we should use the order as defined in the datarow
                            sampleValues.add(StringUtils.removeQuoting(value).toString());
                        }
                        if (!sampleValues.isEmpty()) {
                            try {
                                addSampleField(sampleValuesIndex, sampleValues, sample, dataline);
                            } catch (DatalineParseException e) {
                                System.out.println("SAMPLE VALUE INDEX: " + sampleValuesIndex);
                                throw new DataLineParserException("Error in Sample Value", line, parseState.index,e);
                            }
                        }
                        sampleValuesIndex++;
                        sampleValues = new ArrayList<>();
                        value.setLength(0);
                        parseState.switchState(DatalineParsingState.SAMPLE_VALUES_SEPARATOR);
                    }
                    else if (currentCharacter == '\t') {
                        sampleValues.add(value.toString());
                        try {
                            addSampleField(sampleValuesIndex, sampleValues, sample,dataline);
                        } catch (DatalineParseException e) {
                            throw new DataLineParserException("Error in Sample Value", line, parseState.index,e);
                        }
                        dataline.addSample(sample);
                        value.setLength(0);
                        sample = new ArrayList<>();
                        sampleValues = new ArrayList<>();
                        sampleValuesIndex = 0;
                        parseState.switchState(DatalineParsingState.SAMPLE_SEPARATOR);
                    }
                    else if (currentCharacter == '\n') {
                        sampleValues.add(value.toString());
                        sample.add(sampleValues);
                        dataline.addSample(sample);
                        value.setLength(0);
                        parseState.switchState(DatalineParsingState.FINISHED);
                    }
                    else if (currentCharacter == ' ') {
                        parseState.switchState(DatalineParsingState.INVALID, "Unexpected non-tab whitespace");
                    } else {
                        parseState.switchState(DatalineParsingState.INVALID);
                    }
                    break;
                //TODO: Change sample value representation
                case SAMPLE_VALUE_SEPARATOR:
                    if (Character.isLetterOrDigit(currentCharacter) || "./-+|".indexOf(currentCharacter) != -1) {
                        value.append(currentCharacter);
                        parseState.switchState(DatalineParsingState.SAMPLE_VALUE);
                    }
                    else {
                        parseState.switchState(DatalineParsingState.INVALID);
                     }
                    break;
                case SAMPLE_VALUES_SEPARATOR:
                    if (Character.isLetterOrDigit(currentCharacter) || "./-+|".indexOf(currentCharacter) != -1) {
                        value.append(currentCharacter);
                        parseState.switchState(DatalineParsingState.SAMPLE_VALUE);
                    }
                    else if (currentCharacter == '\t') {
                        dataline.addSample(sample);
                        value.setLength(0);
                        sample = new ArrayList<>();
                        sampleValuesIndex=0;
                        parseState.switchState(DatalineParsingState.SAMPLE_SEPARATOR);
                    }
                    else if (currentCharacter == '\n') {
                        parseState.switchState(DatalineParsingState.FINISHED);
                    }
                    else {
                        parseState.switchState(DatalineParsingState.INVALID);
                    }
                    break;
                case SAMPLE_SEPARATOR:
                    if (Character.isLetterOrDigit(currentCharacter) || currentCharacter == '.' || currentCharacter == '/' || currentCharacter == '|') {
                        value.append(currentCharacter);
                        parseState.switchState(DatalineParsingState.SAMPLE_VALUE);
                    }
                    else if (currentCharacter == '\n') {
                        parseState.switchState(DatalineParsingState.FINISHED);
                    }
                    else {
                        parseState.switchState(DatalineParsingState.INVALID,"Expected one of Letter,Digit,.,/,| during Sample parsing or new line but got: " +currentCharacter);
                    }
                    break;
                case INVALID:
                    //TODO: Use a more customer friendly message
                    throw new DataLineParserException("Parsing failed at state: " + parseState.previousState.toString() + " and index: " + (parseState.index - 1)+": "+parseState.errorMsg, line, parseState.index);
                default:
                    break;
            }        }
            if(value.length() > 0) {
                sampleValues.add(value.toString());
                try {
                    addSampleField(sampleValuesIndex, sampleValues, sample,dataline);
                } catch (DatalineParseException e) {
                    throw new DataLineParserException("Error in Sample Value", line, parseState.index,e);
                }
                dataline.addSample(sample);
            }
        return dataline;
    }
    private void verifyInfoFieldNumberIsZero(String key, Dataline dataline) throws DatalineParseException {
        if (vcfFormatDefinition != null) {
            InfoField infoField = vcfFormatDefinition.getInfoField(key);
            if (infoField != null && Integer.parseInt(infoField.getNumber()) == 0) {
                dataline.addInfoField(new DatalineInfoField(key, null));
            }
            //If there is no meta-information on this info field, automatically allow
            else if (infoField == null) {
                dataline.addInfoField(new DatalineInfoField(key, null));
            }
            //Status Notification
            else {
                throw new DatalineParseException("Info-field '" + key + "' contains more values than the number in the meta-information");
            }
        }
        else {
            dataline.addInfoField(new DatalineInfoField(key, null));
        }
    }
}