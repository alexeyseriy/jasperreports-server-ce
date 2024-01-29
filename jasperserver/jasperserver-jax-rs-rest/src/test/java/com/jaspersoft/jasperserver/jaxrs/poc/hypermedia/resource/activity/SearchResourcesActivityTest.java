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

package com.jaspersoft.jasperserver.jaxrs.poc.hypermedia.resource.activity;

import org.junit.Assert;
import org.junit.Test;

import java.util.Arrays;
import java.util.List;


/**
 * @author: Igor.Nesterenko
 * @version: ${Id}
 */
public class SearchResourcesActivityTest {

    SearchResourcesActivity searchResourcesActivity = new SearchResourcesActivity();

    @Test
    protected void getViewMessageTest() {
        List<String> resouceTypes = Arrays.asList();
        Assert.assertEquals(searchResourcesActivity.getMessageType(resouceTypes), "view.list");
        resouceTypes = Arrays.asList("AWS_DATA_SOURCE_CLIENT_TYPE",
                "JDBC_DATA_SOURCE_CLIENT_TYPE");
        Assert.assertEquals(searchResourcesActivity.getMessageType(resouceTypes), "view.list.datasource");
        resouceTypes = Arrays.asList("AWS_DATA_SOURCE_CLIENT_TYPE",
                "adhocDataView");
        Assert.assertEquals(searchResourcesActivity.getMessageType(resouceTypes), "view.list");
        resouceTypes = Arrays.asList("adhocDataView");
        Assert.assertEquals(searchResourcesActivity.getMessageType(resouceTypes), "view.list.adhocview");
        resouceTypes = Arrays.asList("reportUnit");
        Assert.assertEquals(searchResourcesActivity.getMessageType(resouceTypes), "view.list.report");
        resouceTypes = Arrays.asList("dashboard");
        Assert.assertEquals(searchResourcesActivity.getMessageType(resouceTypes), "view.list.dashboard");
        resouceTypes = Arrays.asList("domain");
        Assert.assertEquals(searchResourcesActivity.getMessageType(resouceTypes), "view.list.domain");
    }
}
