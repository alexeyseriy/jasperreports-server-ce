package com.jaspersoft.jasperserver.api.metadata.user.service;

import com.jaspersoft.jasperserver.api.JasperServerAPI;

@JasperServerAPI
public interface ExternalUserLoginAttemptsCleanUpService {

    /**
     * Clears all data from the jiexternaluserloginevents table
     * @return
     */
    boolean clearAllData();
}
