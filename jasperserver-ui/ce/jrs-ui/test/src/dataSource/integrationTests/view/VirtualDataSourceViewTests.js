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

import sinon from 'sinon';
import $ from 'jquery';
import _ from 'underscore';
import resourceLocator from 'src/resource/resource.locate';
import i18n from 'src/i18n/all.properties';
import jrsConfigs from 'js-sdk/src/jrs.configs';
import dynamicTree from 'src/dynamicTree/dynamicTree.utils';
import dataSourceConfig from '../../test/mock/dataSourceConfigMock'
import VirtualDataSourceView from 'src/dataSource/view/VirtualDataSourceView';
import dataSourceTestingHelper from '../../test/helper/dataSourceTestingHelper'

describe('Testing VirtualDataSourceView', function () {
    var virtualDataSourceView, fakeServer, root;
    beforeEach(function () {
        jrsConfigs.addDataSource = dataSourceConfig;
        sinon.stub(resourceLocator, 'initialize');
        sinon.createRepositoryTree = dynamicTree.createRepositoryTree;
        dynamicTree.createRepositoryTree = function () {
            return {
                observe: function () {
                },
                showTreePrefetchNodes: function () {
                }
            };
        };
    });
    afterEach(function () {
        delete jrsConfigs.addDataSource;
        resourceLocator.initialize.restore();
        dynamicTree.createRepositoryTree = sinon.createRepositoryTree;
    });
    it('VirtualDataSourceView should be defined', function () {
        expect(VirtualDataSourceView).toBeDefined();
        expect(typeof VirtualDataSourceView).toEqual("function");
    });
    describe('VirtualDataSourceView\'s work', function () {
        beforeEach(function () {
            dataSourceTestingHelper.beforeEach();    // create an variable which holds the DS in the DOM object
            // create an variable which holds the DS in the DOM object
            root = $('[name=dataSourceTestArea]');    // prepare fake server
            // prepare fake server
            fakeServer = sinon.fakeServer.create();    // init the data source
            // init the data source
            virtualDataSourceView = new VirtualDataSourceView(_.extend(jrsConfigs.addDataSource.initOptions, {
                dataSourceType: 'virtualdatasource',
                dataSource: undefined,
                el: root
            }));
            virtualDataSourceView.render();
        });
        afterEach(function () {
            // remove the data source from the page
            virtualDataSourceView.remove();    // clear the testable area
            // clear the testable area
            root.empty();    // destroy fake XHR service
            // destroy fake XHR service
            fakeServer.restore();
            dataSourceTestingHelper.afterEach();
        });
        it('Check if all fields are visible', function () {
            // check data source specific fields
            expect(root.find('#subDataSourcesTree')).toBeVisible();
            expect(root.find('#moveButtons')).toBeVisible();
            expect(root.find('#moveButtons').children().length).toBe(3);
            expect(root.find('#selectedDataSourcesHeader')).toBeVisible();
            expect(root.find('#selectedSubDataSourcesListContainer')).toBeVisible();
        });
        it('Check if everything has proper default value', function () {
            // check page title
            expect($('#display .showingToolBar > .content > .header > .title').text()).toBe(i18n['resource.datasource.virtual.page.title.new']);
        });
    });
});