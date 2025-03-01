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

package com.jaspersoft.jasperserver.dto.adhoc.dataset;

import com.jaspersoft.jasperserver.dto.common.DeepCloneable;

import java.io.Serializable;

/**
 * @author Vasyl Spachynskyi
 * @version $Id: Id $
 * @since 09.12.2016
 */
public class ClientFlatDatasetFieldReference extends ClientDatasetFieldReference implements DeepCloneable<ClientDatasetFieldReference>, Serializable {

    public enum FlatDatasetFieldKind {
        GROUP_KIND("group"), AGGREGATION_KIND("aggregation"), DETAIL_KIND("detail");


        private String group;

        FlatDatasetFieldKind(String group) {
            this.group = group;
        }

        @Override
        public String toString() {
            return group;
        }
    }

    private String kind;
    private String groupRef;

    public ClientFlatDatasetFieldReference() {
        super();
    }

    public ClientFlatDatasetFieldReference(ClientFlatDatasetFieldReference field) {
        super(field);

        setKind(field.getKind());
        setGroupRef(field.getGroupRef());
    }

    public String getKind() {
        return kind;
    }

    public ClientFlatDatasetFieldReference setKind(String kind) {
        this.kind = kind;
        return this;
    }

    public String getGroupRef() {
        return groupRef;
    }

    public ClientFlatDatasetFieldReference setGroupRef(String groupRef) {
        this.groupRef = groupRef;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;

        ClientFlatDatasetFieldReference that = (ClientFlatDatasetFieldReference) o;

        if (kind != null ? !kind.equals(that.kind) : that.kind != null) return false;
        return !(groupRef != null ? !groupRef.equals(that.groupRef) : that.groupRef != null);

    }

    @Override
    public int hashCode() {
        int result = super.hashCode();
        result = 31 * result + (kind != null ? kind.hashCode() : 0);
        result = 31 * result + (groupRef != null ? groupRef.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return this.getClass().getSimpleName() + "{" +
                "kind='" + kind + '\'' +
                ", groupRef='" + groupRef + '\'' +
                "} " + super.toString();
    }

    @Override
    public ClientFlatDatasetFieldReference deepClone() {
        return new ClientFlatDatasetFieldReference(this);
    }
}
