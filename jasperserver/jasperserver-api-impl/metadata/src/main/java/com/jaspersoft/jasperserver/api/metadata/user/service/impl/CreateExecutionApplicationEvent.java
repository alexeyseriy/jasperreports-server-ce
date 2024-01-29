package com.jaspersoft.jasperserver.api.metadata.user.service.impl;

import org.springframework.context.ApplicationEvent;

public class CreateExecutionApplicationEvent extends ApplicationEvent {
    public enum ExecutionType {
        REPORT,
        DASHBOARD
    }

    private final String executionID;
    private final ExecutionType type;

    public CreateExecutionApplicationEvent(Object source, String executionID, ExecutionType type) {
        super(source);
        this.executionID = executionID;
        this.type = type;
    }

    public String getExecutionID() {
        return executionID;
    }

    public ExecutionType getType() {
        return type;
    }
}
