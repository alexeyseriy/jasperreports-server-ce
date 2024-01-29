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

package com.jaspersoft.jasperserver.export.modules.favorites;

import com.jaspersoft.jasperserver.api.common.domain.ExecutionContext;
import com.jaspersoft.jasperserver.api.common.util.spring.StaticApplicationContext;
import com.jaspersoft.jasperserver.api.metadata.common.service.impl.hibernate.FavoriteResourceService;
import com.jaspersoft.jasperserver.export.ImportTask;
import com.jaspersoft.jasperserver.export.ParametersImpl;
import com.jaspersoft.jasperserver.export.modules.ImporterModuleContext;
import com.jaspersoft.jasperserver.export.modules.favorites.beans.FavoriteResourceBean;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.context.ApplicationContext;

import java.util.*;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class FavoritesImporterTest {
    @InjectMocks
    @Spy
    private FavoritesImporter favoritesImporter;

    @Spy
    private final FavoritesModuleConfiguration configuration = new FavoritesModuleConfiguration();
    @Spy
    private final FavoriteResourceService favoriteService = mock(FavoriteResourceService.class);

    public void setUp() {
        MockitoAnnotations.initMocks(this);
        configuration.setFavoriteResourceService(favoriteService);
    }

    @Test
    public void importFavoriteResources_success() {

        StaticApplicationContext.setApplicationContext(mock(ApplicationContext.class));
        ImporterModuleContext moduleContext = mock(ImporterModuleContext.class);
        ImportTask importTask = mock(ImportTask.class);
        ExecutionContext context = mock(ExecutionContext.class);

        doReturn(importTask).when(moduleContext).getImportTask();
        doReturn(favoriteService).when(configuration).getFavoriteResourceService();
        doReturn(new ParametersImpl()).when(importTask).getParameters();
        doReturn(context).when(importTask).getExecutionContext();

        favoritesImporter.init(moduleContext);

        Set<FavoriteResourceBean> set = new HashSet<>();
        FavoriteResourceBean bean1 = new FavoriteResourceBean();
        bean1.setResourceURI("/public/sample");
        bean1.setUserName("superuser");
        bean1.setId(1111);
        set.add(bean1);
        Map<String, List<String>> userURIsMap= new HashMap<String, List<String>>();
        userURIsMap.put("superuser",Arrays.asList("/public/sample"));
        favoritesImporter.importFavoriteResources(set);
        verify(favoriteService,times(1)).importFavorites(nullable(ExecutionContext.class),eq( userURIsMap));
    }
}
