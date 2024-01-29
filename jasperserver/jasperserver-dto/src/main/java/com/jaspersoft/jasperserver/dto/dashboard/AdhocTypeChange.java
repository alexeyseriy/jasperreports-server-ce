/*
 * Copyright (C) 2005-2023. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary.
 * Licensed pursuant to commercial Cloud Software Group, Inc End User License Agreement.
 */
package com.jaspersoft.jasperserver.dto.dashboard;

/**
*
* @author Lucian Chirita
*/
public class AdhocTypeChange implements RuntimeComponentAttribute {

	private String updatedChartType;

	public String getUpdatedChartType() {
		return updatedChartType;
	}

	public void setUpdatedChartType(String updatedChartType) {
		this.updatedChartType = updatedChartType;
	}
	
}
