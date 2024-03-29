package legacy.health.genomics.vcf.parser.capability;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.sql.PreparedStatement;
import legacy.health.genomics.vcf.parser.capability.BatchCountingStatement;
/**
 * Created by D058991 on 24.02.2018.
 */

 class CountingPreparedStmtHandler  implements InvocationHandler {


    public static BatchCountingStatement enableCountBatches(PreparedStatement delegate) {
    	
    	return (BatchCountingStatement) Proxy.newProxyInstance(CountingPreparedStmtHandler.class.getClassLoader(),
                new Class[] {BatchCountingStatement.class},
                new CountingPreparedStmtHandler(delegate));
    }
	
	

    private int batchCount = 0;
    private final PreparedStatement delegate;

     CountingPreparedStmtHandler(PreparedStatement delegate) {
        this.delegate = delegate;
    }


    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        if ("getBatchCount".equals(method.getName())) {
            return batchCount;
        }
        Object ret = method.invoke(delegate,args);
        if ("addBatch".equals(method.getName())) {
            ++batchCount;
        }
        if ("clearBatch".equals(method.getName())) {
            batchCount = 0;
        }
        return ret;
    }
}


