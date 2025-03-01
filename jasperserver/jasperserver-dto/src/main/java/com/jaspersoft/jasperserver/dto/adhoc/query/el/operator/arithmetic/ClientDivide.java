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

import com.jaspersoft.jasperserver.dto.adhoc.query.el.ClientExpression;
import com.jaspersoft.jasperserver.dto.adhoc.query.el.ClientExpressions;
import com.jaspersoft.jasperserver.dto.adhoc.query.el.ClientOperator;
import com.jaspersoft.jasperserver.dto.adhoc.query.el.ast.ClientELVisitor;
import com.jaspersoft.jasperserver.dto.adhoc.query.el.operator.ClientOperation;

import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

/**
 * @author Grant Bacon <gbacon@tibco.com>
 * @author Stas Chubar <schubar@tibco.com>
 * @version $Id$
 */
@XmlRootElement(name = ClientDivide.EXPRESSION_ID)
public class ClientDivide extends ClientOperator<ClientDivide> {

    public static final String EXPRESSION_ID = "divide";

    public ClientDivide() {
        super(ClientOperation.DIVIDE);
    }

    public ClientDivide(List<? extends ClientExpression> operands, Boolean paren) {
        super(ClientOperation.DIVIDE, operands, paren);
    }

    public ClientDivide(List<? extends ClientExpression> operands) {
        super(ClientOperation.DIVIDE, operands);
    }

    public ClientDivide(ClientDivide source) {
        super(source);
    }

    @Override
    @Size(min = 2, max = 2, message = DOMEL_INCORRECT_OPERANDS_COUNT)
    public List<ClientExpression> getOperands() {
        return operands;
    }

    @Override
    public String toString() {
        String separator = " " + getOperator().getDomelOperator() + " ";
        String operandsAsString;
        if (getOperands().size() < 2) {
            if (getOperands().isEmpty()) {
                operandsAsString = ClientExpressions.MISSING_REPRESENTATION + separator + ClientExpressions.MISSING_REPRESENTATION;
            } else {
                operandsAsString = getOperands().get(0) + separator + ClientExpressions.MISSING_REPRESENTATION;
            }
        } else {
            operandsAsString = operandsToString(getOperands(), separator);
        }

        return hasParen() ? "(" + operandsAsString + ")" : operandsAsString;
    }

    @Override
    public void accept(ClientELVisitor visitor) {
        super.accept(visitor);
        visitor.visit(this);
    }

    @Override
    public ClientDivide deepClone() {
        return new ClientDivide(this);
    }

    @Override
    public int getPrecedence() {
        return 5;
    }
}
