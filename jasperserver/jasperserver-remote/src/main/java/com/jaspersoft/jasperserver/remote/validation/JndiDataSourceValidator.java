/*
 * Copyright (C) 2005-2023. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary.
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
package com.jaspersoft.jasperserver.remote.validation;

import com.jaspersoft.jasperserver.api.common.domain.ExecutionContext;
import com.jaspersoft.jasperserver.api.common.util.JndiUtils;
import com.jaspersoft.jasperserver.dto.resources.ClientJndiJdbcDataSource;
import com.jaspersoft.jasperserver.remote.exception.InvalidJndiServiceNameException;
import com.jaspersoft.jasperserver.remote.exception.MandatoryParameterNotFoundException;
import org.springframework.stereotype.Component;

import javax.naming.InvalidNameException;
import java.util.Collections;
import java.util.List;

/**
 * <p></p>
 *
 * @author schubar
 * @version $Id$$
 */
@Component
public class JndiDataSourceValidator implements ClientValidator<ClientJndiJdbcDataSource> {

    @Override
    public List<Exception> validate(ExecutionContext ctx, ClientJndiJdbcDataSource value) {
        try {
            JndiUtils.validateName(value.getJndiName());
        } catch (InvalidNameException e) {
            return Collections.singletonList(new InvalidJndiServiceNameException(value.getJndiName(), e));
        }
        catch(NullPointerException e)
        {
            throw new MandatoryParameterNotFoundException(e.getMessage(), "JNDIName");
        }
        return Collections.emptyList();
    }

}
