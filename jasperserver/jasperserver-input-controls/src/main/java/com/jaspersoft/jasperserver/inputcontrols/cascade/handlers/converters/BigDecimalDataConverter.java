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
package com.jaspersoft.jasperserver.inputcontrols.cascade.handlers.converters;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.text.ParseException;
import org.apache.commons.lang.StringUtils;

/**
 * @author Yaroslav.Kovalchyk
 * @version $Id$
 */
@Service
public class BigDecimalDataConverter implements DataConverter<BigDecimal> {

    public String valueToString(BigDecimal value) {
        if (value == null) return "";
        DecimalFormat df = (DecimalFormat) NumberFormat.getNumberInstance(LocaleContextHolder.getLocale());
        df.setGroupingUsed(false);
        df.setMaximumFractionDigits(Integer.MAX_VALUE);
        return df.format(value);
    }

    @Override
    public BigDecimal stringToValue(String rawData) throws ParseException{
        if(StringUtils.isNotEmpty(rawData)) {
            BigDecimal value = new BigDecimal(rawData.replace(",", ".")).stripTrailingZeros();
            if (value.scale() < 0)
                return value.setScale(0);
            return value;
        }
        return null;
    }
}
