package com.jaspersoft.jasperserver.api.metadata.user.service.impl;

import com.jaspersoft.jasperserver.api.metadata.user.service.impl.CreateExecutionApplicationEvent.ExecutionType;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.UUID;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyZeroInteractions;

@RunWith(MockitoJUnitRunner.class)
public class ExecutionsPublishingEventServiceImplTest {
    private static final String ID = UUID.randomUUID().toString();

    @InjectMocks
    private ExecutionsPublishingEventServiceImpl publishingEventService;

    @Mock
    private ApplicationEventPublisher applicationEventPublisher;

    @After
    public void tearDown() {
        RequestContextHolder.setRequestAttributes(null);
    }

    @Captor
    private ArgumentCaptor<CreateExecutionApplicationEvent> eventCaptor;

    @Test
    public void publishReportExecutions_noAttributes_ignorePublishing() {
        publishingEventService.publishReportExecutions(ID);
        verifyZeroInteractions(applicationEventPublisher);
    }

    @Test
    public void publishReportExecutions_noSession_ignorePublishing() {
        mockReturnRequest();
        publishingEventService.publishReportExecutions(ID);
        verifyZeroInteractions(applicationEventPublisher);
    }

    @Test
    public void publishReportExecutions_containsSession_publishedEvent() {
        mockReturnSession();
        publishingEventService.publishReportExecutions(ID);
        verify(applicationEventPublisher).publishEvent(eventCaptor.capture());
        CreateExecutionApplicationEvent event = eventCaptor.getValue();
        assertEquals(ExecutionType.REPORT, event.getType());
        assertEquals(ID, event.getExecutionID());
    }

    @Test
    public void publishDashboardExecutions_noAttributes_ignorePublishing() {
        publishingEventService.publishDashboardExecutions(ID);
        verifyZeroInteractions(applicationEventPublisher);
    }

    @Test
    public void publishDashboardExecutions_noSession_ignorePublishing() {
        mockReturnRequest();
        publishingEventService.publishDashboardExecutions(ID);
        verifyZeroInteractions(applicationEventPublisher);
    }

    @Test
    public void publishDashboardExecutions_containsSession_publishedEvent() {
        mockReturnSession();
        publishingEventService.publishDashboardExecutions(ID);
        verify(applicationEventPublisher).publishEvent(eventCaptor.capture());
        CreateExecutionApplicationEvent event = eventCaptor.getValue();
        assertEquals(ExecutionType.DASHBOARD, event.getType());
        assertEquals(ID, event.getExecutionID());
    }

    private HttpServletRequest mockReturnRequest() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));
        return request;
    }

    private HttpSession mockReturnSession() {
        HttpSession session = mock(HttpSession.class);
        HttpServletRequest request = mockReturnRequest();
        doReturn(session).when(request).getSession(false);
        return session;
    }

}