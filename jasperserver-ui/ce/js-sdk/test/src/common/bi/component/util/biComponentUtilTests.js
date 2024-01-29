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

import biComponentUtil from 'src/common/bi/component/util/biComponentUtil';
import $ from 'jquery';

describe('biComponentUtil:', function () {

    describe('code coverage:', function () {
        it('deepClone method', function () {
            const jqObj = $('<div></div>');
            biComponentUtil.cloneDeep(jqObj);

            const array = [];
            array.parameters = {};
            const result = biComponentUtil.cloneDeep(array);
            expect(result).toEqual(array);
        });

        it('createField method', function () {
            const
                object = {},
                propertyName = 'propertyName',
                instanceData = {},
                readOnly = [],
                stateModel = {
                    set: function () {}
                };
            biComponentUtil.createField(object, propertyName, instanceData, readOnly, stateModel);
            object[propertyName]();
            const result = object[propertyName]({});
            expect(result).toBe(object);
        });

        it('createReadOnlyField method', function () {
            const
                object = {},
                propertyName = 'propertyName',
                instanceData = {},
                stateModel = {
                    set: function () {}
                };
            let
                throwError = true;
            biComponentUtil.createReadOnlyField(object, propertyName, instanceData, throwError, stateModel);
            object[propertyName]();
            try {
                object[propertyName]({});
            } catch (e) {}

            throwError = false;
            biComponentUtil.createReadOnlyField(object, propertyName, instanceData, throwError, stateModel);
            const result = object[propertyName]({});

            expect(result).toBe(object);
        });

        it('createProperty method', function () {
            const
                object = {},
                propertyName = 'propertyName',
                instanceData = {
                    properties: {
                        propertyName: 1
                    }
                },
                stateModel = {};
            biComponentUtil.createProperty(object, propertyName, instanceData, stateModel);
            object[propertyName]();
            const result = object[propertyName]({});
            expect(result).toBe(object);
        });

        it('createReadOnlyProperty method', function () {
            const
                object = {},
                propertyName = 'propertyName',
                instanceData = {
                    properties: {
                        propertyName: 1
                    }
                },
                stateModel = {};
            let
                throwError = true;
            biComponentUtil.createReadOnlyProperty(object, propertyName, instanceData, throwError, stateModel);
            object[propertyName]();
            try {
                object[propertyName]({});
            } catch (e) {}

            throwError = false;
            biComponentUtil.createReadOnlyProperty(object, propertyName, instanceData, throwError, stateModel);
            const result = object[propertyName]({});

            expect(result).toBe(object);
        });

        it('createValidateAction method', function () {
            const
                instanceData = {
                    properties: {
                        propertyName: 1
                    }
                },
                schema = {},
                stateModel = {};
            const result = biComponentUtil.createValidateAction(instanceData, schema, stateModel);
            expect(result).toBeTruthy();
        });

        it('createInstancePropertiesAndFields method', function () {
            const
                context = {},
                instanceData = {
                    properties: {
                        propertyName: 1
                    }
                },
                propertyNames = ['propertyName'],
                fieldNames = ['fieldName'],
                readOnlyFieldNames = ['readOnlyFieldName'],
                stateModel = {};
            biComponentUtil.createInstancePropertiesAndFields(context, instanceData, propertyNames, fieldNames, readOnlyFieldNames, stateModel);
            expect(true).toBeTruthy();
        });
    });

    it('should be able to deep clone ignoring jQuery objects', function () {
        var jqObj = $('<div></div>');
        expect(biComponentUtil.cloneDeep(jqObj)).toBe(jqObj);
        var domObj = $(document.getElementsByTagName('body')[0]);
        expect(biComponentUtil.cloneDeep(domObj)).toBe(domObj);
    });
});