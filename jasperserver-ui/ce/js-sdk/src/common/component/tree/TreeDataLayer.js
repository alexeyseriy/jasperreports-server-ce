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

import _ from 'underscore';
import $ from 'jquery';
import ClassUtil from '../../util/classUtil';

import request from '../../transport/request';

export default ClassUtil.extend({
    constructor: function (options) {
        this.requestType = options.requestType ? options.requestType : 'GET';
        options.getDataUri && (this.getDataUri = options.getDataUri);
        this.getDataUri || (this.getDataUri = _.template(options.dataUriTemplate));
        options.getDataArray && (this.getDataArray = options.getDataArray);
        options.getDataSize && (this.getDataSize = options.getDataSize);
        options.extractId && (this.extractId = options.extractId);
        this.levelDataId = options.levelDataId ? options.levelDataId : 'id';
        this.processors = options.processors || [];
        this.initialize(options);
    },
    initialize: function (options) {
    },
    extractId: function (item) {
        return item[this.levelDataId];
    },
    getDataSize: function (data, status, xhr) {
        return this.getDataArray(data, status, xhr).length;
    },
    getDataArray: function (data, status, xhr) {
        return data;
    },
    obtainData: function (options, level) {
        var result = new $.Deferred(), self = this;
        if (this.predefinedData && this.predefinedData[options.id]) {
            result.resolve({
                total: this.predefinedData[options.id].length,
                data: this.predefinedData[options.id]
            });
        } else {
            request({
                type: this.requestType,
                dataType: this.dataType || 'json',
                headers: {
                    Accept: this.accept || 'application/json',
                    'Content-Type': this.contentType || undefined
                },
                cache: false,
                data: this.data || undefined,
                url: this.getDataUri(options)
            }).done(function () {
                var data = arguments[0];
                self.dataSize = self.getDataSize.call(self, data, options, arguments[2]);
                result.resolve({
                    total: self.dataSize,
                    data: process.call(self, self.getDataArray.call(self, data, options, arguments[2]), options)
                });
            }).fail(function (xhr) {
                result.reject(xhr.status, xhr.responseText);
            });
        }
        return result;
    },
    _process: process
});
function process(data, options) {
    return invokeProcessors.call(this, changeDataStructure.call(this, data), options);
}
function changeDataStructure(data) {
    for (var i = 0, l = data.length; i < l; i++) {
        data[i] = {
            id: this.extractId(data[i]),
            value: data[i]
        };
    }
    return data;
}
function invokeProcessors(data, options) {
    var processedData, processedItem;
    if (this.processors && this.processors.length) {
        for (var i = 0, l = this.processors.length; i < l; i++) {
            processedData = [];
            for (var j = 0, le = data.length; j < le; j++) {
                processedItem = this.processors[i].processItem(data[j], options, this);
                processedItem && processedData.push(processedItem);
            }
            data = processedData;
        }
    }
    return data;
}