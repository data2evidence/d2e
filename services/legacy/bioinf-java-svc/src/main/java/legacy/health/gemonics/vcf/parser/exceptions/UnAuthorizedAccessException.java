package legacy.health.genomics.vcf.parser.exceptions;

public class UnAuthorizedAccessException extends Exception{

	/**
	 * 
	 */
	private static final long serialVersionUID = 6168006274105811577L;
	private int position;
	private static String baseErrorMessage = "Unauthorized Acces!!! ";

	public UnAuthorizedAccessException(String msg, int position) {
		super(msg);
		this.position = position;
	}

	public UnAuthorizedAccessException(String msg, Exception e) {
		super(baseErrorMessage + '\n' + msg, e);
	}

	public UnAuthorizedAccessException(String message) {
		super(baseErrorMessage + '\n' + message);
	}

	public int getPosition() {
		return position;
	}
	static public String getBaseErrorMessage () {
		return baseErrorMessage;
	}
}
