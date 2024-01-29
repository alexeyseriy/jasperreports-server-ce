/*
 * Copyright (C) 2005 - 2020 TIBCO Software Inc. All rights reserved.
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
import _ from 'underscore';
import stdnav from 'js-sdk/src/common/stdnav/stdnav';
import actionModel from '../../actionModel/actionModel.modelGenerator';
import buttonManager from '../../core/core.events.bis';
import layoutModule from '../../core/core.layout';
import primaryNavigation from '../../actionModel/actionModel.primaryNavigation';
import log from 'js-sdk/src/common/logging/logger';
import eventAutomation from "js-sdk/src/common/util/eventAutomation";
import {AriaProps} from "js-sdk/src/common/util/accessibility/waiAriaConstants";

var logger = log.register("stdnav");

const ActiveTopLevelMenuAttribute = 'data-toplevel-descendant';

const $mainMenu = $('#' + layoutModule.MAIN_NAVIGATION_ID);
const $homeMenu = $('#' + layoutModule.MAIN_NAVIGATION_HOME_ITEM_ID);
const $libraryMenu = $('#' + layoutModule.MAIN_NAVIGATION_LIBRARY_ITEM_ID);

var stdnavPluginMainMenu = function () {
    this.menu_item_callbacks = {
        click: {}
    };
};

_.extend(stdnavPluginMainMenu.prototype, {
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
            'toggle': [this, this._onToggle, null],
            'enter': [this, this._onEnter, null],
            'exit': [this, this._onExit, null],
            'fixfocus': [this, this._fixFocus, null],
            'fixsubfocus': [this, this._fixFocus, null],
            'ariarefresh': [this, this._ariaRefresh, null],
            'focusin': [this, this._onFocusIn, null],
            'focusout': [this, this._onFocusOut, null],
            'click': [this, this._onClick, null],
            'subfocusin': [this, this._onSubfocusIn, null],
            'subfocusout': [this, this._onSubfocusOut, null],
            'left': [this, this._onLeft, null],
            'right': [this, this._onRight, null],
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

    _fixFocus: function (element) {
        return element;
    },

    _ariaRefresh: function () {
        this._setHasSubMenuAriaAttributes($mainMenu.find(layoutModule.NAVIGATION_MUTTON_PATTERN));
    },

    _setOpenSubMenuAriaAttributeState: function (p, open, mute = false) {
        const $activeToplevelMenu = $(p);
        if ($activeToplevelMenu.attr(AriaProps.HasPopup)) {
            const role = $activeToplevelMenu.attr('role');
            mute && $activeToplevelMenu.attr('role', 'none')
            $activeToplevelMenu
                .attr(AriaProps.Expanded, open ? 'true' : 'false')
            mute && $activeToplevelMenu.attr('role', role)
        }
    },

    _setHasSubMenuAriaAttributes: function (element) {
        const $menuWithSubmenu = $(element);
        $menuWithSubmenu.find('> p')
            .attr(AriaProps.Expanded, 'false')
            .attr(AriaProps.HasPopup, 'true')
            .attr(AriaProps.Controls, actionModel.PARENT_MENU_CONTAINER)
            .attr(AriaProps.Owns, actionModel.PARENT_MENU_CONTAINER)
    },

    _closeSubMenu: function (element) {
        this._setOpenSubMenuAriaAttributeState($(element).find('> p'), false);

        actionModel.hideMenu();
    },

    _showSubMenu: function (element) {
        const $activeToplevelMenu = $(element);
        const $menuWithSubmenu = $activeToplevelMenu.closest(layoutModule.NAVIGATION_MUTTON_PATTERN);
        if ($menuWithSubmenu.length>0) {
            const $p = $menuWithSubmenu.find('p');
            const allExpandedMenuItems = $mainMenu.find(`${layoutModule.NAVIGATION_MUTTON_PATTERN} > p[${AriaProps.Expanded}=true]`);
            if (allExpandedMenuItems.length && !$p.is(allExpandedMenuItems)) {
                this._setOpenSubMenuAriaAttributeState(allExpandedMenuItems, false, true);
            }

            this._setOpenSubMenuAriaAttributeState($p, true)
            primaryNavigation.showNavButtonMenu(null, $menuWithSubmenu[0], $menuWithSubmenu.text().trim());
        } else {
            this._closeSubMenu($activeToplevelMenu[0]);
        }
    },

    _getActiveTopLevelMenu: function () {
        const activeToplevelMenuId = $mainMenu.attr(ActiveTopLevelMenuAttribute);
        return  $(`#${activeToplevelMenuId}`);
    },

    _onFocusIn: function (element) {
        const $el = $(element);
        let activeTopLevelMenuId = $el.attr(ActiveTopLevelMenuAttribute);
        if (!activeTopLevelMenuId) {
            activeTopLevelMenuId = $el.find('li').first().attr('id');
            $el.attr(ActiveTopLevelMenuAttribute, activeTopLevelMenuId);
        }

        const $activeToplevelMenu = this._getActiveTopLevelMenu();
        return $activeToplevelMenu[0];
    },

    _onFocusOut: function (element) {
        buttonManager.out($(element).find(layoutModule.BUTTON_PATTERN)[0]);
        this._closeSubMenu(element);

        return null;
    },

    _onClick: function (element) {
        const menuItem = $(element).closest('li');
        if (menuItem.length > 0) {
            stdnav.setSubfocus(menuItem);
        }
    },

    /* ========== NAVTYPE BEHAVIOR CALLBACKS =========== */

    _onSubfocusIn: function (element) {
        const $el = $(element).closest('li');
        const elementId = $el.find('p').attr('id') ?? $el.attr('id');
        $mainMenu.attr(AriaProps.ActiveDescendant, elementId);
        buttonManager.over($el.find(layoutModule.BUTTON_PATTERN)[0]);

        if ($el.closest('#' + layoutModule.MAIN_NAVIGATION_ID).length) {
            $mainMenu.attr(ActiveTopLevelMenuAttribute, $el.attr('id'));
            this._showSubMenu($el);
        }
    },

    _onSubfocusOut: function (element) {
        buttonManager.out($(element).find(layoutModule.BUTTON_PATTERN)[0]);
    },

    _onToggle: function (element) {
        this._onEnter(element);
    },

    _onEnter: function (element) {
        if (!actionModel.isMenuShowing()) {
            this._showSubMenu(element);
        }

        if ($(element).is(`#${layoutModule.MAIN_NAVIGATION_ID} li`) && (!($(element).is($homeMenu) || $(element).is($libraryMenu)))) {
            this._onDown(element);
        } else {
            eventAutomation.simulateClickSequence(element);
        }
    },

    _onExit: function (element) {
        const $activeTopLevelMenu = this._getActiveTopLevelMenu()
        stdnav.setSubfocus($activeTopLevelMenu[0]);
        this._closeSubMenu($activeTopLevelMenu)
    },

    /* ========== KEYBOARD BEHAVIOR =========== */
    _onLeft: function (element){
        const $activeTopLevelMenu = this._getActiveTopLevelMenu()

        let $prev = $activeTopLevelMenu.prev();
        if ($prev.length === 0) {
            $prev = $mainMenu.find('li').last();
        }

        stdnav.setSubfocus($prev[0]);
    },

    _onRight: function (element) {
        const $activeTopLevelMenu = this._getActiveTopLevelMenu()

        let $next = $activeTopLevelMenu.next();
        if ($next.length === 0) {
            $next = $mainMenu.find('li').first();
        }

        stdnav.setSubfocus($next[0]);
    },

    _getNextActiveDescendant: function (activeDescendantId) {
        var $menuItems = $(layoutModule.MENU_LIST_PATTERN);
        var $thisItem = activeDescendantId ? $(`#${activeDescendantId}`).closest('li') : null;
        var $firstItem = $menuItems.first();
        var $next = activeDescendantId ? $thisItem.next(layoutModule.MENU_LIST_PATTERN) : $firstItem;

        if (!$next[0]) {
            $next = $firstItem;
        }

        // Oddly, trying to add ":not(.separator)" to the pattern
        // above did not work; the separator was indeed skipped, but
        // the menu item after it was not returned.  This code skips
        // over any number of adjacent separators.
        while ($next.is(layoutModule.SEPARATOR_PATTERN)){
            $next=$next.next(layoutModule.MENU_LIST_PATTERN);
        }

        return $next;
    },

    _getPreviousActiveDescendant: function (activeDescendantId) {
        var $menuItems = $(layoutModule.MENU_LIST_PATTERN);
        var $thisItem = activeDescendantId ? $(`#${activeDescendantId}`).closest('li') : null;
        var $lastItem = $menuItems.last();
        var $previous = activeDescendantId ? $thisItem.prev(layoutModule.MENU_LIST_PATTERN) : $lastItem;

        if (!$previous[0]) {
            $previous = $lastItem;
        }

        // Oddly, trying to add ":not(.separator)" to the pattern
        // above did not work; the separator was indeed skipped, but
        // the menu item after it was not returned.  This code skips
        // over any number of adjacent separators.
        while ($previous.is(layoutModule.SEPARATOR_PATTERN)){
            $previous = $previous.prev(layoutModule.MENU_LIST_PATTERN);
        }

        return $previous;
    },

    _onUp: function (element) {
        if (!actionModel.isMenuShowing()) {
            this._showSubMenu(element);
        }

        if (actionModel.isMenuShowing()) {
            const activeDescendantId = $mainMenu.attr(AriaProps.ActiveDescendant);
            const $prev = this._getPreviousActiveDescendant(activeDescendantId);

            stdnav.setSubfocus($prev[0]);
        }
    },

    _onDown: function (element) {
        if (!actionModel.isMenuShowing()) {
            this._showSubMenu(element);
        }

        if (actionModel.isMenuShowing()) {
            const activeDescendant = $mainMenu.attr(AriaProps.ActiveDescendant);
            const $next = this._getNextActiveDescendant(activeDescendant);

            stdnav.setSubfocus($next[0]);
        }
    },

    _onHome: function (element) {
        const first = $(element).closest('ul').find('li').first()[0];
        stdnav.setSubfocus(first);
    },

    _onEnd: function (element) {
        const last = $(element).closest('ul').find('li').last()[0];
        stdnav.setSubfocus(last);
    }
});

// SECOND EXTENSION PASS - ATTRIBUTES
// Hash members in this pass can reference functions from the last pass.
$.extend(stdnavPluginMainMenu.prototype, {
    // This is the name of the new navtype.  Each stdnav plugin must
    // define a unique name.
    navtype: 'mainmenu',

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

export default new stdnavPluginMainMenu();
