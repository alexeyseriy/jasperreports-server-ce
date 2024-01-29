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
package com.jaspersoft.jasperserver.remote.exception;

import com.jaspersoft.jasperserver.dto.common.ErrorDescriptor;

import java.text.MessageFormat;

/**
 * @author schubar
 * @version $Id$
 */
public class InvalidJndiServiceNameException extends IllegalParameterValueException {
    public static final String ERROR_CODE_INVALID_JNDI_SERVICE_NAME = "invalid.jndi.service.name";

    public InvalidJndiServiceNameException(String serviceName) {
        this(serviceName, (Throwable) null);
        this.getErrorDescriptor().setErrorCode(ERROR_CODE_INVALID_JNDI_SERVICE_NAME);
    }

    public InvalidJndiServiceNameException(String serviceName, Throwable t) {
        this(MessageFormat.format("The JNDI service name {0} is invalid.", serviceName), serviceName);
        this.getErrorDescriptor()
                .setErrorCode(ERROR_CODE_INVALID_JNDI_SERVICE_NAME)
                .setException(t)
        ;
    }

    public InvalidJndiServiceNameException(String message, String... parameters) {
        super(message, parameters);
        this.getErrorDescriptor().setErrorCode(ERROR_CODE_INVALID_JNDI_SERVICE_NAME);
    }

    public InvalidJndiServiceNameException(ErrorDescriptor errorDescriptor) {
        super(errorDescriptor);
        this.getErrorDescriptor().setErrorCode(ERROR_CODE_INVALID_JNDI_SERVICE_NAME);
    }
}
