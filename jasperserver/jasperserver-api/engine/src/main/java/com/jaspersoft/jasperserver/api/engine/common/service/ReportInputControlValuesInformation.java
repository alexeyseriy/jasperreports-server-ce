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

package com.jaspersoft.jasperserver.api.engine.common.service;

import com.jaspersoft.jasperserver.api.JasperServerAPI;

import java.util.Set;

/**
 * @author  inesterenko
 */

@JasperServerAPI
public interface ReportInputControlValuesInformation {

    Set<String> getControlValuesNames();

    ReportInputControlValueInformation getInputControlValueInformation(String name);

    /**
     * Indicate if input control has filter with <i>isAnyValue()</i> function or if all values could be selected.
     * If it's <b>true</b> it doesn't mean that all values will be always selected, but rather they will be selected
     * if incoming values / parameters are empty (if nothing is selected).
     *
     * For example:
     * - isAnyValue is true but parameters contains a single selected value - IC should have only a single selected value;
     * - isAnyValue is true but empty parameters (no values) - IC should select all values.
     */
    boolean isAnyValue();

    void setAnyValue(boolean anyValue);

}
