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

package com.jaspersoft.jasperserver.api.common.error.handling;

import com.jaspersoft.jasperserver.api.JasperServerAPI;

/**
 * Class
 * @author dlitvak
 * @version $Id$
 */
@JasperServerAPI
public interface ExceptionOutputManager {
	final static String ERROR_UID_CONTROL_KEY = "ERROR_UID";
	final static String STACKTRACE_CONTROL_KEY = "STACKTRACE";
	final static String MESSAGE_CONTROL_KEY = "MESSAGE";
	final static String GENERIC_ERROR_MESSAGE_CODE = "generic.error.message";
    final static String ERROR_MESSAGE_PREFIX = "error.prefix.message";

	boolean isExceptionMessageAllowed();
	boolean isStackTraceAllowed();
	boolean isUIDOutputOn();
}
