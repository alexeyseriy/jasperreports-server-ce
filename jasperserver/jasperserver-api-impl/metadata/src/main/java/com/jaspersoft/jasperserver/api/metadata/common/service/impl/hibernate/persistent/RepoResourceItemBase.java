/*
 * Copyright (C) 2005-2023. Cloud Software Group, Inc. All Rights Reserved.
 * http://www.jaspersoft.com.
 *
 * Unless you have purchased a commercial license agreement from Jaspersoft,
 * the following license terms apply:
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

package com.jaspersoft.jasperserver.api.metadata.common.service.impl.hibernate.persistent;

import com.jaspersoft.jasperserver.api.metadata.common.domain.ResourceLookup;
import com.jaspersoft.jasperserver.api.metadata.common.domain.client.ResourceLookupImpl;
import com.jaspersoft.jasperserver.api.metadata.common.domain.impl.IdedRepoObject;
import com.jaspersoft.jasperserver.api.metadata.common.service.ResourceFactory;
import com.jaspersoft.jasperserver.api.metadata.common.service.impl.hibernate.PersistentObjectResolver;

import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

/**
 * <p></p>
 *
 * @author Zakhar.Tomchenco
 * @version $Id$
 */
public abstract class RepoResourceItemBase implements IdedRepoObject, Serializable {
    protected int version;

    protected Date creationDate;
    protected Date updateDate;

    protected String label = null;
    protected String description = null;

    public ResourceKey getResourceKey() {
        return resourceKey;
    }

    public void setResourceKey(ResourceKey resourceKey) {
        this.resourceKey = resourceKey;
    }

    protected ResourceKey resourceKey;

    @Override
    public final ResourceLookup toClientLookup() {
        ResourceLookup resourceLookup = new ResourceLookupImpl();

        resourceLookup.setParentFolder(this.resourceKey.getParent().getResourceURI());
        resourceLookup.setName(resourceKey.getName());

        resourceLookup.setVersion(version);

        resourceLookup.setLabel(label);
        resourceLookup.setCreationDate(creationDate);
        resourceLookup.setDescription(description);

        resourceLookup.setCreationDate(creationDate);
        resourceLookup.setUpdateDate(updateDate);

        resourceLookup.setResourceType(this.getResourceType());

        return resourceLookup;
    }

    @Override
    public final void copyFromClient(Object objIdent, PersistentObjectResolver resolver) {
        throw new IllegalStateException("RepoResourceItemBase objects intended to be read only. Use RepoResourceBase based hierarchy to save items");
    }

    @Override
    public final Object toClient(ResourceFactory clientMappingFactory) {
        return this.toClientLookup();
    }

    public long getId() {
        return resourceKey.getId();
    }

    public void setId(long id) {
        this.resourceKey.id = id;
    }

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }

    public String getName() {
        return resourceKey.getName();
    }

    public void setName(String name) {
        this.resourceKey.name = name;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public RepoFolder getParent() {
        return resourceKey.getParent();
    }

    public void setParent(RepoFolder parent) {
        this.resourceKey.parent = parent;
    }

    public abstract String getResourceType();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        RepoResourceItemBase that = (RepoResourceItemBase) o;

        if (resourceKey.id != that.resourceKey.id) return false;
        if (!Objects.equals(resourceKey.name, that.resourceKey.name)) return false;
        if (resourceKey.parent != null ? !resourceKey.parent.getResourceURI().equals(that.resourceKey.parent.getResourceURI()) : that.resourceKey.parent != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = (int) (resourceKey.id ^ (resourceKey.id >>> 32));
        result = 31 * result + (resourceKey.name != null ? resourceKey.name.hashCode() : 0);
        result = 31 * result + (resourceKey.parent != null ? resourceKey.parent.getResourceURI().hashCode() : 0);
        return result;
    }

    public static class ResourceKey implements Serializable {

        protected long id;

        public long getId() {
            return id;
        }

        public void setId(long id) {
            this.id = id;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            ResourceKey that = (ResourceKey) o;
            return id == that.id && Objects.equals(name, that.name) && Objects.equals(parent, that.parent);
        }

        @Override
        public int hashCode() {
            return Objects.hash(id, name, parent);
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public RepoFolder getParent() {
            return parent;
        }

        public void setParent(RepoFolder parent) {
            this.parent = parent;
        }

        protected String name = null;

        protected RepoFolder parent;
    }
}
