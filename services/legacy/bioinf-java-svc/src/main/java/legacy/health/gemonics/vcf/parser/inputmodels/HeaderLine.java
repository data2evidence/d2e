package legacy.health.genomics.vcf.parser.inputmodels;

import java.util.HashMap;
import java.util.Map;

import legacy.health.genomics.vcf.parser.exceptions.HeaderParseException;

public class HeaderLine {

	public enum Rowinformation {
		METALINE, HEADERLINE, DATALINE, EMPTYLINE, INVALID
	}

	private Rowinformation rowtype;

	private String key;
	private String value;
	private String header;

	private final Map<String, String> valueMap;
	private final Map<String, String> exactValueMap;

	public Map<String, String> getExactValueMap() {
		return exactValueMap;
	}

	public HeaderLine() {
		this.valueMap = new HashMap<>();
		this.exactValueMap = new HashMap<>();
		this.rowtype = Rowinformation.INVALID;
	}

	public void insertValuePair(String valueKey, String valueValue) throws HeaderParseException {
		String oldVal = this.valueMap.put(valueKey.toLowerCase(), valueValue);
		if (oldVal != null) {
			throw new HeaderParseException("Same key with different case");
		}
		this.exactValueMap.put(valueKey, valueValue);
	}

	public void clearValuePairs() {
		this.valueMap.clear();
		this.exactValueMap.clear();
	}

	public String getKey() {
		return key;
	}

	public String getValue() {
		return value;
	}

	public String getHeader() {
		return header;
	}

	public Map<String, String> getValuePair() {
		return valueMap;
	}

	public String getValueForKey(String key) {
		return valueMap.get(key.toLowerCase());
	}

	public void setValue(String value) {
		this.value = value;
	}

	private void setKey(String key) {
		this.key = key;
	}

	private void setHeader(String header) {
		this.header = header;
	}

	private void setRowtype(Rowinformation rowvalue) {
		this.rowtype = rowvalue;
	}

	public Rowinformation getRowtype() {
		return rowtype;
	}

	public enum ParseStates {
		INITIAL, HASH, KEY, VALUE
	}

	public static HeaderLine getFromString(String line) throws HeaderParseException {
		HeaderLine l = new HeaderLine();
		int valueStart = -1;
		ParseStates currentState = ParseStates.INITIAL;
		for (int index = 0; index < line.length(); index++) {
			char currentChar = line.charAt(index);
			switch (currentState) {
			case INITIAL:
				if ("\t ".indexOf(currentChar) != -1) {
					continue; // stay in initial state for leading whitespaces
				} else if (currentChar == '#') {
					currentState = ParseStates.HASH;
					continue;
				} else {
					l.setRowtype(Rowinformation.DATALINE);
					return l; // We can take the shortcut here, as we do not parse DataLines
				}
			case HASH:
				if ("\t ".indexOf(currentChar) != -1) {
					continue; // stay in HASH state for leading whitespaces
				} else if (currentChar == '#') {
					currentState = ParseStates.KEY;
					valueStart = index + 1;
					continue;
				} else {
					// TODO we should continue validating the header, for now we take the shortcut
					l.setHeader(line);
					l.setRowtype(Rowinformation.HEADERLINE);
					return l;
				}
			case KEY:
				if ("\t ".indexOf(currentChar) != -1) {
					continue; // stay in KEY state for leading whitespaces
				} else if (currentChar == '=') {
					currentState = ParseStates.VALUE;
					l.setRowtype(Rowinformation.METALINE);
					l.setKey(line.substring(valueStart, index).trim());
					valueStart = index + 1;
					continue;
				} else {
					continue; // Stay in Key state, as the key continues
				}
			case VALUE:
				continue; // we do not want to further parse the value
			default:
				throw new HeaderParseException("Invalid State", -1);
			}
		}
		if (currentState == ParseStates.VALUE) {
			l.setValue(line.substring(valueStart, line.length()).trim());
			return l;
		} else if (currentState == ParseStates.INITIAL) {
			l.setRowtype(Rowinformation.EMPTYLINE);
			return l;
		} else {
			throw new HeaderParseException("HeaderParser ended up in unexpected type while trying to detect rowtype",
					line.length());
		}

	}

}
