/*
 * Copyright (C) 2005-2023. Cloud Software Group, Inc. All Rights Reserved.
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

package com.jaspersoft.jasperserver.dto.adhoc.query.el.operator.arithmetic;

import com.jaspersoft.jasperserver.dto.adhoc.query.el.AbstractClientOperatorTest;
import com.jaspersoft.jasperserver.dto.adhoc.query.el.ClientExpression;
import com.jaspersoft.jasperserver.dto.adhoc.query.el.ClientVariable;
import com.jaspersoft.jasperserver.dto.adhoc.query.el.operator.ClientOperation;

import java.util.Arrays;
import java.util.List;

import static java.util.Arrays.asList;

/**
 * @author Olexandr Dahno <odahno@tibco.com>
 */

class ClientSubtractTest extends AbstractClientOperatorTest<ClientSubtract> {

    private static ClientExpression VARIABLE_A = new ClientVariable("A");
    private static ClientExpression VARIABLE_B = new ClientVariable("B");

    @Override
    protected ClientSubtract createInstanceWithOperands(List<ClientExpression> operands) {
        return new ClientSubtract(operands);
    }

    @Override
    protected String operatorId() {
        return ClientSubtract.EXPRESSION_ID;
    }

    @Override
    protected String separator() {
        return ClientOperation.SUBTRACT.getDomelOperator();
    }

    @Override
    protected List<ClientSubtract> prepareInstancesWithAlternativeParameters() {
        return Arrays.asList(
                createFullyConfiguredInstance().unsetParen(),
                new ClientSubtract(asList(VARIABLE_A)),
                new ClientSubtract(asList(VARIABLE_A)).setParen(),
                new ClientSubtract(asList(VARIABLE_A, VARIABLE_B)),
                new ClientSubtract(asList(VARIABLE_A, VARIABLE_B)).setParen()
        );
    }

    @Override
    protected ClientSubtract createFullyConfiguredInstance() {
        return new ClientSubtract(TEST_CLIENT_TWO_EXPRESSIONS).setParen();
    }

    @Override
    protected ClientSubtract createInstanceWithDefaultParameters() {
        return new ClientSubtract();
    }

    @Override
    protected ClientSubtract createInstanceFromOther(ClientSubtract other) {
        return new ClientSubtract(other);
    }
}