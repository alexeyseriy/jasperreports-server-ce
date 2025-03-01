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
package com.jaspersoft.jasperserver.dto.adhoc.dataset;

import com.jaspersoft.jasperserver.dto.basetests.BaseDTOJSONPresentableTest;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * @author Olexandr Dahno <odahno@tibco.com>
 */

class ClientDatasetAllLevelTest extends BaseDTOJSONPresentableTest<ClientDatasetAllLevel> {

    private static final List<ClientDatasetFieldReference> TEST_FIELD_REFS = Collections.singletonList(
            new ClientDatasetFieldReference()
    );
    private static final List<ClientDatasetFieldReference> TEST_FIELD_REFS_ALT = Collections.singletonList(
            new ClientDatasetFieldReference().setType("TYPE")
    );

    @Override
    protected List<ClientDatasetAllLevel> prepareInstancesWithAlternativeParameters() {
        return Arrays.asList(
                (ClientDatasetAllLevel)createFullyConfiguredInstance().setFieldRefs(TEST_FIELD_REFS_ALT),
                (ClientDatasetAllLevel)createFullyConfiguredInstance().setFieldRefs(null)
        );
    }

    @Override
    protected ClientDatasetAllLevel createFullyConfiguredInstance() {
        return (ClientDatasetAllLevel)createInstanceWithDefaultParameters()
                .setFieldRefs(TEST_FIELD_REFS);
    }

    @Override
    protected ClientDatasetAllLevel createInstanceWithDefaultParameters() {
        return new ClientDatasetAllLevel();
    }

    @Override
    protected ClientDatasetAllLevel createInstanceFromOther(ClientDatasetAllLevel other) {
        return new ClientDatasetAllLevel(other);
    }
}