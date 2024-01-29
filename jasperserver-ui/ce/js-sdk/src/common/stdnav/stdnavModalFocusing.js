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

/* Standard Navigation library (stdnav) extension
 * ------------------------------------
 * Modal focus management handlers
 *
 */
import jQuery from 'jquery';
import _ from 'underscore';

const MODAL_TRAP_ELEMENT_TEMPLATE =
    _.template('<div {{-attrName }}="{{-attrValue }}" js-navtype="modalTrap" class="offLeft" tabindex="0"></div>');

export const DIALOG_REFERENCE_ATTRIBUTE = 'js-dialog-reference';

export default {

    // Add special focusable invisible elements before and after modal dialog.
    // When they will receive focus - they will force focus back to the modal dialog:
    // - element before the dialog will force last focusable element of the dialog
    // - element after the dialog will force first focusable element of the dialog (or dialog itself if it's focusable)
    beginModalFocus: function(element) {
        if (!element) {
            return;
        }

        const $el = jQuery(element);
        const id = _.uniqueId();

        // This should handle the case
        // where two different "threads" pop up the same dialog.
        if (this.modalDialogRoots[id]) {
            this.endModalFocus(this.modalDialogRoots[id]);
        }

        this.modalDialogRoots[id] = element;
        $el.attr(DIALOG_REFERENCE_ATTRIBUTE, id);

        const trapElement = MODAL_TRAP_ELEMENT_TEMPLATE({attrName: DIALOG_REFERENCE_ATTRIBUTE, attrValue: id});
        jQuery(trapElement).insertBefore($el);
        jQuery(trapElement).insertAfter($el);
    },

    // Resumes the focusability of all elements in the DOM which do not
    // have the element provided as a parent.
    endModalFocus: function(element) {
        const $el = jQuery(element);
        const id = $el.attr(DIALOG_REFERENCE_ATTRIBUTE);
        if (this.modalDialogRoots[id]) {
            document.querySelectorAll(`[js-navtype='modalTrap'][${DIALOG_REFERENCE_ATTRIBUTE}='${id}']`).forEach(e => e.remove());
            delete this.modalDialogRoots[id];
        }
    },
}