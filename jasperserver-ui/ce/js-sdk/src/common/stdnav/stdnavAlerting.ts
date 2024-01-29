/*
 * Copyright (C) 2005 - 2020 TIBCO Software Inc. All rights reserved.
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

import jQuery from 'jquery';

enum AlertLevel {
    Alert,
    Polite
}

const AlertLevelToElementIdMap: {[key in AlertLevel]: string} = {
    [AlertLevel.Alert]: '#stdnavAlert',
    [AlertLevel.Polite]: '#stdnvaPolite'
}

const DEFAULT_CLEAR_ALERT_TIMEOUT = 5 * 1000; // 5 seconds

const timeout: Map<AlertLevel, number> = new Map();

function setLiveRegionValue(level: AlertLevel, message: Element | string, clearAlertTimeout = DEFAULT_CLEAR_ALERT_TIMEOUT) {
    const levelEmentId = AlertLevelToElementIdMap[level];

    if (timeout.get(level)) {
        clearTimeout(timeout.get(level))
        timeout.delete(level);
    }

    jQuery(`${levelEmentId}`).empty().append(message);

    const levelTimeout = window.setTimeout(() => {
        jQuery(`${levelEmentId}`).empty();
        timeout.delete(level);
    }, clearAlertTimeout)

    timeout.set(level, levelTimeout);
}

export default {
    alert(message: Element | string, clearAlertTimeout?: number) {
        setLiveRegionValue(AlertLevel.Alert, message, clearAlertTimeout)
    },
    polite(message: Element | string, clearAlertTimeout?: number) {
        setLiveRegionValue(AlertLevel.Polite, message, clearAlertTimeout)
    }
}
