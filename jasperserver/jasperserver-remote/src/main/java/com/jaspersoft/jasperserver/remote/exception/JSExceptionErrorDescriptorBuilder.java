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
package com.jaspersoft.jasperserver.remote.exception;

import com.jaspersoft.jasperserver.api.JSException;

import com.jaspersoft.jasperserver.api.common.error.handling.SecureExceptionHandler;
import com.jaspersoft.jasperserver.dto.common.ErrorDescriptor;
import com.jaspersoft.jasperserver.dto.common.ErrorDescriptorBuilder;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.Locale;

/**
 * <p></p>
 *
 * @author yaroslav.kovalchyk
 * @version $Id$
 */
@Component
public class JSExceptionErrorDescriptorBuilder implements ErrorDescriptorBuilder<JSException> {
    private static final String DUMMY_DEFAULT_MESSAGE = "dummyDefaultMessage";
    @Resource
    private MessageSource messageSource;
    @Resource
    private SecureExceptionHandler secureExceptionHandler;

    @Override
    public ErrorDescriptor build(JSException e) {
		String errorCode = null;
        if(e.getMessage() != null && !DUMMY_DEFAULT_MESSAGE.equals(messageSource.getMessage(e.getMessage(),
                new Object[]{}, DUMMY_DEFAULT_MESSAGE, Locale.getDefault()))){
			// exception message is an message code in bundles. Let's use it as error code,
			// but add common prefix "jrs.error." to identify the case
			errorCode = "jrs." + e.getMessage();
		}

		return secureExceptionHandler.handleException(e.getCause() != null ? e.getCause() : e, new ErrorDescriptor().setErrorCode(errorCode));
    }
}
