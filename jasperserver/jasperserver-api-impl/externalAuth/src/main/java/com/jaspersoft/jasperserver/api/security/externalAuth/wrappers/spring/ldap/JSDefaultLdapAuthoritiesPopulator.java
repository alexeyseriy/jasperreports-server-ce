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
package com.jaspersoft.jasperserver.api.security.externalAuth.wrappers.spring.ldap;

import com.jaspersoft.jasperserver.api.JasperServerAPI;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.core.log.LogMessage;
import org.springframework.ldap.core.ContextSource;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.ldap.userdetails.DefaultLdapAuthoritiesPopulator;
import org.springframework.security.ldap.userdetails.LdapAuthority;

import java.util.*;

/**
 * Wrapper class for org.springframework.security.ldap.userdetails.DefaultLdapAuthoritiesPopulator
 * @author dlitvak
 * @version $Id$
 * @since 6.0
 */
@JasperServerAPI
public class JSDefaultLdapAuthoritiesPopulator extends DefaultLdapAuthoritiesPopulator {
	private static final Log logger = LogFactory.getLog(JSDefaultLdapAuthoritiesPopulator.class);
	private boolean convertToUpperCase = true;
	public JSDefaultLdapAuthoritiesPopulator(ContextSource contextSource, String groupSearchBase)  {
		super(contextSource, groupSearchBase);
	}

	@Override
	public Set<GrantedAuthority> getGroupMembershipRoles(String userDn, String username) {
		if (getGroupSearchBase() == null) {
			return new HashSet();
		} else {
			Set<GrantedAuthority> authorities = new HashSet();
			if (logger.isDebugEnabled()) {
				logger.debug("Searching for roles for user '" + username + "', DN = '" + userDn + "', with filter " + getGroupSearchFilter() + " in search base '" + getGroupSearchBase() + "'");
			}

			Set<String> userRoles = getLdapTemplate().searchForSingleAttributeValues(getGroupSearchBase(), getGroupSearchFilter(), new String[]{userDn, username}, getGroupRoleAttribute());
			if (logger.isDebugEnabled()) {
				logger.debug("Roles from search: " + userRoles);
			}

			String role;
			for(Iterator var5 = userRoles.iterator(); var5.hasNext(); authorities.add(new SimpleGrantedAuthority(getRolePrefix() + role))) {
				role = (String)var5.next();
				if (convertToUpperCase) {
					role = role.toUpperCase();
				}
			}

			return authorities;
		}
	}
}
