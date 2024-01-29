package com.jaspersoft.jasperserver.api.metadata.common.service.impl;

import com.jaspersoft.jasperserver.api.JasperServerAPI;
import org.springframework.security.core.userdetails.UserDetails;

@JasperServerAPI
public interface LogEventService {
    /**
     * Creates an instance of RepoLogEvent when the user exceeds the configured NOFA (number of failed attempts) and the
     * account is set inactive/disabled. Accepts UserDetails as input to fetch user specific metadata, for instance, username.
     *
     * @param userDetails
     */
    public void createUserAccountLockedEvent(UserDetails userDetails);

    void createRecordCleanUpEventForExternalUsers();
}
