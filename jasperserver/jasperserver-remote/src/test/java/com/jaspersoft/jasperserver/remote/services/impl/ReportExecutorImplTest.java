package com.jaspersoft.jasperserver.remote.services.impl;

import com.jaspersoft.jasperserver.api.engine.jasperreports.domain.impl.PaginationParameters;
import com.jaspersoft.jasperserver.remote.services.ReportExecutionOptions;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.HashMap;
import java.util.Map;

import static java.util.Collections.singletonMap;
import static net.sf.jasperreports.engine.JRParameter.IS_IGNORE_PAGINATION;
import static net.sf.jasperreports.engine.JRParameter.MAX_PAGE_HEIGHT;
import static net.sf.jasperreports.engine.JRParameter.MAX_PAGE_WIDTH;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@RunWith(MockitoJUnitRunner.class)
public class ReportExecutorImplTest {

    @InjectMocks
    private ReportExecutorImpl reportExecutor;

    @Test
    public void configurePagination_nullParametersAndNullDefaultSettings_noPagination() {
        Map<String, Object> result = reportExecutor.configurePagination(null,
                new ReportExecutionOptions().setPaginationParameters(null)
        );
        assertTrue(result.isEmpty());
    }

    @Test
    public void configurePagination_nullParametersAndUpdatedDefaultSettings_defaultPagination() {
        PaginationParameters paginationParameters = new PaginationParameters();
        paginationParameters.setPaginated(false);
        Map<String, Object> result = reportExecutor.configurePagination(null,
                new ReportExecutionOptions().setPaginationParameters(paginationParameters)
        );
        assertEquals(singletonMap(IS_IGNORE_PAGINATION, true), result);
    }

    @Test
    public void configurePagination_nullParametersAndDefaultIgnorePaginationSettings_defaultIgnorePagination() {
        Map<String, Object> result = reportExecutor.configurePagination(null,
                new ReportExecutionOptions().setDefaultIgnorePagination(true)
        );
        assertEquals(singletonMap(IS_IGNORE_PAGINATION, true), result);
    }

    @Test
    public void configurePagination_parametersWithIgnorePaginationTrueAndDefaultSettings_ignorePagination() {
        Map<String, Object> parameters = singletonMap(IS_IGNORE_PAGINATION, true);
        Map<String, Object> result = reportExecutor.configurePagination(parameters, new ReportExecutionOptions());
        assertEquals(parameters, result);
    }

    @Test
    public void configurePagination_parametersWithIgnorePaginationFalseAndDefaultSettings_withPagination() {
        Map<String, Object> parameters = singletonMap(IS_IGNORE_PAGINATION, true);
        Map<String, Object> result = reportExecutor.configurePagination(parameters, new ReportExecutionOptions());
        assertEquals(parameters, result);
    }

    @Test
    public void configurePagination_parametersWithIgnorePaginationAndUpdatedDefaultSettings_fullyConfiguredPagination() {
        PaginationParameters paginationParameters = new PaginationParameters();
        paginationParameters.setMaxPageHeight(10);
        paginationParameters.setMaxPageWidth(5);

        Map<String, Object> parameters = new HashMap<>(singletonMap(IS_IGNORE_PAGINATION, true));
        Map<String, Object> result = reportExecutor.configurePagination(parameters,
                new ReportExecutionOptions().setPaginationParameters(paginationParameters)
        );

        Map<String, Object> expected = new HashMap<String, Object>() {{
            put(IS_IGNORE_PAGINATION, true);
            put(MAX_PAGE_HEIGHT, 10);
            put(MAX_PAGE_WIDTH, 5);
        }};
        assertEquals(expected, result);
    }
}