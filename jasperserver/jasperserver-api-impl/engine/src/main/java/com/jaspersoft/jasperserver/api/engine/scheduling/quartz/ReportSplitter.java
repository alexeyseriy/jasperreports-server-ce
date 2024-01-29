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

import java.util.Iterator;
import java.util.Map.Entry;
import java.util.function.BiFunction;
import java.util.function.Consumer;
import java.util.function.Function;

import com.jaspersoft.jasperserver.api.engine.scheduling.domain.ReportJob;

import net.sf.jasperreports.engine.JRPropertiesUtil;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.PrintPart;
import net.sf.jasperreports.engine.PrintParts;

/**
 * 
 * @author Lucian Chirita (lucianc@users.sourceforge.net)
 */
public class ReportSplitter {
	
	public static final String PART_PROPERTY_SPLIT = JRPropertiesUtil.PROPERTY_PREFIX + "print.part.split";

	public void splitOutput(ReportJobContext jobContext, JasperPrint jasperPrint,
			Function<ReportJob, String> baseFilenameSupplier, String fileExtension,
			ReportOutputCreator outputCreator, Consumer<ReportOutput> outputConsumer) {
		boolean splitOutput = false;
		if (jasperPrint.hasParts()) {
			JRPropertiesUtil properties = JRPropertiesUtil.getInstance(jobContext.getJasperReportsContext());
			PrintParts parts = jasperPrint.getParts();
			
			Entry<Integer, PrintPart> previousPart = null;
			for (Iterator<Entry<Integer, PrintPart>> partsIt = parts.partsIterator(); partsIt.hasNext();) {
				Entry<Integer, PrintPart> partEntry = partsIt.next();
				PrintPart part = partEntry.getValue();
				boolean split = properties.getBooleanProperty(part, PART_PROPERTY_SPLIT, false);
				if (split) {
					splitOutput = true;
					if (previousPart != null) {
						createPartOutput(outputConsumer, jobContext, jasperPrint, 
								baseFilenameSupplier, fileExtension, outputCreator, 
								previousPart.getValue(), previousPart.getKey(), partEntry.getKey());
					}
				}
				
				if (previousPart == null || split) {
					previousPart = partEntry;
				}
			}

			if (splitOutput) {
				createPartOutput(outputConsumer, jobContext, jasperPrint, 
						baseFilenameSupplier, fileExtension, outputCreator, 
						previousPart.getValue(), previousPart.getKey(), jasperPrint.getPages().size());
			}
		}
		
		if (!splitOutput) {
			String filename = baseFilenameSupplier.apply(jobContext.getReportJob()) + "." + fileExtension;
			ReportOutput output = outputCreator.createOutput(filename, null, null);
			if (output != null) {
				outputConsumer.accept(output);
			}
		}	
	}
	
	protected void createPartOutput(Consumer<ReportOutput> outputConsumer,
			ReportJobContext jobContext, JasperPrint jasperPrint,
			Function<ReportJob, String> baseFilenameSupplier, String fileExtension,
			ReportOutputCreator outputCreator, 
			PrintPart part, int startPageIndex, int endPageIndex) {
		try {
			ReportJob outputJobDetails = jobContext.getJobDetails(part);
			String baseFilename = baseFilenameSupplier.apply(jobContext.getReportJob());
			String effectiveName = baseFilenameSupplier.apply(outputJobDetails);
			if (effectiveName.equals(baseFilename)) {
				effectiveName = baseFilename + "_" + part.getName().replaceAll("[^_.\\p{L}\\p{N}]", "_");
			}
			String filename = effectiveName + "." + fileExtension;
			
			ReportOutput output = outputCreator.createOutput(filename, startPageIndex, endPageIndex - 1);
			output.setProperties(new ReportOutputProperties(part.getName(), part));
			output.setJobDetails(outputJobDetails);
			outputConsumer.accept(output);
		} catch (Exception e) {
			jobContext.handleException(
					jobContext.getMessage("report.scheduling.error.exporting.report", new Object[]{fileExtension}), 
					e);
			
		}
	}
}
