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

import Trait from 'src/components/scalableList/model/trait/addToSelectionModelTrait';

describe('addToSelectionModelTrait:', function () {

    const context = {
        get: function () {
            return 1;
        },
        selectionContains: function (value, index) {},
        addValueToSelection: function (value, index) {}
    };

    it('afterFetchComplete function: code coverage', function () {

        const items = [
            undefined,
            {
                addToSelection: true
            },
            {
                addToSelection: 'some_other_value'
            }
        ];

        Trait.afterFetchComplete.call(context, items);
    });
});