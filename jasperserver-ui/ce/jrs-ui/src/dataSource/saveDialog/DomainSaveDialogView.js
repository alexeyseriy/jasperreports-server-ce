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
import i18n from '../../i18n/all.properties';
import ResourceModel from 'bi-repository/src/bi/repository/model/RepositoryResourceModel';
import BaseSaveDialogView from './BaseSaveDialogView';
import standardConfirmTemplate from 'js-sdk/src/common/templates/standardConfirm.htm';
import domainSaveDialogTemplate from './template/domainSaveDialogTemplate.htm';
import dialogs from '../../components/components.dialogs';

export default BaseSaveDialogView.extend({
    saveDialogTemplate: domainSaveDialogTemplate,
    constructor: function (options) {
        options || (options = {});
        this.options = options;
        BaseSaveDialogView.prototype.constructor.call(this, options);
    },
    initialize: function () {
        this.preSelectedFolder = ResourceModel.getParentFolderFromUri(this.options.dataSource.uri) || '/';
        BaseSaveDialogView.prototype.initialize.apply(this, arguments);
        this.listenTo(this.model, 'change:openInAdHocDesigner', this._onOpenInAdHocDesignerChange);
    },
    extendModel: function (sourceModel) {
        var model = BaseSaveDialogView.prototype.extendModel.call(this, sourceModel), self = this, dataSourceName, domainName, domainResourceId;
        model.set('openInAdHocDesigner', false);    // We need to pre-generate the domain name based on the data source name.
        // And because we haven't set listeners for model's changes (we'll do this later)
        // we have to generate resourceID ourselves
        // We need to pre-generate the domain name based on the data source name.
        // And because we haven't set listeners for model's changes (we'll do this later)
        // we have to generate resourceID ourselves
        dataSourceName = sourceModel.dataSource.label;
        domainName = dataSourceName + ' Domain';
        domainResourceId = ResourceModel.generateResourceName(domainName);
        model.set('label', domainName);
        model.set('name', domainResourceId);
        model.validation = _.extend({}, ResourceModel.prototype.validation, {
            label: [
                {
                    required: true,
                    msg: i18n['resource.datasource.saveDomainDialog.validation.not.empty.label']
                },
                {
                    maxLength: ResourceModel.settings.LABEL_MAX_LENGTH,
                    msg: i18n['resource.datasource.saveDomainDialog.validation.too.long.label']
                }
            ],
            name: [
                {
                    required: true,
                    msg: i18n['resource.datasource.saveDomainDialog.validation.not.empty.name']
                },
                {
                    maxLength: ResourceModel.settings.NAME_MAX_LENGTH,
                    msg: i18n['resource.datasource.saveDomainDialog.validation.too.long.name']
                },
                {
                    doesNotContainCharacters: ResourceModel.settings.NAME_NOT_SUPPORTED_SYMBOLS,
                    msg: i18n['resource.datasource.saveDomainDialog.validation.invalid.chars.name']
                }
            ],
            description: [
                { required: false },
                {
                    maxLength: ResourceModel.settings.DESCRIPTION_MAX_LENGTH,
                    msg: i18n['resource.datasource.saveDomainDialog.validation.too.long.description']
                }
            ],
            parentFolderUri: [{
                fn: function (value) {
                    if (!self.options.skipLocation) {
                        if (_.isNull(value) || _.isUndefined(value) || _.isString(value) && value === '') {
                            return i18n['resource.datasource.saveDomainDialog.validation.not.empty.parentFolderIsEmpty'];
                        }
                        if (value.slice(0, 1) !== '/') {
                            return i18n['resource.datasource.saveDomainDialog.validation.folder.not.found'].replace('{0}', value);
                        }
                    }
                }
            }]
        });
        return model;
    },
    _onOpenInAdHocDesignerChange: function () {
        var textId = this._getLabelForSaveButton();
        this.changeButtonLabel('save', i18n[textId]);
    },
    _getLabelForSaveButton: function (model) {
        // this dialog can be called with any model
        model = model || this.model;
        var saveButtonLabel = 'resource.datasource.saveDialog.save';
        if (!!model.get('openInAdHocDesigner')) {
            saveButtonLabel = 'resource.datasource.saveDomainDialog.saveAndOpenDesigner';
        }
        return saveButtonLabel;
    },
    _onSaveDialogCancelButtonClick: function () {
        var self = this, msg = 'You are about to cancel the creation of a new domain.<br/>If You wish to create a domain in the future,<br/>You will need to go through the regular Domain Designer.<br/>The data source, however, has successfully been saved.', confirm = $(standardConfirmTemplate);
        confirm.find('.body').html(msg);
        dialogs.popupConfirm.show(confirm.get(0), true, {
            okButtonSelector: '[name=buttonOK]',
            cancelButtonSelector: '[name=buttonCancel]'
        }).done(function () {
            self._closeDialog();
            if (_.isFunction(self.options.success)) {
                self.options.success();
            }
        });
    },
    performSave: function () {
        var self = this;
        this.model.save().done(function () {
            self._closeDialog();
            if (_.isFunction(self.options.success)) {
                self.options.success();
            }
        });
    }
});