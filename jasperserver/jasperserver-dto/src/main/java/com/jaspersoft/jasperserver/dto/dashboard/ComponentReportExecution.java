/*
 * Copyright (C) 2005-2023. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary.
 * Licensed pursuant to commercial Cloud Software Group, Inc End User License Agreement.
 */
package com.jaspersoft.jasperserver.dto.dashboard;

/**
*
* @author Lucian Chirita
*/
public class ComponentReportExecution implements RuntimeComponentAttribute {

	private String reportExecutionId;
	
	public ComponentReportExecution() {
	}
	
	public ComponentReportExecution(String reportExecutionId) {
		this.reportExecutionId = reportExecutionId;
	}

	public String getReportExecutionId() {
		return reportExecutionId;
	}

	public void setReportExecutionId(String reportExecutionId) {
		this.reportExecutionId = reportExecutionId;
	}

}
