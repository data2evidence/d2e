package legacy.health.genomics.vcf.parser.exceptions;

public class DataLineParserException extends Exception {
    private final long line;
    private final long charIdx;
    private Throwable exp;

    public DataLineParserException(String message, long line, long charIdx,  Throwable exp) {
        super(message + ": " + exp.getMessage());
        this.line = line;
        this.charIdx = charIdx;
        this.exp = exp;
    }

    public DataLineParserException(String message, long line, long charIdx) {
        super(message);
        this.line = line;
        this.charIdx = charIdx;
    }
}
