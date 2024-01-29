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


/**
 * @version: $Id$
 */
import webHelpModule from '../components/components.webHelp';
import dialogs from '../components/components.dialogs';
import layoutModule from '../core/core.layout';
import {ValidationModule} from "../util/utils.common";
import jQuery from 'jquery';
import LoginConst from './login.const';

const LOGIN_BOX_TEMPLATE_DOM_ID = "login";
const DOCUMENTATION_BUTTON_ID = "documentationButton";
const GOTO_JASPERFORGE_BUTTON_ID = "gotoJasperForge";
// const CONTACT_SALES_BUTTON_ID = "contactSalesButton";
// const CONTACT_SALES_URL = "http://www.jaspersoft.com/contact-us";
const NEED_HELP_LINK_ID = "needHelp";
const NEED_HELP_DIALOG_ID = "helpLoggingIn";

const WARNING_SECTION = "loginWarningSection";
const ERROR_SECTION = "loginErrorSection";

class LoginBox {

    _dom = null;

    constructor(options) {
        this._initialize(options)
    }

    _initialize(options) {
        this._initVars(options);
        this._processTemplate();
        this._initHandlers();

        if (this._passwordExpiredDays.length > 0) {
            this._passwordExpiredDays.val(this._passwordExpirationInDays);
        }

        this._beforeFocus();
        this._focus();
    }

    _beforeFocus() {
        if (this._warningMessage) {
            this._customError.html(this._warningMessage)
                .removeClass("hidden")
        }

        if (this._errorSection.text().trim()) {
            this._errorSection.attr('aria-hidden', 'false');
            this._errorSection.attr('role', 'alert');
            this._errorSection.attr('aria-live', 'Assertive');
        }

        if (this._warningSection.text().trim()) {
            this._warningSection.attr('aria-hidden', 'false')
        }
    }

    _getElementToFocus() {
        if (this._errorSection.attr('aria-hidden') === 'false') {
            const organizationIdInput = jQuery(`#${LoginConst.ORGANIZATION_ID}`);
            const usernameInput = jQuery(`#${LoginConst.J_USERNAME}`);
            return organizationIdInput.length && !(organizationIdInput.closest('label').hasClass('hidden')) ? organizationIdInput : usernameInput;
        }
    }

    _focus() {
        const element = this._getElementToFocus();
        if (element) {
            jQuery(element).trigger('focus');
            //to fix intermittent issue of not having "data-focus-visible-added" below "if" block added
            if(!jQuery(element).hasClass('focus-visible')){
                jQuery(element).addClass('focus-visible');
                jQuery(element).attr('data-focus-visible-added', '');
            }
        }
    }

    _initVars(options) {
        this._showLocaleMessage = options.showLocaleMessage;
        this._hideLocaleMessage = options.hideLocaleMessage;
        this._changePasswordMessage = options.changePasswordMessage;
        this._cancelPasswordMessage = options.cancelPasswordMessage;

        this._allowUserPasswordChange = options.allowUserPasswordChange;
        this._showPasswordChange = options.showPasswordChange;
        this._allowedPasswordPattern = new RegExp(options.allowedPasswordPattern);

        this._passwordExpirationInDays = options.passwordExpirationInDays;

        this._nonEmptyPasswordMessage = options.nonEmptyPasswordMessage;
        this._passwordNotMatchMessage = options.passwordNotMatchMessage;
        this._passwordNotMatchMessage = options.passwordNotMatchMessage;
        this._passwordTooWeakMessage = options.passwordTooWeakMessage;

        this._warningMessage = options.warningMessage;
    }

    _processTemplate() {
        this._dom = jQuery('#' + LOGIN_BOX_TEMPLATE_DOM_ID);

        this._showHideLocaleAndTimezone = jQuery(`#${LoginConst.SHOW_HIDE_LOCALE_AND_TIMEZONE}`);
        this._localeAndTimeZone = jQuery(`#${LoginConst.LOCALE_AND_TIMEZONE}`);

        this._changePassword = jQuery(`#${LoginConst.CHANGE_PASSWORD}`);
        this._j_newpassword1 = jQuery(`#${LoginConst.J_NEW_PASSWORD1_PSEUDO}`);
        this._j_newpassword2 = jQuery(`#${LoginConst.J_NEW_PASSWORD2_PSEUDO}`);
        this._showHideChangePassword = jQuery(`#${LoginConst.SHOW_HIDE_CHANGE_PASSWORD}`);
        this._passwordExpiredDays = this._dom.find(`input[name="${LoginConst.PASSWORD_EXPIRED_DAYS}"]`);

        this._customError = jQuery(`#${LoginConst.CUSTOM_ERROR}`);

        this._loginForm = this._dom.parent('form');

        this.documentationButton = jQuery('#' + DOCUMENTATION_BUTTON_ID);
        this.gotoJasperForge = jQuery('#' + GOTO_JASPERFORGE_BUTTON_ID);
        this.needHelpLink = jQuery('#' + NEED_HELP_LINK_ID);

        this.needHelpDialog = jQuery('#' + NEED_HELP_DIALOG_ID);

        this._warningSection = jQuery(`#${WARNING_SECTION}`);
        this._errorSection = jQuery(`#${ERROR_SECTION}`);
    }

    _initHandlers() {
        this._showHideLocaleAndTimezone.on('click', this._localeAndTimezoneShowHideHandler.bindAsEventListener(this));

        if(this._allowUserPasswordChange) {
            this._showHideChangePassword.on('click', this._changePasswordShowHideHandler.bindAsEventListener(this));
            // use jQuery to work with login.js
            this._loginForm.on('submit', this._submitValidateHandler.bind(this));
        }

        if (this._showPasswordChange) {
            this._changePasswordShowHideHandler();
        }

        //web help
        if (window.webHelpModule) {
            this.documentationButton.on("click", function(e) {
                webHelpModule.displayWebHelp();
            }.bindAsEventListener(this));
        }

        this.gotoJasperForge.on("click", function(e) {
            var url = "http://jasperforge.org";
            window.name = "";
            var runPopup=window.open(url, "jasperforge.org");
            runPopup.focus();
        }.bindAsEventListener(this));

        this.needHelpLink.on("click", () => {
            dialogs.popup.show(this.needHelpDialog[0], true, {closable: true});
        });

        var loginDialogs = [this.needHelpDialog];

        loginDialogs.each(function(dialog) {
            dialog.find(layoutModule.BUTTON_PATTERN).on("click", function(e) {
                dialogs.popup.hide(dialog);
            });
        });
    }

    _submitValidateHandler(event) {
        this._customError.addClass("hidden");

        if (!this._changePassword.hasClass("hidden")) {
            var isValid = ValidationModule.validate([
                {
                    validators: [
                        {method: this._emptyPasswordValidator.bind(this)},
                        {method: this._confirmationPasswordTooWeakValidator.bind(this)}
                    ],
                    element: this._j_newpassword1[0]
                },
                {
                    validators: [
                        {method: this._emptyPasswordValidator.bind(this)},
                        {method: this._confirmationPasswordNotMatchValidator.bind(this)}
                    ],
                    element: this._j_newpassword2[0]
                }
            ]);

            if (!isValid) {
                event.preventDefault();
            }
        }
    }

    _emptyPasswordValidator(value) {
        var isValid = true;
        var errorMessage = "";

        if (value.blank()) {
            isValid = false;
            errorMessage = this._nonEmptyPasswordMessage;
        }

        return {
            isValid: isValid,
            errorMessage: errorMessage
        };
    }

    _confirmationPasswordNotMatchValidator(value) {
        var isValid = true;
        var errorMessage = "";

        if (value !== this._j_newpassword1.val()) {
            isValid = false;
            errorMessage = this._passwordNotMatchMessage;
        }

        return {
            isValid: isValid,
            errorMessage: errorMessage
        };
    }

    _confirmationPasswordTooWeakValidator(value) {
        return {
            isValid: this._allowedPasswordPattern.test(value),
            errorMessage: this._passwordTooWeakMessage
        }
    }

    _changePasswordShowHideHandler() {
        this._changePassword.toggleClass("hidden");

        if (this._changePassword.hasClass("hidden")) {
            this._showHideChangePassword.html(this._changePasswordMessage)
                .attr("aria-expanded", "false");
            this._j_newpassword1.val("");
            this._j_newpassword2.val("");
        } else {
            this._showHideChangePassword.html(this._cancelPasswordMessage)
                .attr("aria-expanded", "true");
        }
    }

    _localeAndTimezoneShowHideHandler() {
        this._localeAndTimeZone.toggleClass("hidden");

        if (this._localeAndTimeZone.hasClass("hidden")) {
            this._showHideLocaleAndTimezone
                .html(this._showLocaleMessage)
                .attr("aria-expanded", "false");
        } else {
            this._showHideLocaleAndTimezone
                .html(this._hideLocaleMessage)
                .attr("aria-expanded", "true");
        }
    }
}

export default LoginBox;
