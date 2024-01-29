package com.jaspersoft.jasperserver.remote.services.impl;

import com.jaspersoft.jasperserver.api.engine.jasperreports.domain.impl.ReportUnitResult;
import com.jaspersoft.jasperserver.dto.executions.ExecutionStatus;
import com.jaspersoft.jasperserver.remote.services.ReportExecution;
import com.jaspersoft.jasperserver.remote.services.impl.RunReportServiceCacheFactoryBean.RunReportCacheEventListener;
import net.sf.ehcache.Ehcache;
import net.sf.ehcache.Element;
import net.sf.jasperreports.engine.JRVirtualizer;
import org.apache.commons.lang3.tuple.Pair;
import org.junit.Test;

import java.util.UUID;

import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyZeroInteractions;

public class RunReportServiceCacheFactoryBeanTest {
    private final RunReportCacheEventListener listener = new RunReportCacheEventListener();

    private final Ehcache cache = mock(Ehcache.class);

    @Test
    public void notifyElementEvicted_statusReady_evicted() {
        Element element = newReportExecution("superuser", "/public/Samples/report", ExecutionStatus.ready);
        listener.notifyElementEvicted(cache, element);
        ReportExecution reportExecution = ((Pair<String, ReportExecution>) element.getObjectValue()).getRight();

        ReportUnitResult reportUnitResult = reportExecution.getReportUnitResult();
        verify(reportUnitResult.getVirtualizer()).cleanup();
        verify(reportUnitResult).setJasperPrintAccessor(null);
    }

    @Test
    public void notifyElementEvicted_statusCanceled_exception() {
        Element element = newReportExecution("superuser", "/public/Samples/report", ExecutionStatus.cancelled);
        listener.notifyElementEvicted(cache, element);
        ReportExecution reportExecution = ((Pair<String, ReportExecution>) element.getObjectValue()).getRight();

        verifyZeroInteractions(reportExecution.getReportUnitResult());
    }

    private Element newReportExecution(String username, String resourceUri, ExecutionStatus status) {
        JRVirtualizer virtualizer = mock(JRVirtualizer.class);
        ReportUnitResult result = mock(ReportUnitResult.class);

        doReturn(resourceUri).when(result).getReportUnitURI();
        doReturn(virtualizer).when(result).getVirtualizer();

        ReportExecution reportExecution = new ReportExecution();
        reportExecution.setReportUnitResult(result);
        reportExecution.setStatus(status);

        // Username to ReportExecution
        Pair<String, ReportExecution> pair = Pair.of(username, reportExecution);
        return new Element(UUID.randomUUID().toString(), pair);
    }

}