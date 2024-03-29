package legacy.health.genomics.vcf.parser.exceptions;

public class DIJobStatusException extends Exception{

	/**
	 * 
	 */
	private static final long serialVersionUID = 8884201261108027440L;
	
	private static String baseErrorMessage = "Error Updating DI Job Status:";

	public DIJobStatusException(String message, Exception envException) {
		super(baseErrorMessage + '\n' + message, envException);
	}

	public DIJobStatusException(String message) {
		super(baseErrorMessage + '\n' + message);
	}

}
