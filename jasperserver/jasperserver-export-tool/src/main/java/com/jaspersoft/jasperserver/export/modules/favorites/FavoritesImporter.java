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

import com.jaspersoft.jasperserver.api.metadata.common.domain.Folder;
import com.jaspersoft.jasperserver.core.util.PathUtils;
import com.jaspersoft.jasperserver.export.modules.BaseImporterModule;
import com.jaspersoft.jasperserver.export.modules.ImporterModuleContext;
import com.jaspersoft.jasperserver.export.modules.favorites.beans.FavoriteResourceBean;
import com.jaspersoft.jasperserver.export.modules.favorites.beans.FavoriteResourceIndexBean;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.dom4j.Element;

import java.util.*;
import java.util.stream.Collectors;

public class FavoritesImporter extends BaseImporterModule {

    private final static Log log = LogFactory.getLog(FavoritesImporter.class);

    protected FavoritesModuleConfiguration configuration;
    private String prependPathArg;
    protected String prependPath;
    private int maxFavoritesPerIteration = 1000;

    public void setMaxFavoritesPerIteration(int maxFavoritesPerIteration) {
        this.maxFavoritesPerIteration = maxFavoritesPerIteration;
    }

    public FavoritesModuleConfiguration getConfiguration() {
        return configuration;
    }

    public void setConfiguration(FavoritesModuleConfiguration configuration) {
        this.configuration = configuration;
    }

    /*protected void doInExceptionHandlingContext(String reportUri, Callback callback) {
        callback.execute();
    }*/

    protected String getFavoriteFilename(long favoriteId) {
        return favoriteId + ".xml";
    }

/*    protected String prependedPath(String uri) {
        return PathUtils.concatPaths(prependPath, uri);
    }*/

    public String getPrependPathArg() {
        return prependPathArg;
    }

    public void setPrependPathArg(String prependPathArg) {
        this.prependPathArg = prependPathArg;
    }

    public void init(ImporterModuleContext moduleContext) {
        super.init(moduleContext);
        prependPath = getPrependPath();
    }

    protected String getPrependPath() {
        String path = getParameterValue(getPrependPathArg());
        if (path != null) {
            path = PathUtils.normalizePath(path);
            if (path.length() == 0 || path.equals(Folder.SEPARATOR)) {
                path = null;
            } else if (!path.startsWith(Folder.SEPARATOR)) {
                path = Folder.SEPARATOR + path;
            }
        }
        return path;
    }

    public List<String> process() {
        initProcess();
        final Set<FavoriteResourceBean> favoriteResourceBeans = new HashSet<>();

        for (Iterator i = indexElement.elementIterator(configuration.getIndexFavoriteElement()); i.hasNext(); ) {
            Element ruElement = (Element) i.next();
            String uri = ruElement.getText();
            favoriteResourceBeans.addAll(processFavoriteResource(uri));
        }
        importFavoriteResources(favoriteResourceBeans);
        return null;
    }
    protected void importFavoriteResources(Set<FavoriteResourceBean> favoriteResourceBeans){
        Map<String, List<FavoriteResourceBean>> map = favoriteResourceBeans.stream().collect(Collectors.groupingBy(FavoriteResourceBean::getUserName));
        for (String userName : map.keySet()) {
            List<String> uris = map.get(userName).stream().map(favorite -> favorite.getResourceURI()).collect(Collectors.toList());
            Map<String, List<String>> userURIsMap = new HashMap<>();
            int first=0,last = first+ maxFavoritesPerIteration;
            while(last <=  uris.size()) {
                userURIsMap.put(userName, uris.subList(first, last));
                configuration.getFavoriteResourceService().importFavorites(executionContext, userURIsMap);
                commandOut.info("Added " + last +"/"+uris.size()+ " favorite(s) for user " + userName);
                first = last;
                last = first+ maxFavoritesPerIteration;
            }
            if(first < uris.size() && last>uris.size()) {
                userURIsMap.put(userName, uris.subList(first, uris.size()));
                configuration.getFavoriteResourceService().importFavorites(executionContext, userURIsMap);
                commandOut.info("Added " + uris.size() +"/"+uris.size()+ " favorite(s) for user " + userName);
            }
        }
    }


    protected List<FavoriteResourceBean> processFavoriteResource(String uri) {
//      final String newUri = prependedPath(uri);
        final String ruPath = PathUtils.concatPaths(configuration.getFavoritesDir(), uri);
        FavoriteResourceIndexBean indexBean = (FavoriteResourceIndexBean) deserialize(ruPath, configuration.getFavoriteIndexFilename(), configuration.getSerializer());
        long[] favoriteIds = indexBean.getFavoriteIds();
        return getFavoriteResourceBeans(ruPath, favoriteIds);
        //commandOut.info("Added " + imported + " favorite(s) for resource " + newUri);
    }

    protected List<FavoriteResourceBean> getFavoriteResourceBeans(String favoritesPath, long[] favoriteIds) {
        ArrayList<FavoriteResourceBean> favoriteResourceBeans = new ArrayList<FavoriteResourceBean>();
        for (int i = 0; i < favoriteIds.length; i++) {
            String favoriteFilename = getFavoriteFilename(favoriteIds[i]);
            favoriteResourceBeans.add((FavoriteResourceBean) deserialize(favoritesPath, favoriteFilename, configuration.getSerializer()));
        }
        return favoriteResourceBeans;
    }
}
