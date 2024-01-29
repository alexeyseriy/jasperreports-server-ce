/*
 * Copyright (C) 2005 - 2021 TIBCO Software Inc. All rights reserved.
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
 * @version: $Id: $
 */

/* Standard Navigation library (stdnav) plugin
 * Elements: LI, OL, UL, div
 * Navtype:  tablist
 *
 * Plugin for toolbar menus, which may consist of simple buttons, text inputs,
 * buttons with drop-down options, tabs, etc. It handles the basic keyboard
 * navigation: moving left/right, opening the drop-downs, firing the actions.
 *
 * This module supports enhancements intended to improve compliance with
 * section 508 of the Rehabilitation Act of 1973, 29 USC 798, as amended
 * 1998.
 */

import $ from 'jquery';
import _ from 'underscore';
import stdnav from 'js-sdk/src/common/stdnav/stdnav';
import layoutModule from "../../core/core.layout";

let gserial = 0;
layoutModule.TABLIST_CONTAINER_EL = '[js-navtype="tablist"]';
layoutModule.TABLIST_LEAF_EL = '.tablistleaf';

var StdnavTabList = function () {
    gserial++;
    this.serial = gserial;
};

_.extend(StdnavTabList.prototype, {
    zinit: function () {
        return this;
    },

    // Registers the 'tablist' navtype with stdnav.
    activate: function () {
        // This is the behaviour hash for the navtype.  These defaults pass
        // everything through to the browser, and are normally overridden
        // with $.extend based on specific tagnames and stdnav attributes.
        this.behavior = {
            'ariaprep': [this, this._ariaPrep, null],
            'ariarefresh': [this, this._ariaRefresh, null],
            'fixfocus': [this, this._fixFocus, null],
            'fixsubfocus': [this, this._fixFocus, null],
            'fixsuperfocus': [this, this._fixSuperfocus, null],
            'left': [this, this._onLeft, null],
            'right': [this, this._onRight, null],
            'up': [this, this._onUp, null],
            'down': [this, this._onDown, null],
            'click': [this, this._onClick, null],
            'inherit': false,
            'inheritable': true
        };
        stdnav.registerNavtype(this.navtype, this.behavior, this.navtype_tags);
    },

    // Unregisters the 'tablist' navtype from stdnav.  This must be done
    // before deactivating/unloading stdnav.
    deactivate: function () {
        stdnav.unregisterNavtype(this.navtype, this);
    },

    // This callback is run when the page is initially rendered.  Add the
    // appropriate ARIA tags for the handled construct, if they do not already
    // exist.
    _ariaPrep: function (el) {
        this._ariaRefresh(el);
    },

    // This callback is run when the superfocus changes to the construct.
    _ariaRefresh: function (el) {
        $(el).attr('role', 'tablist');
        const $tabItems = $(el).find(layoutModule.TABLIST_LEAF_EL).not('[disabled]');
        $.each($tabItems, function (key, item) {
            const $item = $(item);
            if($(item).hasClass('selected')){
                $item.attr('aria-selected', 'true');
            }else{
                $item.attr('aria-selected', 'false');
            }
            $item.attr('role', 'tab');

            const $icons = $($item).find('[class="icon"]');
            $.each($icons, function (key, iconEl) {
                $(iconEl).attr('aria-hidden', 'true');
            });
        });
        return null;
    },

    /* ====== Focus Management ====== */
    _fixFocus: function (element) {
        let newFocus;
        const $el = $(element);
        if ($el.is(layoutModule.TABLIST_CONTAINER_EL)) {
            var items = $el.find(layoutModule.TABLIST_LEAF_EL).not(".label");
            if (items.length > 0) {
                //set focus to active/selected Item
                newFocus = (items.filter((index, item)=>$(item).hasClass("selected")))[0];
            }else {
                // The entire list is empty-- set focus to the next focusable element
                newFocus = stdnav.getNextFocusableElement(element);
            }
        } else if ($el.is(layoutModule.TABLIST_LEAF_EL)) {
            newFocus = element;
        } else {
            // Assume we're in a span or something within a leaf.
            const lis = $el.closest(layoutModule.TABLIST_LEAF_EL);
            if (lis.length > 0) {
                if ($(lis[0]).prop['js-navigable'] === false) {
                    // Clicked on a header or something; focus the list instead.
                    newFocus = $el.closest(layoutModule.TABLIST_CONTAINER_EL);
                } else {
                    newFocus = lis[0];
                }
            }
        }

        // Avoid focusing disabled button
        if ($(newFocus).is("[disabled]") || $(newFocus).find(".button").is(":disabled")) {
            const activeElement = $(newFocus).closest(layoutModule.TABLIST_CONTAINER_EL).find(layoutModule.TABLIST_LEAF_EL).not('[disabled]');
            newFocus = activeElement[0] ?? newFocus;
        }

        // this code is necessary to avoid issues like JS-63350
        if (newFocus && (newFocus[0] === $el[0])) {
            newFocus = null;
        }

        return newFocus;
    },

    // Superfocus adjustment callback.
    _fixSuperfocus: function (element) {
        let newSuperfocus;
        const $root = $(element).closest(layoutModule.TABLIST_CONTAINER_EL);
        if ($root.length > 0) {
            newSuperfocus = $root[0];
        } else {
            // let StdNav fall back to BODY
            newSuperfocus = null;
        }
        return newSuperfocus;
    },

    /* ========== KEYBOARD BEHAVIOR =========== */
    _onLeft: function (element){
        const $thisItem = $(element).is(layoutModule.TABLIST_LEAF_EL) ? $(element) : $(element).closest(layoutModule.TABLIST_LEAF_EL);
        let $prev = null;

        if ($thisItem.length>0){
            $thisItem.attr('aria-selected', 'false').removeClass('selected');;
            const $prevAll = $thisItem.prevAll(layoutModule.TABLIST_LEAF_EL).not(".label");
            $prevAll.each(function(key, elem){
                const $elem = $(elem);
                if($prev === null && !($elem.is("[disabled]")) && $elem.find(".button:disabled").length === 0){
                    $prev = $elem;
                }
            });
        }
        $prev = $prev ? $prev[0] : element;
        $($prev).attr('aria-selected', 'true').addClass('selected');;
        return $prev;
    },

    _onRight: function (element) {
        const $thisItem = $(element).is(layoutModule.TABLIST_LEAF_EL) ? $(element) : $(element).closest(layoutModule.TABLIST_LEAF_EL);
        let $next = null;

        if ($thisItem.length>0){
            $thisItem.attr('aria-selected', 'false').removeClass('selected');;
            const $nextAll = $thisItem.nextAll(layoutModule.TABLIST_LEAF_EL).not(".label");
            $nextAll.each(function(key, elem){
                const $elem = $(elem);
                if($next === null && !($elem.is("[disabled]")) && $elem.find(".button:disabled").length === 0){
                    $next = $elem;
                }
            });
        }
        $next = $next ? $next[0] : element;
        $($next).attr('aria-selected', 'true').addClass('selected');
        return $next;
    },

    _onUp: function (element) {
        return element;
    },

    _onDown: function (element) {
        return element;
    },

    _onClick: function (element) {
        const $element = $(element).is(layoutModule.TABLIST_LEAF_EL) ? $(element) : $(element).closest(layoutModule.TABLIST_LEAF_EL);
        const $siblingAll = $element.siblings(layoutModule.TABLIST_LEAF_EL).not(".label");
        $siblingAll.each(function(key, elem){
            $(elem).attr('aria-selected', 'false');
        });
        const item = $element.not('[disabled]');
        if(item.length>0) {
            $element.attr('aria-selected', 'true');
        }
    }
});

$.extend(StdnavTabList.prototype, {
    // This is the name of the new navtype.  Each stdnav plugin must
    // define a unique name.
    navtype: 'tablist',

    // This array extends the tag-to-navtype map in stdnav.  If your
    // plugin should apply to all elements of a given type, add those
    // element tagnames, in lower case, to this array.  It is normally
    // empty, and the page templates simply set an appropriate
    // "data-navtype=" attribute to get the expected behavior.
    // CASE SENSITIVE - USE UPPER-CASE!
    navtype_tags: []
});

export default new StdnavTabList();