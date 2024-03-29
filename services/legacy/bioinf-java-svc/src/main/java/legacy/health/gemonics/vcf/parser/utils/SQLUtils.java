package legacy.health.genomics.vcf.parser.utils;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Types;

import legacy.health.genomics.vcf.parser.datamodel.EPrimitiveType;

/**
 * Created by D058991 on 24.02.2018.
 */
public class SQLUtils {

    public static void addBooleanOrNull(PreparedStatement stmt, int idx, Boolean value) throws SQLException {

        if (value == null) {
            stmt.setNull(idx, Types.INTEGER);
        } else {
            stmt.setInt(idx, value ? 1 : 0);
        }
    }


    public static void addIntegerOrNull(PreparedStatement stmt, int idx, Integer value) throws SQLException {
        if (value == null) {
            stmt.setNull(idx, Types.INTEGER);
        } else {
            stmt.setInt(idx, value);
        }
    }

    public static void addValueWithCorrectType(PreparedStatement stmt, int idx, String value, EPrimitiveType type) throws SQLException {
        switch(type) {
            case Integer:
                if(value == null || value.equals(".")) {
                    stmt.setNull(idx, Types.INTEGER);
                } else {
                    stmt.setInt(idx, Integer.parseInt(value));
                }
                break;
            case Float:
                if(value == null || value.equals(".")) {
                    stmt.setNull(idx, Types.REAL);
                } else {
                    stmt.setDouble(idx, Double.parseDouble(value));
                }
                break;
            case Flag:
                if(value == null || value.equals(".")) {
                    stmt.setNull(idx, Types.TINYINT);
                } else {
                    stmt.setInt(idx, Integer.parseInt(value));
                }
                break;
            case Character:
                if(value == null || value.equals(".")) {
                    stmt.setNull(idx, Types.NVARCHAR);
                } else {
                    stmt.setString(idx, value);
                }
                break;
            case String:
                if(value == null || value.equals(".")) {
                    stmt.setNull(idx, Types.NVARCHAR);
                } else {
                    stmt.setString(idx, value);
                }
                break;
        }
    }

}
