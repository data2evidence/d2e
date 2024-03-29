package legacy.health.genomics.vcf.parser.inputmodels;

import java.util.Locale;

import legacy.health.genomics.vcf.parser.datamodel.HeaderField;
import legacy.health.genomics.vcf.parser.exceptions.HeaderParseException;

public class HeaderParserStateMachine implements IHeaderParser {

	private enum ParseStates {
		INITIAL, INNER_KEY, INNER_VALUE, FINAL, QUOTED_INNER_KEY, UNQUOTED_INNER_KEY, ESCAPED_UNQUOTED_INNER_KEY,
		ESCAPED_QUOTED_INNER_KEY, END_QUOTED_INNER_KEY, QUOTED_INNER_VALUE, UNQUOTED_INNER_VALUE,
		ESCAPED_UNQUOTED_INNER_VALUE, ESCAPED_QUOTED_INNER_VALUE, END_QUOTED_INNER_VALUE
	}

	private enum HeaderLineStates {
		INITIAL, HEADER, SAMPLEID
	}

	/**
	 * Create a HeaderParser as Basic StateMachineImplementation
	 */
	public HeaderParserStateMachine() {
	}

	static private class ParseState {

		int index = 0;
		int currentKeyStart = -1;
		int currentValueStart = -1;
		String currentKeyName = "";
		String currentValueName = "";
		final String line;
		ParseStates currentState = ParseStates.INITIAL;

		ParseState(HeaderLine line) {
			this.line = line.getValue();
		}

		void setState(ParseStates newState) {
			this.currentState = newState;
		}

		void endCurrentKey(boolean trimValue) {
			assert currentKeyStart >= 0;
			currentKeyName = line.substring(currentKeyStart, index);
			if (trimValue) {
				currentKeyName = currentKeyName.trim();
			}
			currentKeyStart = -1;
		}

		void startNewKey(int offset) {
			assert currentKeyStart == -1;
			currentKeyStart = index + offset;
		}

		String getCurrentKey() {
			return currentKeyName;
		}

		void startNewValue(int offset) {
			assert currentValueStart == -1;
			assert !currentKeyName.isEmpty();
			assert currentKeyStart == -1;
			currentValueStart = index + offset;
		}

		void endCurrentValue(boolean trimValue) {
			assert currentValueStart >= 0;
			currentValueName = line.substring(currentValueStart, index);
			if (trimValue) {
				currentValueName = currentValueName.trim();
			}
			currentValueStart = -1;
		}

		String getCurrentValue() {
			return currentValueName;
		}
	}

	@Override
	public HeaderLine parseLine(HeaderLine line) throws HeaderParseException {

		ParseState state = new ParseState(line);

		for (; state.index < line.getValue().length(); state.index++) {
			char currentChar = line.getValue().charAt(state.index);
			switch (state.currentState) {
			case INITIAL:
				if ("\t ".indexOf(currentChar) != -1) {
					continue; // Skip leading whitespace characters, stay in Initial
				} else if (currentChar == '<') {
					state.setState(ParseStates.INNER_KEY);
					continue;
				} else {
					return line; // as we start with a non-whitespace non < character we assume the value is just
									// a plain string
				}
			case INNER_KEY:
				if ("\t ".indexOf(currentChar) != -1) {
					continue; // Skip leading whitespace characters, stay in INNER_KEY
				} else if (currentChar == '"') {
					state.setState(ParseStates.QUOTED_INNER_KEY);
					state.startNewKey(/* startOnNextChar */1);
					continue;
				} else {
					state.setState(ParseStates.UNQUOTED_INNER_KEY);
					state.startNewKey(/* startKeyOnCurrentChar */ 0);
					continue;
				}
			case UNQUOTED_INNER_KEY:
				switch (currentChar) {
				case '=':
					state.setState(ParseStates.INNER_VALUE);
					state.endCurrentKey(/* trimKey */ true);
					continue;
				case '"':
					throw new HeaderParseException("Unexpected quote in unquoted key", state.index + 1);
				case '\\':
					state.setState(ParseStates.ESCAPED_UNQUOTED_INNER_KEY);
					continue;
				default:
					continue; // Stay in Unquoted Key
				}
			case ESCAPED_UNQUOTED_INNER_KEY:
				state.setState(ParseStates.UNQUOTED_INNER_KEY);
				continue;
			case QUOTED_INNER_KEY:
				switch (currentChar) {
				case '\\':
					state.setState(ParseStates.ESCAPED_QUOTED_INNER_KEY);
					continue;
				case '"':
					state.setState(ParseStates.END_QUOTED_INNER_KEY);
					state.endCurrentKey(/* trimKey */ false);
					continue;
				default:
					continue; // Stay in quoted Key
				}
			case ESCAPED_QUOTED_INNER_KEY:
				state.setState(ParseStates.QUOTED_INNER_KEY);
				continue;
			case END_QUOTED_INNER_KEY:
				if ("\t ".indexOf(currentChar) != -1) {
					continue; // Skip trailing whitespace characters, stay in END_QUOTED_INNER_KEY
				} else if (currentChar == '=') {
					state.setState(ParseStates.INNER_VALUE);
					continue;
				} else {
					throw new HeaderParseException("Unexpected character after quoted key", state.index + 1);
				}
			case INNER_VALUE:
				if ("\t ".indexOf(currentChar) != -1) {
					continue; // Skip leading whitespace characters, stay in INNER_VALUE
				} else if (currentChar == '"') {
					state.setState(ParseStates.QUOTED_INNER_VALUE);
					state.startNewValue(/* startOnNextChar */1);
					continue;
				} else {
					state.setState(ParseStates.UNQUOTED_INNER_VALUE);
					state.startNewValue(/* startKeyOnCurrentChar */ 0);
					continue;
				}
			case UNQUOTED_INNER_VALUE:
				switch (currentChar) {
				case '"':
					throw new HeaderParseException("Unexpected quote in unquoted value", state.index + 1);
				case ',':
					state.setState(ParseStates.INNER_KEY);
					state.endCurrentValue(/* trimValue */ true);
					line.insertValuePair(state.getCurrentKey(), state.getCurrentValue());
					continue;
				case '\\':
					state.setState(ParseStates.ESCAPED_UNQUOTED_INNER_VALUE);
					continue;
				case '>':
					state.endCurrentValue(/* trimValue */ true);
					line.insertValuePair(state.getCurrentKey(), state.getCurrentValue());
					state.setState(ParseStates.FINAL);
					continue;
				default:
					continue;// Keep the current State and stay in unquoted inner value

				}
			case ESCAPED_UNQUOTED_INNER_VALUE:
				state.setState(ParseStates.UNQUOTED_INNER_VALUE);
				continue;
			case QUOTED_INNER_VALUE:
				switch (currentChar) {
				case '\\':
					state.setState(ParseStates.ESCAPED_QUOTED_INNER_VALUE);
					continue;
				case '"':
					state.setState(ParseStates.END_QUOTED_INNER_VALUE);
					state.endCurrentValue(/* trimValue */ false);
					line.insertValuePair(state.getCurrentKey(), state.getCurrentValue());
					continue;
				default:
					continue; // stay in quotedValue

				}
			case END_QUOTED_INNER_VALUE:
				if ("\t ".indexOf(currentChar) != -1) {
					continue; // Skip trailing whitespace characters, stay in END_QUOTED_INNER_VALUE
				} else if (currentChar == ',') {
					state.setState(ParseStates.INNER_KEY);
					continue;
				} else if (currentChar == '>') {
					state.setState(ParseStates.FINAL);
					continue;
				} else {
					throw new HeaderParseException("Unexpected character after quoted value", state.index + 1);
				}
			case ESCAPED_QUOTED_INNER_VALUE:
				state.setState(ParseStates.QUOTED_INNER_VALUE);
				continue;
			case FINAL:
				if ("\t ".indexOf(currentChar) != -1) {
					continue; // Skip trailing whitespace characters, stay in FINAL
				} else {
					throw new HeaderParseException("Unexpected character after final state", state.index + 1);
				}
			default:
				throw new HeaderParseException("Unexpected State", -1);
			}

		}
		if (state.currentState == ParseStates.FINAL) {
			return line;
		} else {
			throw new HeaderParseException("Ended in invalid State", line.getValue().length());
		}
	}

	@Override // TODO rewrite machine
	public HeaderField parseHeaderLine(HeaderLine line) throws HeaderParseException {
		HeaderLineStates currentState = HeaderLineStates.INITIAL;
		HeaderField headerStringResult = new HeaderField();
		int stringLength = line.getHeader().length();
		int valueStart = 0;
		String headerValue;

		// Process for header content
		for (int index = 0; index < stringLength; index++) {
			char currentCh = line.getHeader().charAt(index);
			switch (currentState) {
			case INITIAL:
				if (("\t ".indexOf(currentCh) != -1)) {
					continue; // Keep status
				} else if (currentCh == '#') {
					currentState = HeaderLineStates.HEADER;
					valueStart = index;
				} else {
					throw new HeaderParseException("Invalid character at beginning of Header", 1);
				}
				break;
			case HEADER:
				if (("\t ".indexOf(currentCh) != -1)) {
					headerValue = line.getHeader().substring(valueStart, index);
					headerStringResult.setHeader(headerValue);
					if (headerValue.toLowerCase(Locale.ENGLISH).equals("format")) {
						currentState = HeaderLineStates.SAMPLEID;
						valueStart = index + 1;
					} else {
						currentState = HeaderLineStates.HEADER;
						valueStart = index + 1;
						continue;
					}
				}
				continue;

			case SAMPLEID:

				if (("\t ".indexOf(currentCh) != -1)) {
					currentState = HeaderLineStates.SAMPLEID;
					headerStringResult.setSampleId(line.getHeader().substring(valueStart, index));
					valueStart = index + 1;
				} else if ((stringLength - 1) == index) {
					headerStringResult.setSampleId(line.getHeader().substring(valueStart, index + 1));
				}
				break;
			default:
				throw new UnsupportedOperationException(
						"VCF MetaLine Header Parser ended up in unknown page:" + currentState);
			}
		}
		return headerStringResult;
	}
}
