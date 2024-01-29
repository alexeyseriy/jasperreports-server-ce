/*
 * Copyright (C) 2005 - 2022 TIBCO Software Inc. All rights reserved. Confidentiality & Proprietary.
 * Licensed pursuant to commercial TIBCO End User License Agreement.
 */

import jiveDataConverter from "src/bi/report/jive/util/jiveDataConverter";


describe("Jive Data Converter tests", function() {
    it("should convert operator and value to schema format", function() {
        expect(jiveDataConverter.operatorAndValueToSchemaFormat("IS_TRUE", "boolean")).toEqual({
            operator: "equal",
            value: true
        });
        expect(jiveDataConverter.operatorAndValueToSchemaFormat("IS_FALSE", "boolean")).toEqual({
            operator: "equal",
            value: false
        });

    });

});
