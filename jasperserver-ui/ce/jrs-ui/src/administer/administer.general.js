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
/**
 * @version: $Id$
 */
import jQuery from 'jquery';
import layoutModule from '../core/core.layout';
import Administer from './administer.base';
import dialogs from '../components/components.dialogs';
import AdministerUtils from './administer.common';

const general = {
    SAVE_PFX: 'save',
    CANCEL_PFX: 'cancel',
    ERROR_PFX: 'error_',
    INPUT_PFX: 'input_',
    initialize() {
        AdministerUtils.initialize.call(this);
    },
    initEvents() {
        AdministerUtils.initEvents();
    },
    _updateCallback(response) {
        if (response.error) {
            dialogs.systemConfirm.showWarning(Administer.getMessage(response.error));
        } else {
            dialogs.systemConfirm.show(Administer.getMessage(response.result));
            jQuery(document.body).find(`[for="${general.INPUT_PFX}${response.optionName}"]`).removeClass(layoutModule.ERROR_CLASS)[0]
        }
    }
};

export default general;
