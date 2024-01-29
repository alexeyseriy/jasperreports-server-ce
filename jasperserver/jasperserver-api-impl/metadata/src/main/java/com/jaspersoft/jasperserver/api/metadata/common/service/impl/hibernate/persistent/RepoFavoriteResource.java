package com.jaspersoft.jasperserver.api.metadata.common.service.impl.hibernate.persistent;

import com.jaspersoft.jasperserver.api.metadata.common.domain.Favorite;
import com.jaspersoft.jasperserver.api.metadata.common.domain.client.FavoriteResourceImpl;
import com.jaspersoft.jasperserver.api.metadata.user.domain.impl.hibernate.RepoUser;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

public class RepoFavoriteResource implements Favorite,Serializable {
    private static final Log log = LogFactory.getLog(RepoFavoriteResource.class);

    public long id;
    public RepoResource resource;
    public RepoUser user;
    protected Date creationDate;

    @Override
    public boolean equals(Object other) {
        if (!(other instanceof RepoFavoriteResource)) return false;
        if (this == other) return true;
        if (other == null || getClass() != other.getClass()) return false;
        RepoFavoriteResource that = (RepoFavoriteResource) other;
        return Objects.equals(resource, that.resource) && Objects.equals(user, that.user);
    }

    @Override
    public int hashCode() {
        return super.hashCode();
    }

    public RepoFavoriteResource() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public RepoResource getResource() {
        return resource;
    }

    public void setResource(RepoResource resource) {
        this.resource = resource;
    }

    public RepoUser getUser() {
        return user;
    }

    public void setUser(RepoUser user) {
        this.user = user;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }
    public long getResourceId() {
        return resource.getId();
    }

    public void setResourceId(long resourceId) {
        this.resource.setId(resourceId); }

    public long getUserId() {
        return user.getId();
    }

    public void setUserId(long userId) {
        this.user.setId(userId);
    }
    public String getUserName() {
        return user.getFullName();
    }

    public String getResourceURI() {
        return resource.getResourceURI();
    }

    public FavoriteResourceImpl toClient(){
        FavoriteResourceImpl favoriteResource = new FavoriteResourceImpl();
        favoriteResource.setId(getId());
//        favoriteResource.setUserName(getUserName());
        favoriteResource.setResourceURI(getResourceURI());
        return favoriteResource;
    }
}
