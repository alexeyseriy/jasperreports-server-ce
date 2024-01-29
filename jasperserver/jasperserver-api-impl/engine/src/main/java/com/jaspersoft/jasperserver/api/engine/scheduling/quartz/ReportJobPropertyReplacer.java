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

import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import com.jaspersoft.jasperserver.api.engine.scheduling.domain.ReportJob;
import com.jaspersoft.jasperserver.api.engine.scheduling.domain.ReportJobMailNotification;

import net.sf.jasperreports.engine.JRPropertiesHolder;

/**
 * @author Lucian Chirita (lucianc@users.sourceforge.net)
 * @version $Id$
 */
public class ReportJobPropertyReplacer {

	private static final Pattern DELIM = Pattern.compile(" *, *");
	
	@SuppressWarnings("unchecked")
	public ReportJob replaceProperties(ReportJob jobDetails, JRPropertiesHolder properties) {
    	ObjectPropertyReplacer propertyReplacer = new ObjectPropertyReplacer();
		ReportJob replacedJobDetails = propertyReplacer.replaceProperties(jobDetails, properties);
		ReportJobMailNotification mailNotification = replacedJobDetails.getMailNotification();
		if (mailNotification != null) {
			mailNotification.setToAddresses(tokenizeList(mailNotification.getToAddresses()));
			mailNotification.setCcAddresses(tokenizeList(mailNotification.getCcAddresses()));
			mailNotification.setBccAddresses(tokenizeList(mailNotification.getBccAddresses()));
		}
		return replacedJobDetails;
	}
	
	protected List<String> tokenizeList(List<String> values) {
		if (values == null || values.isEmpty()) {
			return values;
		}
		
		return values.stream().flatMap(DELIM::splitAsStream).collect(Collectors.toList());
	}
}
