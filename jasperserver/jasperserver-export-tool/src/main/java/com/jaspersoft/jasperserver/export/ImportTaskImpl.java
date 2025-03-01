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

package com.jaspersoft.jasperserver.export;

import com.jaspersoft.jasperserver.export.io.ImportInput;

/**
 * @author Lucian Chirita (lucianc@users.sourceforge.net)
 * @version $Id$
 */
public class ImportTaskImpl extends BaseExportImportTask implements ImportTask {

	private ImportInput input;
	private ImportInputMetadata inputMetadata;

	public ImportInput getInput() {
		return input;
	}

	public void setInput(ImportInput input) {
		this.input = input;
	}

	@Override
	public ImportInputMetadata getInputMetadata() {
		return inputMetadata;
	}

	@Override
	public void setInputMetadata(ImportInputMetadata inputMetadata) {
		this.inputMetadata = inputMetadata;
	}
}
