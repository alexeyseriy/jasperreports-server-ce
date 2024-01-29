/*
 * Copyright (C) 2005 - 2023. Cloud Software Group, Inc. All Rights Reserved.
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

import layoutModule from "../core/core.layout";
import webHelpModule from "../components/components.webHelp";
import jQuery from "jquery";
import {matchAny} from "../util/utils.common";
import Administer from "./administer.base";

const AdministerUtils={
    initialize() {
        layoutModule.resizeOnClient('serverSettingsMenu', 'settings');
        webHelpModule.setCurrentContext('admin');
        this.initEvents();
    },
    initEvents() {
        jQuery('#display').on('click', (e) => {
            const elem = e.target;
            const button = matchAny(elem, [layoutModule.BUTTON_PATTERN], true);
            if (button) {
                // observe navigation
                for (const pattern in Administer.menuActions) {
                    if (jQuery(button).is(pattern) && !jQuery(button).parents('li').hasClass('selected')) {
                        document.location = Administer.menuActions[pattern]();
                        return;
                    }
                }
            }
        });
    },
};

export default AdministerUtils;