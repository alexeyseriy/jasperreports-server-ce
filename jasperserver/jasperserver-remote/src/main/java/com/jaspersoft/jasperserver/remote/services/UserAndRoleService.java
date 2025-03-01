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
package com.jaspersoft.jasperserver.remote.services;

import com.jaspersoft.jasperserver.api.metadata.user.domain.Role;
import com.jaspersoft.jasperserver.api.metadata.user.domain.User;
import com.jaspersoft.jasperserver.remote.common.RoleSearchCriteria;
import com.jaspersoft.jasperserver.remote.common.UserSearchCriteria;
import com.jaspersoft.jasperserver.api.ErrorDescriptorException;

import java.util.List;

/**
 * @author Volodya Sabadosh (vsabadosh@jaspersoft.com)
 * @version $Id $
 */
public interface UserAndRoleService {

    public List<User> findUsers(UserSearchCriteria criteria) throws ErrorDescriptorException;

    public User putUser(User user) throws ErrorDescriptorException;

    public void deleteUser(User user) throws ErrorDescriptorException;

    public List<Role> findRoles(RoleSearchCriteria criteria) throws ErrorDescriptorException;

    public Role putRole(Role role) throws ErrorDescriptorException;

    public Role updateRoleName(Role oldRole, String newName) throws ErrorDescriptorException;

    public void deleteRole(Role role) throws ErrorDescriptorException;

}
