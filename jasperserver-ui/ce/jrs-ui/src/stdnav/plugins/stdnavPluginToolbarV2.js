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
 * Elements: LI, OL, UL
 * Navtype:  toolbarV2
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
import buttonManager from '../../core/core.events.bis';
import layoutModule from "../../core/core.layout";

let gserial = 0;
layoutModule.TOOLBAR_CONTAINER_EL = '[js-navtype="toolbarV2"]';
layoutModule.TOOLBAR_LEAF_EL = '.leaf';

var StdnavPluginToolbarV2 = function () {
    gserial++;
    this.serial = gserial;
};

_.extend(StdnavPluginToolbarV2.prototype, {
    zinit: function () {
        return this;
    },

    // Registers the 'toolbarV2' navtype with stdnav.
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
            'superfocusout': [this, this._onSuperfocusOut, null],
            'subfocusin': [this, this._onSubfocusIn, null],
            'subfocusout': [this, this._onSubfocusOut, null],
            'left': [this, this._onLeft, null],
            'up': [this, this._onUp, null],
            'down': [this, this._onDown, null],
            'right': [this, this._onRight, null],
            'enter': [this, this._onEnter, null],
            'toggle': [this, this._onEnter, null],
            'home': [this, this._onHome, null],
            'end': [this, this._onEnd, null],
            'click': [this, this._onClick, null],
            'inherit': false,
            'inheritable': true
        };
        stdnav.registerNavtype(this.navtype, this.behavior, this.navtype_tags);
    },

    // Unregisters the 'toolbarV2' navtype from stdnav.  This must be done
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
        $(el).attr('role', 'toolbar');
        const $btnItems = $(el).find('.button');
        $.each($btnItems, function (key, item) {
            const $item = $(item);
            $item.attr('aria-pressed', 'false');
            //set navtype to button to avoid running default 'button' navtype for button
            $item.attr('js-navtype', 'none');

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
        if ($el.is(layoutModule.TOOLBAR_CONTAINER_EL)) {
            var items = $el.find(layoutModule.TOOLBAR_LEAF_EL).not(".divider");
            if (items.length > 0) {
                items = items.find('.button').not(':disabled');
                if (items.length > 0) {
                    newFocus = items[0];
                } else {
                    // The entire list is empty-- set focus to the next/previous focusable element depending on where is superfocus
                    let elementWithSuperfocus = $('.superfocus')[0];
                    if(($el.next())[0] === elementWithSuperfocus){
                        newFocus = stdnav.getPreviousFocusableElement(element);
                        if(newFocus && newFocus === $('#maincontent')[0]){
                            newFocus = stdnav.getPreviousFocusableElement(newFocus);
                        }
                    }else{
                        newFocus = stdnav.getNextFocusableElement(element);
                    }
                }
            }
        } else if ($el.is(layoutModule.TOOLBAR_LEAF_EL)) {
            newFocus = ($el.find('.button'))[0];
        } else {
            // Assume we're in a span or something within a leaf.
            const lis = $el.closest(layoutModule.TOOLBAR_LEAF_EL);
            if (lis.length > 0) {
                if ($(lis[0]).prop['js-navigable'] === false) {
                    // Clicked on a header or something; focus the list instead.
                    newFocus = $el.closest(layoutModule.TOOLBAR_CONTAINER_EL);
                } else {
                    newFocus = lis.find('.button');
                }
            }
        }

        // Avoid focusing disabled button
        if ($(newFocus).is(":disabled") || $(newFocus).find(".button").is(":disabled")) {
            const nextElements = $(newFocus).closest(layoutModule.TOOLBAR_LEAF_EL).nextAll().filter(function (index, element) {
                return $(element).find(".button").is(":enabled");
            });
            newFocus = nextElements[0] ?? newFocus;
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
        const $root = $(element).closest(layoutModule.TOOLBAR_CONTAINER_EL);
        if ($root.length > 0) {
            newSuperfocus = $root[0];
        } else {
            // let StdNav fall back to BODY
            newSuperfocus = null;
        }
        return newSuperfocus;
    },

    _onSuperfocusOut: function(element) {
        const $leafAll = $(element).closest(layoutModule.TOOLBAR_CONTAINER_EL).find(layoutModule.TOOLBAR_LEAF_EL).not(".divider");
        $leafAll.each(function(key, elem){
            $(elem).find(".button").removeClass(layoutModule.PRESSED_CLASS).attr('aria-pressed', 'false');
        });
    },

    _onSubfocusIn: function(element){
        const $elem = $(element).is('.button') ? $(element) : $(element).find('.button');
        buttonManager.over($elem[0]);
    },

    _onSubfocusOut: function(element){
        const $elem = $(element).is('.button') ? $(element) : $(element).find('.button');
        buttonManager.out($elem[0]);
    },

    /* ========== KEYBOARD BEHAVIOR =========== */
    _onLeft: function (element){
        const $thisItem = $(element).is(layoutModule.TOOLBAR_LEAF_EL) ? $(element) : $(element).closest(layoutModule.TOOLBAR_LEAF_EL);
        let $prev = null;

        if ($thisItem.length>0){
            const $prevAll = $thisItem.prevAll(layoutModule.TOOLBAR_LEAF_EL).not(".divider");
            $prevAll.each(function(key, elem){
                const $elem = $(elem);
                if($prev === null &&  $elem.find(".button:disabled").length === 0 && $elem.find(".button:hidden").length === 0){
                    $prev = $elem.find('.button');
                }
            });

            //If we are on first Item of toolbar Item, pressing left arrow key should take us to last toolbar enabled item.
            if($prev === null){
                const $nextAll = $thisItem.nextAll(layoutModule.TOOLBAR_LEAF_EL).not(".divider");
                $nextAll.each(function(key, elem){
                    const $elem = $(elem);
                    if($elem.find(".button:disabled").length === 0 && $elem.find(".button:hidden").length === 0){
                        $prev = $elem.find('.button');
                    }
                });
            }
        }
        $prev = $prev ?? element;
        return $prev;
    },

    _onRight: function (element) {
        const $thisItem = $(element).is(layoutModule.TOOLBAR_LEAF_EL) ? $(element) : $(element).closest(layoutModule.TOOLBAR_LEAF_EL);
        let $next = null;

        if ($thisItem.length>0){
            const $nextAll = $thisItem.nextAll(layoutModule.TOOLBAR_LEAF_EL).not(".divider");
            $nextAll.each(function(key, elem){
                const $elem = $(elem);
                if($next === null && $elem.find(".button:disabled").length === 0 && $elem.find(".button:hidden").length === 0){
                    $next = $elem.find('.button');
                }
            });
            //If we are on last Item of toolbar Item, pressing right should take us to first enabled item.
            if($next === null){
                const $prevAll = $thisItem.prevAll(layoutModule.TOOLBAR_LEAF_EL).not(".divider");
                $prevAll.each(function(key, elem){
                    const $elem = $(elem);
                    if($elem.find(".button:disabled").length === 0 && $elem.find(".button:hidden").length === 0){
                        $next = $elem.find('.button');
                    }
                });
            }
        }
        $next = $next ?? element;
        return $next;
    },

    _onUp: function (element) {
        //toolbar with buttons only not need any behaviour, if needed change this with checks
        return element;
    },

    _onDown: function (element) {
        //toolbar with buttons only not need any behaviour, if needed change this with checks
        return element;
    },

    _onEnter: function (element) {
        const $thisItem = $(element).is(layoutModule.TOOLBAR_LEAF_EL) ? $(element) : $(element).closest(layoutModule.TOOLBAR_LEAF_EL);
        if($thisItem.length>0){
            const $siblingAll = $thisItem.siblings(layoutModule.TOOLBAR_LEAF_EL).not(".divider");
            $siblingAll.each(function(key, elem){
                $(elem).find(".button").removeClass(layoutModule.PRESSED_CLASS).attr('aria-pressed', 'false');
            });
            if($thisItem.find(".button").length >0 && $thisItem.find(".button:disabled").length === 0 && $thisItem.find(".button:hidden").length === 0){
                let $btn = $thisItem.find(".button");
                $btn.attr('aria-pressed', 'true');
                buttonManager.down($btn[0]);
                $($btn[0]).trigger('mouseup');
            }
        }
    },

    _onHome: function (element) {
        let $firstEl = null;
        const $thisItem = $(element).is(layoutModule.TOOLBAR_LEAF_EL) ? $(element) : $(element).closest(layoutModule.TOOLBAR_LEAF_EL);
        const $prevAll = $thisItem.prevAll(layoutModule.TOOLBAR_LEAF_EL).not(".divider");
        $prevAll.each(function(key, elem){
            const $elem = $(elem);
            if($elem.find(".button:disabled").length === 0 && $elem.find(".button:hidden").length === 0){
                $firstEl = $elem.find('.button');
            }
        });
        return $firstEl ?? element;
    },

    _onEnd: function (element) {
        let $lastEl = null;
        const $thisItem = $(element).is(layoutModule.TOOLBAR_LEAF_EL) ? $(element) : $(element).closest(layoutModule.TOOLBAR_LEAF_EL);
        const $nextAll = $thisItem.nextAll(layoutModule.TOOLBAR_LEAF_EL).not(".divider");
        $nextAll.each(function(key, elem){
            const $elem = $(elem);
            if($elem.find(".button:disabled").length === 0 && $elem.find(".button:hidden").length === 0){
                $lastEl = $elem.find('.button');
            }
        });
        return $lastEl ?? element;
    },

    _onClick: function (element) {
        const $siblingAll = $(element).closest(layoutModule.TOOLBAR_LEAF_EL).siblings(layoutModule.TOOLBAR_LEAF_EL).not(".divider");
        $siblingAll.each(function(key, elem){
            $(elem).find(".button").attr('aria-pressed', 'false');
        });
        const $btn = $(element).is('.button') ? $(element) : $(element).closest('.button');
        if($btn.length>0) {
            $btn.attr('aria-pressed', 'true');
        }
    }
});

$.extend(StdnavPluginToolbarV2.prototype, {
    // This is the name of the new navtype.  Each stdnav plugin must
    // define a unique name.
    navtype: 'toolbarV2',

    // This array extends the tag-to-navtype map in stdnav.  If your
    // plugin should apply to all elements of a given type, add those
    // element tagnames, in lower case, to this array.  It is normally
    // empty, and the page templates simply set an appropriate
    // "data-navtype=" attribute to get the expected behavior.
    // CASE SENSITIVE - USE UPPER-CASE!
    navtype_tags: []
});

export default new StdnavPluginToolbarV2();