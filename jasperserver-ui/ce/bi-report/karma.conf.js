/*
 * Copyright (C) 2005 - 2020 TIBCO Software Inc. All rights reserved. Confidentiality & Proprietary.
 * Licensed pursuant to commercial TIBCO End User License Agreement.
 */

const webpackConfigFactory = require("./webpack.config");
const karmaConfig = require("js-sdk/karma.conf.default");
const isCoverageEnabled = require("js-sdk/util/coverage/isCoverageEnabled");

let conf = Object.assign({}, karmaConfig, {
    webpack: webpackConfigFactory({test: true, coverage: isCoverageEnabled()}),
    coverageIstanbulReporter: Object.assign({}, karmaConfig.coverageIstanbulReporter, {
        thresholds: {
            global: {
                statements: 21,
                branches: 11,
                functions: 26,
                lines: 21
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

module.exports = function (config) {
    config.set(conf);
};
