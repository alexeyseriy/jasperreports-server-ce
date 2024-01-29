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

package com.jaspersoft.jasperserver.dto.favorite;

import com.jaspersoft.jasperserver.dto.common.DeepCloneable;

import java.util.List;

import static com.jaspersoft.jasperserver.dto.utils.ValueObjectUtils.checkNotNull;
import static com.jaspersoft.jasperserver.dto.utils.ValueObjectUtils.copyOf;

public class FavoriteResourceListWrapper implements DeepCloneable<FavoriteResourceListWrapper> {
    private List<FavoriteResource> favorites;

    public FavoriteResourceListWrapper() {
    }

    public FavoriteResourceListWrapper(List<FavoriteResource> favorites) {
        this.favorites = favorites;
    }

    public FavoriteResourceListWrapper(FavoriteResourceListWrapper other) {
        checkNotNull(other);

        this.favorites = copyOf(other.getFavorites());
    }

    @Override
    public FavoriteResourceListWrapper deepClone() {
        return new FavoriteResourceListWrapper(this);
    }

    public List<FavoriteResource> getFavorites() {
        return favorites;
    }

    public FavoriteResourceListWrapper setFavorites(List<FavoriteResource> favorites) {
        this.favorites = favorites;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        FavoriteResourceListWrapper that = (FavoriteResourceListWrapper) o;

        if (favorites != null ? !favorites.equals(that.favorites) : that.favorites != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return favorites != null ? favorites.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "FavoriteResourceListWrapper{" +
                "favorites=" + favorites +
                '}';
    }
}
