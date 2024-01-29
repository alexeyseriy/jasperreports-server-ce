package com.jaspersoft.jasperserver.api.metadata.user.service.impl;

public interface ExecutionsPublishingEventService {
    void publishReportExecutions(String id);

    void publishDashboardExecutions(String id);
}
