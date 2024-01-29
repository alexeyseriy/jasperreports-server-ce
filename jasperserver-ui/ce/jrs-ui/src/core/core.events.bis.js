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
///////////////////////////////////////////////////////////////////////////////////
// Drag with MouseDown
///////////////////////////////////////////////////////////////////////////////////
import jQuery from 'jquery';
import {
    isSupportsTouch,
    matchMeOrUp,
    isRightClick,
    isIE,
    hasDisabledAttributeSet,
} from '../util/utils.common';
import layoutModule from '../core/core.layout';
import TouchController from '../util/touch.controller';
import {tooltipModule} from '../components/components.tooltip';
import primaryNavModule from '../actionModel/actionModel.primaryNavigation';
import buttonManager from './core.buttonManager';

document.observe(isSupportsTouch() ? 'drag:touchstart' : 'drag:mousedown', function (evt) {
    var element = evt.memo.targetEvent.element();
    if (!isSupportsTouch() || !(event.treeEvent || event.listEvent)) {
        var li = matchMeOrUp(element, layoutModule.LIST_ITEM_PATTERN);
        if (li && !element.match(layoutModule.DISCLOSURE_BUTTON_PATTERN)) {
            buttonManager.down(li, function (listItemElement) {
                return jQuery(listItemElement).children(layoutModule.LIST_ITEM_WRAP_PATTERN)[0];
            });
        }
        if (element.match(layoutModule.DISCLOSURE_BUTTON_PATTERN)) {
            buttonManager.down(element);
        }
    }
});    ///////////////////////////////////////////////////////////////////////////////////
// Mouse Effects
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
// Mouse Effects
///////////////////////////////////////////////////////////////////////////////////
// Suppress Default Context Menu
///////////////////////////////////////////////////////////////////////////////////
//use this to cancel the default event. Weird behavior on mac Gecko browser
//see link:http://unixpapa.com/js/mouse.html for more info
///////////////////////////////////////////////////////////////////////////////////
// Suppress Default Context Menu
///////////////////////////////////////////////////////////////////////////////////
//use this to cancel the default event. Weird behavior on mac Gecko browser
//see link:http://unixpapa.com/js/mouse.html for more info
document.observe('mouseup', function (evt) {
    if (isRightClick(evt)) {
        var node = evt.element();
        document.fire(layoutModule.ELEMENT_CONTEXTMENU, {
            targetEvent: evt,
            node: node
        });
    }
});    // Workaround for IE9 native context menu
// Workaround for IE9 native context menu
document.observe('contextmenu', function (event) {
    Event.stop(event);
    return false;
});

const MainMenuTopLevelItemToActionMap = {
    [layoutModule.MAIN_NAVIGATION_HOME_ITEM_ID]: 'home',
    [layoutModule.MAIN_NAVIGATION_LIBRARY_ITEM_ID]: 'library'
};

document.observe('dom:loaded', function (event) {
    var isGlobalEventsAllowed = function (el) {
        var $el = jQuery(el);
        return typeof $el.data('globalEvents') === 'undefined';
    };
    isIE() && document.body.setAttribute('oncontextmenu', 'return false');
    jQuery('body').on('mouseover', layoutModule.BUTTON_PATTERN, function (evt) {
        if (!hasDisabledAttributeSet(this) && isGlobalEventsAllowed(this))
            buttonManager.over(this);
    });
    jQuery('body').on('mouseout', layoutModule.BUTTON_PATTERN, function (evt) {
        if (isGlobalEventsAllowed(this))
            buttonManager.out(this);
    });
    jQuery('body').on('focusin', layoutModule.BUTTON_PATTERN, function (evt) {
        if (!hasDisabledAttributeSet(this) && isGlobalEventsAllowed(this))
            buttonManager.over(this);
    });
    jQuery('body').on('focusout', layoutModule.BUTTON_PATTERN + '.' + layoutModule.HOVERED_CLASS, function (evt) {
        if (!hasDisabledAttributeSet(this) && isGlobalEventsAllowed(this))
            buttonManager.out(this);
    });
    jQuery('body').on('mousedown mouseup touchstart touchend', [
        layoutModule.BUTTON_PATTERN,
        layoutModule.MENU_LIST_PATTERN,
        layoutModule.DISCLOSURE_BUTTON_PATTERN,
        layoutModule.META_LINKS_PATTERN
    ].join(','), function (evt) {
        const isStartEvent = evt.type === 'mousedown' || evt.type === 'touchstart';

        if (!hasDisabledAttributeSet(this) && isGlobalEventsAllowed(this)) {
            isStartEvent ? buttonManager.down(this) : buttonManager.up(this);
        }
    });

    // Main menu
    jQuery('body').on('click', `#${layoutModule.MAIN_NAVIGATION_ID} > li`, function (evt) {
        const action = MainMenuTopLevelItemToActionMap[evt.currentTarget.getAttribute('id')];
        if (action) {
            primaryNavModule.navigationOption(action);
        }
    });
    jQuery(`#${layoutModule.MAIN_NAVIGATION_ID}`).on('mouseover', layoutModule.NAVIGATION_MUTTON_PATTERN, function (evt) {
        primaryNavModule.showNavButtonMenu(evt, this);
    });


    jQuery('#frame').on('touchend mouseup', '.minimize', function (evt) {
        if (this.parentNode.className.indexOf('maximized') >= 0) {
            jQuery(this).attr('aria-expanded', false);
            layoutModule.minimize(this);
        } else {
            jQuery(this).attr('aria-expanded', true);
            layoutModule.maximize(this);
        }
        evt.preventDefault();
    });
    jQuery('#frame').on('touchend mouseup', layoutModule.TABSET_TAB_PATTERN, function (evt) {
        if (!hasDisabledAttributeSet(this) && isGlobalEventsAllowed(this) && jQuery(this.parentNode).attr('disableCoreEvents') !== 'true') {
            jQuery(this).siblings().removeClass(layoutModule.SELECTED_CLASS).each(function (index, element) {
                jQuery(jQuery(this).attr('tabId')).addClass('hidden');
            });
            jQuery(this).addClass(layoutModule.SELECTED_CLASS);
            jQuery(jQuery(this).attr('tabId')).removeClass('hidden');    // Dirty hack to make anchor bigger when attributes tab is selected.
            // Dirty hack to make anchor bigger when attributes tab is selected.
            var $anchor = jQuery(this).closest('.tabs').find('.control.tabSet.anchor');
            jQuery(this).attr('tabId') === '#attributesTab' ? $anchor.addClass('attributesAnchor') : $anchor.removeClass('attributesAnchor');
        }
    });
    jQuery('#' + layoutModule.META_LINK_LOGOUT_ID).on('mousedown touchstart', function (evt) {
        evt.preventDefault();
        primaryNavModule.navigationOption('logOut');
    });

    /*
     * Tooltips
     */
    jQuery('body').on('mouseover', '[tooltiptext]', function (evt) {
        tooltipModule.showJSTooltip(this, [
            evt.clientX,
            evt.clientY
        ])
    });
    jQuery('body').on('focusin', '[tooltiptext]', function (evt) {
        tooltipModule.showJSTooltip(this, [
            evt.target.getBoundingClientRect().right,
            evt.target.getBoundingClientRect().top
        ])
    });
    jQuery('body').on('mouseout click focusout', '[tooltiptext]', function (evt) {
        tooltipModule.hideJSTooltip(this);
    });

    if (isSupportsTouch()) {
        document.body.addEventListener('touchstart', function (e) {
            window.calendar && window.calendar.hide && !window.calendar.hidden && window.calendar.hide();
            if (typeof TouchController !== 'undefined')
                TouchController.element_scrolled = false;
        }, false);
        document.body.addEventListener('touchmove', function (e) {
            //e.preventDefault();
        }, false);
    }    /*
     * Bug fix 28602.
     */
    /*
     * Bug fix 28602.
     */
    jQuery('#filePath').on('mouseenter mouseout', function () {
        jQuery('#fake_upload_button').toggleClass('over');
    });
});

export default buttonManager;