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

import BaseDataSourceView from '../view/BaseDataSourceView';
import _ from 'underscore';
import i18n from '../../i18n/all.properties';
import CustomDataSourceModel from '../model/CustomDataSourceModel';
import InternalDiagnosticTemplate from '../template/InternalDiagnosticTemplate.htm';

export default BaseDataSourceView.extend({
    PAGE_TITLE_NEW_MESSAGE_CODE: 'resource.datasource.jndi.page.title.new',
    PAGE_TITLE_EDIT_MESSAGE_CODE: 'resource.datasource.jndi.page.title.edit',
    modelConstructor: CustomDataSourceModel,
    render: function () {
        this.$el.empty();
        this.renderBlankBody();
        return this;
    },
    renderBlankBody: function () {
        this.$el.append(_.template(InternalDiagnosticTemplate, { i18n: i18n }));
    }
});