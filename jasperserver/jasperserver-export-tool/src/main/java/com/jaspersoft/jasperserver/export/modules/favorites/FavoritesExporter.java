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

import com.jaspersoft.jasperserver.api.metadata.common.domain.*;
import com.jaspersoft.jasperserver.api.metadata.common.domain.client.FavoriteResourceImpl;
import com.jaspersoft.jasperserver.api.metadata.common.service.impl.hibernate.FavoriteResourceService;
import com.jaspersoft.jasperserver.api.metadata.user.domain.User;
import com.jaspersoft.jasperserver.api.metadata.user.domain.client.RoleImpl;
import com.jaspersoft.jasperserver.api.metadata.user.domain.client.UserImpl;
import com.jaspersoft.jasperserver.export.modules.BaseExporterModule;
import com.jaspersoft.jasperserver.export.modules.favorites.beans.FavoriteResourceBean;
import com.jaspersoft.jasperserver.export.modules.favorites.beans.FavoriteResourceIndexBean;
import com.jaspersoft.jasperserver.export.service.impl.ImportExportServiceImpl;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.dom4j.Element;

import java.util.*;

import static com.jaspersoft.jasperserver.export.service.impl.ImportExportServiceImpl.ROLES_PARAMETER;
import static com.jaspersoft.jasperserver.export.service.impl.ImportExportServiceImpl.USERS_PARAMETER;

public class FavoritesExporter extends BaseExporterModule {
	private static final Logger log = LogManager.getLogger(FavoritesExporter.class);

	protected class OutputFolderCreator {
		private String uri;
		private String folderPath;

		OutputFolderCreator(String uri) {
			this.uri = uri;
		}

		public String getFolderPath() {
			if (folderPath == null) {
				folderPath = mkdir(configuration.getFavoritesDir(), uri);
			}
			return folderPath;
		}
	}

	protected interface ExceptionHandlingCallback {
		void execute();
	}

	protected FavoritesModuleConfiguration configuration;

    protected String urisArg;

	protected Set exportedURIs;

	public FavoritesModuleConfiguration getConfiguration() {
		return configuration;
	}

	public void setConfiguration(FavoritesModuleConfiguration configuration) {
		this.configuration = configuration;
	}


	public String getUrisArg() {
		return urisArg;
	}

	public void setUrisArg(String urisArg) {
		this.urisArg = urisArg;
	}

	protected boolean doInExceptionHandlingContext(ExceptionHandlingCallback callback) {
		callback.execute();
		return true;
	}
	public boolean toProcess() {
		return (exportEverything || hasParameter(urisArg)) && isToProcess();
	}

	protected boolean isToProcess() {
		return !hasParameter(ImportExportServiceImpl.SKIP_FAVORITE_RESOURCES);
	}
	
	public void process() {
		log.debug("Process favorites");

		mkdir(configuration.getFavoritesDir());
                                            
		exportedURIs = new HashSet();

		String[] resourceURIs;
		if (exportEverything) {
			resourceURIs = new String[]{"/"};
		} else {
            resourceURIs = getParameterValues(urisArg);
			if (ArrayUtils.isEmpty(resourceURIs)) resourceURIs = new String[]{"/"};
		}
		final FavoriteResourceService.Filters favoriteFilters = new FavoriteResourceService.Filters();
		if (hasParameter(ROLES_PARAMETER)) {
			Optional.ofNullable(getParameterValues(ROLES_PARAMETER)).ifPresent(roles ->
					favoriteFilters.setForRoles(Arrays.asList(roles)));
		}
		if (hasParameter(USERS_PARAMETER)) {
			favoriteFilters.setForUsers(new ArrayList<>());
			Optional.ofNullable(getParameterValues(USERS_PARAMETER)).ifPresent(users ->
					favoriteFilters.setForUsers(Arrays.asList(users)));
		}
		for (String uri : resourceURIs) {
			if (!exportFilter.excludeFolder(uri, exportParams)) {
				processUri(uri, favoriteFilters);
			}
		}
	}

	private void processUri(final String uri,  FavoriteResourceService.Filters favoriteFilters) {
		log.debug("Process resource folderUri: {}", uri);
		Folder folder = configuration.getRepository().getFolder(executionContext, uri);
		if (folder == null) {
			doInExceptionHandlingContext(new ExceptionHandlingCallback() {
				@Override
				public void execute() {
					List<FavoriteResourceImpl> favorites = configuration.getFavoriteResourceService().getFavoritesForUri(executionContext,uri, favoriteFilters);
					processResource(uri,favorites);
				}
			});

		} else {
			processFolder(uri,  favoriteFilters);
		}
	}

	protected void processFolder(String uri,  FavoriteResourceService.Filters favoriteFilters) {
		if (exportFilter.excludeFolder(uri, exportParams)) return;
		processFolderResources(uri, favoriteFilters);
		List subFolders = configuration.getRepository().getSubFolders(executionContext, uri);
		if (subFolders != null && !subFolders.isEmpty()) {
			for (Iterator it = subFolders.iterator(); it.hasNext();) {
				Folder subFolder = (Folder) it.next();
				processFolder(subFolder.getURIString(), favoriteFilters);
			}
		}
	}

	protected void processFolderResources(String folderURI, FavoriteResourceService.Filters favoriteFilters) {
		List<FavoriteResourceImpl> favorites = configuration.getFavoriteResourceService().getFavoritesForUri(executionContext,folderURI, favoriteFilters);
		processResource(folderURI,favorites);
	}
	protected void processResource(String folderUri, List<FavoriteResourceImpl> favorites) {
		if (exportedURIs != null && exportedURIs.contains(folderUri)) {
			return;
		}
		log.debug("Getting favorites for the resource: {}", folderUri);
		if (favorites != null && !favorites.isEmpty()) {
			if (exportFavorites(folderUri, favorites)) {
				writeIndexFavoriteResourceEntry(folderUri);
			}
			if (exportedURIs == null) {
				exportedURIs = new HashSet<>();
			}
			exportedURIs.add(folderUri);

			final String msg = "Exported " + favorites.size() + " favorite entrie(s) for the " + folderUri;
			commandOut.info(msg);
			log.debug(msg);
			//	}
		} else {
			final String msg = "Folder " + folderUri + " does not have favoriteResources";
			commandOut.debug(msg);
			log.debug(msg);
		}
	}

	protected boolean exportFavorites(String uri, List favorites) {
		final OutputFolderCreator folderCreator = new OutputFolderCreator(uri);
		
		List<Long> processedIds = new ArrayList<Long>();

		for (Object favorite : favorites) {

			boolean ok = doInExceptionHandlingContext(new ExceptionHandlingCallback() {
				@Override
				public void execute() {
					exportFavorite(folderCreator.getFolderPath(), (Favorite) favorite);
				}
			});

			if (ok) {
				processedIds.add(((Favorite)favorite).getId());
			}
		}

		if (processedIds.isEmpty()) {
			return false;
		} else {
			FavoriteResourceIndexBean indexBean = new FavoriteResourceIndexBean();
			long[] favoriteIds = ArrayUtils.toPrimitive(processedIds.toArray(new Long[processedIds.size()]));
			indexBean.setFavoriteIds(favoriteIds);
			serialize(indexBean, folderCreator.getFolderPath(), configuration.getFavoriteIndexFilename(), configuration.getSerializer());
			return true;
		}
	}

	protected void exportFavorite(String folderPath, Favorite favorite) {
		FavoriteResourceBean favoriteBean = new FavoriteResourceBean();
		favoriteBean.copyFrom(favorite, getConfiguration());
		serialize(favoriteBean, folderPath, getFavoriteFilename(favorite), configuration.getSerializer());
	}

	protected String getFavoriteFilename(Favorite favoriteResource) {
		return favoriteResource.getId() + ".xml";
	}

	protected void writeIndexFavoriteResourceEntry(String uri) {
		Element ruElement = getIndexElement().addElement(configuration.getIndexFavoriteElement());
		ruElement.setText(uri);
	}
}
