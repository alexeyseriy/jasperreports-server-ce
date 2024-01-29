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

package com.jaspersoft.jasperserver.api.security.csrf;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.util.Collections.singletonList;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class JSCorsProcessorTest {

    @InjectMocks
    private JSCorsProcessor corsProcessor;

    private MockHttpServletRequest request;
    private final MockHttpServletResponse response = new MockHttpServletResponse();
    private final Map<String, List<String>> testHeaderUrlPatterns = new HashMap<>();
    private final Map<String, List<String>> testHeaderValues = new HashMap<>();
    private final List<String> patternList = new ArrayList<>();

    @Before
    public void init() {
        MockitoAnnotations.initMocks(this);
        request = new MockHttpServletRequest();
        request.setServletPath(null);
        request.setContextPath("http://localhost.jaspersoft.com:8080/jasperserver-pro");
        response.setHeader("Accept", "text/html");
        patternList.add("/runtime/[0-9A-Za-z]*/rest_v2/settings/.*");
        testHeaderUrlPatterns.put("Vary", patternList);
        testHeaderUrlPatterns.put("Accept", patternList);
        testHeaderValues.put("Vary", singletonList("Accept-Language"));
        testHeaderValues.put("Accept", singletonList("application/json"));
    }


    @Test
    public void shouldAddHeaderForValidRequests() {
        request.setRequestURI("http://localhost.jaspersoft.com:8080/jasperserver-pro/runtime/27F3EE97/rest_v2/settings/auth");
        corsProcessor.setHeaderUrlPatterns(testHeaderUrlPatterns);
        corsProcessor.setHeaderValues(testHeaderValues);
        corsProcessor.addJrsHeaders(response, request);
        assertEquals(response.getHeader("Vary"), "Accept-Language");
    }

    @Test
    public void shouldNotAddHeaderForInValidRequests() {
        request.setRequestURI("http://localhost.jaspersoft.com:8080/jasperserver-pro/login.html");
        corsProcessor.setHeaderUrlPatterns(testHeaderUrlPatterns);
        corsProcessor.setHeaderValues(testHeaderValues);
        corsProcessor.addJrsHeaders(response, request);
        assertNull(response.getHeader("Vary"));
    }

    @Test
    public void shouldAddOldHeaderValueForValidRequests() {
        request.setRequestURI("http://localhost.jaspersoft.com:8080/jasperserver-pro/runtime/27F3EE97/rest_v2/settings/auth");
        corsProcessor.setHeaderUrlPatterns(testHeaderUrlPatterns);
        corsProcessor.setHeaderValues(testHeaderValues);
        corsProcessor.addJrsHeaders(response, request);
        assertEquals(response.getHeader("Accept"), "text/html, application/json");
    }

}
