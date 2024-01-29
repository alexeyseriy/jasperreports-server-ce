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
 * @author: ${username}
 * @version: $Id$
 */

/* Standard Navigation library (stdnav) plugin
 * Elements: LI, OL, UL
 * Navtype:  actionmenu
 *
 * Plugin for "actionModel"-based menus, such as the JRS main menu, which
 * handle mouse and touch events, but offer no keyboard support.  (Note
 * that "actionModel" itself is not used in a Backbone context yet, in
 * case its name suggests that to you; it's a coincidence.)
 *
 * This module supports enhancements intended to improve compliance with
 * section 508 of the Rehabilitation Act of 1973, 29 USC 798, as amended
 * 1998.
 */

import $ from 'jquery';
import _ from 'underscore';
import stdnav from 'js-sdk/src/common/stdnav/stdnav';
import actionModel from '../../actionModel/actionModel.modelGenerator';
import buttonManager from '../../core/core.events.bis';
import layoutModule from '../../core/core.layout';
import log from 'js-sdk/src/common/logging/logger';
import {AriaProps} from "js-sdk/src/common/util/accessibility/waiAriaConstants";

var logger = log.register("stdnav");

const MENU_TRAP_ELEMENT_TEMPLATE = '<div js-navtype="menuTrap" class="offLeft" tabindex="0"></div>';

var stdnavPluginActionMenu = function () {
};

_.extend(stdnavPluginActionMenu.prototype, {
    zinit: function (selector) {
        return this;
    },

    // Registers the 'actionMenu' navtype with stdnav.  Both stdnav and ActionMenu
    // must be loaded and activated before this can be done.
    activate: function () {
        // This is the behaviour hash for the navtype.  These defaults pass
        // everything through to the browser, and are normally overridden
        // with $.extend based on specific tagnames and stdnav attributes.
        this.behavior = {
            'toggle': [this, this._onEnter, null],
            'enter': [this, this._onEnter, null],
            'exit': [this, this._onExit, null],
            'fixfocus': [this, this._fixFocus, null],
            'fixsubfocus': [this, this._fixFocus, null],
            'fixsuperfocus': [this, this._fixSuperfocus, null],
            'focusin': [this, this._onFocusIn, null],
            'focusout': [this, this._onFocusOut, null],
            'subfocusin': [this, this._onSubfocusIn, null],
            'left': [this, this._onLeft, null],
            'right': [this, this._onRight, null],
            'superfocusin': [this, this._onSuperfocusIn, null],
            'superfocusout': [this, this._onSuperfocusOut, null],
            'up': [this, this._onUp, null],
            'down': [this, this._onDown, null],
            'home': [this, this._onHome, null],
            'end': [this, this._onEnd, null],
            'inherit': false,
            'inheritable': true
        };
        stdnav.registerNavtype(this.navtype, this.behavior, this.navtype_tags);
    },

    // Unregisters the 'actionMenu' navtype from stdnav.  This must be done
    // before deactivating/unloading stdnav.
    deactivate: function () {
        stdnav.unregisterNavtype(this.navtype, this);
    },

    /* ====== Focus Management ====== */


    // Focus adjustment callback.  Ensures that if the DIV or UL elements
    // themselves are given focus, that it is promoted to the first LI.
    _fixFocus: function (element) {
        var newFocus;
        var $el = $(element);
        if ($el.is('#' + actionModel.PARENT_MENU_CONTAINER)) {
            $(MENU_TRAP_ELEMENT_TEMPLATE).insertBefore($el);
            $(MENU_TRAP_ELEMENT_TEMPLATE).insertAfter($el);
        }
        const pressedItem = $el.find(`.${layoutModule.PRESSED_CLASS} > p`);
        if (pressedItem.length > 0) {
            newFocus = pressedItem[0];
        }else {
            if ($el.is('div,ul,ol')) {
                newFocus = $el.find('li > p')[0] ?? element;
            } else if ($el.is('li')) {
                // Focus is already appropriate.
                newFocus = $el.find('> p')[0] ?? element;
            } else {
                newFocus = $el.closest('li').find('> p')[0] ??
                    ($el.closest('ul').find('li > p')[0] ?? element);
            }
        }
        return newFocus;
    },

    // Superfocus adjustment callback.  Because of the way actionModel
    // works, the menu is expected to be rooted in an enclosing DIV that
    // contains the list, so use the DIV for the superfocus region.
    // However, context menus are _not_
    _fixSuperfocus: function (element) {
        return $(element).closest(`.context`)[0];
    },

    _onSuperfocusIn: function(element){
    },

    _onFocusIn: function (element) {
        var $el = $(element);

        var $li = $el.closest(layoutModule.MENU_LIST_PATTERN);
        if ($li.length>0) {
            this._openChildMenu($li[0], true);
            //this._setAriaAttributes($li[0]);
            buttonManager.over($li.find(layoutModule.BUTTON_PATTERN)[0]);
        }

        return element;
    },

    _setAriaAttributes: function (element) {
        var $li = $(element);
        var $p = $li.find('> p');

        if ($li.hasClass(layoutModule.NODE_CLASS) && !$p.attr(AriaProps.HasPopup)) {
            $p.attr(AriaProps.Expanded, 'false')
                .attr(AriaProps.HasPopup, 'true')
        }
    },

    _openChildMenu: function (element, open) {
        var $li = $(element);
        var $p = $li.find('> p');

        if ($li.hasClass(layoutModule.NODE_CLASS)) {
            this._setAriaAttributes(element);
            const isMenuShowing = actionModel.isMenuShowing($li.find('.context')[0]);

            if (open) {
                $p.attr(AriaProps.Expanded, 'true')
                !isMenuShowing && actionModel.showChildSubmenu(element);
            } else {
                isMenuShowing && actionModel.hideChildSubmenu(element);
                $p.attr(AriaProps.Expanded, 'false');
            }
        }
    },

    _onFocusOut: function (element) {
        var $thisItem = $(element).closest(layoutModule.MENU_LIST_PATTERN);
        if ($thisItem.length>0) {
            // An item in a drop-down or context menu has lost focus.
            buttonManager.out($thisItem.find(layoutModule.BUTTON_PATTERN)[0]);
        }
        return null;
    },

    // When the entire menu loses superfocus, ensure that any remaining
    // hover events and classes for actionMenu fire as expected, and that
    // the context menu is hidden.
    _onSuperfocusOut: function(element){

    },

    /* ========== NAVTYPE BEHAVIOR CALLBACKS =========== */

    _onSubfocusIn: function (element) {
        // Handle menus hosted in non-focusable elements (such as a cell in a grid).
        if (element.nodeName !== 'P') {
            // Find a usable child element.
            var subel = this._fixFocus(element);
            // Adjust subfocus without firing callbacks.
            stdnav.setSubfocus(subel, false);
        }
    },

    _onEnter: function (element) {
        return this._onRight(element);
    },

    _onExit: function (element) {
        var $context = $(element).closest('.context');
        if ($context.attr('id') === layoutModule.MENU_ID) {
            actionModel.hideMenu();
        } else {
            return this._onLeft(element);
        }
    },

    /* ========== KEYBOARD BEHAVIOR =========== */
    _onLeft: function (element){
        const $thisItem = $(element).closest(layoutModule.MENU_LIST_PATTERN);
        const $parentMenu = $thisItem.closest('ul');
        if (!$parentMenu.is(`#${actionModel.PARENT_MENU_CONTAINER}`)) {
            const parentMenuItem = $parentMenu.closest('li');
            stdnav.forceFocus(parentMenuItem.find('> p')[0]);
            this._openChildMenu(parentMenuItem[0], false);
        } else {
            return element
        }
    },

    _onRight: function (element) {
        const $thisItem = $(element).closest(layoutModule.MENU_LIST_PATTERN);
        const $subMenuItem = $thisItem.find('ul[role=menu] li').first();

        if ($subMenuItem.length>0) {
            this._openChildMenu($thisItem[0], true);
            return $subMenuItem.find('> p')[0];
        } else {
            return element;
        }
    },

    _onUp: function (element) {
        var $el = $(element).closest(layoutModule.MENU_LIST_PATTERN);
        var $lastItem = $el.closest('ul').find('> li').last();
        var $prev = $el.prev('li');

        while ($prev.is(layoutModule.SEPARATOR_PATTERN)){
            $prev=$prev.prev('li');
        }

        if (!$prev[0]) {
            $prev = $lastItem;
        }

        if ($prev.length>0){
            this._openChildMenu($el[0], false);
            stdnav.forceFocus($prev.find('> p')[0]);
        } else {
            return element;
        }
    },

    _onDown: function (element) {
        var $el = $(element).closest(layoutModule.MENU_LIST_PATTERN);
        var $firstItem = $el.closest('ul').find('> li').first();
        var $next = $el.next('li');

        while ($next.is(layoutModule.SEPARATOR_PATTERN)){
            $next=$next.next('li');
        }

        if (!$next[0]) {
            $next = $firstItem;
        }

        if ($next.length>0){
            this._openChildMenu($el[0], false);
            stdnav.forceFocus($next.find('> p')[0]);
        } else {
            return element;
        }
    },

    _onHome: function (element) {
        var $el = $(element).closest(layoutModule.MENU_LIST_PATTERN);
        var $firstItem = $el.closest('ul').find('> li').first();
        this._openChildMenu($el[0], false);
        stdnav.forceFocus($firstItem.find('> p')[0]);
    },

    _onEnd: function (element) {
        var $el = $(element).closest(layoutModule.MENU_LIST_PATTERN);
        var $lastItem = $el.closest('ul').find('> li').last();
        this._openChildMenu($el[0], false);
        stdnav.forceFocus($lastItem.find('> p')[0]);
    }
});

// SECOND EXTENSION PASS - ATTRIBUTES
// Hash members in this pass can reference functions from the last pass.
$.extend(stdnavPluginActionMenu.prototype, {
    // This is the name of the new navtype.  Each stdnav plugin must
    // define a unique name.
    navtype: 'actionmenu',

    // This arrray extends the tag-to-navtype map in stdnav.  If your
    // plugin should apply to all elements of a given type, add those
    // element tagnames, in lower case, to this array.  It is normally
    // empty, and the page templates simply set an appropriate
    // "data-navtype=" attribute to get the expected behavior.
    //
    // NOTE: The HTML5 "menu" element is still very broken.  In practice
    // our menus are built with list items and use "js-navtype" overrides to
    // this type.
    //
    // CASE SENSITIVE - USE UPPER-CASE!
    navtype_tags: []
});

export default new stdnavPluginActionMenu();
