/*
 * Copyright (C) 2005-2023. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary.
 * Licensed pursuant to commercial Cloud Software Group, Inc End User License Agreement.
 */
package com.jaspersoft.jasperserver.dto.dashboard;

import java.util.List;

import javax.xml.bind.annotation.XmlElementWrapper;

import com.jaspersoft.jasperserver.dto.reports.ReportParameter;

/**
*
* @author Lucian Chirita
*/
public class ComponentParameters implements RuntimeComponentAttribute {

	private List<ReportParameter> parameters;

	@XmlElementWrapper(name = "parameters")
	public List<ReportParameter> getParameters() {
		return parameters;
	}

	public void setParameters(List<ReportParameter> parameters) {
		this.parameters = parameters;
	}

}
