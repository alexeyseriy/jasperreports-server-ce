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

import './commons.minimal.main';
import '../namespace/namespace';
import '../core/core.accessibility';
import '../core/core.events.bis';
import '../core/core.key.events';
import actionModel from '../actionModel/actionModel.modelGenerator';
import primaryNavigation from '../actionModel/actionModel.primaryNavigation';
import globalSearch from '../repository/repository.search.globalSearchBoxInit';
import layoutModule from '../core/core.layout';
import jrsConfigs from 'js-sdk/src/jrs.configs';
import $ from 'jquery';

// add information about locale into body's class
$('body').addClass('locale-' + jrsConfigs.userLocale);
layoutModule.initialize();
primaryNavigation.initializeNavigation();    //navigation setup
//navigation setup
jrsConfigs.initAdditionalUIComponents && globalSearch.initialize();
document.fire('dom:loaded');
