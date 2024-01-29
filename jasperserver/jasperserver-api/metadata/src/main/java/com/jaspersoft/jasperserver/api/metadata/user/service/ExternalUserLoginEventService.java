package com.jaspersoft.jasperserver.api.metadata.user.service;

import com.jaspersoft.jasperserver.api.JasperServerAPI;

import java.util.List;


/**
 * ExternalUserLoginEventService is a service used to manage RepoExternalUserLoginEvent objects
 * @author rkalidas
 */
@JasperServerAPI
public interface ExternalUserLoginEventService {

    List getExternalUserLoginEvents();

    void addNewExternalUserLoginEvent(Object externalUserLoginEventInstance);

    void updateExternalUserLoginEvent(Object repoExternalUserLoginEvent);

    Object getExternalUserLoginEventByUsernameAndTenantId(String username, String tenantId);

    Object getTenantForExternalUserLoginEvent(String tenantId,String username);
}
