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
package com.jaspersoft.jasperserver.dto.adhoc.query.group.axis;

import com.jaspersoft.jasperserver.dto.adhoc.query.ClientField;

import java.util.List;

/**
 * @author Andriy Godovanets
 */
public interface ClientAxis<T extends ClientField> {

    /**
     * Get axis item by name
     *
     * @param name item name
     * @return item
     */
    T get(String name);

    /**
     * Get axis item by index
     *
     * @param index item index
     * @return item
     */
    T get(int index);

    /**
     * Axis items: levels, fields, aggregations
     *
     * @return Axis items list
     */
    List<T> getItems();


    int size();
}
