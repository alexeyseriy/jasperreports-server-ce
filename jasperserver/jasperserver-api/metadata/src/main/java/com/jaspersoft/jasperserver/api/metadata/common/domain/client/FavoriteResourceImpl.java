package com.jaspersoft.jasperserver.api.metadata.common.domain.client;

import com.jaspersoft.jasperserver.api.metadata.common.domain.Favorite;
import com.jaspersoft.jasperserver.api.metadata.common.domain.Folder;

public class FavoriteResourceImpl implements Favorite {
    private String resourceURI;
    private String userName;

    private String parentURI;
    private String resourceName;

    private String tenantUser;
    private String tenantId;

    public FavoriteResourceImpl() {
    }

    public FavoriteResourceImpl( long id, String folderUri, String  name, String userName) {
        this.id = id;
        this.resourceURI = folderUri+ Folder.SEPARATOR+name;
        this.userName = userName;
    }
    public FavoriteResourceImpl( long id, String uri, String userName) {
        this.id = id;
        this.resourceURI = uri;
        this.userName = userName;
    }

    public void setResourceURI(String resourceURI) {
        this.resourceURI = resourceURI;
    }

    public void setParentURI(String parentURI) {
        this.parentURI = parentURI;
    }

    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setTenantUser(String tenantUser) {
        this.tenantUser = tenantUser;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }


    //    protected Date creationDate;
    private long id;
    @Override
    public long getId() {
        return id;
    }

    @Override
    public void setId(long id) {
        this.id=id;
    }

    @Override
    public long getResourceId() {
        return 0;
    }

    @Override
    public void setResourceId(long resourceId) {

    }

    @Override
    public long getUserId() {
        return 0;
    }

    @Override
    public void setUserId(long userId) {

    }

    @Override
    public String getUserName() {
        if (userName == null && tenantId != null && tenantUser != null) {
            userName = tenantUser + "|" + tenantId;
        }
        return userName;
    }

    @Override
    public String getResourceURI() {
        if (resourceURI == null && parentURI != null && resourceName != null) {
            resourceURI = parentURI + Folder.SEPARATOR + resourceName;
        }

        return resourceURI;
    }
}
