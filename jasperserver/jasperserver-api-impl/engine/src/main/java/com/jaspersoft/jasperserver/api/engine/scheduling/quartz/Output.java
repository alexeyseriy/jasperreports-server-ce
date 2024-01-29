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

package com.jaspersoft.jasperserver.api.engine.scheduling.quartz;

import java.io.Serializable;
import java.util.function.Consumer;

import org.quartz.JobExecutionException;

import com.jaspersoft.jasperserver.api.engine.jasperreports.domain.impl.PaginationParameters;

import net.sf.jasperreports.engine.JRPropertiesHolder;
import net.sf.jasperreports.engine.JasperPrint;

/**
 * @author sanda zaharia (shertage@users.sourceforge.net)
 * @version $Id$
 */
public interface Output extends Serializable 
{
	public Boolean isIgnorePagination();
	
	public PaginationParameters getPaginationParameters(JRPropertiesHolder propertiesHolder);
	
	public boolean isCompress();

	public ReportOutput getOutput(
			ReportJobContext jobContext,
			JasperPrint jasperPrint) throws JobExecutionException;

	default public void createOutputs(
			ReportJobContext jobContext,
			JasperPrint jasperPrint,
			Consumer<ReportOutput> outputConsumer) throws JobExecutionException
	{
		ReportOutput output = getOutput(jobContext, jasperPrint);
		outputConsumer.accept(output);
	}

	public Boolean isPaginationPreferred(JRPropertiesHolder propertiesHolder);
	
	default public String getFileExtension() {
		throw new UnsupportedOperationException();
	}
	
	default public String getFileType() {
		throw new UnsupportedOperationException();
	}
}
