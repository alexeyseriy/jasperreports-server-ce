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

import $ from 'jquery';
import repositorySearch from 'src/repository/repository.search.components';
import permissionDialogTemp from './test/templates/permissions.htm';
import setTemplates from 'js-sdk/test/tools/setTemplates';
import layoutModule from "../../../src/core/core.layout";

describe('Permission Dialog components', function () {
    const resource = {};
    beforeEach(function () {
        setTemplates(permissionDialogTemp);
    });
    describe(' -- ResourcePermissions', function () {
        it('should be able to call editResourcePermissions methods of repositorySearch', function () {
            spyOn(repositorySearch, 'editResourcePermissions');
            expect(repositorySearch.editResourcePermissions).toBeDefined();
            repositorySearch.editResourcePermissions(resource);
            expect(repositorySearch.editResourcePermissions).toHaveBeenCalled();
            expect(repositorySearch.editResourcePermissions).toHaveBeenCalledWith(resource);
        });

        it('should be able to call ResourcePermissions methods of repositorySearch', function () {
            spyOn(repositorySearch.resourcePermissionsObj, 'ResourcePermissions').and.callThrough();
            repositorySearch.resourcePermissionsObj._processTemplate = () => {};
            repositorySearch.resourcePermissionsObj.ResourcePermissions(resource);
            expect(repositorySearch.resourcePermissionsObj.ResourcePermissions).toHaveBeenCalled();
            expect(repositorySearch.resourcePermissionsObj.ResourcePermissions).toHaveBeenCalledWith(resource);
        });

        it('should be able to call _showWarning method of ResourcePermissions', function () {
            spyOn(repositorySearch.resourcePermissionsObj.ResourcePermissions.prototype, '_showWarning');
            repositorySearch.resourcePermissionsObj._processTemplate = () => {};
            repositorySearch.resourcePermissionsObj.ResourcePermissions(resource);
            repositorySearch.resourcePermissionsObj.ResourcePermissions.prototype._dom = $('<div id="permissionDialog"></div>');
            repositorySearch.resourcePermissionsObj.ResourcePermissions.prototype._showWarning();
            expect(repositorySearch.resourcePermissionsObj.ResourcePermissions.prototype._showWarning).toBeDefined();
            expect(repositorySearch.resourcePermissionsObj.ResourcePermissions.prototype._showWarning).toHaveBeenCalled();
        });

        it('should show and receive focus on error message when call _showWarning method called', function () {
            const permisionDialogEL = $('#permissionDialog');
            const permissionBodyEL = permisionDialogEL.find('div.body');
            repositorySearch.resourcePermissionsObj._processTemplate = () => {};
            repositorySearch.resourcePermissionsObj.ResourcePermissions(resource);
            repositorySearch.resourcePermissionsObj.ResourcePermissions.prototype._dom = permisionDialogEL;
            repositorySearch.resourcePermissionsObj.ResourcePermissions.prototype._showWarning();
            expect(permissionBodyEL.hasClass(layoutModule.ERROR_CLASS)).toBeTruthy();
            expect(permissionBodyEL.find(layoutModule.MESSAGE_WARNING_PATTERN)[0]).toEqual(document.activeElement);
        });
    });
});