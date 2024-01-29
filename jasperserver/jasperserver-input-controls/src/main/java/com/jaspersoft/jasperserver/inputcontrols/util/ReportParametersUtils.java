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
package com.jaspersoft.jasperserver.inputcontrols.util;

import com.jaspersoft.jasperserver.dto.reports.inputcontrols.InputControlOption;
import com.jaspersoft.jasperserver.dto.reports.inputcontrols.InputControlState;
import com.jaspersoft.jasperserver.dto.reports.inputcontrols.ReportInputControl;
import org.apache.commons.collections4.CollectionUtils;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class ReportParametersUtils {

    /**
     * Get values from input controls states.
     * This method removes all duplicated values.
     *
     * @param states input control states
     * @return unordered unique values
     */
    public static Map<String, String[]> getValueMapFromInputControlStates(List<InputControlState> states) {
        Map<String, String[]> valueMap = new HashMap<>(states.size());
        for (InputControlState state : states) {
            if (state != null)
                valueMap.put(state.getId(), getValueFromInputControlState(state));
        }

        return valueMap;
    }

    /**
     * Get values from input controls which contains non-null state.
     * This method removes all duplicated values.
     *
     * @param inputControls with internal non-null states
     * @return unordered unique values
     */
    public static Map<String, String[]> getValueMapFromInputControls(List<ReportInputControl> inputControls) {
        HashMap<String, String[]> valueMap = new LinkedHashMap<>(inputControls.size());
        for (ReportInputControl ic : inputControls) {
            InputControlState state = ic.getState();
            if (state != null) {
                valueMap.put(state.getId(), getValueFromInputControlState(state));
            }
        }
        return valueMap;
    }

    private static String[] getValueFromInputControlState(InputControlState state) {
        if (state.getValue() != null) {
            return new String[]{state.getValue()};
        } else if (CollectionUtils.isNotEmpty(state.getOptions())) {
            Set<String> values = new LinkedHashSet<>(state.getOptions().size());
            for (InputControlOption option : state.getOptions()) {
                if (option.isSelected()) {
                    values.add(option.getValue());
                }
            }
            return values.toArray(new String[0]);
        } else {
            return new String[0];
        }
    }
}
