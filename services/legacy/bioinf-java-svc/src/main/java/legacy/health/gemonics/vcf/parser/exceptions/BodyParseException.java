package legacy.health.genomics.vcf.parser.exceptions;

public class BodyParseException extends Exception{
	/**
	 * 
	 */
	private static final long serialVersionUID = -7364912245836274696L;
	private int position;
	private static String baseErrorMessage = "Error Importing VCF file: ";

	public BodyParseException(String msg, int position) {
		super(msg);
		this.position = position;
	}

	public BodyParseException(String msg, Exception e) {
		super(baseErrorMessage + '\n' + msg, e);
	}

	public BodyParseException(String message) {
		super(baseErrorMessage + '\n' + message);
	}

	public int getPosition() {
		return position;
	}
	static public String getBaseErrorMessage () {
		return baseErrorMessage;
	}

}
