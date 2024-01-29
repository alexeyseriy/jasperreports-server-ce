package com.jaspersoft.jasperserver.api.metadata.user.service.impl;

import com.jaspersoft.jasperserver.api.metadata.common.service.ResourceFactory;
import com.jaspersoft.jasperserver.api.metadata.common.service.impl.HibernateDaoImpl;
import com.jaspersoft.jasperserver.api.metadata.common.service.impl.hibernate.util.IlikeEscapeAwareExpression;
import com.jaspersoft.jasperserver.api.metadata.tenant.service.TenantPersistenceResolver;
import com.jaspersoft.jasperserver.api.metadata.user.domain.ExternalUserLoginEvent;
import com.jaspersoft.jasperserver.api.metadata.user.domain.impl.hibernate.RepoExternalUserLoginEvent;
import com.jaspersoft.jasperserver.api.metadata.user.domain.impl.hibernate.RepoTenant;
import com.jaspersoft.jasperserver.api.metadata.user.service.ExternalUserLoginEventService;
import com.jaspersoft.jasperserver.api.metadata.user.service.TenantService;
import org.apache.log4j.Logger;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.orm.hibernate5.HibernateTemplate;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

/**
 * External User Login Event Service Implementation
 * @author rkalidas
 */

@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
public class ExternalUserLoginEventServiceImpl extends HibernateDaoImpl implements ExternalUserLoginEventService {

    private TenantPersistenceResolver tenantPersistenceResolver;
    private boolean userNameCaseSensitive;
    public ResourceFactory getPersistentClassFactory() {
        return persistentClassFactory;
    }

    public void setPersistentClassFactory(ResourceFactory persistentClassFactory) {
        this.persistentClassFactory = persistentClassFactory;
    }
    Logger logger = Logger.getLogger(ExternalUserLoginEventServiceImpl.class);
    private ResourceFactory persistentClassFactory;

    protected Class getPersistentExternalUserLoginEventClass(){
        return getPersistentClassFactory().getImplementationClass(ExternalUserLoginEvent.class);
    }

    @Override
    public List getExternalUserLoginEvents() {
        DetachedCriteria detachedCriteria = DetachedCriteria.forClass(getPersistentExternalUserLoginEventClass());
        try{
            return getHibernateTemplate().findByCriteria(detachedCriteria);
        }
        catch(Exception exception){
            logger.debug("Error in getting external user login events "+exception.getMessage(),exception);
        }
        return Collections.emptyList();
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRED,readOnly = false)
    public void addNewExternalUserLoginEvent(Object externalUserLoginEventInstance) {
        try{
            getHibernateTemplate().saveOrUpdate(externalUserLoginEventInstance);
            getHibernateTemplate().flush();
        }
        catch(Exception exception){
            logger.debug("Error in adding external user login event. "+exception.getMessage(),exception);
        }
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRED, readOnly = false)
    public void updateExternalUserLoginEvent(Object repoExternalUserLoginEvent) {
        try{
            getHibernateTemplate().saveOrUpdate(repoExternalUserLoginEvent);
            getHibernateTemplate().flush();
        }
        catch(Exception exception){
            logger.debug("Error in updating external user login event. "+exception.getMessage(),exception);
        }
    }

    @Override
    public Object getExternalUserLoginEventByUsernameAndTenantId(String username, String tenantId) {
        return getRepoUserByUsernameAndTenantId(username,tenantId);
    }

    @Override
    public Object getTenantForExternalUserLoginEvent(String tenantId, String username) {
        return getTenantPersistenceResolver().getPersistentTenant(TenantService.ORGANIZATIONS,false);
    }

    @Transactional(propagation = Propagation.REQUIRED,readOnly = false)
    private RepoExternalUserLoginEvent getRepoUserByUsernameAndTenantId(String username, String tenantId) {
        List userList = findByCriteria(createUserSearchCriteria(username,tenantId,
                isUsernameCaseSensitive()));
        RepoExternalUserLoginEvent repoExternalUserLoginEvent = null;
        if (userList.isEmpty()) {
            logger.debug("User not found with username \"" + username
                    + "\" in tenant " + tenantId + ".");
        } else if (userList.size() == 1) {
            repoExternalUserLoginEvent = (RepoExternalUserLoginEvent) userList.get(0);
        }
        return repoExternalUserLoginEvent;
    }

    protected List findByCriteria(DetachedCriteria criteria){
        HibernateTemplate template = getHibernateTemplate();
        return template.findByCriteria(criteria);
    }

    protected DetachedCriteria createUserSearchCriteria(String username, String tenantId,
                                                        boolean isCaseSensitive) {
        DetachedCriteria criteria = DetachedCriteria.forClass(RepoExternalUserLoginEvent.class);
        criteria.add(isCaseSensitive ? Restrictions.eq("username", username) :
                new IlikeEscapeAwareExpression("username", username, MatchMode.EXACT));
        criteria.add(Restrictions.eq("tenantId", tenantId));
        criteria.getExecutableCriteria(getSession()).setCacheable(true);
        return criteria;
    }

    public boolean isUsernameCaseSensitive() {
        return userNameCaseSensitive;
    }

    public void setUsernameCaseSensitive(boolean usernameCaseSensitive) {
        userNameCaseSensitive = usernameCaseSensitive;
    }

    public TenantPersistenceResolver getTenantPersistenceResolver() {
        return tenantPersistenceResolver;
    }

    public void setTenantPersistenceResolver(TenantPersistenceResolver tenantPersistenceResolver) {
        this.tenantPersistenceResolver = tenantPersistenceResolver;
    }
}
