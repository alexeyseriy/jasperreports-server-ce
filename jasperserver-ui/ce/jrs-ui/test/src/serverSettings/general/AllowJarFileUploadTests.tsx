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

import React from 'react';
import { mount } from 'enzyme';
import AllowJarFileUpload from 'src/serverSettings/general/AllowJarFileUpload';
import restoreBuiltInObjects from 'test/tools/restoreBuiltInObjects';

describe('Allow Jar file upload tests ', () => {

    beforeEach(() => {
        restoreBuiltInObjects.enableNativeImplementation();
    });

    afterEach(() => {
        restoreBuiltInObjects.restoreEnvironment();
    });

    it('should render Allow Jar file upload component', () => {
        const component = mount(
            <AllowJarFileUpload />
        );
        const input = component.find('.jr-MuiCardContent-root');
        expect(input.length).toBeFalsy();
        component.unmount();
    });
})
