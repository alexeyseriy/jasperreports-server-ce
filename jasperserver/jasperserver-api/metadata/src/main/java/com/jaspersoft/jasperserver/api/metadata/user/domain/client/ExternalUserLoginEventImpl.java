package com.jaspersoft.jasperserver.api.metadata.user.domain.client;

import com.jaspersoft.jasperserver.api.metadata.user.domain.ExternalUserLoginEvent;

import java.util.Date;

public class ExternalUserLoginEventImpl implements ExternalUserLoginEvent {

    private Long id;
    private String username;
    private boolean isActive;
    private Integer numberOfFailedAttempts;
    private Date recordCreationDate;
    private Date recordLastUpdateDate;

    @Override
    public Long getId() {
        return null;
    }

    @Override
    public void setId(long id) {

    }

    @Override
    public String getUsername() {
        return null;
    }

    @Override
    public void setUsername(String username) {

    }

    @Override
    public boolean isActive() {
        return false;
    }

    @Override
    public void setIsActive(boolean isActive) {

    }

    @Override
    public int getNumberOfFailedAttempts() {
        return numberOfFailedAttempts != null ? numberOfFailedAttempts : 0;

    }

    @Override
    public void setNumberOfFailedAttempts(int numberOfFailedAttempts) {

    }

    @Override
    public Date getRecordCreationDate() {
        return null;
    }

    @Override
    public void setRecordCreationDate(Date recordCreationDate) {

    }

    @Override
    public Date getRecordLastUpdateDate() {
        return null;
    }

    @Override
    public void setRecordLastUpdateDate(Date recordLastUpdateDate) {

    }
}
