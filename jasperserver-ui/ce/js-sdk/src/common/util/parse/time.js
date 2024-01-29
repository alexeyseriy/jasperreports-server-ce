/*
 * Copyright (C) 2005 - 2022 TIBCO Software Inc. All rights reserved.
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

import jrsConfigs from "../../../jrs.configs";
import RelativeTime from '../datetime/RelativeTime';
import Time from '../datetime/Time';

var ISO_8061_TIME_PATTERN = 'HH:mm:ss';

let localeSettingsObject = jrsConfigs.localeSettings;

function isRelativeTime(value) {
    return RelativeTime.isValid(value);
}
function isTime(value, timeFormat) {
    let time = Time.parse(value, timeFormat ? timeFormat : localeSettingsObject.timeFormat);
    if (time) {
        // is we got into this IF that means the format matches the value, so now let's see if the value contains
        // correct time
        return time.isValid();
    }
    // if the format didn't match the value then, maybe, the value contains millisecnds, and to check this we need to
    // add a millisecond formatter to the format.
    // BUT: if the format was specified as an argument, then we don't need to guess if the value has the milliseconds
    // or not, we just follow the parse() result.
    if (timeFormat) {
        return false;
    }
    // ok, so, checking with milliseconds formatter:
    time = Time.parse(value, localeSettingsObject.timeFormat + '.l');
    return Boolean(time && time.isValid());
}
function isIso8601Time(value) {
    return isTime(value, ISO_8061_TIME_PATTERN);
}
function compareTimes(value1, value2, timeFormat) {
    const time1 = value1 instanceof Time ? value1 : Time.parse(value1, timeFormat != null ? timeFormat : localeSettingsObject.timeFormat),
        time2 = value2 instanceof Time ? value2 : Time.parse(value2, timeFormat != null ? timeFormat : localeSettingsObject.timeFormat);
    if (typeof time1 === 'undefined' || typeof time2 === 'undefined') {
        return;
    }
    return Time.compare(time1, time2);
}
function timeToIso8061Time(hours, minutes, seconds) {
    const obj = new Time(hours, minutes, seconds);
    if (obj.isValid()) {
        return obj.format(ISO_8061_TIME_PATTERN);
    }
    return undefined;
}
function iso8601TimeToTimeObject(val) {
    return Time.parse(val, ISO_8061_TIME_PATTERN);
}
export default {
    isRelativeTime: isRelativeTime,
    isTime: isTime,
    isIso8601Time: isIso8601Time,
    compareTimes: compareTimes,
    timeToIso8061Time: timeToIso8061Time,
    iso8601TimeToTimeObject: iso8601TimeToTimeObject
};
