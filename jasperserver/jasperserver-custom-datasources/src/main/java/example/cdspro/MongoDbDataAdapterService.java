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
package example.cdspro;

import com.jaspersoft.mongodb.adapter.MongoDbDataAdapter;
import com.jaspersoft.mongodb.connection.MongoDbConnection;
import net.sf.jasperreports.data.AbstractDataAdapterService;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JRParameter;
import net.sf.jasperreports.engine.JasperReportsContext;
import net.sf.jasperreports.engine.ParameterContributorContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.util.Map;

/**
 * @author Teodor Danciu (teodord@users.sourceforge.net)
 * @version $Id: MongoDbDataAdapterService.java 45929 2014-09-25 18:28:22Z ichan $
 * @author Eric Diaz
 */
public class MongoDbDataAdapterService extends AbstractDataAdapterService {
    private static final Log log = LogFactory.getLog(MongoDbDataAdapterService.class);

    private MongoDbConnection connection;

    private MongoDbDataAdapter dataAdapter;


    public MongoDbDataAdapterService(JasperReportsContext jasperReportsContext, MongoDbDataAdapter dataAdapter) {
        super(new ParameterContributorContext(jasperReportsContext, null, null), dataAdapter);
        this.dataAdapter=dataAdapter;
    }

    @Override
    public void contributeParameters(Map<String, Object> parameters) throws JRException {
        if (connection != null) {
            dispose();
        }
        if (dataAdapter != null) {
            try {
                createConnection();
                parameters.put(JRParameter.REPORT_CONNECTION, connection);
            } catch (Exception e) {
                throw new JRException(e);
            }
        }
    }

    private void createConnection() throws JRException {
        connection = new MongoDbConnection(dataAdapter.getMongoURI(), dataAdapter.getUsername(),
        		 dataAdapter.getPassword());
    }

    @Override
    public void dispose() {
        try {
            if (connection != null)
                connection.close();
        } catch (Exception e) {
            e.printStackTrace();
            if (log.isErrorEnabled())
                log.error("Error while closing the connection.", e);
        }
    }

    @Override
    public void test() throws JRException {
        try {
            if (connection != null) {
            } else {
                createConnection();
            }
            connection.test();
        } finally {
            dispose();
        }
    }
}
