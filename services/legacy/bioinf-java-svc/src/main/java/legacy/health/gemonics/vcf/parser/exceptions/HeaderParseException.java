package legacy.health.genomics.vcf.parser.exceptions;

public class HeaderParseException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = -3166196343895431700L;
	private int position;
	private static String baseErrorMessage = "Error parsing header: ";

	public HeaderParseException(String msg, int position) {
		super(msg);
		this.position = position;
	}

	public HeaderParseException(String msg) {
		super(msg);
	}

	public int getPosition() {
		return position;
	}
	
	static public String getBaseErrorMessage () {
		return baseErrorMessage;
	}
}
