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
package com.jaspersoft.jasperserver.remote.resources.validation;

import com.jaspersoft.jasperserver.api.common.domain.ExecutionContext;
import com.jaspersoft.jasperserver.api.metadata.common.domain.Resource;
import com.jaspersoft.jasperserver.api.metadata.common.domain.ResourceLookup;
import com.jaspersoft.jasperserver.api.metadata.common.service.RepositoryService;
import com.jaspersoft.jasperserver.api.metadata.olap.domain.MondrianXMLADefinition;
import com.jaspersoft.jasperserver.api.metadata.user.domain.Tenant;
import com.jaspersoft.jasperserver.api.metadata.user.service.TenantService;
import com.jaspersoft.jasperserver.api.metadata.view.domain.FilterCriteria;
import com.jaspersoft.jasperserver.dto.resources.ResourceMediaType;
import com.jaspersoft.jasperserver.remote.exception.IllegalParameterValueException;
import com.jaspersoft.jasperserver.remote.exception.MandatoryParameterNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

import static com.jaspersoft.jasperserver.remote.resources.validation.ValidationHelper.empty;

/**
 * <p></p>
 *
 * @author Yaroslav.Kovalchyk
 * @version $Id$
 */
@Service
public class MondrianXmlaDefinitionValidator extends GenericResourceValidator<MondrianXMLADefinition> {
    @javax.annotation.Resource(name = "concreteRepository")
    private RepositoryService repositoryService;
    @javax.annotation.Resource(name = "concreteTenantService")
    private TenantService tenantService;

    @Override
    protected void internalValidate(ExecutionContext ctx, MondrianXMLADefinition resource, List<Exception> errors, Map<String, String[]> additionalParameters) {
        if (!empty(resource.getCatalog())){
            validateUniqueCatalog(ctx, resource.getCatalog(), resource.getURIString(), errors);
        } else {
            errors.add(new MandatoryParameterNotFoundException("catalog"));
        }

        if (empty(resource.getMondrianConnection())){
            errors.add(new MandatoryParameterNotFoundException("mondrianConnection"));
        }
    }

    private void validateUniqueCatalog(ExecutionContext ctx, String catalog, String uri, List<Exception> errors) {
        Tenant tenant = tenantService.getTenantBasedOnRepositoryUri(null, uri);
        String tenantFolder = null;
        FilterCriteria criteria = FilterCriteria.createFilter(MondrianXMLADefinition.class);
        // does it belong to any org template?
        int templIndex = uri.indexOf(TenantService.ORG_TEMPLATE);
        if (templIndex >= 0) {
            // filter out all definitions from this template
            criteria.addFilterElement(FilterCriteria.createAncestorFolderFilter(
                    uri.substring(0, templIndex + TenantService.ORG_TEMPLATE.length())));
        } else {
            // does it belong to any organization?
            if (tenant != null) {
                // filter out all definition from this organization
                // note that it will include definitions fro sub organizations as well,
                // which we will filter out later
                tenantFolder = tenant.getTenantFolderUri();
                criteria.addFilterElement(FilterCriteria.createAncestorFolderFilter(tenantFolder));
            }
        }
        ResourceLookup[] lookups = repositoryService.findResource(null, criteria);
        catalog = catalog.toLowerCase();

        for (int i = 0; i < lookups.length; i++) {
            // if it is not a template, we need to skip all sub organization resources
            // from the validation scope
            if (templIndex < 0) {
                String uriTail = lookups[i].getURIString();
                if (tenantFolder != null) {
                    uriTail = uriTail.substring(tenantFolder.length());
                }
                // now, if uriTail contains "organizations", it means we got sub org resource
                if (uriTail.indexOf(TenantService.ORGANIZATIONS) >= 0) {
                    continue;
                }
            }
            Resource res = repositoryService.getResource(ctx, lookups[i].getURIString());
            MondrianXMLADefinition def = (MondrianXMLADefinition) res;
            if (def.getCatalog().toLowerCase().equals(catalog)
                    && !def.getURIString().equals(uri)) {
                errors.add(new IllegalParameterValueException("Another XML/A source already uses that catalog name",
                        ResourceMediaType.MONDRIAN_XMLA_DEFINITION_CLIENT_TYPE + ".catalog", catalog));
            }
        }
    }
}
