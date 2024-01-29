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

package com.jaspersoft.jasperserver.export.modules.favorites;

import com.jaspersoft.jasperserver.api.metadata.common.service.RepositoryService;
import com.jaspersoft.jasperserver.api.metadata.common.service.impl.hibernate.FavoriteResourceService;
import com.jaspersoft.jasperserver.export.io.ObjectSerializer;

public class FavoritesModuleConfiguration {
    private RepositoryService repository;
    private FavoriteResourceService favoriteResourceService;
    private ObjectSerializer serializer;
    private String indexFavoriteElement;
    private String favoriteIndexFilename;
    private String favoritesDir;

    public RepositoryService getRepository() {
        return repository;
    }

    public void setRepository(RepositoryService repository) {
        this.repository = repository;
    }

    public String getFavoriteIndexFilename() {
        return favoriteIndexFilename;
    }

    public void setFavoriteIndexFilename(String favoriteIndexFilename) {
        this.favoriteIndexFilename = favoriteIndexFilename;
    }

    public String getFavoritesDir() {
        return favoritesDir;
    }

    public void setFavoritesDir(String favoritesDir) {
        this.favoritesDir = favoritesDir;
    }

    public FavoriteResourceService getFavoriteResourceService() {
        return favoriteResourceService;
    }

    public void setFavoriteResourceService(FavoriteResourceService favoriteResourceService) {
        this.favoriteResourceService = favoriteResourceService;
    }

    public String getIndexFavoriteElement() {
        return indexFavoriteElement;
    }

    public void setIndexFavoriteElement(String indexFavoriteElement) {
        this.indexFavoriteElement = indexFavoriteElement;
    }

    public ObjectSerializer getSerializer() {
        return serializer;
    }

    public void setSerializer(ObjectSerializer serializer) {
        this.serializer = serializer;
    }
}
