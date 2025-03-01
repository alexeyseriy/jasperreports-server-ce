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

package com.jaspersoft.jasperserver.dto.authority;

import com.jaspersoft.jasperserver.dto.basetests.BaseDTOPresentableTest;

import java.util.Arrays;
import java.util.List;

/**
 * @author Andriy Tivodar <ativodar@tibco>
 */

public class ClientRoleTest extends BaseDTOPresentableTest<ClientRole> {

    @Override
    protected List<ClientRole> prepareInstancesWithAlternativeParameters() {
        return Arrays.asList(
                createFullyConfiguredInstance().setName("testName2"),
                createFullyConfiguredInstance().setTenantId("tenantId2"),
                createFullyConfiguredInstance().setExternallyDefined(false),
                // with null values
                createFullyConfiguredInstance().setName(null),
                createFullyConfiguredInstance().setTenantId(null)
        );
    }

    @Override
    protected ClientRole createFullyConfiguredInstance() {
        ClientRole clientRole = new ClientRole();
        clientRole.setName("testName");
        clientRole.setTenantId("tenantId");
        clientRole.setExternallyDefined(true);
        return clientRole;
    }

    @Override
    protected ClientRole createInstanceWithDefaultParameters() {
        return new ClientRole();
    }

    @Override
    protected ClientRole createInstanceFromOther(ClientRole other) {
        return new ClientRole(other);
    }
}
