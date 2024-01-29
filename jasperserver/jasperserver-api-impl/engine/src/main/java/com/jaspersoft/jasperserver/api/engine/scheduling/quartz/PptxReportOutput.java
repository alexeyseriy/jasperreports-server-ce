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

import java.io.IOException;
import java.io.OutputStream;
import java.util.Collections;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.jaspersoft.jasperserver.api.JSExceptionWrapper;
import com.jaspersoft.jasperserver.api.engine.jasperreports.common.PptxExportParametersBean;
import com.jaspersoft.jasperserver.api.metadata.common.domain.ContentResource;
import com.jaspersoft.jasperserver.api.metadata.common.domain.DataContainer;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JRPropertiesHolder;
import net.sf.jasperreports.engine.JRPropertiesUtil;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.export.ooxml.JRPptxExporter;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleExporterInputItem;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import net.sf.jasperreports.export.SimplePptxReportConfiguration;


/**
 * @author sanda zaharia (shertage@users.sourceforge.net)
 * @version $Id$
 */
public class PptxReportOutput extends AbstractReportOutput
{

	private static final Log log = LogFactory.getLog(PptxReportOutput.class);

	private PptxExportParametersBean exportParams;
	public PptxReportOutput()
	{
	}

	@Override
	protected DataContainer export(ReportJobContext jobContext, 
			JasperPrint jasperPrint, Integer startPageIndex, Integer endPageIndex) {
		try {
			JRPptxExporter exporter = new JRPptxExporter(getJasperReportsContext());
			SimplePptxReportConfiguration reportConfiguration = new SimplePptxReportConfiguration();
			reportConfiguration.setStartPageIndex(startPageIndex);
			reportConfiguration.setEndPageIndex(endPageIndex);
            exporter.setExporterInput(new SimpleExporterInput(Collections.singletonList(
            		new SimpleExporterInputItem(jasperPrint, reportConfiguration))));
			
			
			boolean close = false;
			DataContainer pptxData = jobContext.createDataContainer(this);
			OutputStream pptxDataOut = pptxData.getOutputStream();
			try {
				exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(pptxDataOut));
				
				if(exportParams != null)
				{
					if(exportParams.getIgnoreHyperlink() != null) {
						SimplePptxReportConfiguration configuration = new SimplePptxReportConfiguration();
						configuration.setIgnoreHyperlink(exportParams.getIgnoreHyperlink());
						exporter.setConfiguration(configuration);
					}
				}	
				exporter.exportReport();

				close = false;
				pptxDataOut.close();
				return pptxData;
			} catch (IOException e) {
				throw new JSExceptionWrapper(e);
			} finally {
				if (close) {
					try {
						pptxDataOut.close();
					} catch (IOException e) {
						log.error("Error closing stream", e);
					}
				}
			}
		} catch (JRException e) {
			throw new JSExceptionWrapper(e);
		}
	}

	/**
	 * @return Returns the exportParams.
	 */
	public PptxExportParametersBean getExportParams() {
		return exportParams;
	}

	/**
	 * @param exportParams The exportParams to set.
	 */
	public void setExportParams(PptxExportParametersBean exportParams) {
		this.exportParams = exportParams;
	}

	@Override
	public String getFileExtension()
	{
		return "pptx";
	}
	
	@Override
	public String getFileType() {
		return ContentResource.TYPE_PPTX;
	}
	
	@Override
	public Boolean isPaginationPreferred(JRPropertiesHolder propertiesHolder){
		Boolean isPaginationPreferred = super.isPaginationPreferred(propertiesHolder);
		if (isPaginationPreferred == null)
		{
			if (propertiesHolder != null)
			{
				isPaginationPreferred = JRPropertiesUtil.getInstance(getJasperReportsContext()).getBooleanProperty(propertiesHolder.getPropertiesMap(), PptxExportParametersBean.PROPERTY_PPTX_PAGINATED);
			}
		}
		return isPaginationPreferred;
	}
}
