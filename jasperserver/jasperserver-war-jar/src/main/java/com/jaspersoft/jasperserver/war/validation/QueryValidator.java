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
package com.jaspersoft.jasperserver.war.validation;

import com.jaspersoft.jasperserver.api.metadata.common.domain.Query;
import com.jaspersoft.jasperserver.api.metadata.common.service.RepositoryService;
import com.jaspersoft.jasperserver.core.util.validators.ValidationUtil;
import com.jaspersoft.jasperserver.war.common.JasperServerConst;
import com.jaspersoft.jasperserver.war.dto.QueryWrapper;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

/**
 * @author Ionut Nedelcu (ionutned@users.sourceforge.net)
 * @version $Id$
 */
public class QueryValidator implements Validator
{
	private RepositoryService repository;

	public RepositoryService getRepository()
	{
		return repository;
	}

	public void setRepository(RepositoryService repository)
	{
		this.repository = repository;
	}

	public boolean supports(Class klass)
	{
		return QueryWrapper.class.isAssignableFrom(klass);
	}

	public void validate(Object object, Errors errors)
	{
		QueryWrapper wrapper = (QueryWrapper) object;
		validateNameLabelDesc(wrapper, errors);
		validateQueryText(wrapper, errors);
	}

	public void validateNameLabelDesc(QueryWrapper wrapper, Errors errors)
	{
		Query query = wrapper.getQuery();
		if (query.getName() == null || query.getName().trim().length() == 0) {
			errors.rejectValue("query.name", "QueryValidator.error.not.empty");
		} else {
			if(!ValidationUtil.regExValidateName(query.getName())) {
				errors.rejectValue("query.name", "QueryValidator.error.invalid.chars");
			}
			if (query.getName().length() > JasperServerConst.MAX_LENGTH_NAME) {
				errors.rejectValue("query.name", "QueryValidator.error.too.long",
						new Object[]{JasperServerConst.MAX_LENGTH_NAME_W}, null);
			}

			if (wrapper.isAloneNewMode()) {
				if (repository.repositoryPathExists(null, query.getURIString())) {
					errors.rejectValue("query.name", "QueryValidator.error.duplicate");
				}
			}
		}

		if (query.getLabel() == null || query.getLabel().trim().length() == 0) {
			errors.rejectValue("query.label", "QueryValidator.error.not.empty");
		} else {
			if(!ValidationUtil.regExValidateLabel(query.getLabel())) {
				errors.rejectValue("query.label", "QueryValidator.error.invalid.chars");
			}
			if (query.getLabel().length() > JasperServerConst.MAX_LENGTH_LABEL) {
				errors.rejectValue("query.label", "QueryValidator.error.too.long",
						new Object[]{JasperServerConst.MAX_LENGTH_LABEL_W}, null);
			}
		}

		if (query.getDescription() != null && query.getDescription().length() > 250) {
			errors.rejectValue("query.description", "QueryValidator.error.too.long");
		}
	}

	public void validateQueryText(QueryWrapper wrapper, Errors errors)
	{
		Query query = wrapper.getQuery();

		if (query.getSql() == null || query.getSql().trim().length() == 0) {
			errors.rejectValue("query.sql", "QueryValidator.error.not.empty");
		}
	}
}
