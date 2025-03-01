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

package com.jaspersoft.jasperserver.export.io;

import com.jaspersoft.jasperserver.api.JSExceptionWrapper;
import com.jaspersoft.jasperserver.export.modules.ExporterModuleContext;
import com.jaspersoft.jasperserver.export.modules.ImporterModuleContext;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.exolab.castor.mapping.Mapping;
import org.exolab.castor.mapping.MappingException;
import org.exolab.castor.xml.Marshaller;
import org.exolab.castor.xml.ResolverException;
import org.exolab.castor.xml.Unmarshaller;
import org.exolab.castor.xml.XMLContext;
import org.exolab.castor.xml.XMLException;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.net.URL;

/**
 * @author Lucian Chirita (lucianc@users.sourceforge.net)
 * @version $Id$
 */
public class CastorSerializer implements ObjectSerializer, InitializingBean {
	private static final Logger log = LogManager.getLogger(CastorSerializer.class);

	private XMLContext context = new XMLContext();

	private Resource[] castorMappings;

	private String[] castorDescriptorPackages;

	public void setCastorMappings(Resource[] castorMappings) {
		this.castorMappings = castorMappings;
	}

    public void setCastorDescriptorPackages(String[] castorDescriptorPackages) {
        this.castorDescriptorPackages = castorDescriptorPackages;
    }

    public void afterPropertiesSet() throws Exception {
		createCastorMapping();
	}

	protected void createCastorMapping() {
		Mapping castorMapping = new Mapping();

		if (castorMappings != null) {
			try {
				log.debug("Create castor mappings");

				for (int i = 0; i < castorMappings.length; i++) {
					Resource mappingRes = castorMappings[i];
					final URL url = mappingRes.getURL();
					log.debug("Load mapping: {}", url);
					castorMapping.loadMapping(url);
				}
				context.addMapping(castorMapping);
			} catch (IOException | MappingException e) {
				log.error(e);
				throw new JSExceptionWrapper(e);
			}
		}

		if (castorDescriptorPackages != null) {
            try {
                context.addPackages(castorDescriptorPackages);
            } catch (ResolverException e) {
                log.error(e);
                throw new JSExceptionWrapper(e);
            }
        }
	}

	public void write(Object object, OutputStream stream, ExporterModuleContext exportContext) throws IOException {
		try {
			Writer writer = new OutputStreamWriter(stream, exportContext.getCharacterEncoding());
            Marshaller marshaller = context.createMarshaller();
            marshaller.setWriter(writer);
            marshaller.marshal(object);
		} catch (UnsupportedEncodingException | XMLException e) {
			log.error(e);
			throw new JSExceptionWrapper(e);
		}
	}

	public Object read(InputStream stream, ImporterModuleContext importContext) throws IOException {
		try {
			Reader reader = new InputStreamReader(stream, importContext.getCharacterEncoding());
			Unmarshaller unmarshaller = context.createUnmarshaller();
            unmarshaller.setWhitespacePreserve(true);
            Object object = unmarshaller.unmarshal(reader);
			return object;
		} catch (XMLException e) {
			log.error(e);
			throw new JSExceptionWrapper(e);
		}
	}
}
