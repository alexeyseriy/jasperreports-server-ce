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

package com.jaspersoft.jasperserver.dto.job.wrappers;

import com.jaspersoft.jasperserver.dto.basetests.BaseDTOPresentableTest;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * @author Olexandr Dahno <odahno@tibco.com>
 */

public class ClientJobIdListWrapperTest extends BaseDTOPresentableTest<ClientJobIdListWrapper> {

    private static final Long TEST_ID = 1L;
    private static final List<Long> TEST_IDS = Collections.singletonList(TEST_ID);

    private static final Long TEST_ID_1 = 2L;
    private static final List<Long> TEST_IDS_1 = Collections.singletonList(TEST_ID_1);

    @Override
    protected List<ClientJobIdListWrapper> prepareInstancesWithAlternativeParameters() {
        return Arrays.asList(
                createFullyConfiguredInstance().setIds(TEST_IDS_1),
                // null values
                createFullyConfiguredInstance().setIds(null)
        );
    }

    @Override
    protected ClientJobIdListWrapper createFullyConfiguredInstance() {
        return createInstanceWithDefaultParameters()
                .setIds(TEST_IDS);
    }

    @Override
    protected ClientJobIdListWrapper createInstanceWithDefaultParameters() {
        return new ClientJobIdListWrapper();
    }

    @Override
    protected ClientJobIdListWrapper createInstanceFromOther(ClientJobIdListWrapper other) {
        return new ClientJobIdListWrapper(other);
    }
}