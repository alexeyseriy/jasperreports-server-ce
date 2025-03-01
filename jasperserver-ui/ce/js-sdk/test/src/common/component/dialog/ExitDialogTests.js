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

import sinon from 'sinon';
import ExitDialog from 'src/common/component/dialog/ExitDialog';
import Dialog from 'src/common/component/dialog/Dialog';


describe('Exit Dialog', function () {
    let sandbox;

    beforeEach(function () {
        sandbox = sinon.createSandbox();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('should call Exit Dialog constructor', function () {
        const constructor = Dialog.prototype.constructor,
            constructorStub = sandbox.stub(Dialog.prototype, 'constructor').callsFake(constructor),
            options={
                bodyText:{
                    firstText: 'This Report has unsaved changes that will be lost if you continue.',
                    secondText: 'Do you want to close this Report without saving?'},
                previousState:true
            },
            dialog = new ExitDialog(options);
        expect(constructorStub).toHaveBeenCalled();
        dialog.remove();
    });
});