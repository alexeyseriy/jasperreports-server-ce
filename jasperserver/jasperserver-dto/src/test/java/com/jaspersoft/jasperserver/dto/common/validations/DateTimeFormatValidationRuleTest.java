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

package com.jaspersoft.jasperserver.dto.common.validations;

import com.jaspersoft.jasperserver.dto.basetests.BaseDTOPresentableTest;

import java.util.Arrays;
import java.util.List;

/**
 * @author Andriy Tivodar <ativodar@tibco>
 */

public class DateTimeFormatValidationRuleTest extends BaseDTOPresentableTest<DateTimeFormatValidationRule> {

    @Override
    protected List<DateTimeFormatValidationRule> prepareInstancesWithAlternativeParameters() {
        return Arrays.asList(
                createFullyConfiguredInstance().setFormat("format2"),
                createFullyConfiguredInstance().setErrorMessage("error2"),
                // with null values
                createFullyConfiguredInstance().setFormat(null),
                createFullyConfiguredInstance().setErrorMessage(null)
        );
    }

    @Override
    protected DateTimeFormatValidationRule createFullyConfiguredInstance() {
        DateTimeFormatValidationRule dateTimeFormatValidationRule = new DateTimeFormatValidationRule();
        dateTimeFormatValidationRule.setFormat("format");
        dateTimeFormatValidationRule.setErrorMessage("error");
        return dateTimeFormatValidationRule;
    }

    @Override
    protected DateTimeFormatValidationRule createInstanceWithDefaultParameters() {
        return new DateTimeFormatValidationRule();
    }

    @Override
    protected DateTimeFormatValidationRule createInstanceFromOther(DateTimeFormatValidationRule other) {
        return new DateTimeFormatValidationRule(other);
    }
}
