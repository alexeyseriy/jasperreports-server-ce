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

export default (html: string) => {
    // The length for '<div id='treeNodeText'>' is 23:
    const START_DIV_LENGTH = 23;
    // The length for '</div>' is 6:
    const END_DIV_LENGTH = 6;
    // Length for start + end is 29:
    const WRAPPING_DIV_LENGTH = 29;

    const htmlTrimmed = html.trim();
    if (htmlTrimmed.length <= WRAPPING_DIV_LENGTH) {
        return {};
    }
    const jsonAsText = htmlTrimmed.substring(START_DIV_LENGTH, htmlTrimmed.length - END_DIV_LENGTH);
    return JSON.parse(jsonAsText);
};
