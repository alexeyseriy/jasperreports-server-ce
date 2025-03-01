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


/**
 * @version: $Id$
 */

/**
 * Module for creating report from Adhoc Data View
 */
import jQuery from 'jquery';
import {JRS} from '../namespace/namespace';
import __jrsConfigs__ from 'js-sdk/src/jrs.configs';
import dialogs from '../components/components.dialogs';
import repositorySearch from '../repository/repository.search.root';

JRS.CreateReport = (function(jQuery, jrsConfigs) {
    //this module needs some scripts from PRO in order to run
    var getDialog = function(advUri) {
        return new JRS.GeneratorPropertiesDialog({
            advUri: advUri,
            okHandler: JRS.CreateReport.showGeneratedReport,
            messages: jrsConfigs
        });
    };

    return {
        /**
         * Redirects browser page that generates report from advUri Adhoc Data View and displays generated report
         * @param advUri
         */
        showGeneratedReport: function(data) {

            var url = "reportGenerator.html?action=displayTempReportUnit" +
                "&advUri=" + encodeURIComponent(data.sourceURI) +
                "&template=" + encodeURIComponent(data.template || "") +
                "&generator=" + encodeURIComponent(data.generator || "") +
                "&exportFormat=html";

            jQuery.ajax(url, {
                type: 'GET',
                dataType: 'json',
                success: function(response, textStatus, jqXHR) {
                    if (response.status === "OK") {
                        window.location = response.data;
                    } else {
                        dialogs.errorPopup.show(response.data.msg);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    dialogs.errorPopup.show("Unknown Error");
                }
            });
        },

        selectADV: function() {
            var resources = repositorySearch.model.getSelectedResources();
            var uri = resources && resources.length > 0 ? resources[0].URIString : "";
            getDialog(uri).show();
        },

        selectGenerator: function(advUri, event) {
            getDialog(advUri).show(false, event);
        }
    };
})(jQuery, __jrsConfigs__);

jQuery(function() {
    //make sure ajaxbuffer is available
    if(jQuery("#ajaxbuffer").length === 0) {
        jQuery("body").append(jQuery('<div id="ajaxbuffer" style="display:none"></div>'));
    }
});

export default JRS.CreateReport;