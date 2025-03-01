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

import net.sf.jasperreports.engine.JRPropertiesHolder;

public class ReportOutputProperties {
	
	public static final String QUALIFIER_GENERAL = "_GENERAL";
	
	public static final ReportOutputProperties GENERAL = new ReportOutputProperties(QUALIFIER_GENERAL);
	
	private final String qualifier;
	private JRPropertiesHolder properties;
	
	public ReportOutputProperties(String qualifier) {
		this.qualifier = qualifier;
	}
	
	public ReportOutputProperties(String qualifier, JRPropertiesHolder properties) {
		this.qualifier = qualifier;
		this.properties = properties;
	}

	public String getQualifier() {
		return qualifier;
	}

	public JRPropertiesHolder getProperties() {
		return properties;
	}

	public void setProperties(JRPropertiesHolder properties) {
		this.properties = properties;
	}

}
