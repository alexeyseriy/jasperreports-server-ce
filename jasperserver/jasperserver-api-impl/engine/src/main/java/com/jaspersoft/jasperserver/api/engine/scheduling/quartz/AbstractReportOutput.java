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

import java.util.function.Consumer;

import org.quartz.JobExecutionException;

import com.jaspersoft.jasperserver.api.engine.jasperreports.domain.impl.PaginationParameters;
import com.jaspersoft.jasperserver.api.engine.scheduling.domain.ReportJob;
import com.jaspersoft.jasperserver.api.metadata.common.domain.DataContainer;

import net.sf.jasperreports.engine.JRPropertiesHolder;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReportsContext;



/**
 * @author Teodor Danciu (teodord@users.sourceforge.net)
 * @version $Id: CsvReportOutput.java 19940 2010-12-13 09:29:40Z tmatyashovsky $
 */
public abstract class AbstractReportOutput implements Output 
{

	private Boolean isIgnorePagination;
	private boolean compress = false;
	private JasperReportsContext jasperReportsContext;
	
	/** 
	 *
	 */
	public Boolean isIgnorePagination()
	{
		return this.isIgnorePagination; 
	}
	
	@Override
	public PaginationParameters getPaginationParameters(JRPropertiesHolder propertiesHolder)
	{
		PaginationParameters params = new PaginationParameters();
		params.setPaginated(isPaginationPreferred(propertiesHolder));
		params.setMaxPageHeight(getMaxPageHeight(propertiesHolder));
		params.setMaxPageWidth(getMaxPageWidth(propertiesHolder));
		return params;
	}

	/** 
	 *
	 */
	public void setIgnorePagination(Boolean isIgnorePagination)
	{
		this.isIgnorePagination = isIgnorePagination; 
	}

	public boolean isCompress() {
		return compress;
	}

	public void setCompress(boolean compress) {
		this.compress = compress;
	}

	public JasperReportsContext getJasperReportsContext() {
		return jasperReportsContext;
	}

	public void setJasperReportsContext(JasperReportsContext jasperReportsContext) {
		this.jasperReportsContext = jasperReportsContext;
	}
	
	public Boolean isPaginationPreferred(JRPropertiesHolder propertiesHolder){
		return isIgnorePagination() == null ? null : !isIgnorePagination();
	}
	
	protected Integer getMaxPageHeight(JRPropertiesHolder propertiesHolder) {
		return null;
	}
	
	protected Integer getMaxPageWidth(JRPropertiesHolder propertiesHolder) {
		return null;
	}

	public ReportOutput getOutput(ReportJobContext jobContext,
			JasperPrint jasperPrint) throws JobExecutionException {
		DataContainer exportData = export(jobContext, jasperPrint, null, null);
		String filename = getBaseFilename(jobContext) + "." + getFileExtension();
		return new ReportOutput(exportData, getFileType(), filename);
	}

	@Override
	public void createOutputs(ReportJobContext jobContext, JasperPrint jasperPrint,
			Consumer<ReportOutput> outputConsumer) throws JobExecutionException {
		ReportSplitter splitter = new ReportSplitter();
		splitter.splitOutput(jobContext, jasperPrint, 
				jobDetails -> getBaseFilename(jobContext, jobDetails), 
				getFileExtension(),
				(filename, startPageIndex, endPageIndex) -> 
					createOutput(jobContext, filename, jasperPrint, startPageIndex, endPageIndex),
				outputConsumer);
	}

	protected ReportOutput createOutput(ReportJobContext jobContext, String filename, 
			JasperPrint jasperPrint, Integer startPageIndex, Integer endPageIndex) {
		DataContainer exportData = export(jobContext, jasperPrint, startPageIndex, endPageIndex);
		ReportOutput output = new ReportOutput(exportData, getFileType(), filename);
		return output;
	}

	protected abstract DataContainer export(ReportJobContext jobContext, 
			JasperPrint jasperPrint, Integer startPageIndex, Integer endPageIndex);
	
	protected String getBaseFilename(ReportJobContext jobContext) {
		return getBaseFilename(jobContext, jobContext.getReportJob());
	}

	protected String getBaseFilename(ReportJobContext jobContext, ReportJob outputJobDetails) {
		return jobContext.getBaseFilename(outputJobDetails);
	}
}
