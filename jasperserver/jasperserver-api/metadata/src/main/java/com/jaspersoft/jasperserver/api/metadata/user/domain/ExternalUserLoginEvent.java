package com.jaspersoft.jasperserver.api.metadata.user.domain;

import com.jaspersoft.jasperserver.api.JasperServerAPI;

import java.util.Date;

/**
 * Base interface for externalUserLoginEvents
 * @author rkalidas
 */

@JasperServerAPI
public interface ExternalUserLoginEvent {

    /**
     * Returns the external login event id
     * @return
     */
    public Long getId();
    public void setId(long id);

    /**
     * Returns the username
     * @return
     */
    public String getUsername();
    public void setUsername(String username);

    /**
     * Returns the active status of the user
     * @return
     */

    public boolean isActive();
    public void setIsActive(boolean isActive);

    /**
     * Returns the number of failed login attempts
     * @return
     */

    public int getNumberOfFailedAttempts();
    public void setNumberOfFailedAttempts(int numberOfFailedAttempts);

    /**
     * Returns the date of record creation
     * @return
     */

    public Date getRecordCreationDate();
    public void setRecordCreationDate(Date recordCreationDate);

    /**
     * Returns the date of record updation
     * @return
     */

    public Date getRecordLastUpdateDate();
    public void setRecordLastUpdateDate(Date recordLastUpdateDate);

}
