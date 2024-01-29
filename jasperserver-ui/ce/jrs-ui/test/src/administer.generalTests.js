/*
 * Copyright (C) 2005 - 2023. Cloud Software Group, Inc. All Rights Reserved.
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

import general from "../../src/administer/administer.general";
import sinon from "sinon";
import dialogs from '../../src/components/components.dialogs';
import layoutModule from '../../src/core/core.layout';

describe('administer general', function () {
    it('should be able to call resizeOnClient', function () {
        const resizeOnClientStub = sinon.stub(layoutModule, 'resizeOnClient');
        general.initialize();
        expect(resizeOnClientStub).toHaveBeenCalled();
        resizeOnClientStub.restore();
    });
    it('should be able to show dialog', function () {
        const showStub = sinon.stub(dialogs.systemConfirm, 'show');
        general._updateCallback({result: 'ok'})
        expect(showStub).toHaveBeenCalled();
        showStub.restore();
    });
    it('should be able to showWarning dialog', function () {
        const showWarningStub = sinon.stub(dialogs.systemConfirm, 'showWarning');
        general._updateCallback({error: 'error'});
        expect(showWarningStub).toHaveBeenCalled();
        showWarningStub.restore();
    });
});
