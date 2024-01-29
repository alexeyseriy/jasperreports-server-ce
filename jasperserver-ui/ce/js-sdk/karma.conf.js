/*
 * Copyright (C) 2005 - 2020 TIBCO Software Inc. All rights reserved.
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

const karmaConfig = require("./karma.conf.default");

let conf = Object.assign({}, karmaConfig, {
    files: karmaConfig.files.concat([
        //include our CSS
        {pattern: 'themes/default/jasper-ui/**/*.css', include: false},
        {pattern: 'themes/default/jquery-ui/**/*.css', include: false}
    ]),
    coverageIstanbulReporter: Object.assign({}, karmaConfig.coverageIstanbulReporter, {
        thresholds: {
            global: {
                statements: 70,
                branches: 60,
                functions: 61,
                lines: 69
            },
            each: {
                statements: 0,
                lines: 0,
                branches: 0,
                functions: 0
            }
        }
    })
});

module.exports = function(config) {
    config.set(conf);
};
