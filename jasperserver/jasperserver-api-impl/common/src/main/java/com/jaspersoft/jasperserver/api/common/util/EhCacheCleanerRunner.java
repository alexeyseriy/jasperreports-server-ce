package com.jaspersoft.jasperserver.api.common.util;

import net.sf.ehcache.Ehcache;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.util.TimerTask;

/**
 * 2013-09-06   thorick
 * <p/>
 * Timer is not recommended for heavily concurrent task scheduling
 * (See 'Java Concurrency in Practice' by Goetz,  6.2.5 'Delayed and Periodic Tasks'),
 * <p/>
 * but in this case we actually *want* a single dedicated thread that does just one job
 * and when it encounters an unhandled Exception (EhCache is GONE)
 * we actually WANT that the Timer Thread AND the Timer are killed.
 * <p/>
 * In more sophisticated Time services such as those outlined by Goetz above, this is exactly
 * what you DON'T WANT.
 * <p/>
 * The Spring 'destroy-method' hook calling the shutdown() method
 * is the first line shut down mechanism
 * <p/>
 * The RuntimeException on 'cache gone' is the last resort to deal with 'shutting down'
 * the Daemon thread at JasperServer undeploy time.
 */
public class EhCacheCleanerRunner extends TimerTask {

    final private Log cleanerLog = LogFactory.getLog(EhCacheCleanerRunner.class);
    boolean hasRun = false;
    private final Ehcache ehcache;
    private final String cleanerTaskName;

    //int testCount = 0;

    public EhCacheCleanerRunner(String cleanerTaskName, Ehcache ehcache) {
        this.ehcache = ehcache;
        this.cleanerTaskName = cleanerTaskName;
    }

    public void run() {

        // test: simulate JasperServer undeploy and cache gone, but Daemon Thread still running.
        //if (hasRun && (++testCount > 2))  { cache = null; }

        if (ehcache == null) {
            if (hasRun) {
                throw new RuntimeException(cleanerTaskName + " thread detected missing cache. " +
                        "This is a normal condition if JasperServer has been killed or undeployed." +
                        "  This Thread will be killed.");
            } else {
                if (cleanerLog.isDebugEnabled())
                    cleanerLog.debug(cleanerTaskName + " skip cache eviction run, waiting for cache to become live.");

                return;   // still waiting for a valid cache to run on
            }
        }
        try {
            if (cleanerLog.isDebugEnabled())
                cleanerLog.debug(cleanerTaskName + "  running cache eviction at " + System.currentTimeMillis());

            hasRun = true;
            ehcache.evictExpiredElements();
        } catch (Throwable t) {
            cleanerLog.error(t);
        }
    }

}
