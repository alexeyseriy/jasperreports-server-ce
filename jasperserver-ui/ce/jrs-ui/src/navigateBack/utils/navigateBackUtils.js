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

import $ from "jquery";
import ExitDialog from 'js-sdk/src/common/component/dialog/ExitDialog';
import _ from 'underscore';
import {isProVersion} from "../../namespace/namespace";
import Report from '../../reportViewer/report.view.runtime';


const NAVIGATE_BACK= {
    LAST_ACCESSED_RESOURCE_PAGE: 'last_accessed_resource_page'
};
export default {
    exitDialogBox: function (options, isBack , navBackFn) {
        const {previousState} = options;
        let isReportProcessing;
        if(window.viewer?.hasReport()){
            isReportProcessing = window.viewer.isExportRunning() || window.viewer.isReportRunning();
        }

        this.exitDialog = new ExitDialog(options);

        if (previousState ||  isReportProcessing) {
            this.exitDialog.on('button:close', _.bind(this.onCloseWithoutSaveButtonClick, this, isBack , navBackFn));
            this.exitDialog.on('button:cancel', _.bind(this.closeExitDialog, this, isBack));
            this.exitDialog.open();
        } else {
            this.destroyInstanceOnNavigation(isBack, navBackFn)
        }
    },
    hideExitDialog:function(isBack){
        let exitBtn = $('#close'),
            backBtn=$('#back');
        let btn = isBack? backBtn : exitBtn;
        btn.hasClass('over') && btn.removeClass('over');
        btn.blur();
        this.exitDialog.$el.css({ width: this.exitDialog.width });
        this.exitDialog.remove();
        $('#dialogDimmer').css('display','none')
    },
    navigateBack :function(isBack , navBackFn){
        return isBack ? navBackFn(true) : this.navigateToLocation();
    },
    navigateToLocation: function () {
        const navigationItem = this.getLocation();
        if(history.length>1 && !!navigationItem){
            location.href = navigationItem
        }else{
            document.location = `flow.html?_flowId=${isProVersion() ? 'homeFlow' : 'searchFlow'}`;
        }
    },
    onCloseWithoutSaveButtonClick:function(isBack , navBackFn){
        this.hideExitDialog(isBack);
        this.destroyInstanceOnNavigation(isBack, navBackFn);
    },
    closeExitDialog:function(isBack){
        this.hideExitDialog(isBack);
    },
    setLocation:function(destination){
        sessionStorage.setItem(NAVIGATE_BACK.LAST_ACCESSED_RESOURCE_PAGE,destination);
    },
    getLocation:function(){
        return sessionStorage.getItem(NAVIGATE_BACK.LAST_ACCESSED_RESOURCE_PAGE);
    },
    destroyInstanceOnNavigation:function(isBack , navBackFn){
        if(window.viewer?.hasReport()){
            const navBackCb = this.navigateBack.bind(this,isBack, navBackFn);
            if(!isBack && !Report.isDrillDownExecution && history.length>1){
                Report.deleteReportExecution(navBackCb);
            }else{
                window.viewer._reportInstance.destroy(()=>{},()=>{},this.navigateBack(isBack, navBackFn))
            }
        }else{
            this.navigateBack(isBack, navBackFn)
        }
    }
}