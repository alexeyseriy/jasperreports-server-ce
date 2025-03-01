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

package com.jaspersoft.jasperserver.api.search;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 */
public class SortByAccessTimeTransformer implements ResultTransformer {
    public List<Long> transformToIdList(List resultList) {
        List<Long> idList = new ArrayList<Long>();

        if (resultList != null) {
            for (Object result : resultList) {
                if(result instanceof Long){
                    idList.add((Long)result);
                } else {
                    Object[] values = (Object[]) result;

                    idList.add((Long) values[0]);
                }
            }
        }

        return idList;
    }

    public List<Timestamp> transformToLastAccessTimeList(List resultList) {
        List<Timestamp> timestampList = new ArrayList<Timestamp>();

        if (resultList != null) {
            for (Object result : resultList) {
                Object[] values = (Object[]) result;

                timestampList.add((Timestamp) values[1]);
            }
        }

        return timestampList;
    }

    public Integer transformToCount(List resultList) {
        int count = 0;

        // TODO:  HibernateUpgrade 26.08.2016 - new Hibernate returning Long values, most probably we need to refactor all classes which depend from this transformer to handle Long (currently Integer)
        if (resultList.size() == 1) { // In this case we have count for single classes
            Object result = resultList.get(0);
            count = (result instanceof Integer ? (Integer)result : ((Long) result).intValue());
        } else if (resultList.size() > 1) { // In this case we have count for several derived classes
            for (Object obj : resultList) {
                count += (obj instanceof Integer ? (Integer)obj : ((Long) obj).intValue());;
            }
        }
        return count;
    }

    public List<String> transformToURIList(List resultList) {
        List<String> uriList = new ArrayList();

        if(resultList != null){
            for (Object result : resultList) {
                Object[] values = (Object[]) result;
                uriList.add((String) values[0]);
            }
        }

        return uriList;
    }
}
