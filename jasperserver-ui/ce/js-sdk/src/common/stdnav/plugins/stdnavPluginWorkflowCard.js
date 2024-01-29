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
import logger from "../../logging/logger";
import stdnav from '../stdnav';


let localLogger = logger.register("stdnavPluginWorkflowCard");
let version = '0.0.1';
let singleton = null;
let gserial = 0;

let StdnavPluginWorkflowCard = function StdnavPluginWorkflowCard() {
    gserial++;
    this.serial = gserial;
};

$.extend(StdnavPluginWorkflowCard.prototype, {
    zinit: function zinit(selector) {
        localLogger.debug('stdnavPluginWorkflowCard.init(' + selector + ')\n');
        return this;
    },
    activate: function activate() {
        this.behavior = {
            'ariaprep': [this, this._ariaPrep, null],
            'ariarefresh': [this, this._ariaRefresh, null],
            'right': [this, this._onRight, null],
            'left': [this, this._onLeft, null],
            'up': [this, this._onUp, null],
            'down': [this, this._onDown, null],
            'home': [this, this._onHome, null],
            'end': [this, this._onEnd, null],
            'toggle': [this, this._onEnterOrToggle, null],
            'enter': [this, this._onEnterOrToggle, null],
            'exit': [this, this._onExit, null],
            'fixfocus': [this, this._fixFocus, null],
            'fixsuperfocus': [this, this._fixSuperfocus, null],
            'click': [this, this._onClick, null],
            'inherit': true,
            'inheritable': true
        };
        stdnav.registerNavtype(this.navtype, this.behavior, this.navtype_tags);
    },
    deactivate: function deactivate() {
        stdnav.unregisterNavtype('list2', this.behavior);
    },
    _ariaPrep: function _ariaPrep(el) {
        this._ariaRefresh(el);
    },
    _ariaRefresh: function _ariaRefresh() {
        return null;
    },
    _fixFocus: function _fixFocus(element) {
        let $el = $(element);

        if ($el.is("ul")) {
            element = $el.find("li").eq(0)[0];
        }

        return element;
    },
    _fixSuperfocus: function _fixSuperfocus(element) {
        let newSuperfocus;
        let $closestList = $(element).parents('ul').last();

        if ($closestList.length > 0) {
            newSuperfocus = $closestList[0];
        } else {
            newSuperfocus = null;
        }
        return newSuperfocus;
    },
    _onClick: function _onClick(element) {
        const $el = $(element);
        const isButtonOrChild = $el.closest('button').length > 0;
        const isMainUl = $el.prop('nodeName') === 'UL' && $el.attr('role') === 'menubar';
        const isLiMenuItem = $el.prop('nodeName') === 'LI' && $el.attr('role') === 'menuitem';

        if (isLiMenuItem) {
            stdnav.forceFocus($el);
        } else if (!(isButtonOrChild || isMainUl)) {
            stdnav.forceFocus($el.parents('li').last());
        }
    },
    _navigationCallbackHandler: function _navigationCallbackHandler(element, listCallback, buttonCallback) {
        const currentFocus = $(element).closest('li,button');

        if (currentFocus.prop('nodeName') === 'LI') {
            return listCallback();
        } else if (currentFocus.prop('nodeName') === 'BUTTON') {
            return buttonCallback();
        }
        return null;
    },
    _onLeft: function _onLeft(element) {
        let currentPosition, newPosition, newSelectedButton;
        const visibleButtonList = $(element).closest('ul').find('button:visible');

        if (visibleButtonList.first().hasClass('subfocus')) {
            return visibleButtonList.last();
        }
        currentPosition = $('li button').index($('button.subfocus'));
        newPosition = currentPosition - 1;
        newSelectedButton = $('li button').eq(newPosition);
        return newPosition >= 0 && newSelectedButton[0];
    },
    _onRight: function _onRight(element) {
        const listCallback = () => {
            const visibleButtonList = $(element).closest('li').find('button:visible');
            return visibleButtonList.first();
        }
        const buttonCallback = () => {
            let currentPosition, newPosition, newSelectedButton;
            const visibleButtonList = $(element).closest('ul').find('button:visible');

            if (visibleButtonList.last().hasClass('subfocus')) {
                return visibleButtonList.first();
            }
            currentPosition = $('li button').index($('button.subfocus'));
            newPosition = currentPosition + 1;
            newSelectedButton = $('li button').eq(newPosition);
            return newSelectedButton.length && newSelectedButton[0];
        }
        return this._navigationCallbackHandler(element, listCallback, buttonCallback);
    },
    _onUp: function _onUp(element) {
        const listCallback = () => {
            const closestLi = $(element).closest('li');
            const liList = closestLi.parent().children('li');
            const previousItem = closestLi.prev();

            if (liList.length <= 1) {
                return null;
            }
            return previousItem.length ? previousItem : liList.last();
        }
        const buttonCallback = () => {
            const closestLiParent = $(element).closest('ul').parent();
            const liParentList = closestLiParent.parent().children('li');
            const previousItem = closestLiParent.prev();

            if (liParentList.length <= 1) {
                return null;
            }
            return previousItem.length ? previousItem : liParentList.last();
        }
        return this._navigationCallbackHandler(element, listCallback, buttonCallback);
    },
    _onDown: function _onDown(element) {
        const listCallback = () => {
            const closestLi = $(element).closest('li');
            const liList = closestLi.parent().children('li');
            const nextItem = closestLi.next();

            if (liList.length <= 1) {
                return null;
            }
            return nextItem.length ? nextItem : liList.first();
        }
        const buttonCallback = () => {
            const closestLiParent = $(element).closest('ul').parent();
            const liParentList = closestLiParent.parent().children('li');
            const nextItem = closestLiParent.next();

            if (liParentList.length <= 1) {
                return null;
            }
            return nextItem.length ? nextItem : liParentList.first();
        }
        return this._navigationCallbackHandler(element, listCallback, buttonCallback);
    },
    _onHome: function _onHome(element) {
        const listCallback = () => {
            const liList = $(element).closest('li').parent().children('li');
            return liList.first();
        }
        const buttonCallback = () => {
            const visibleButtonList = $(element).closest('ul').find('button:visible');
            return visibleButtonList.first();
        }
        return this._navigationCallbackHandler(element, listCallback, buttonCallback);
    },
    _onEnd: function _onEnd(element) {
        const listCallback = () => {
            const liList = $(element).closest('li').parent().children('li');
            return liList.last();
        }
        const buttonCallback = () => {
            const visibleButtonList = $(element).closest('ul').find('button:visible');
            return visibleButtonList.last();
        }
        return this._navigationCallbackHandler(element, listCallback, buttonCallback);
    },
    _onEnterOrToggle: function _onEnterOrToggle(element) {
        const $el = $(element);
        if ($el.prop('nodeName') === 'LI' && $el.attr('role') === 'menuitem') {
            return $el.find('button:visible').first();
        }
        return null;
    },
    _onExit: function _onExit(element) {
        const $el = $(element);
        if ($el.prop('nodeName') === 'BUTTON') {
            return $el.closest('ul').parent();
        }
        return null;
    }
});
$.extend(StdnavPluginWorkflowCard.prototype, {
    navtype: 'workflowCard',
    navtype_tags: ['li', 'button']
});

let stdnavPluginWorkflowCard = new StdnavPluginWorkflowCard();
export default stdnavPluginWorkflowCard;

