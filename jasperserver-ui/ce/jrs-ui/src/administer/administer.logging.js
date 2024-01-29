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
/**
 * @version: $Id$
 */
import {$} from 'prototype';
import layoutModule from '../core/core.layout';
import {matchAny} from "../util/utils.common";
import Administer from './administer.base';
import webHelpModule from '../components/components.webHelp';
import jQuery from 'jquery';
import AdministerUtils from './administer.common';

var logging = {
    initialize: function () {
        AdministerUtils.initialize.call(this);
    },
    initEvents: function () {
        const self = this;
        AdministerUtils.initEvents();
        jQuery('.js-logSettings select').on('change', function (e) {
            var $el = jQuery(e.target), loggerName;
            if ($el.hasClass('js-newLogger')) {
                loggerName = jQuery('#newLoggerName').val();
            } else {
                loggerName = $el.parent().prev().text();
            }
            self._setLevel(encodeURIComponent(loggerName), $el.val());
        });
    },
    _setLevel: function (logger, level) {
        const formElement = Object.assign(document.createElement("form"), {
            method: 'post',
            action: 'log_settings.html'
        });
        formElement.appendChild(Object.assign(document.createElement("input"), {
            type: 'hidden',
            name: 'logger',
            value: logger
        }));
        formElement.appendChild(Object.assign(document.createElement("input"), {
            type: 'hidden',
            name: 'level',
            value: level
        }));
        document.body.appendChild(formElement);
        formElement.submit();
    }
};

export default logging;