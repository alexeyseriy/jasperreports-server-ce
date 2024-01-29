package com.jaspersoft.jasperserver.api.metadata.user.domain.impl.hibernate;

import com.jaspersoft.jasperserver.api.metadata.common.domain.impl.IdedObject;
import com.jaspersoft.jasperserver.api.metadata.common.service.ResourceFactory;
import com.jaspersoft.jasperserver.api.metadata.common.service.impl.hibernate.PersistentObjectResolver;
import com.jaspersoft.jasperserver.api.metadata.user.domain.User;
import com.jaspersoft.jasperserver.api.metadata.user.service.impl.UserAuthorityPersistenceService;
import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;

import java.util.Date;

public class RepoExternalUserLoginEvent implements IdedObject{

    private long id;
    private String username = null;
    private boolean enabled = false;
    private Date recordCreationDate = null;
    private Date recordLastUpdateDate = null;
    private int numberOfFailedLoginAttempts;
    private String tenantId;
    /**
     * @return
     * @hibernate.id type="long" column="id" generator-class="identity"
     */
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    /**
     * @hibernate.property
     * 		column="username" type="string" length="100" not-null="true" unique="true"
     *
     * @return Returns the username.
     *
     * (non-Javadoc)
     * @see com.jaspersoft.jasperserver.api.metadata.user.domain.User#getUsername()
     */
    public String getUsername() {
        return username;
    }

    public void setUsername(String newUsername) {
        if (newUsername == null || newUsername.trim().length() == 0) {
            throw new RuntimeException("No user name");
        }
        //adding this check because external users might have usernames > 100 characters in length.
        if(newUsername.length() > 100){
            newUsername = newUsername.substring(0,100);
        }
        username = newUsername;
    }

    /* (non-Javadoc)
     * @see org.springframework.security.core.userdetails.UserDetails#isAccountNonExpired()
     */
    public boolean isAccountNonExpired() {
        return enabled;
    }

    /* (non-Javadoc)
     * @see org.acegisecurity.userdetails.UserDetails#isAccountNonLocked()
     */
    public boolean isAccountNonLocked() {
        return enabled;
    }

    /* (non-Javadoc)
     * @see org.acegisecurity.userdetails.UserDetails#isCredentialsNonExpired()
     */
    public boolean isCredentialsNonExpired() {
        return enabled;
    }

    /** @hibernate.property
     * 		column="enabled" type="boolean"
     *
     *  (non-Javadoc)
     * @see org.springframework.security.core.userdetails.UserDetails#isEnabled()
     */
    public boolean isEnabled() {
        return enabled;
    }

    /**
     * @param enabled The enabled to set.
     */
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }



    public void copyFromClient(Object obj, PersistentObjectResolver resolver) {
        if (!(resolver instanceof UserAuthorityPersistenceService)) {
            throw new IllegalArgumentException(
                    "This method requires an UserAuthorityPersistenceService resolver");
        }
        copyFromClient(obj, (UserAuthorityPersistenceService) resolver);
    }

    public void copyFromClient(Object obj, UserAuthorityPersistenceService resolver) {
        User u = (User) obj;

        // u -> this
        setUsername(u.getUsername() == null ? "" : u.getUsername());
        setEnabled(u.isEnabled());
        setNumberOfFailedLoginAttempts(u.getNumberOfFailedLoginAttempts());
        setTenantId(u.getTenantId());
    }

    public Object toClient(ResourceFactory clientMappingFactory) {
        User u = (User) clientMappingFactory.newObject(User.class);
        // this -> u
        u.setUsername(getUsername());
        u.setEnabled(isEnabled());
        u.setNumberOfFailedLoginAttempts(getNumberOfFailedLoginAttempts());
        u.setTenantId(getTenantId());
        return u;

    }

    public String toString() {
        return new ToStringBuilder(this)
                .append("userId", getId())
                .append("username", getUsername())
                .append("tenantId",getTenantId())
                .toString();
    }

    public boolean equals(Object other) {
        if ( !(other instanceof RepoUser) ) return false;
        RepoExternalUserLoginEvent castOther = (RepoExternalUserLoginEvent) other;
        return new EqualsBuilder()
                .append(this.getId(), castOther.getId())
                .isEquals();
    }

    public int hashCode() {
        return new HashCodeBuilder()
                .append(getId())
                .toHashCode();
    }


    public void setNumberOfFailedLoginAttempts(int numberOfFailedLoginAttempts) {
        this.numberOfFailedLoginAttempts = numberOfFailedLoginAttempts;
    }
    public int getNumberOfFailedLoginAttempts() {
        return numberOfFailedLoginAttempts;
    }

    public Date getRecordCreationDate() {
        return recordCreationDate;
    }

    public void setRecordCreationDate(Date recordCreationDate) {
        this.recordCreationDate = recordCreationDate;
    }

    public Date getRecordLastUpdateDate() {
        return recordLastUpdateDate;
    }

    public void setRecordLastUpdateDate(Date recordLastUpdateDate) {
        this.recordLastUpdateDate = recordLastUpdateDate;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }
}

