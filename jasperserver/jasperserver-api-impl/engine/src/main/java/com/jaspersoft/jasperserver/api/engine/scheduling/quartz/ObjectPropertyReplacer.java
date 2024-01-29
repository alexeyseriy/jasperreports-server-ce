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

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.OutputStream;

import org.springframework.util.PropertyPlaceholderHelper;

import com.jaspersoft.jasperserver.api.JSException;

import net.sf.jasperreports.engine.JRPropertiesHolder;

/**
 * @author Lucian Chirita (lucianc@users.sourceforge.net)
 * @version $Id$
 */
public class ObjectPropertyReplacer {

	public static final String PLACEHOLDER_PREFIX = "${";

	public static final String PLACEHOLDER_SUFFIX = "}";

	public static final String VALUE_SEPARATOR = ":";

	private PropertyPlaceholderHelper placeholderHelper;
	
	public ObjectPropertyReplacer() {
		this.placeholderHelper = new PropertyPlaceholderHelper(PLACEHOLDER_PREFIX, PLACEHOLDER_SUFFIX, VALUE_SEPARATOR, true);
	}

	public <T> T replaceProperties(T source, JRPropertiesHolder properties) {
		ByteArrayOutputStream output = new ByteArrayOutputStream();
		try {
			try (ObjectOutputStream objectOut = new PropertyReplacerObjectOutputStream(output, properties)) {
				objectOut.writeObject(source);
			}
			
			try (ObjectInputStream objectIn = new ObjectInputStream(new ByteArrayInputStream(output.toByteArray()))) {
				@SuppressWarnings("unchecked")
				T replaced = (T) objectIn.readObject();
				return replaced;
			} catch (ClassNotFoundException e) {
				throw new JSException(e);
			}
		} catch (IOException e) {
			throw new JSException(e);
		}
	}
	
	public String replace(String source, JRPropertiesHolder properties) {
		return placeholderHelper.replacePlaceholders(source, 
				property -> properties.getPropertiesMap().getProperty(property));
	}
	
	protected class PropertyReplacerObjectOutputStream extends ObjectOutputStream {

		private JRPropertiesHolder properties;

		protected PropertyReplacerObjectOutputStream(OutputStream stream, JRPropertiesHolder properties) throws IOException {
			super(stream);
			this.properties = properties;
			
			enableReplaceObject(true);
		}

		@Override
		protected Object replaceObject(Object obj) throws IOException {
			if (obj instanceof String) {
				return replace((String) obj, properties);
			}

			return super.replaceObject(obj);
		}
	}
}
