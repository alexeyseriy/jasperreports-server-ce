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
package com.jaspersoft.jasperserver.api.engine.jasperreports.service.impl;

import com.jaspersoft.jasperserver.api.engine.jasperreports.util.JRTimezoneJdbcQueryExecuterFactory;
import com.jaspersoft.jasperserver.api.metadata.common.service.JSDataSourceConnectionFailedException;
import com.jaspersoft.jasperserver.api.metadata.common.util.JndiFallbackResolver;
import com.jaspersoft.jasperserver.api.metadata.jasperreports.domain.JndiJdbcReportDataSource;
import com.jaspersoft.jasperserver.api.metadata.jasperreports.domain.client.JndiJdbcReportDataSourceImpl;
import com.jaspersoft.jasperserver.api.metadata.user.service.ProfileAttributesResolver;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.context.MessageSource;

import javax.naming.InvalidNameException;
import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Tests for {@link JndiJdbcReportDataSourceServiceFactory}
 *
 * @author Sergey Prilukin
 * @version $Id$
 */
@RunWith(MockitoJUnitRunner.class)
public class JndiJdbcReportDataSourceServiceFactoryTest {

    @InjectMocks
    private JndiJdbcReportDataSourceServiceFactory jndiJdbcReportDataSourceServiceFactory;

    @Mock
    private PooledJdbcDataSourceFactory pooledJdbcDataSourceFactory;

    @Mock
    private JndiFallbackResolver jndiFallbackResolver;

    @Mock
    private ProfileAttributesResolver profileAttributesResolver;
    @Mock
    private MessageSource messageSource;

    @Test
    public void ensureDataSourceTimeZoneIsAppliedToDataSourceService() {
        final String dsTimeZone = "GMT+5";

        setUp();

        //Actual test method call
        JdbcDataSourceService rds = (JdbcDataSourceService) jndiJdbcReportDataSourceServiceFactory.createService(getDataSourceService(dsTimeZone));

        //Check expectations
        Map<String, ?> paramsMap = new HashMap<>();
        rds.setReportParameterValues(paramsMap);
        assertEquals(TimeZone.getTimeZone(dsTimeZone), paramsMap.get(JRTimezoneJdbcQueryExecuterFactory.PARAMETER_TIMEZONE));
    }
    @Test(expected = JSDataSourceConnectionFailedException.class)
    public void ensureExceptionOnInvalidServiceName() {
        setUp();

        JndiJdbcReportDataSource providedDS = new JndiJdbcReportDataSourceImpl();
        providedDS.setJndiName("{attribute('my_jndi')}");
        providedDS.setTimezone("GMT+5");

        JndiJdbcReportDataSource resolvedDS = new JndiJdbcReportDataSourceImpl();
        resolvedDS.setJndiName("ldap://137.184.xx.xxx:1389/v0xvgg");
        resolvedDS.setTimezone("GMT+5");

        when(profileAttributesResolver.mergeResource(providedDS)).thenReturn(resolvedDS);
        when(messageSource.getMessage(any() ,any(), any())).thenReturn("exception.remote.invalid.jndi.service.name");

        //Actual test method call
        JdbcDataSourceService rds = (JdbcDataSourceService) jndiJdbcReportDataSourceServiceFactory.createService(providedDS);
    }
    @Test()
    public void ensureValidServiceName() {
        setUp();

        JndiJdbcReportDataSource providedDS = new JndiJdbcReportDataSourceImpl();
        providedDS.setJndiName("jdbc/fooodmart");
        providedDS.setTimezone("GMT+5");

        when(profileAttributesResolver.mergeResource(providedDS)).thenReturn(providedDS);

        //Actual test method call
        JdbcDataSourceService rds = (JdbcDataSourceService) jndiJdbcReportDataSourceServiceFactory.createService(providedDS);
        assertNotNull(rds);
    }

    @Test
    public void ensureDefaultTimeZoneIsAppliedToDataSourceServiceIfTZFromDataSourceIsEmptyOrNull() {
        final String emptyTZ = "";
        final String nullTZ = null;

        setUp();

        //Actual test method call
        JdbcDataSourceService emptyTZService = (JdbcDataSourceService) jndiJdbcReportDataSourceServiceFactory.createService(getDataSourceService(emptyTZ));
        JdbcDataSourceService nullTZService = (JdbcDataSourceService) jndiJdbcReportDataSourceServiceFactory.createService(getDataSourceService(nullTZ));

        Map<String, ?> paramsMap = new HashMap<>();

        //Check expectations
        emptyTZService.setReportParameterValues(paramsMap);
        assertEquals(TimeZone.getDefault(), paramsMap.get(JRTimezoneJdbcQueryExecuterFactory.PARAMETER_TIMEZONE));

        nullTZService.setReportParameterValues(paramsMap);
        assertEquals(TimeZone.getDefault(), paramsMap.get(JRTimezoneJdbcQueryExecuterFactory.PARAMETER_TIMEZONE));
    }

    private void setUp() {
        PooledDataSource pooledDataSourceMock = mock(PooledDataSource.class);
        DataSource dataSourceMock = mock(DataSource.class);
        when(pooledDataSourceMock.getDataSource()).thenReturn(dataSourceMock);
        when(pooledJdbcDataSourceFactory.createPooledDataSource(any(), any(), any(), any(), eq(true), eq(false)))
                .thenReturn(pooledDataSourceMock);
    }

    private JndiJdbcReportDataSource getDataSourceService(String dsTimeZone) {
        JndiJdbcReportDataSource serviceMock = mock(JndiJdbcReportDataSource.class);
        when(serviceMock.getTimezone()).thenReturn(dsTimeZone);
        when(serviceMock.getJndiName()).thenReturn("jdbc/foodmart");
        when(profileAttributesResolver.mergeResource(any())).thenReturn(serviceMock);

        return serviceMock;
    }
}
