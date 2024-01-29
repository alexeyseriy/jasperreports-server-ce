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

/**
 * @version: $Id: $
 */

/* global spyOn */
import $ from 'jquery';
import toolbarTemplate from './test/templates/toolbarV2.htm';
import stdnav from 'js-sdk/src/common/stdnav/stdnav';
import StdnavPluginToolbarV2 from 'src/stdnav/plugins/stdnavPluginToolbarV2';
import setTemplates from 'js-sdk/test/tools/setTemplates';
import buttonManager from "../../../../src/core/core.events.bis";

describe("Stdnav Toolbar Plugin", function() {
    let key = $.simulate.keyCode,
        toolbarListItem;

    beforeEach(function() {
        $("body").attr("js-stdnav", "true");
        setTemplates(toolbarTemplate);
        toolbarListItem = $(".js-toolbar li");

        stdnav.activate();
        StdnavPluginToolbarV2.activate();

        $(".subfocus").removeClass("subfocus");
        $(".superfocus").removeClass("superfocus");

    });

    afterEach(function() {
        StdnavPluginToolbarV2.deactivate();
        stdnav.deactivate();
        $("body").removeAttr("js-stdnav");
    });

    describe("toolbar focus ", function (){
        it("ariarefresh should be called when toolbar receive focus", function(){
            const toolbarEL = $('[js-navtype="toolbarV2"]')[0];
            const ariaRefreshSpy = spyOn(StdnavPluginToolbarV2.behavior.ariarefresh, 1);
            toolbarEL.focus();
            expect(ariaRefreshSpy).toHaveBeenCalledTimes(1);
        });

        it("toolbar role should be assigned when toolbarNew navtype element receive focus", function(){
            const toolbarEL = $('[js-navtype="toolbarV2"]')[0];
            toolbarEL.focus();
            expect($(toolbarEL).attr('role')).toEqual('toolbar');
        });
    });

    describe("left-right navigation inside menus", function (){
        it("should move class 'subfocus' to prev active btn, if we press left arrow key", function(){
            toolbarListItem.eq(6).find('.button').focus();
            expect(StdnavPluginToolbarV2.behavior.left[1].call(StdnavPluginToolbarV2, $(".subfocus")[0])).toEqual(toolbarListItem.eq(3).find('.button')[0]);
        });

        it("should move class 'subfocus' to next active btn if we press right arrow key", function(){
            toolbarListItem.eq(0).find('.button').focus();
            expect(StdnavPluginToolbarV2.behavior.right[1].call(StdnavPluginToolbarV2, $(".subfocus")[0])).toEqual(toolbarListItem.eq(2).find('.button')[0]);
        });

        it("should move class 'subfocus' to last active btn if we press left arrow key on first active element", function(){
            toolbarListItem.eq(0).find('.button').focus();
            expect(StdnavPluginToolbarV2.behavior.left[1].call(StdnavPluginToolbarV2, $(".subfocus")[0])).toEqual(toolbarListItem.eq(9).find('.button')[0]);
        });

        it("should move class 'subfocus' to first active btn if we press right arrow key on last active btn", function(){
            toolbarListItem.eq(9).find('.button').focus();
            expect(StdnavPluginToolbarV2.behavior.right[1].call(StdnavPluginToolbarV2, $(".subfocus")[0])).toEqual(toolbarListItem.eq(0).find('.button')[0]);
        });

        it("should call '_onSubfocusOut & _onSubfocusIn', when we press left arrow key", function(){
            toolbarListItem.eq(0).find('.button').focus();
            const onSubfocusOutSpy = spyOn(StdnavPluginToolbarV2.behavior.subfocusout, 1);
            const onSubfocusInSpy = spyOn(StdnavPluginToolbarV2.behavior.subfocusin, 1);
            $((toolbarListItem.eq(0).find('.button'))[0]).simulate("keydown", {keyCode: key.LEFT});
            expect(onSubfocusInSpy).toHaveBeenCalledTimes(1);
            expect(onSubfocusOutSpy).toHaveBeenCalledTimes(1);
        });

        it("should call '_onSubfocusOut & _onSubfocusIn', when we press right arrow key", function(){
            toolbarListItem.eq(0).find('.button').focus();
            const onSubfocusOutSpy = spyOn(StdnavPluginToolbarV2.behavior.subfocusout, 1);
            const onSubfocusInSpy = spyOn(StdnavPluginToolbarV2.behavior.subfocusin, 1);
            $((toolbarListItem.eq(0).find('.button'))[0]).simulate("keydown", {keyCode: key.RIGHT});
            expect(onSubfocusInSpy).toHaveBeenCalledTimes(1);
            expect(onSubfocusOutSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("up-down navigation inside menus", function(){
        it("should not move class 'subfocus' to next btn if we press down arrow key", function(){
            toolbarListItem.eq(0).find('.button').focus();
            expect(StdnavPluginToolbarV2.behavior.down[1].call(StdnavPluginToolbarV2, $(".subfocus")[0])).toEqual(toolbarListItem.eq(0).find('.button')[0]);
        });

        it("should not move class 'subfocus' to prev btn if we press up arrow key", function(){
            toolbarListItem.eq(2).find('.button').focus();
            expect(StdnavPluginToolbarV2.behavior.up[1].call(StdnavPluginToolbarV2, $(".subfocus")[0])).toEqual(toolbarListItem.eq(2).find('.button')[0]);
        });

        it("should not call '_onSubfocusOut, when we press up arrow key", function(){
            toolbarListItem.eq(2).find('.button').focus();
            const onSubfocusOutSpy = spyOn(StdnavPluginToolbarV2.behavior.subfocusout, 1);
            $((toolbarListItem.eq(2).find('.button'))[0]).simulate("keydown", {keyCode: key.UP});
            expect(onSubfocusOutSpy).toHaveBeenCalledTimes(0);
        });

        it("should not remove class 'subfocus' from last active btn if we press down arrow key", function(){
            toolbarListItem.eq(9).find('.button').focus();
            expect(StdnavPluginToolbarV2.behavior.down[1].call(StdnavPluginToolbarV2, $(".subfocus")[0])).toEqual(toolbarListItem.eq(9).find('.button')[0]);
        });

        it("should not call '_onSubfocusOut', when we press down arrow key", function(){
            toolbarListItem.eq(9).find('.button').focus();
            const onSubfocusOutSpy = spyOn(StdnavPluginToolbarV2.behavior.subfocusout, 1);
            $((toolbarListItem.eq(9).find('.button'))[0]).simulate("keydown", {keyCode: key.DOWN});
            expect(onSubfocusOutSpy).toHaveBeenCalledTimes(0)
        });
    });

    describe("navigation with home and end keys", function (){
        describe("on home key down", function(){
            it("should move class 'subfocus' to first active btn if we press 'Home' key on last active btn", function(){
                toolbarListItem.eq(9).find('.button').focus();
                expect(StdnavPluginToolbarV2.behavior.home[1].call(StdnavPluginToolbarV2, $(".subfocus")[0])).toEqual(toolbarListItem.eq(0).find('.button')[0]);
            });
            it("should move class 'subfocus' to first active btn if we press 'Home' key on any active btn", function(){
                toolbarListItem.eq(6).find('.button').focus();
                expect(StdnavPluginToolbarV2.behavior.home[1].call(StdnavPluginToolbarV2, $(".subfocus")[0])).toEqual(toolbarListItem.eq(0).find('.button')[0]);
            });
        });

        describe("on end key down", function (){
            it("should move class 'subfocus' to last active btn if we press 'End' key on first active element", function(){
                toolbarListItem.eq(0).find('.button').focus();
                expect(StdnavPluginToolbarV2.behavior.end[1].call(StdnavPluginToolbarV2, $(".subfocus")[0])).toEqual(toolbarListItem.eq(9).find('.button')[0]);
            });
            it("should move class 'subfocus' to last active btn if we press 'End' key on any active element", function(){
                toolbarListItem.eq(3).find('.button').focus();
                expect(StdnavPluginToolbarV2.behavior.end[1].call(StdnavPluginToolbarV2, $(".subfocus")[0])).toEqual(toolbarListItem.eq(9).find('.button')[0]);
            });
        });
    });

    describe("Actions with Enter and Space keys", function () {
        it("should call ToolbarPlugin 'enter' handler when Enter key pressed on BUTTON", function () {
            const enterSpy = spyOn(StdnavPluginToolbarV2.behavior.enter, 1);
            toolbarListItem.eq(0).find('.button').focus();
            $((toolbarListItem.eq(0).find('.button'))[0]).simulate("keydown", {keyCode: key.ENTER});
            expect(enterSpy).toHaveBeenCalledTimes(1);
        });

        it("should call ToolbarPlugin 'toggle' handler when Space key pressed on BUTTON", function () {
            const toggleSpy = spyOn(StdnavPluginToolbarV2.behavior.toggle, 1);
            toolbarListItem.eq(0).find('.button').focus();
            $((toolbarListItem.eq(0).find('.button'))[0]).simulate("keydown", {keyCode: key.SPACE});
            expect(toggleSpy).toHaveBeenCalledTimes(1);
        });

        it("should call buttonManager 'down' function when Enter or Space key pressed on BUTTON", function () {
            const backButtonLI = $((toolbarListItem.eq(0))[0]);
            const backButton = $(toolbarListItem.eq(0)).find('.button');

            const btnDownSpy = spyOn(buttonManager, "down");

            toolbarListItem.eq(0).find('.button').focus();
            backButtonLI.simulate("keydown", {keyCode: key.SPACE});
            backButtonLI.simulate("keydown", {keyCode: key.ENTER});

            expect(btnDownSpy).toHaveBeenCalledWith(backButton[0]);
            expect(btnDownSpy).toHaveBeenCalledTimes(2);
        });
    });
});