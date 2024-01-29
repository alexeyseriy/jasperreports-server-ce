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

package com.jaspersoft.jasperserver.api.metadata.common.service.impl.hibernate;

import com.jaspersoft.jasperserver.api.common.domain.ExecutionContext;
import com.jaspersoft.jasperserver.api.metadata.common.domain.ResourceLookup;
import com.jaspersoft.jasperserver.api.metadata.common.domain.client.FavoriteResourceImpl;
import com.jaspersoft.jasperserver.api.metadata.common.service.impl.hibernate.persistent.RepoResource;
import com.jaspersoft.jasperserver.api.metadata.user.domain.Role;
import com.jaspersoft.jasperserver.api.metadata.user.domain.User;

import java.util.List;
import java.util.Map;

public interface FavoriteResourceService {

    void addFavorites(User user, List<String> uriList);

    void removeFavorites(User user, List<String> uriList);

    List<String> getFavoritesURIList(User user, List<String> resourceURIList);

    List<Long> getFavoriteIdsForUser(User user, boolean isFilterEnabled);

    List<RepoResource> getRepoResourceList(List<String> uriList);

    List<ResourceLookup>  toLookups(List<RepoResource> repoResources);

    List<FavoriteResourceImpl> getFavoritesForUri(ExecutionContext context, String resURI);
    List<FavoriteResourceImpl> getFavoritesForUri(ExecutionContext context, String resURI, Filters filters);

    void importFavorites(ExecutionContext context, Map<String,List<String>> userURIsFavMap);

    class Filters {
        public List<String> forRoles;
        public List<String> forUsers;
        public List<String> includeResourcesOfType;

        public List<String> getForRoles() {
            return forRoles;
        }

        public void setForRoles(List<String> forRoles) {
            this.forRoles = forRoles;
        }

        public List<String> getForUsers() {
            return forUsers;
        }

        public void setForUsers(List<String> forUsers) {
            this.forUsers = forUsers;
        }

        public List<String> getIncludeResourcesOfType() {
            return includeResourcesOfType;
        }

        public void setIncludeResourcesOfType(List<String> includeResourcesOfType) {
            this.includeResourcesOfType = includeResourcesOfType;
        }
    }
}
