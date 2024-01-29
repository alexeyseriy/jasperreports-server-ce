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

import jQuery from 'jquery';
import log from "../../logging/logger";
import stdnav from '../stdnav';
import {DIALOG_REFERENCE_ATTRIBUTE} from '../stdnavModalFocusing';

const logger = log.register("stdnav");

const stdnavPluginModalTrap = function () {
};

jQuery.extend(stdnavPluginModalTrap.prototype, {
    // Registers the 'button' navtype with stdnav.  stdnav must be loaded and
    // activated before this can be done.
    activate: function () {
        // This is the behaviour hash for the navtype.  These defaults pass
        // everything through to the browser, and are normally overridden
        // with jQuery.extend based on specific tagnames and stdnav attributes.
        this.behavior = {
            'fixfocus': [this, this._fixFocus, null]
        };
        stdnav.registerNavtype(this.navtype, this.behavior, this.navtype_tags);
    },

    // Unregisters navtype from stdnav.  This must be done
    // before deactivating/unloading stdnav.
    deactivate: function () {
        stdnav.unregisterNavtype(this.navtype, this.behavior);
    },

    /* ========== NAVTYPE BEHAVIOR CALLBACKS =========== */

    _fixFocus: function (element) {
        const $el = jQuery(element);
        const currentModalDialogRoot = stdnav.modalDialogRoots[$el.attr(DIALOG_REFERENCE_ATTRIBUTE)];
        if (!currentModalDialogRoot) {
            logger.error('Modal Trap element exists while there is no opened dialog');
            return element;
        }

        let modalFocusableElement;
        if ($el.prev().is(currentModalDialogRoot)) {
            modalFocusableElement = stdnav.getFirstFocusableElement(currentModalDialogRoot)
        } else if ($el.next().is(currentModalDialogRoot)) {
            modalFocusableElement = stdnav.getLastFocusableElement(currentModalDialogRoot)
        }

        if (!modalFocusableElement) {
            logger.error('Modal dialog does not contain any focusable element');
            return element;
        }

        return modalFocusableElement;
    }
});

// SECOND EXTENSION PASS - ATTRIBUTES
// Hash members in this pass can reference functions from the last pass.
jQuery.extend(stdnavPluginModalTrap.prototype, {
    // This is the name of the new navtype.  Each stdnav plugin must
    // define a unique name.
    navtype: 'modalTrap',

    // This arrary extends the tag-to-navtype map in stdnav.  If your
    // plugin should apply to all elements of a given type, add those
    // element tagnames, in lower case, to this array.  It is normally
    // empty, and the page templates simply set an appropriate
    // "data-navtype=" attribute to get the expected behavior.
    //
    // CASE SENSITIVE - USE UPPER-CASE!
    navtype_tags: []
});
var newStdnavPluginModalTrap = new stdnavPluginModalTrap();
export default newStdnavPluginModalTrap;