package legacy.health.genomics.vcf.parser.exceptions;

public class EnvironmentException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = -2388359138685153202L;
	private static String baseErrorMessage = "Error creating Environment:";

	public EnvironmentException(String message, Exception envException) {
		super(baseErrorMessage + '\n' + message, envException);
	}
}
