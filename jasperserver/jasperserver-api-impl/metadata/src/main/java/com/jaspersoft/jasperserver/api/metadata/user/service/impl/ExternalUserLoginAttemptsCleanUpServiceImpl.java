package com.jaspersoft.jasperserver.api.metadata.user.service.impl;

import com.jaspersoft.jasperserver.api.metadata.common.service.ResourceFactory;
import com.jaspersoft.jasperserver.api.metadata.common.service.impl.HibernateDaoImpl;
import com.jaspersoft.jasperserver.api.metadata.common.service.impl.LogEventService;
import com.jaspersoft.jasperserver.api.metadata.user.domain.ExternalUserLoginEvent;
import com.jaspersoft.jasperserver.api.metadata.user.service.ExternalUserLoginAttemptsCleanUpService;
import org.hibernate.criterion.DetachedCriteria;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
public class ExternalUserLoginAttemptsCleanUpServiceImpl extends HibernateDaoImpl implements ExternalUserLoginAttemptsCleanUpService
{
    ResourceFactory persistentClassFactory;
    Logger logger = LoggerFactory.getLogger(ExternalUserLoginAttemptsCleanUpServiceImpl.class);
    private int userLoginAttemptsThreshold;
    LogEventService loggingService;

    @Override
    @Transactional(propagation = Propagation.REQUIRED, readOnly = false)
    public boolean clearAllData() {
        logger.debug("Scheduler Invoked.");
        DetachedCriteria detachedCriteria = DetachedCriteria.forClass(getPersistentExternalUserLoginEventClass());
        try{
            List<ExternalUserLoginEvent> externalUserLoginEventList = (List<ExternalUserLoginEvent>) getHibernateTemplate().findByCriteria(detachedCriteria);
            if(externalUserLoginEventList!=null && externalUserLoginEventList.size() >= getUserLoginAttemptsThreshold()){
                logger.debug("Records exists in externalUserLoginEvent table. Cleanup initiated.");
                getHibernateTemplate().deleteAll(externalUserLoginEventList);
                getLoggingService().createRecordCleanUpEventForExternalUsers();
                logger.debug("Cleanup completed.");
                return true;
            }
        }
        catch (Exception exception){
            logger.debug("Error in deleting the records of externalUserLoginEvents table..",exception);
        }
        logger.debug("Scheduler Completed.");
        return false;
    }

    public ResourceFactory getPersistentClassFactory() {
        return persistentClassFactory;
    }

    public void setPersistentClassFactory(ResourceFactory persistentClassFactory) {
        this.persistentClassFactory = persistentClassFactory;
    }

    protected Class getPersistentExternalUserLoginEventClass(){
        return getPersistentClassFactory().getImplementationClass(ExternalUserLoginEvent.class);
    }

    public int getUserLoginAttemptsThreshold() {
        return userLoginAttemptsThreshold;
    }

    public void setUserLoginAttemptsThreshold(int userLoginAttemptsThreshold) {
        this.userLoginAttemptsThreshold = userLoginAttemptsThreshold;
    }

    public LogEventService getLoggingService() {
        return loggingService;
    }

    public void setLoggingService(LogEventService loggingService) {
        this.loggingService = loggingService;
    }
}
