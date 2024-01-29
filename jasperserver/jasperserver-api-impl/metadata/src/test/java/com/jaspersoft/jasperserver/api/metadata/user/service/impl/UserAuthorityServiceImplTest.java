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

package com.jaspersoft.jasperserver.api.metadata.user.service.impl;

import com.jaspersoft.jasperserver.api.common.crypto.PasswordCipherer;
import com.jaspersoft.jasperserver.api.common.domain.ExecutionContext;
import com.jaspersoft.jasperserver.api.common.util.spring.StaticApplicationContext;
import com.jaspersoft.jasperserver.api.logging.diagnostic.domain.DiagnosticAttribute;
import com.jaspersoft.jasperserver.api.logging.diagnostic.domain.DiagnosticAttributeImpl;
import com.jaspersoft.jasperserver.api.logging.diagnostic.helper.DiagnosticAttributeBuilder;
import com.jaspersoft.jasperserver.api.logging.diagnostic.service.DiagnosticCallback;
import com.jaspersoft.jasperserver.api.metadata.common.service.ResourceFactory;
import com.jaspersoft.jasperserver.api.metadata.user.domain.ProfileAttribute;
import com.jaspersoft.jasperserver.api.metadata.user.domain.User;
import com.jaspersoft.jasperserver.api.metadata.user.domain.client.ProfileAttributeImpl;
import com.jaspersoft.jasperserver.api.metadata.user.domain.client.UserImpl;
import com.jaspersoft.jasperserver.api.metadata.user.domain.impl.hibernate.RepoProfileAttribute;
import com.jaspersoft.jasperserver.api.metadata.user.domain.impl.hibernate.RepoTenant;
import com.jaspersoft.jasperserver.api.metadata.user.domain.impl.hibernate.RepoUser;
import com.jaspersoft.jasperserver.api.metadata.user.service.ProfileAttributeLevel;
import com.jaspersoft.jasperserver.api.metadata.user.service.ProfileAttributeService;
import org.apache.commons.codec.digest.DigestUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.context.ApplicationContext;
import org.springframework.orm.hibernate5.HibernateTemplate;
import org.springframework.test.context.event.annotation.BeforeTestMethod;

import java.util.List;
import java.util.Map;

import static java.util.Collections.singleton;
import static java.util.Collections.singletonList;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * Tests for {@link com.jaspersoft.jasperserver.api.metadata.user.service.impl.UserAuthorityServiceImpl}
 *
 * @author vsabadosh
 */
@RunWith(MockitoJUnitRunner.class)
public class UserAuthorityServiceImplTest {
    private static final String CHANGER = "profileAttributeChanger";

    @Spy
    @InjectMocks
    private UserAuthorityServiceImpl userAuthorityService;
    @Mock
    private HibernateTemplate hibernateTemplate;
    @Mock
    private ResourceFactory objectFactory;
    @Mock
    private ProfileAttributeService profileAttributeService;
    @Mock
    private ResourceFactory persistentClassFactory;

    private final ApplicationContext applicationContext = mock(ApplicationContext.class);

    private final PasswordCipherer passwordCipherer = mock(PasswordCipherer.class);

    @Before
    public void setUp() {
        doReturn(new UserImpl()).when(objectFactory).newObject(User.class);
        doReturn(new ProfileAttributeImpl()).when(objectFactory).newObject(ProfileAttribute.class);
        doReturn(CHANGER).when(profileAttributeService).getChangerName(anyString());
        doReturn(passwordCipherer).when(applicationContext).getBean(PasswordCipherer.ID);
        doAnswer(invocationOnMock -> encodePassword(invocationOnMock.getArgument(0)))
                .when(passwordCipherer).decodePassword(anyString());
        StaticApplicationContext.setApplicationContext(applicationContext);
    }

    @Test
    public void getDiagnosticDataTest() {
        int total_users_count = 5;
        int total_enabled_users_count = 6;
        int total_roles_count = 7;

        doReturn(total_users_count).when(userAuthorityService).getUsersCountExceptExcluded(any(), eq(null), eq(false));
        doReturn(total_enabled_users_count).when(userAuthorityService).getUsersCountExceptExcluded(any(), eq(null), eq(true));
        lenient().doReturn(total_roles_count).when(userAuthorityService).getTenantRolesCount(any(), eq(null), eq(null));
        doReturn(total_roles_count).when(userAuthorityService).getTotalRolesCount(any());

        Map<DiagnosticAttribute, DiagnosticCallback> resultDiagnosticData = userAuthorityService.getDiagnosticData();

        //Test total size of diagnostic attributes collected from UserAuthorityServiceImpl
        assertEquals(3, resultDiagnosticData.size());

        assertEquals(total_users_count, resultDiagnosticData.get(new DiagnosticAttributeImpl(
                DiagnosticAttributeBuilder.TOTAL_USERS_COUNT, null, null)).getDiagnosticAttributeValue());

        assertEquals(total_enabled_users_count, resultDiagnosticData.get(new DiagnosticAttributeImpl(
                DiagnosticAttributeBuilder.TOTAL_ENABLED_USERS_COUNT, null, null)).getDiagnosticAttributeValue());

        assertEquals(total_roles_count, resultDiagnosticData.get(new DiagnosticAttributeImpl(
                DiagnosticAttributeBuilder.TOTAL_ROLES_COUNT, null, null)).getDiagnosticAttributeValue());
    }


    @BeforeTestMethod
    public void initBeforeTest(){
        hibernateTemplate = Mockito.mock(HibernateTemplate.class);
    }

    @Test
    public void getUsersWithProfileAttributes_noUsers_null() {
        List<User> users = userAuthorityService.getUsersWithProfileAttributes(null, null);
        assertNull(users);
    }

    @Test
    public void getUsers_usersWithAttributes_convertedUserWithoutAttributes() {
        RepoUser repoUser = newUser("username");
        RepoProfileAttribute profileAttribute = newProfileAttribute("attr1", "value1", repoUser);
        repoUser.setProfileAttributes(singleton(profileAttribute));
        repoUser.setTenant(newTenant("/organizations"));

        doReturn(RepoUser.class).when(persistentClassFactory).getImplementationClass(User.class);
        doReturn(singletonList(repoUser)).when(hibernateTemplate).loadAll(RepoUser.class);

        List<User> users = userAuthorityService.getUsers(null, null);

        assertEquals(1, users.size());
        User user = users.get(0);
        assertEquals(repoUser.getUsername(), user.getUsername());
        assertEquals(repoUser.getEmailAddress(), user.getEmailAddress());
        assertEquals(encodePassword(repoUser.getPassword()), user.getPassword());

        assertNull(user.getAttributes());
    }

    @Test
    public void getTenantUsers_usersWithAttributes_convertedUserWithoutAttributes() {
        RepoUser repoUser = newUser("username");
        RepoProfileAttribute profileAttribute = newProfileAttribute("attr1", "value1", repoUser);
        repoUser.setProfileAttributes(singleton(profileAttribute));
        repoUser.setTenant(newTenant("/organizations"));

        doReturn(singletonList(repoUser)).when(hibernateTemplate).execute(any());

        List<User> users = userAuthorityService.getTenantUsers(null, null, null);

        assertEquals(1, users.size());
        User user = users.get(0);
        assertEquals(repoUser.getUsername(), user.getUsername());
        assertEquals(repoUser.getEmailAddress(), user.getEmailAddress());
        assertEquals(encodePassword(repoUser.getPassword()), user.getPassword());

        assertNull(user.getAttributes());
    }

    @Test
    public void getUsersWithProfileAttributes_usersWithAttributes_convertedUsers() {
        RepoUser repoUser = newUser("username");
        RepoProfileAttribute profileAttribute = newProfileAttribute("attr1", "value1", repoUser);
        repoUser.setProfileAttributes(singleton(profileAttribute));
        repoUser.setTenant(newTenant("/organizations"));

        doReturn(singletonList(repoUser)).when(hibernateTemplate).execute(any());

        List<User> users = userAuthorityService.getUsersWithProfileAttributes(null, null);

        assertEquals(1, users.size());
        User user = users.get(0);
        assertEquals(repoUser.getUsername(), user.getUsername());
        assertEquals(repoUser.getEmailAddress(), user.getEmailAddress());
        assertEquals(encodePassword(repoUser.getPassword()), user.getPassword());

        ProfileAttribute attribute = (ProfileAttribute) user.getAttributes().get(0);
        assertEquals(profileAttribute.getAttrName(), attribute.getAttrName());
        assertEquals(profileAttribute.getAttrValue(), attribute.getAttrValue());
        assertEquals(CHANGER, attribute.getGroup());
        assertEquals(ProfileAttributeLevel.TARGET_ASSIGNED, attribute.getLevel());
    }

    @Test
    public void getTenantUsersWithProfileAttributes_usersWithAttributes_convertedUsers() {
        RepoUser repoUser = newUser("username");
        RepoProfileAttribute profileAttribute = newProfileAttribute("attr1", "value1", repoUser);
        repoUser.setProfileAttributes(singleton(profileAttribute));
        repoUser.setTenant(newTenant("/organizations"));

        doReturn(singletonList(repoUser)).when(hibernateTemplate).execute(any());

        List<User> users = userAuthorityService.getTenantUsersWithProfileAttributes(null, null, null);

        assertEquals(1, users.size());
        User user = users.get(0);
        assertEquals(repoUser.getUsername(), user.getUsername());
        assertEquals(repoUser.getEmailAddress(), user.getEmailAddress());
        assertEquals(encodePassword(repoUser.getPassword()), user.getPassword());

        ProfileAttribute attribute = (ProfileAttribute) user.getAttributes().get(0);
        assertEquals(profileAttribute.getAttrName(), attribute.getAttrName());
        assertEquals(profileAttribute.getAttrValue(), attribute.getAttrValue());
        assertEquals(CHANGER, attribute.getGroup());
        assertEquals(ProfileAttributeLevel.TARGET_ASSIGNED, attribute.getLevel());
    }

    public RepoUser newUser(String username) {
        RepoUser repoUser = new RepoUser();
        repoUser.setUsername(username);
        repoUser.setEmailAddress(username + "@test.com");
        repoUser.setPassword(username);
        return repoUser;
    }

    public RepoTenant newTenant(String uri) {
        RepoTenant repoTenant = new RepoTenant();
        repoTenant.setTenantUri(uri);
        repoTenant.setTenantFolderUri(uri);
        return repoTenant;
    }

    public RepoProfileAttribute newProfileAttribute(String name, String value, Object principal) {
        RepoProfileAttribute repoProfileAttribute = new RepoProfileAttribute();
        repoProfileAttribute.setAttrName(name);
        repoProfileAttribute.setAttrValue(value);
        repoProfileAttribute.setPrincipal(principal);
        return repoProfileAttribute;
    }

    private String encodePassword(String password) {
        return DigestUtils.sha1Hex(password);
    }

    @Test
    public void testPutUser() {
        RepoUser repoUser= new RepoUser();
        repoUser.setNumberOfFailedLoginAttempts(1);
        repoUser.setUsername("testUser");
        repoUser.setPassword("testPassword");
        repoUser.setEnabled(true);
        repoUser.setExternallyDefined(false);
        repoUser.setTenantId("organizations");
        repoUser.setId(10);
        userAuthorityService.setHibernateTemplate(hibernateTemplate);
        doNothing().when(userAuthorityService).updatePersistentUser(Mockito.any(),Mockito.any());
        doNothing().when(userAuthorityService).addPropertiesToUserEvent(Mockito.any(String[].class),Mockito.any(User.class));
        when(userAuthorityService.getHibernateTemplate()).thenReturn(hibernateTemplate);
        doNothing().when(hibernateTemplate).saveOrUpdate(Mockito.any(User.class));
        when(userAuthorityService.getRepoUser(Mockito.any(ExecutionContext.class),Mockito.any(User.class))).thenReturn(repoUser);
        verify(userAuthorityService,times(1)).doPutUser(null,repoUser);
    }
}
