package com.legacy.health.fhir.meta.sql.queryengine;

import com.legacy.health.fhir.meta.FhirException;

import java.util.regex.Pattern;

public class SQLUtils {

    static String SQLToken = "(?:[A-Za-z_0-9\\.\\+\\*:#]|(?:\\-(?!\\-)))+";
    static String quotedSQLIdentifierSingle = "(^\"" + SQLToken + "\"$)";
    static String unquotedSQLIdentifierSingle = "(^" + SQLToken + "$)";
    static String quotedSQLIdentifierSchemaWithSchema = "(^" + SQLToken + "\"\\.\"" + SQLToken + "\"$)|";
    static String unquotedSQLIdentifierSchemaWithSchema = "(^" + SQLToken + "\\." + SQLToken + "$)";
    static Pattern sqlIdentifier = Pattern.compile(quotedSQLIdentifierSingle + "|" + quotedSQLIdentifierSchemaWithSchema
            + "|" + unquotedSQLIdentifierSingle + "|" + unquotedSQLIdentifierSchemaWithSchema);

    public static String assertValidSQLIdentifier(String id) throws FhirException {

        if (!sqlIdentifier.matcher(id).find()
                || (id.charAt(0) == '"' && id.charAt(id.length() - 1) != '"')
                || (id.charAt(id.length() - 1) == '"' && id.charAt(0) != '"')) {
            throw new FhirException("Unsecure SQL identifier detected " + id, null);
        } else {
            return id;
        }
    }

    public static String ensureQuoting(String id, char quoteChar) {
        if (!(id.charAt(0) == quoteChar && id.charAt(id.length() - 1) == quoteChar)) {
            return quoteChar + id.replaceAll(String.valueOf(quoteChar), "\\" + quoteChar) + quoteChar;
        }
        return id;
    }
}
