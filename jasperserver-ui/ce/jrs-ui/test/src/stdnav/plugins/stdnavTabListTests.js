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
import tablistTemplate from './test/templates/tablist.htm';
import stdnav from 'js-sdk/src/common/stdnav/stdnav';
import StdnavTabList from 'src/stdnav/plugins/stdnavTabList';
import setTemplates from 'js-sdk/test/tools/setTemplates';

describe("Stdnav TabList Plugin", function() {
    let key = $.simulate.keyCode,
        tablistListItem;

    beforeEach(function() {
        $("body").attr("js-stdnav", "true");
        setTemplates(tablistTemplate);
        tablistListItem = $(".tablistleaf");

        stdnav.activate();
        StdnavTabList.activate();

        $(".subfocus").removeClass("subfocus");
        $(".superfocus").removeClass("superfocus");

    });

    afterEach(function() {
        StdnavTabList.deactivate();
        stdnav.deactivate();
        $("body").removeAttr("js-stdnav");
    });

    describe("tablist focus ", function (){
        it("ariarefresh should be called when tablist receive focus", function(){
            const tablistEL = $('[js-navtype="tablist"]')[0];
            const ariaRefreshSpy = spyOn(StdnavTabList.behavior.ariarefresh, 1);
            tablistEL.focus();
            expect(ariaRefreshSpy).toHaveBeenCalledTimes(1);
        });

        it("tablist role should be assigned when tablistNew navtype element receive focus", function(){
            const tablistEL = $('[js-navtype="tablist"]')[0];
            tablistEL.focus();
            expect($(tablistEL).attr('role')).toEqual('tablist');
        });

        it("focus should be assigned to element which is previously selected", function(){
            const tablistEL = $('[js-navtype="tablist"]')[0];
            tablistEL.focus();
            let selectedItem = $(".selected");
            expect(selectedItem[0]).toEqual($(".subfocus")[0]);
            expect(selectedItem.attr('aria-selected')).toBeTruthy();
        });
    });

    describe("left-right navigation inside menus", function (){
        beforeEach(function () {
            const tablistEL = $('[js-navtype="tablist"]')[0];
            tablistEL.focus();
        });
        it("should move 'focus' to prev item, if we press left arrow key", function(){
            expect(StdnavTabList.behavior.left[1].call(StdnavTabList, $("[aria-selected='true']")[0])).toEqual(tablistListItem.eq(0)[0]);
        });

        it("should move 'focus' to next item if we press right arrow key", function(){
            expect(StdnavTabList.behavior.right[1].call(StdnavTabList, $("[aria-selected='true']")[0])).toEqual(tablistListItem.eq(3)[0]);
        });

        it("should not move 'focus', if we press left arrow key on first active element", function(){
            let selector = "[aria-selected='true']";
            StdnavTabList.behavior.left[1].call(StdnavTabList, $(selector)[0]);
            expect(StdnavTabList.behavior.left[1].call(StdnavTabList, $(selector)[0])).toEqual(tablistListItem.eq(0)[0]);
        });

        it("should move 'focus' to next to next item if we press right arrow key on twice", function(){
            let selector = "[aria-selected='true']";
            StdnavTabList.behavior.right[1].call(StdnavTabList, $(selector)[0]);
            expect(StdnavTabList.behavior.right[1].call(StdnavTabList, $(selector)[0])).toEqual(tablistListItem.eq(6)[0]);
        });
    });

    describe("up-down navigation and click inside tablist", function(){
        beforeEach(function () {
            const tablistEL = $('[js-navtype="tablist"]')[0];
            tablistEL.focus();
        });
        it("should not move 'focus' to next item if we press down arrow key", function(){
            expect(StdnavTabList.behavior.down[1].call(StdnavTabList, $("[aria-selected='true']")[0])).toEqual(tablistListItem.eq(2)[0]);
        });

        it("should not move 'focus' to prev item if we press up arrow key", function(){
            expect(StdnavTabList.behavior.up[1].call(StdnavTabList, $("[aria-selected='true']")[0])).toEqual(tablistListItem.eq(2)[0]);
        });

        it("should not move 'focus' to prev item if we click on item", function(){
            var clickSpy = spyOn(StdnavTabList.behavior.click, 1);
            $(tablistListItem.eq(3)).trigger("click");
            expect(clickSpy).toHaveBeenCalledTimes(1);
        });
    });
});