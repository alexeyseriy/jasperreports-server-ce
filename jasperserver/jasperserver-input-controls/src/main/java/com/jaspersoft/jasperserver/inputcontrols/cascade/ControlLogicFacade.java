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
package com.jaspersoft.jasperserver.inputcontrols.cascade;

import java.util.List;

/**
 * ControlLogicFacade
 * @author jwhang
 * @version 1.1
 * Interface used by exterior clients using the cascading service such as servlets, web services, etc.
 */

public interface ControlLogicFacade {

    @Deprecated
    public List<EventEnvelope> initialize(String reportUri, List<EventEnvelope> envelopes) throws SecurityException;

    @Deprecated
    public List<EventEnvelope> handleEvents(String reportUri, List<EventEnvelope> envelopes) throws SecurityException;

    @Deprecated
    public List<EventEnvelope> autoPopulate(String reportUri, List<EventEnvelope> envelopes, String lookupKey) throws SecurityException;

}



