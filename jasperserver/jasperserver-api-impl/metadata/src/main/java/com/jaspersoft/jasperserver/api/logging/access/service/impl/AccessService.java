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
package com.jaspersoft.jasperserver.api.logging.access.service.impl;

import com.jaspersoft.jasperserver.api.logging.service.LoggingService;
import com.jaspersoft.jasperserver.api.logging.access.domain.AccessEvent;
import org.hibernate.criterion.DetachedCriteria;

import java.util.List;

/**
 * @author Sergey Prilukin
 * @version $Id$
 */
public interface AccessService extends LoggingService {
    public void purgeAccessEvents();
    public List<AccessEvent> getAllEvents(int firstResult, int maxResults);
    public int getAccessEventsCount();
    public void deleteAccessEvent(String uri, boolean isFolder);
    public void importAccessEvent(AccessEvent accessEvent);
    public void importAccessEvents(List<AccessEvent> accessEvents);
    public List getResourceURIs(DetachedCriteria criteria, int max);
    public void updateAccessEventsByResourceURI(String oldURI, String newURI);
    public void deleteAccessEventsByUser(String userId);
}
