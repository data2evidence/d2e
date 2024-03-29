package legacy.health.genomics.vcf.parser.datamodel;



import com.sap.db.jdbc.*;
import com.sap.db.jdbc.packet.HDataPart;
import com.sap.db.jdbc.trace.Tracer;
import org.mockito.Mockito;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;
import sun.reflect.generics.reflectiveObjects.NotImplementedException;

import java.io.InputStream;
import java.io.Reader;
import java.math.BigDecimal;
import java.net.URL;
import java.sql.*;
import java.sql.Date;
import java.util.*;

public class FakePreparedStmt implements java.sql.PreparedStatement {

    static class Return {
        Object ret;
        List<Object> parameter;

        public Return(Object ret) {
            this.parameter = new LinkedList<>();
            this.ret=ret;
        }
        public void ifParametersAre(Object... args){
            parameter.add(null);
            for (Object a : args) {
                parameter.add(a);
            }
        }

    }


    static class PrepStmtAnswer implements Answer<FakePreparedStmt> {

        List<FakePreparedStmt> stmts;
        public PrepStmtAnswer(List<FakePreparedStmt> mockStmts) {
            this.stmts = mockStmts;

        }
        @Override
        public FakePreparedStmt answer(InvocationOnMock invocation) throws Throwable {
            Object[] arguments = invocation.getArguments();
            FakePreparedStmt fakePreparedStmt = new FakePreparedStmt((String) arguments[0]);
            stmts.add(fakePreparedStmt);
            return fakePreparedStmt;
        }
    }

    String queryString;

    ArrayList<ArrayList<Object> >buffer;
    ArrayList< ArrayList<Boolean> >is_valid;
    ArrayList< Return> returns;

    private void ensureSize(ArrayList list, int size, Object defaultObject) {

        list.ensureCapacity(size);
        while (list.size() <= size) {
            list.add(defaultObject);
        }
    }

    public Return ReturnNextableResultSet() {
        Return r = new Return(true);
        returns.add(r);
        return r;
    }

    public Return ReturnNonNextableResultSet() {
        Return r = new Return(false);
        returns.add(r);
        return r;
    }

    public Return ThrowException() {
        Return r = new Return(new SQLException("PreparedStatement was queried with parameters that should not happen "));
        returns.add(r);
        return r;
    }
    public FakePreparedStmt(String s) {
        queryString = s;
        buffer = new ArrayList<>();
        is_valid = new ArrayList<>();
        buffer.add(0, new ArrayList<>());
        is_valid.add(0, new ArrayList<>());
        returns = new ArrayList<>();
    }

    public List<Object> getRow(int i) {
        return this.buffer.get(i);
    }
    private void setValue(int i,Object x) {
        if(i >= buffer.get(buffer.size()-1).size()) {
            ensureSize(buffer.get(buffer.size()-1), i, null);
            ensureSize(is_valid.get(buffer.size()-1), i, false);
        }
        buffer.get(buffer.size()-1).set(i, x);
        is_valid.get(buffer.size()-1).set(i,true);
    }


    @Override
    public ResultSet executeQuery() throws SQLException {
        if(returns.isEmpty()) {
            return null;
        }
        for (Return ret: returns) {
            if (ret.parameter.equals(buffer.get(buffer.size() - 1))) {
                ResultSet rs = Mockito.mock(ResultSetSapDB.class);
                if(ret.ret instanceof Exception) {
                    for (Object o:ret.parameter)
                    {
                        System.out.print(o +",");
                    }
                    throw (SQLException) ret.ret;
                }
                if(((boolean)ret.ret == true)) {
                    Mockito.when(rs.next()).thenReturn(true);
                }else {
                    Mockito.when(rs.next()).thenReturn(false);
                }

                return rs;
            }
        }
        return null;
    }

    @Override
    public int executeUpdate() throws SQLException {
        return 0;
    }

    @Override
    public void setNull(int i, int i1) throws SQLException {
        if(i >= buffer.get(buffer.size()-1).size()) {
            ensureSize(buffer.get(buffer.size()-1), i, null);
            ensureSize(is_valid.get(buffer.size()-1), i, false);
        }
        buffer.get(buffer.size()-1).set(i,null);
    }

    @Override
    public void setBoolean(int i, boolean b) throws SQLException {
        setValue(i,b);
    }

    @Override
    public void setByte(int i, byte b) throws SQLException {
        setValue(i,b);
    }

    @Override
    public void setShort(int i, short i1) throws SQLException {
        setValue(i,i1);
    }

    @Override
    public void setInt(int i, int i1) throws SQLException {
        setValue(i,i1);
    }

    @Override
    public void setLong(int i, long l) throws SQLException {
        setValue(i,l);
    }

    @Override
    public void setFloat(int i, float v) throws SQLException {
        setValue(i,v);
    }

    @Override
    public void setDouble(int i, double v) throws SQLException {
        setValue(i,v);
    }

    @Override
    public void setBigDecimal(int i, BigDecimal bigDecimal) throws SQLException {
        setValue(i,bigDecimal);
    }

    @Override
    public void setString(int i, String s) throws SQLException {
        setValue(i,s);
    }

    @Override
    public void setBytes(int i, byte[] bytes) throws SQLException {
        setValue(i,bytes);
    }

    @Override
    public void setDate(int i, Date date) throws SQLException {
        setValue(i,date);
    }

    @Override
    public void setTime(int i, Time time) throws SQLException {
        setValue(i,time);
    }

    @Override
    public void setTimestamp(int i, Timestamp timestamp) throws SQLException {
        setValue(i,timestamp);
    }

    @Override
    public void setAsciiStream(int i, InputStream inputStream, int i1) throws SQLException {
        throw new NotImplementedException();
    }

    @Override
    public void setUnicodeStream(int i, InputStream inputStream, int i1) throws SQLException {
        throw new NotImplementedException();
    }

    @Override
    public void setBinaryStream(int i, InputStream inputStream, int i1) throws SQLException {
        throw new NotImplementedException();
    }

    @Override
    public void clearParameters() throws SQLException {
        this.is_valid.get(this.is_valid.size()-1).clear();
        this.buffer.get(this.buffer.size()-1).clear();
    }

    @Override
    public void setObject(int i, Object o, int i1) throws SQLException {
        throw new NotImplementedException();
    }

    @Override
    public void setObject(int i, Object o) throws SQLException {
        setValue(i,o);
    }

    @Override
    public boolean execute() throws SQLException {
        return false;
    }

    @Override
    public void addBatch() throws SQLException {
        this.buffer.add(new ArrayList<>());
        this.is_valid.add(new ArrayList<>());
    }

    @Override
    public void setCharacterStream(int i, Reader reader, int i1) throws SQLException {

    }

    @Override
    public void setRef(int i, Ref ref) throws SQLException {

    }

    @Override
    public void setBlob(int i, Blob blob) throws SQLException {

    }

    @Override
    public void setClob(int i, Clob clob) throws SQLException {

    }

    @Override
    public void setArray(int i, Array array) throws SQLException {

    }

    @Override
    public ResultSetMetaData getMetaData() throws SQLException {
        return null;
    }

    @Override
    public void setDate(int i, Date date, Calendar calendar) throws SQLException {

    }

    @Override
    public void setTime(int i, Time time, Calendar calendar) throws SQLException {

    }

    @Override
    public void setTimestamp(int i, Timestamp timestamp, Calendar calendar) throws SQLException {

    }

    @Override
    public void setNull(int i, int i1, String s) throws SQLException {

    }

    @Override
    public void setURL(int i, URL url) throws SQLException {

    }

    @Override
    public ParameterMetaData getParameterMetaData() throws SQLException {
        return null;
    }

    @Override
    public void setRowId(int i, RowId rowId) throws SQLException {

    }

    @Override
    public void setNString(int i, String s) throws SQLException {

    }

    @Override
    public void setNCharacterStream(int i, Reader reader, long l) throws SQLException {

    }

    @Override
    public void setNClob(int i, NClob nClob) throws SQLException {

    }

    @Override
    public void setClob(int i, Reader reader, long l) throws SQLException {

    }

    @Override
    public void setBlob(int i, InputStream inputStream, long l) throws SQLException {

    }

    @Override
    public void setNClob(int i, Reader reader, long l) throws SQLException {

    }

    @Override
    public void setSQLXML(int i, SQLXML sqlxml) throws SQLException {

    }

    @Override
    public void setObject(int i, Object o, int i1, int i2) throws SQLException {

    }

    @Override
    public void setAsciiStream(int i, InputStream inputStream, long l) throws SQLException {

    }

    @Override
    public void setBinaryStream(int i, InputStream inputStream, long l) throws SQLException {

    }

    @Override
    public void setCharacterStream(int i, Reader reader, long l) throws SQLException {

    }

    @Override
    public void setAsciiStream(int i, InputStream inputStream) throws SQLException {

    }

    @Override
    public void setBinaryStream(int i, InputStream inputStream) throws SQLException {

    }

    @Override
    public void setCharacterStream(int i, Reader reader) throws SQLException {

    }

    @Override
    public void setNCharacterStream(int i, Reader reader) throws SQLException {

    }

    @Override
    public void setClob(int i, Reader reader) throws SQLException {

    }

    @Override
    public void setBlob(int i, InputStream inputStream) throws SQLException {

    }

    @Override
    public void setNClob(int i, Reader reader) throws SQLException {

    }

    @Override
    public ResultSet executeQuery(String s) throws SQLException {
        return null;
    }

    @Override
    public int executeUpdate(String s) throws SQLException {
        return 0;
    }

    @Override
    public void close() throws SQLException {

    }

    @Override
    public int getMaxFieldSize() throws SQLException {
        return 0;
    }

    @Override
    public void setMaxFieldSize(int i) throws SQLException {

    }

    @Override
    public int getMaxRows() throws SQLException {
        return 0;
    }

    @Override
    public void setMaxRows(int i) throws SQLException {

    }

    @Override
    public void setEscapeProcessing(boolean b) throws SQLException {

    }

    @Override
    public int getQueryTimeout() throws SQLException {
        return 0;
    }

    @Override
    public void setQueryTimeout(int i) throws SQLException {

    }

    @Override
    public void cancel() throws SQLException {

    }

    @Override
    public SQLWarning getWarnings() throws SQLException {
        return null;
    }

    @Override
    public void clearWarnings() throws SQLException {

    }

    @Override
    public void setCursorName(String s) throws SQLException {

    }

    @Override
    public boolean execute(String s) throws SQLException {
        return false;
    }

    @Override
    public ResultSet getResultSet() throws SQLException {
        return null;
    }

    @Override
    public int getUpdateCount() throws SQLException {
        return 0;
    }

    @Override
    public boolean getMoreResults() throws SQLException {
        return false;
    }

    @Override
    public void setFetchDirection(int i) throws SQLException {

    }

    @Override
    public int getFetchDirection() throws SQLException {
        return 0;
    }

    @Override
    public void setFetchSize(int i) throws SQLException {

    }

    @Override
    public int getFetchSize() throws SQLException {
        return 0;
    }

    @Override
    public int getResultSetConcurrency() throws SQLException {
        return 0;
    }

    @Override
    public int getResultSetType() throws SQLException {
        return 0;
    }

    @Override
    public void addBatch(String s) throws SQLException {

    }

    @Override
    public void clearBatch() throws SQLException {

    }

    @Override
    public int[] executeBatch() throws SQLException {
        return new int[0];
    }

    @Override
    public Connection getConnection() throws SQLException {
        return null;
    }

    @Override
    public boolean getMoreResults(int i) throws SQLException {
        return false;
    }

    @Override
    public ResultSet getGeneratedKeys() throws SQLException {
        return null;
    }

    @Override
    public int executeUpdate(String s, int i) throws SQLException {
        return 0;
    }

    @Override
    public int executeUpdate(String s, int[] ints) throws SQLException {
        return 0;
    }

    @Override
    public int executeUpdate(String s, String[] strings) throws SQLException {
        return 0;
    }

    @Override
    public boolean execute(String s, int i) throws SQLException {
        return false;
    }

    @Override
    public boolean execute(String s, int[] ints) throws SQLException {
        return false;
    }

    @Override
    public boolean execute(String s, String[] strings) throws SQLException {
        return false;
    }

    @Override
    public int getResultSetHoldability() throws SQLException {
        return 0;
    }

    @Override
    public boolean isClosed() throws SQLException {
        return false;
    }

    @Override
    public void setPoolable(boolean b) throws SQLException {

    }

    @Override
    public boolean isPoolable() throws SQLException {
        return false;
    }

    @Override
    public void closeOnCompletion() throws SQLException {

    }

    @Override
    public boolean isCloseOnCompletion() throws SQLException {
        return false;
    }

    @Override
    public <T> T unwrap(Class<T> aClass) throws SQLException {
        return null;
    }

    @Override
    public boolean isWrapperFor(Class<?> aClass) throws SQLException {
        return false;
    }
}
