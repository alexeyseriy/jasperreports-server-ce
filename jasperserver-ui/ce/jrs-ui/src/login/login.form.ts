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
import jrsConfigs from 'js-sdk/src/jrs.configs';
// @ts-ignore
import JSEncrypter from 'js-sdk/src/common/util/encrypter';
// @ts-ignore
import webHelpModule from '../components/components.webHelp';
import LoginConst from './login.const'

type ExtendedWindow = typeof window & {
    doesAllowUserPasswordChange?: boolean | undefined
}

const KEY_ENTER = 13;
const WEB_HELPER_MODULE_CONTEXT = 'login';

interface ParamsToEncrypt {
    // eslint-disable-next-line camelcase
    j_password: string,
    // eslint-disable-next-line camelcase
    j_newpassword1?: string,
    // eslint-disable-next-line camelcase
    j_newpassword2?: string,
}

export default function loginForm() {
    const usernameElement = jQuery(`#${LoginConst.J_USERNAME}`);
    const passwordPseudoElement = jQuery(`#${LoginConst.J_PASSWORD_PSEUDO}`);
    const organisationElement = jQuery(`#${LoginConst.ORGANIZATION_ID}`);
    const extendedWindow = window as ExtendedWindow;

    webHelpModule.setCurrentContext(WEB_HELPER_MODULE_CONTEXT);

    const submitLogin = function submitLogin(event: JQuery.Event) {
        if (jrsConfigs.isEncryptionOn) {
            // global property from jsp page, set up in security-config.properties
            const paramsToEncrypt: ParamsToEncrypt = {
                j_password: String(passwordPseudoElement.val() ?? '')
            };

            if (extendedWindow.doesAllowUserPasswordChange) {
                const newPass1 = String(jQuery(`#${LoginConst.J_NEW_PASSWORD1_PSEUDO}`).val() ?? '');
                const newPass2 = String(jQuery(`#${LoginConst.J_NEW_PASSWORD2_PSEUDO}`).val() ?? '');
                if (jQuery.trim(newPass1)) {
                    paramsToEncrypt.j_newpassword1 = newPass1;
                }
                if (jQuery.trim(newPass2)) {
                    paramsToEncrypt.j_newpassword2 = newPass2;
                }
            }

            JSEncrypter.encryptData(paramsToEncrypt, (encData: {[key: string]: string}) => {
                Object.keys(encData).forEach((k) => {
                    // set hidden fields to encrypted values
                    jQuery(`#${k}`).val(encData[k]); // hide pseudo password field contents, so that browser autocomplete
                    // is not trigger to remember the encrypted password every time.
                    // hide pseudo password field contents, so that browser autocomplete
                    // is not trigger to remember the encrypted password every time.
                    jQuery(`#${k}_pseudo`).val('');
                })
                jQuery(`#${LoginConst.LOGIN_FORM}`).trigger('submit');
            });
        } else {
            jQuery(`#${LoginConst.J_PASSWORD}`).val(String(passwordPseudoElement.val() ?? ''));
            jQuery(`#${LoginConst.J_NEW_PASSWORD1}`).val(String(jQuery(`#${LoginConst.J_NEW_PASSWORD1_PSEUDO}`).val() ?? ''));
            jQuery(`#${LoginConst.J_NEW_PASSWORD2}`).val(String(jQuery(`#${LoginConst.J_NEW_PASSWORD2_PSEUDO}`).val() ?? ''));
            jQuery(`#${LoginConst.LOGIN_FORM}`).trigger('submit');
        }

        event.preventDefault();
    };

    jQuery(`#${LoginConst.SUBMIT_BUTTON}`)
        .removeAttr('disabled')
        .on('click', submitLogin);

    [usernameElement, passwordPseudoElement, organisationElement].forEach((el) => {
        el.on('keypress', (event: JQuery.KeyPressEvent) => {
            if ((event.keyCode || event.which) !== KEY_ENTER) {
                return;
            }
            submitLogin(event);
        });
    })
}
