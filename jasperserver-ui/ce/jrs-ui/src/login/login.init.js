/*
 * Copyright (C) 2005 - 2019 TIBCO Software Inc. All rights reserved.
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
import initLoginForm from './login.form';
import { isIPad } from '../util/utils.common';
import aboutDialog from '../components/components.about'
import LoginConst from './login.const'

function initIPad() {
    if (isIPad()) {
        const $frame = jQuery('#frame');
        const $h2 = jQuery('h2.textAccent');
        const $copy = jQuery('#copy');
        const $loginForm = jQuery(`#${LoginConst.LOGIN_FORM}`);

        const onOrientationChange = () => {
            const { orientation } = window;

            switch (orientation) {
            case 0:
                $h2.css('font-size', '14px').parent().css('width', '39%');
                $copy.css('width', '600px');
                $loginForm.css({
                    left: '524px',
                    right: ''
                });
                break;
            case 90:
            case -90:
                $h2.css('font-size', '16px').parent().css('width', '46%');
                $copy.css('width', '766px');
                $loginForm.css({
                    left: '',
                    right: '-10px'
                });
                break;
            }
        };

        $frame.hide();
        onOrientationChange();
        $frame.show();

        window.addEventListener('orientationchange', onOrientationChange);
    }
}

export default function loginInit(LoginBox) {
    initLoginForm();

    if (window.location.hash) {
        window.localStorage.previousPageHash = window.location.hash;
    }

    aboutDialog.initialize();

    new LoginBox(jrsConfigs.loginState);

    initIPad();
}
